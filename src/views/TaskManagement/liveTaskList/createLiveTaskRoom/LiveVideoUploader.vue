<template>
  <VideoFileInput ref="fileInputRef" @file-selected="handleFileSelected" />

  <el-button v-if="!hasSelectedFile" type="primary" size="large" @click="openFileSelector">
    <el-icon><Plus /></el-icon>
    {{ buttonText }}
  </el-button>
  <div class="deferred-video-uploader" v-else>
    <!-- Hidden file input -->

    <!-- UI elements -->
    <div class="file-selector" v-if="showOperation">
      <template v-if="hasSelectedFile">
        <UploadProgress v-if="isUploading" :progress="progress" :status="uploadStatus" style="flex: 1" />
        <FileInfo v-else :fileName="''" @modify="openFileSelector" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useDeferredVideoUpload } from '@/composables/useDeferredVideoUpload'
import VideoFileInput from '@/views/VideoList/components/VideoFileInput.vue'
import UploadProgress from '@/views/VideoList/components/UploadProgress.vue'
import FileInfo from '@/views/VideoList/components/FileInfo.vue'
import type { FileUploadOptions, VideoInfo, UploadEmits } from '@/global_types/video-upload'

// Props
interface Props {
  buttonText?: string
  videoInfo?: VideoInfo
  showOperation?: boolean
  uploadOptions?: FileUploadOptions
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: '选择视频',
  videoInfo: undefined,
  showOperation: false,
  uploadOptions: () => ({}),
  userId: ''
})

// Events - extend the original events with upload method
interface DeferredUploadEmits extends UploadEmits {
  'preview-ready': [previewUrl: string]
}

const emit = defineEmits<DeferredUploadEmits>()

// Refs
const fileInputRef = ref<InstanceType<typeof VideoFileInput> | null>(null)

// Create a wrapper for the emit function
const emitWrapper = (event: string, ...args: any[]) => {
  ;(emit as any)(event, ...args)
}

// Composables - use deferred upload
const {
  selectedFile,
  hasSelectedFile,
  isUploading,
  progress,
  uploadStatus,
  previewUrl,
  selectFile,
  startUpload,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload,
  reset
} = useDeferredVideoUpload(props.uploadOptions, emitWrapper, props.videoInfo)

// Methods
const openFileSelector = (): void => {
  fileInputRef.value?.openSelector()
}

const handleFileSelected = async (file: File): Promise<void> => {
  await selectFile(file)

  // Emit preview ready event if we have a preview URL
  if (previewUrl.value) {
    emit('preview-ready', previewUrl.value)
  }
}

// Public method to trigger upload
const uploadFile = async (): Promise<any> => {
  console.log('DeferredVideoUploader.uploadFile called')
  console.log('hasSelectedFile:', hasSelectedFile.value)
  console.log('selectedFile:', selectedFile.value)
  console.log('isUploading:', isUploading.value)

  if (!hasSelectedFile.value) {
    throw new Error('没有选择文件')
  }

  // eslint-disable-next-line no-return-await
  return await startUpload()
}

// Expose public methods
defineExpose({
  openFileSelector,
  uploadFile,
  reset,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload,
  selectedFile,
  previewUrl,
  hasSelectedFile,
  isUploading, // Expose isUploading directly for reactive access
  // Debug info
  debug: () => ({
    hasSelectedFile: hasSelectedFile.value,
    selectedFile: selectedFile.value,
    isUploading: isUploading.value,
    uploadStatus: uploadStatus.value,
    previewUrl: previewUrl.value
  })
})

// Lifecycle hook
onMounted(() => {
  console.log('DeferredVideoUploader mounted')
})
</script>

<style scoped>
.deferred-video-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
}

.file-selector {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
