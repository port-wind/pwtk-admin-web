import { ref, computed } from 'vue'
import { useFileValidation } from './useFileValidation'
import { useChunkUpload } from './useChunkUpload'
import { initVideoUpload } from '@/api/video'
import type { FileUploadOptions, VideoInfo, UploadProgress } from '@/global_types/video-upload'

export interface DeferredUploadState {
  selectedFile: File | null
  previewUrl: string | null
  isUploading: boolean
  progress: number
  status: '' | 'success' | 'exception'
  sessionId: string | null
  isPaused: boolean
}

export function useDeferredVideoUpload(
  options: FileUploadOptions = {},
  emit: (..._: any[]) => void,
  videoInfo?: VideoInfo
) {
  // Composables
  const { validateVideoFile } = useFileValidation()
  const chunkUpload = useChunkUpload()

  // State
  const state = ref<DeferredUploadState>({
    selectedFile: null,
    previewUrl: null,
    isUploading: false,
    progress: 0,
    status: '',
    sessionId: null,
    isPaused: false
  })

  // Computed
  const fileName = computed(() => state.value.selectedFile?.name || videoInfo?.filename || '')
  const hasSelectedFile = computed(() => !!state.value.selectedFile)
  const isUploading = computed(() => state.value.isUploading)
  const progress = computed(() => state.value.progress)
  const uploadStatus = computed(() => state.value.status)
  const previewUrl = computed(() => state.value.previewUrl)

  // Methods
  const createPreviewUrl = (file: File): string => {
    // Clean up previous preview URL
    if (state.value.previewUrl && state.value.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.value.previewUrl)
    }

    // Create new preview URL
    return URL.createObjectURL(file)
  }

  const cancelUpload = (): void => {
    // Reset upload state
    state.value.isUploading = false
    state.value.progress = 0
    state.value.status = ''
    state.value.isPaused = false

    // Cancel chunk upload
    chunkUpload.cancelUpload(state.value.sessionId)

    // Reset session
    state.value.sessionId = null

    // Reset chunk upload state
    chunkUpload.reset()

    emit('upload-cancelled', { file: state.value.selectedFile })
  }
  const reset = (): void => {
    // Clean up preview URL
    if (state.value.previewUrl && state.value.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(state.value.previewUrl)
    }

    // Cancel any ongoing upload
    if (state.value.isUploading) {
      cancelUpload()
    }

    // Reset state
    state.value = {
      selectedFile: null,
      previewUrl: null,
      isUploading: false,
      progress: 0,
      status: '',
      sessionId: null,
      isPaused: false
    }

    chunkUpload.reset()
  }
  const selectFile = async (file: File): Promise<void> => {
    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.isValid) {
      const error = new Error(validation.error)
      emit('invalid-file-type', { file, error })
      return
    }

    // Clean up previous state
    reset()

    // Set selected file and create preview
    state.value.selectedFile = file
    state.value.previewUrl = createPreviewUrl(file)

    emit('file-selected', file)
  }

  const initializeUpload = async (file: File): Promise<string | null> => {
    try {
      console.log(`初始化分片上传: ${file.name} (${file.size} bytes)`)

      const result = await initVideoUpload({
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        tag: options.tag || 'user',
        path: options.path || 'videos',
        chunkSize: (options.chunkSize || 10) * 1024 * 1024
      })

      if (!result.success) {
        throw new Error(result.message || '初始化上传失败')
      }

      return result.data.sessionId
    } catch (error) {
      console.error('初始化分片上传失败:', error)
      throw error
    }
  }

  const handleUploadProgress = (progressPercent: number): void => {
    state.value.progress = progressPercent

    const progressData: UploadProgress = {
      percent: progressPercent,
      uploadedChunks: chunkUpload.uploadedChunks.value,
      totalChunks: chunkUpload.totalChunks.value
    }

    emit('upload-progress', progressData)
  }

  const handleUploadComplete = async (): Promise<any> => {
    try {
      const result = await chunkUpload.completeUpload(state.value.sessionId!)

      state.value.isUploading = false
      state.value.progress = 100
      state.value.status = 'success'

      emit('upload-success', result)
      return result
    } catch (error) {
      state.value.status = 'exception'
      state.value.isUploading = false
      emit('upload-error', error)
      throw error
    }
  }

  const startUpload = async (): Promise<any> => {
    if (!state.value.selectedFile) {
      throw new Error('没有选择文件')
    }

    try {
      // Reset upload state
      state.value.isUploading = true
      state.value.progress = 0
      state.value.status = ''
      state.value.sessionId = null
      state.value.isPaused = false

      emit('upload-started', { file: state.value.selectedFile })

      // Prepare chunks
      chunkUpload.prepareChunks(state.value.selectedFile)

      // Initialize upload session
      const sessionId = await initializeUpload(state.value.selectedFile)

      // If null is returned, it means instant upload succeeded
      if (sessionId === null) {
        state.value.isUploading = false
        state.value.progress = 100
        state.value.status = 'success'
        // For instant upload, we need to simulate a successful response
        const result = { success: true, data: { fileUrl: 'instant-upload-success' } }
        emit('upload-success', result)
        return result
      }

      state.value.sessionId = sessionId

      // Create a promise that resolves when upload completes
      return new Promise((resolve, reject) => {
        // Store the resolve/reject functions so handleUploadComplete can use them
        const originalHandleUploadComplete = handleUploadComplete

        const wrappedHandleUploadComplete = async (): Promise<any> => {
          try {
            const result = await originalHandleUploadComplete()
            resolve(result)
            return result
          } catch (error) {
            reject(error)
            throw error
          }
        }

        // Start upload queue with the wrapped completion handler
        chunkUpload.processUploadQueue(sessionId, handleUploadProgress, wrappedHandleUploadComplete).catch((error) => {
          state.value.isUploading = false
          state.value.status = 'exception'
          emit('upload-error', error)
          reject(error)
        })
      })
    } catch (error) {
      state.value.isUploading = false
      state.value.status = 'exception'
      emit('upload-error', error)
      throw error
    }
  }

  const retryUpload = async (): Promise<any> => {
    if (state.value.selectedFile && !state.value.isUploading) {
      // eslint-disable-next-line no-return-await
      return await startUpload()
    }
    throw new Error('无法重试上传')
  }

  const pauseUpload = (): void => {
    if (!state.value.isUploading || state.value.isPaused) return

    state.value.isPaused = true
    chunkUpload.pauseUpload()
  }

  const resumeUpload = (): void => {
    if (!state.value.isPaused || !state.value.sessionId) return

    state.value.isPaused = false
    chunkUpload.resumeUpload(state.value.sessionId, handleUploadProgress, handleUploadComplete)
  }

  return {
    // State
    selectedFile: computed(() => state.value.selectedFile),
    fileName,
    hasSelectedFile,
    isUploading,
    progress,
    uploadStatus,
    previewUrl,

    // Methods
    selectFile,
    startUpload,
    cancelUpload,
    retryUpload,
    pauseUpload,
    resumeUpload,
    reset
  }
}
