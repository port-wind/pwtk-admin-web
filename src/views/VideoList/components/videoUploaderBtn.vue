<template>
  <div class="file-uploader" v-if="showOperation">
    <!-- Hidden file input -->
    <VideoFileInput ref="fileInputRef" @file-selected="handleFileSelected" />

    <!-- UI elements -->
    <div class="file-selector">
      <template v-if="!fileName">
        <p v-if="!userId">请先选择视频作者</p>
        <el-button v-else type="primary" size="large" @click="openFileSelector">
          <el-icon><Plus /></el-icon>
          {{ buttonText }}
        </el-button>
      </template>

      <template v-else>
        <UploadProgress v-if="isUploading" :progress="progress" :status="uploadStatus" />
        <FileInfo v-else :fileName="fileName" @modify="openFileSelector" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useVideoUpload } from '@/composables/useVideoUpload'
import VideoFileInput from './VideoFileInput.vue'
import UploadProgress from './UploadProgress.vue'
import FileInfo from './FileInfo.vue'
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

// Events
const emit = defineEmits<UploadEmits>()

// Refs
const fileInputRef = ref<InstanceType<typeof VideoFileInput> | null>(null)

// Create a wrapper for the emit function
const emitWrapper = (event: string, ...args: any[]) => {
  ;(emit as any)(event, ...args)
}

// Composables - pass videoInfo for fileName computation
const {
  fileName,
  isUploading,
  progress,
  uploadStatus,
  selectFile,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload,
  reset
} = useVideoUpload(props.uploadOptions, emitWrapper, props.videoInfo)

// Methods
const openFileSelector = (): void => {
  fileInputRef.value?.openSelector()
}

const handleFileSelected = async (file: File): Promise<void> => {
  await selectFile(file)
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px dashed #d9d9d9;
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
