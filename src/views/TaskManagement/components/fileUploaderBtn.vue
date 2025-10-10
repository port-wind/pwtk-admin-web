<template>
  <div class="file-uploader" v-if="showOperation">
    <!-- Hidden file input with accept attribute to filter files -->
    <input
      type="file"
      accept=".wav,audio/wav,audio/x-wav"
      @change="onFileSelected"
      style="display: none"
      ref="fileInputRef"
      @click=";($event.target as HTMLInputElement).value = ''"
    />

    <!-- UI elements -->
    <div class="file-selector">
      <template v-if="!fileName">
        <el-button type="primary" @click="openFileSelector">{{ buttonText }}</el-button>
      </template>

      <template v-else>
        <div class="progress-container" v-if="isUploading">
          <el-progress :percentage="progress" :status="uploadStatus" class="upload-progress" />
        </div>
        <div class="change-file" v-else>
          <span class="file-name">{{ fileName }}</span>
          <el-link type="primary" class="modify-link" @click="openFileSelector">修改</el-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, computed } from 'vue'
import { completeAudioUpload, initAudioUpload, uploadAudioChunk } from '@/api/task'
// Types
export interface FileUploadOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number>
  fileFieldName?: string
  showOperation?: boolean
  chunkSize?: number
  concurrency?: number
}

export interface UploadResponse {
  success: boolean
  data?: any
  error?: Error | string | null
}

export type AudioInfo = {
  duration: number
  filesize: number
  filename: string
  id: number
  mimeType: string
}

// Props with defaults
const props = defineProps({
  buttonText: {
    type: String,
    default: '选择音频'
  },
  audioInfo: {
    type: Object as () => AudioInfo,
    default: undefined
  },
  showOperation: {
    type: Boolean,
    default: false
  },
  uploadOptions: {
    type: Object as () => FileUploadOptions,
    default: () => ({})
  }
})

// Events
const emit = defineEmits([
  'file-selected',
  'upload-started',
  'upload-progress',
  'upload-success',
  'upload-error',
  'upload-cancelled',
  'invalid-file-type'
])
const MAX_FILE_SIZE_LIMIT = 1 // GB
const CHUNK_SIZE_LIMIT = 10 //MB
// State
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isUploading = ref(false)
const progress = ref(0)
const uploadStatus = ref<'' | 'success' | 'exception'>('')
const fileName = computed(() => selectedFile.value?.name || props.audioInfo?.filename || '')

// Chunked upload state
const chunkSize = computed(() => (props.uploadOptions.chunkSize || CHUNK_SIZE_LIMIT) * 1024 * 1024) // Default 2MB
const concurrency = computed(() => props.uploadOptions.concurrency || 3) // Default 3 concurrent uploads
const uploadId = ref<string | null>(null)
const chunks = ref<any[]>([])
const uploadedChunks = ref(0)
const totalChunks = ref(0)
const isChunkedUpload = ref(false)
const isPaused = ref(false)
const activeUploads = ref(0)
const abortControllers = ref(new Map())
const chunkProgress = ref<{ index: number; progress: number }[]>([])

// WAV file validation
function isWavFile(file: File): boolean {
  // Check by extension
  if (!file.name.toLowerCase().endsWith('.wav')) {
    return false
  }

  // Check by MIME type
  const validMimeTypes = ['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav']
  return validMimeTypes.includes(file.type)
}

// Methods
function openFileSelector(): void {
  fileInputRef.value?.click()
}

function cancelUpload(): void {
  // Reset upload state
  isUploading.value = false
  progress.value = 0
  uploadStatus.value = ''

  // Cancel all active chunk uploads
  if (isChunkedUpload.value) {
    // eslint-disable-next-line no-restricted-syntax
    for (const controller of abortControllers.value.values()) {
      controller.abort()
    }
    abortControllers.value.clear()
    uploadId.value = null
    chunks.value = []
    uploadedChunks.value = 0
    totalChunks.value = 0
    isPaused.value = false
    activeUploads.value = 0
  }
  selectedFile.value = null
  // Notify that upload was cancelled
  emit('upload-cancelled', { file: selectedFile.value })
  emit('file-selected', null)
}

