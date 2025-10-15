<template>
  <div :class="['image-container-issue', { 'hide-add': fileList.length >= 1 }]" @click="handleUploadClick">
    <el-upload
      :multiple="true"
      :disabled="!formState.issue"
      listType="picture-card"
      :limit="1"
      :fileList="fileList"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :on-progress="onProgress"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="customUploadRequest"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { RxState } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import { useImageUpload } from '@/views/PhotosSys/newsPaperIssue/composables/useImageUpload'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'
import type { IssueFormData } from '@/views/PhotosSys/newsPaperIssue/newsIssueType/index'

const props = defineProps({
  rxState: {
    type: Object as () => RxState<IssueFormData>,
    required: true
  }
})
const { fileList, handelCustomRequest } = useImageUpload(props.rxState)
const formState = computed(() => props.rxState.formState)
const issue = computed(() => formState.value.issue)
const handleUploadClick = () => {
  if (!issue.value) {
    ElMessage.error('请先选择期数')
  }
}

const beforeUpload = (file: File) => {
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    // eslint-disable-next-line no-alert
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  return true
}

const onProgress = (event: any) => {
  console.log('Upload progress:', event.percent)
}

const onRemove = () => {
  formState.value.imgPath = ''
  // eslint-disable-next-line vue/no-mutating-props
  props.rxState.fileList = []
}
const onSuccess = (response: any, _: any, __: any[]) => {
  console.log('Upload success:', response)
}

const onError = (error: any) => {
  console.error('Upload error:', error)
  ElMessage.error('文件上传失败')
}

const onChange = (file: any, list: any[]) => {
  const updatedFileList = list.map((item) => ({
    ...item,
    issueNumber: Number(issue.value)
  }))
  // eslint-disable-next-line vue/no-mutating-props
  props.rxState.fileList = updatedFileList
}

const customUploadRequest = async (options: any) => {
  await handelCustomRequest(options, true)
}
</script>

<style scoped lang="less">
.image-container-issue {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  overflow: hidden;

  img {
    object-fit: contain;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }

  &.hide-add {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }

  :deep(.el-upload--picture-card) {
    width: 350px;
    height: 525px;
  }

  :deep(.el-upload-list__item) {
    width: 350px;
    height: 525px;
  }
  :deep(.el-upload-list__item-preview) {
    display: none !important;
  }
}
</style>
