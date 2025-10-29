import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { initVideoUpload } from '@/api/video'
import { useFileValidation } from './useFileValidation'
import { useChunkUpload } from './useChunkUpload'
import type { FileUploadOptions, VideoInfo, UploadState, UploadProgress } from '@/global_types/video-upload'

export function useVideoUpload(options: FileUploadOptions = {}, emit: (..._: any[]) => void, videoInfo?: VideoInfo) {
  // Composables
  const { validateVideoFile } = useFileValidation()
  const chunkUpload = useChunkUpload()

  // State
  const selectedFile = ref<File | null>(null)
  const uploadState = ref<UploadState>({
    isUploading: false,
    progress: 0,
    status: '',
    sessionId: null,
    isPaused: false
  })

  // Computed
  const fileName = computed(() => selectedFile.value?.name || videoInfo?.filename || '')
  const isUploading = computed(() => uploadState.value.isUploading)
  const progress = computed(() => uploadState.value.progress)
  const uploadStatus = computed(() => uploadState.value.status)
  const isPaused = computed(() => uploadState.value.isPaused)

  // Methods
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
    uploadState.value.progress = progressPercent

    const progressData: UploadProgress = {
      percent: progressPercent,
      uploadedChunks: chunkUpload.uploadedChunks.value,
      totalChunks: chunkUpload.totalChunks.value
    }

    emit('upload-progress', progressData)
  }
  const cancelUpload = (): void => {
    // Reset upload state
    uploadState.value.isUploading = false
    uploadState.value.progress = 0
    uploadState.value.status = ''
    uploadState.value.isPaused = false

    // Cancel chunk upload
    chunkUpload.cancelUpload(uploadState.value.sessionId)

    // Reset session
    uploadState.value.sessionId = null

    // Reset selected file
    const currentFile = selectedFile.value
    selectedFile.value = null

    // Reset chunk upload state
    chunkUpload.reset()

    // Notify that upload was cancelled
    emit('upload-cancelled', { file: currentFile })
    emit('file-selected', null)
  }
  const handleUploadComplete = async (): Promise<void> => {
    try {
      const result = await chunkUpload.completeUpload(uploadState.value.sessionId!)

      uploadState.value.isUploading = false
      uploadState.value.progress = 100
      uploadState.value.status = 'success'

      emit('upload-success', result)
    } catch (error) {
      uploadState.value.status = 'exception'
      ElMessage.error('上传失败')
      cancelUpload()
      emit('upload-error', error)
    }
  }

  const startUpload = async (file: File): Promise<void> => {
    try {
      // Reset state
      uploadState.value = {
        isUploading: true,
        progress: 0,
        status: '',
        sessionId: null,
        isPaused: false
      }

      emit('upload-started', { file })

      // Prepare chunks
      chunkUpload.prepareChunks(file)

      // Initialize upload session
      const sessionId = await initializeUpload(file)

      // If null is returned, it means instant upload succeeded
      if (sessionId === null) {
        uploadState.value.isUploading = false
        uploadState.value.progress = 100
        uploadState.value.status = 'success'
        return
      }

      uploadState.value.sessionId = sessionId

      // Start upload queue
      await chunkUpload.processUploadQueue(sessionId, handleUploadProgress, handleUploadComplete)
    } catch (error) {
      uploadState.value.isUploading = false
      uploadState.value.status = 'exception'
      ElMessage.error('上传失败')
      cancelUpload()
      emit('upload-error', error)
    }
  }

  const selectFile = async (file: File): Promise<void> => {
    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.isValid) {
      const error = new Error(validation.error)
      emit('invalid-file-type', { file, error })
      return
    }

    // Cancel any ongoing upload
    if (uploadState.value.isUploading) {
      cancelUpload()
    }

    selectedFile.value = file
    emit('file-selected', file)

    // Start upload process
    await startUpload(file)
  }

  const retryUpload = (): void => {
    if (selectedFile.value && !uploadState.value.isUploading) {
      startUpload(selectedFile.value)
    }
  }

  const pauseUpload = (): void => {
    if (!uploadState.value.isUploading || uploadState.value.isPaused) return

    uploadState.value.isPaused = true
    chunkUpload.pauseUpload()
  }

  const resumeUpload = (): void => {
    if (!uploadState.value.isPaused || !uploadState.value.sessionId) return

    uploadState.value.isPaused = false
    chunkUpload.resumeUpload(uploadState.value.sessionId, handleUploadProgress, handleUploadComplete)
  }

  const reset = (): void => {
    cancelUpload()
    selectedFile.value = null
    uploadState.value = {
      isUploading: false,
      progress: 0,
      status: '',
      sessionId: null,
      isPaused: false
    }
    chunkUpload.reset()
  }

  return {
    // State
    selectedFile,
    fileName,
    isUploading,
    progress,
    uploadStatus,
    isPaused,

    // Methods
    selectFile,
    cancelUpload,
    retryUpload,
    pauseUpload,
    resumeUpload,
    reset
  }
}