// New method to prepare chunks for chunked upload
function prepareChunks(file: File): void {
  chunks.value = []
  const fileSize = file.size
  totalChunks.value = Math.ceil(fileSize / chunkSize.value)

  for (let i = 0; i < totalChunks.value; i += 1) {
    const start = i * chunkSize.value
    const end = Math.min(start + chunkSize.value, fileSize)
    chunks.value.push({
      index: i,
      blob: file.slice(start, end),
      status: 'pending', // pending, uploading, uploaded, error
      progress: 0
    })
  }

  console.log(`已准备 ${totalChunks.value} 个分片，每片大小 ${chunkSize.value} 字节`)
}

// Initialize chunked upload
async function initChunkedUpload(file: File): Promise<string | null> {
  try {
    console.log(`初始化分片上传: ${file.name} (${file.size} bytes)`)

    // Mock API call for initialization - you'll need to replace this with your actual API
    // This would typically return an uploadId or session identifier
    const result = await initAudioUpload({
      filename: file.name,
      totalSize: file.size,
      chunkSize: chunkSize.value,
      totalChunks: totalChunks.value,
      mimeType: file.type
    })

    if (!result.success) {
      throw new Error(result.message || '初始化上传失败')
    }

    // Check for instant upload (file already exists)
    if (result.data.instantUpload) {
      console.log(`文件秒传成功! ID: ${result.data.id}`)
      emit('upload-success', result)
      return null // No need for chunked upload
    }

    return result.data.uploadId
  } catch (error) {
    console.error('初始化分片上传失败:', error)
    throw error
  }
}

