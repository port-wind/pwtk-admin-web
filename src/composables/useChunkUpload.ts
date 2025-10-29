import { ref, computed } from 'vue'
import { uploadVideoChunk, completeVideoUpload, cancelVideoUpload } from '@/api/video'
import type { ChunkInfo, UploadResponse } from '@/global_types/video-upload'

const CHUNK_SIZE_LIMIT = 10 // MB
const DEFAULT_CONCURRENCY = 2

export function useChunkUpload() {
  // State
  const chunks = ref<ChunkInfo[]>([])
  const uploadedChunks = ref(0)
  const totalChunks = ref(0)
  const activeUploads = ref(0)
  const isPaused = ref(false)
  const abortControllers = ref(new Map<number, AbortController>())

  // Computed
  const chunkSize = computed(() => CHUNK_SIZE_LIMIT * 1024 * 1024)
  const concurrency = computed(() => DEFAULT_CONCURRENCY)

  // Methods
  const prepareChunks = (file: File): void => {
    chunks.value = []
    const fileSize = file.size
    totalChunks.value = Math.ceil(fileSize / chunkSize.value)

    for (let i = 0; i < totalChunks.value; i += 1) {
      const start = i * chunkSize.value
      const end = Math.min(start + chunkSize.value, fileSize)

      chunks.value.push({
        index: i,
        blob: file.slice(start, end),
        status: 'pending',
        progress: 0
      })
    }

    console.log(`已准备 ${totalChunks.value} 个分片，每片大小 ${chunkSize.value} 字节`)
  }

  const updateTotalProgress = (): number => {
    if (chunks.value.length === 0) return 0

    const totalProgress =
      chunks.value.reduce((sum, chunk) => {
        if (chunk.status === 'uploaded') return sum + 100
        if (chunk.status === 'uploading') return sum + (chunk.progress || 0)
        return sum
      }, 0) / totalChunks.value

    return Math.round(totalProgress)
  }

  const uploadChunk = async (chunk: ChunkInfo, sessionId: string): Promise<void> => {
    if (isPaused.value) return

    const controller = new AbortController()
    abortControllers.value.set(chunk.index, controller)

    try {
      console.log(`上传分片 ${chunk.index + 1}/${totalChunks.value} 开始`)
      chunk.status = 'uploading'

      const partNumber = chunk.index + 1
      const result = await uploadVideoChunk(sessionId, partNumber, chunk.blob, controller.signal)

      if (!result.success) {
        throw new Error(result.message || `上传分片 ${chunk.index} 失败`)
      }

      chunk.progress = result.data?.progress || 100
      chunk.status = 'uploaded'
      uploadedChunks.value += 1
      abortControllers.value.delete(chunk.index)

      console.log(`分片 ${chunk.index + 1}/${totalChunks.value} 上传成功`)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        chunk.status = 'pending'
        console.log(`分片 ${chunk.index + 1}/${totalChunks.value} 上传已中止`)
      } else {
        chunk.status = 'error'
        console.error(`分片 ${chunk.index + 1}/${totalChunks.value} 上传失败:`, error)
      }
      abortControllers.value.delete(chunk.index)
      throw error
    }
  }

  const processUploadQueue = async (
    sessionId: string,
    onProgress: (_: number) => void,
    onComplete: () => Promise<void>
  ): Promise<void> => {
    if (isPaused.value) return

    const pendingChunks = chunks.value.filter((chunk) => chunk.status === 'pending')

    if (pendingChunks.length === 0 && activeUploads.value === 0) {
      await onComplete()
      return
    }

    while (activeUploads.value < concurrency.value && pendingChunks.length > 0) {
      const chunk = pendingChunks.shift()!
      activeUploads.value += 1

      uploadChunk(chunk, sessionId)
        .then(() => {
          onProgress(updateTotalProgress())
        })
        .catch((error) => {
          console.error('Chunk upload failed:', error)
        })
        .finally(() => {
          activeUploads.value -= 1
          processUploadQueue(sessionId, onProgress, onComplete)
        })
    }
  }

  const completeUpload = async (sessionId: string): Promise<UploadResponse> => {
    console.log('请求服务器合并分片...')

    const result = await completeVideoUpload(sessionId)

    if (!result.success) {
      throw new Error(result.message || '完成上传失败')
    }

    console.log(`上传完成! 文件URL: ${result.data.fileUrl}`)
    return result
  }

  const cancelUpload = async (sessionId: string | null): Promise<void> => {
    // Cancel all active chunk uploads
    Array.from(abortControllers.value.values()).forEach((controller) => controller.abort())
    abortControllers.value.clear()

    // Cancel upload on server
    if (sessionId) {
      try {
        await cancelVideoUpload(sessionId)
        console.log('Upload cancelled on server')
      } catch (error) {
        console.error('Failed to cancel upload on server:', error)
      }
    }
  }

  const pauseUpload = (): void => {
    isPaused.value = true
    console.log('上传已暂停')

    Array.from(abortControllers.value.values()).forEach((controller) => controller.abort())
  }

  const resumeUpload = (sessionId: string, onProgress: (_: number) => void, onComplete: () => Promise<void>): void => {
    isPaused.value = false
    console.log('继续上传')
    processUploadQueue(sessionId, onProgress, onComplete)
  }

  const reset = (): void => {
    chunks.value = []
    uploadedChunks.value = 0
    totalChunks.value = 0
    activeUploads.value = 0
    isPaused.value = false
    abortControllers.value.clear()
  }

  return {
    // State
    chunks: chunks.value,
    uploadedChunks,
    totalChunks,
    isPaused,

    // Methods
    prepareChunks,
    processUploadQueue,
    completeUpload,
    cancelUpload,
    pauseUpload,
    resumeUpload,
    reset,
    updateTotalProgress
  }
}