// Complete the chunked upload process
async function completeChunkedUpload(): Promise<void> {
  try {
    console.log('请求服务器合并分片...')

    const response = await completeAudioUpload({
      uploadId: uploadId.value
    })

    if (!response.success) {
      throw new Error(response.message || '完成上传失败')
    }

    console.log(`上传完成! 文件ID: ${response.data.id}`)
    isUploading.value = false
    progress.value = 100
    uploadStatus.value = 'success'

    emit('upload-success', response)
  } catch (error) {
    console.error('完成分片上传失败:', error)
    uploadStatus.value = 'exception'
    ElMessage.error('上传失败')
    cancelUpload()
    emit('upload-error', error)
  }
}
// Update total progress based on chunk statuses
function updateTotalProgress(): void {
  if (chunks.value.length === 0) return

  // Calculate overall progress
  const totalProgress =
    chunks.value.reduce((sum, chunk) => {
      // For uploaded chunks, count as 100%
      if (chunk.status === 'uploaded') return sum + 100
      // For uploading chunks, use their individual progress
      if (chunk.status === 'uploading') return sum + (chunk.progress || 0)
      // Pending or error chunks count as 0%
      return sum
    }, 0) / totalChunks.value

  progress.value = Math.round(totalProgress)

  // Update chunk progress display
  chunkProgress.value = chunks.value.map((chunk) => ({
    index: chunk.index,
    progress: chunk.progress || 0
  }))

  emit('upload-progress', {
    percent: progress.value,
    uploadedChunks: uploadedChunks.value,
    totalChunks: totalChunks.value
  })
}
// Upload a single chunk
async function uploadChunk(chunk: any): Promise<void> {
  if (isPaused.value) return

  const controller = new AbortController()
  abortControllers.value.set(chunk.index, controller)

  try {
    console.log(`上传分片 ${chunk.index + 1}/${totalChunks.value} 开始`)
    chunk.status = 'uploading'

    const formData = new FormData()
    formData.append('uploadId', uploadId.value as string)
    formData.append('chunkIndex', chunk.index.toString())
    formData.append('chunk', chunk.blob)

    // Add any additional parameters
    if (props.uploadOptions.params) {
      Object.entries(props.uploadOptions.params).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    // Use fetch with signal for abort capability
    // signal: controller.signal
    const contenttype = ''
    const timeout = 300 * 1000
    const response = await uploadAudioChunk(formData, contenttype, controller.signal, timeout)

    if (!response.success) {
      throw new Error(response.message || `上传分片 ${chunk.index} 失败`)
    }

    // Update status
    chunk.status = 'uploaded'
    uploadedChunks.value += 1
    abortControllers.value.delete(chunk.index)

    console.log(`分片 ${chunk.index + 1}/${totalChunks.value} 上传成功`)
    updateTotalProgress()
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
// Process the upload queue with concurrency control
async function processUploadQueue(): Promise<void> {
  if (isPaused.value) return

  // Find pending chunks
  const pendingChunks = chunks.value.filter((chunk) => chunk.status === 'pending')

  if (pendingChunks.length === 0 && activeUploads.value === 0) {
    // All chunks uploaded, complete the upload
    await completeChunkedUpload()
    return
  }

  // Start uploads up to concurrency limit
  while (activeUploads.value < concurrency.value && pendingChunks.length > 0) {
    const chunk = pendingChunks.shift()
    activeUploads.value += 1

    uploadChunk(chunk).finally(() => {
      activeUploads.value -= 1
      processUploadQueue()
    })
  }
}

// Method to start chunked upload
async function startChunkedUpload(file: File): Promise<void> {
  try {
    isUploading.value = true
    isChunkedUpload.value = true
    progress.value = 0
    uploadStatus.value = ''
    uploadedChunks.value = 0

    emit('upload-started', { file })

    // Prepare chunks
    prepareChunks(file)

    // Initialize upload session
    const uploadSessionId = await initChunkedUpload(file)

    // If null is returned, it means instant upload succeeded
    if (uploadSessionId === null) {
      isUploading.value = false
      progress.value = 100
      uploadStatus.value = 'success'
      return
    }

    uploadId.value = uploadSessionId

    // Start upload queue
    processUploadQueue()
  } catch (error) {
    isUploading.value = false
    uploadStatus.value = 'exception'
    ElMessage.error('上传失败')
    cancelUpload()
    emit('upload-error', error)
  }
}

// Original single-file upload method
async function uploadFile(file: File): Promise<void> {
  // For larger files, use chunked upload
  if (file.size > 10 * 1024 * 1024) {
    // 10MB threshold
    await startChunkedUpload(file)
    return
  }

  await startChunkedUpload(file)
}

function retryUpload(): void {
  if (selectedFile.value && !isUploading.value) {
    uploadFile(selectedFile.value)
  }
}

async function onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const { files } = input

  if (!files || files.length === 0) return

  const file = files[0]

  // Validate file is a WAV file
  if (!isWavFile(file)) {
    const error = new Error(`只支持WAV格式文件，当前文件类型: ${file.type}`)
    console.warn(error.message)
    emit('invalid-file-type', { file, error })
    return
  }
  if (file.size > MAX_FILE_SIZE_LIMIT * 1024 * 1024 * 1024) {
    ElMessage.error(`文件大小不可超过${MAX_FILE_SIZE_LIMIT}GB`)
    return
  }
  // Cancel any ongoing upload
  if (isUploading.value) {
    cancelUpload()
  }

  selectedFile.value = file
  emit('file-selected', file)

  // Start upload process
  await uploadFile(file)
}

// Reset the component state
function reset(): void {
  // First cancel any ongoing upload
  cancelUpload()

  // Then reset all state variables
  selectedFile.value = null
  isUploading.value = false
  progress.value = 0
  uploadStatus.value = ''

  // Reset chunked upload state
  isChunkedUpload.value = false
  uploadId.value = null
  chunks.value = []
  totalChunks.value = 0
  uploadedChunks.value = 0
  isPaused.value = false
  activeUploads.value = 0
  abortControllers.value.clear()
  chunkProgress.value = []
}

// Methods to control chunked upload
function pauseUpload(): void {
  if (!isChunkedUpload.value || !isUploading.value) return

  isPaused.value = true
  console.log('上传已暂停')

  // Abort all active chunk uploads
  // eslint-disable-next-line no-restricted-syntax
  for (const controller of abortControllers.value.values()) {
    controller.abort()
  }
}

function resumeUpload(): void {
  if (!isChunkedUpload.value || !isPaused.value) return

  isPaused.value = false
  console.log('继续上传')
  processUploadQueue()
}

// Expose public methods
defineExpose({
  openFileSelector,
  reset,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload
})
</script>

<style scoped>
.file-uploader {
  width: 100%;
}

.file-selector {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.file-name {
  word-break: break-all;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modify-link,
.retry-link {
  margin-left: 10px;
}

.change-file {
  display: flex;
  align-items: center;
  gap: 5px;
}

.upload-progress {
  margin-left: 10px;
  min-width: 100px;
  flex: 1;
}

.chunk-progress-text {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
</style>
