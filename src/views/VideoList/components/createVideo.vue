<template>
  <div class="video-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="8">
          <!-- Video Upload -->
          <div class="input-with-button">
            <!-- Show video preview when available but not when uploading -->
            <nativeVideoViewer
              :video-source="videoPreviewUrl || form.videoPath"
              v-if="(videoPreviewUrl || form.videoPath) && !isUploading"
            />

            <!-- Show DeferredVideoUploader when no file selected OR when uploading -->
            <DeferredVideoUploader
              ref="videoUploaderRef"
              :uploadOptions="{ fileFieldName: 'video', params: { uploaderId: '82' } }"
              :showOperation="true"
              :video-info="form.videoInfo"
              :user-id="form.userId"
              :style="{
                display: (!videoPreviewUrl && !form.videoPath) || isUploading ? 'flex' : 'none'
              }"
              @file-selected="handleFileSelected"
              @preview-ready="handlePreviewReady"
              @upload-success="handleUploadSuccess"
              @upload-error="handleUploadError"
            />
          </div>
          <div v-if="(videoPreviewUrl || form.videoPath) && !isUploading" style="text-align: center; margin-top: 10px">
            <el-button type="danger" @click="resetVideo">重新上传</el-button>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- Video Author -->
          <el-row>
            <el-col :span="14">
              <el-form-item label="视频作者:" prop="userId">
                <SelectUserIdAndNickname
                  v-model="form.userId!"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="彩种:" prop="gameType" v-if="form.ifActive === 'y'">
                <GameTypeList
                  v-model="form.gameType"
                  :withDefault="true"
                  @onSelect="($event) => handleGameTypeChange($event?.gameType)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <!-- Video Tag -->
              <el-form-item label="视频标签:" prop="tag">
                <el-select
                  v-model="form.tags"
                  placeholder="视频标签"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                >
                  <el-option
                    v-for="item in tagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="width: 260px"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="年份:" prop="year" v-if="form.ifActive === 'y'">
                <el-select v-model="form.year" placeholder="年份" @change="handleYearChange">
                  <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="启用彩种:" prop="ifActive">
                <el-radio-group v-model="form.ifActive" style="margin-right: 10px" @change="handleIfActiveChange">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="期数:" prop="issue" v-if="form.ifActive === 'y'">
                <el-select
                  v-model="form.issue"
                  placeholder="请选择期数"
                  filterable
                  :disabled="!form.gameType || !form.year"
                >
                  <el-option
                    v-for="item in issueOptionsState.data"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- <p v-else>{{ form.issue }}</p> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <!-- Video Title -->
              <el-form-item label="视频标题:" prop="title">
                <el-input
                  v-model="form.title"
                  type="textarea"
                  rows="1"
                  :maxlength="50"
                  show-word-limit
                  placeholder="请输入视频标题"
                  :disabled="!showOperation"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <!-- Video Description -->
              <el-form-item label="视频简介:" prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  :maxlength="200"
                  show-word-limit
                  rows="3"
                  placeholder="请输入视频简介"
                  :disabled="!showOperation"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <section class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useWhitelist } from '@/composables/useWhiteList'
import { createVideo, getFormattedVideoTagList } from '@/api/video'
import type { VideoInfo } from '@/global_types/video-upload'
import DeferredVideoUploader from './DeferredVideoUploader.vue'
import nativeVideoViewer from './nativeVideoViewer/index.vue'
import SelectUserIdAndNickname from '@/components/selectUserIdAndNickname/index.vue'
import { useIssueOptions } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueOpLogic'
import { YearTypes } from '@/utils/dataFormat'
import { useBettingStore } from '@/stores/bettingStore'

const emit = defineEmits(['close', 'refresh'])
const { issueOptionsState, loadIssueOptions } = useIssueOptions()
const yearOptions = ref<any[]>(YearTypes)

// Set up store and composables
const whitelist = useWhitelist()
// Set up refs for form and loading states
const formRef = ref<FormInstance>()
const videoUploaderRef = ref<InstanceType<typeof DeferredVideoUploader> | null>(null)
const isLoading = ref(false)
const isSubmitting = ref(false)

// Status for operation control
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
export type VideoFormStatus = Status | 'CREATION' | 'EDIT'
const status = ref<VideoFormStatus>('CREATION')
const showOperation = computed(() => status.value === 'CREATION' || status.value === 'PENDING')
const tagList = ref<{ value: string; label: string }[]>([])

// Video preview state
const videoPreviewUrl = ref<string>('')
const selectedVideoFile = ref<File | null>(null)

// Track if upload is in progress to show uploader during upload
const isUploading = computed(() => {
  return videoUploaderRef.value?.isUploading || false
})

// Form data structure
interface VideoForm {
  userId: string
  title: string
  description: string
  tags: string[]
  videoPath: string
  videoInfo?: VideoInfo
  ifActive?: string
  gameType?: string
  year?: string
  issue?: string
}

const form = reactive<VideoForm>({
  userId: '',
  title: '',
  description: '',
  tags: [],
  videoPath: '',
  ifActive: 'n',
  gameType: '',
  year: '',
  issue: ''
})
const isActive = computed(() => form.ifActive === 'y')
const bettingStore = useBettingStore()
const formRules = reactive({
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  title: [{ required: true, message: '请输入视频标题', trigger: 'change' }],
  gameType: [{ required: isActive.value, message: '请选择彩种', trigger: 'change' }],
  year: [{ required: isActive.value, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: isActive.value, message: '请选择期数', trigger: 'change' }],
  description: [{ required: true, message: '请输入视频简介', trigger: 'change' }]
})

// Close modal
const handleCancel = () => {
  // Clean up blob URL if exists
  if (videoPreviewUrl.value && videoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }
  emit('close')
}

// Reset video selection
const resetVideo = () => {
  // Clean up blob URL if exists
  if (videoPreviewUrl.value && videoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }

  videoPreviewUrl.value = ''
  selectedVideoFile.value = null
  form.videoPath = ''

  // Reset the uploader component
  if (videoUploaderRef.value) {
    videoUploaderRef.value.reset()
  }
}

// Helper method to validate uploader state
const validateUploaderState = (): string | null => {
  if (!videoUploaderRef.value) {
    return '视频上传器组件未初始化'
  }

  if (!selectedVideoFile.value) {
    return '没有选择的视频文件'
  }

  if (!videoUploaderRef.value.hasSelectedFile) {
    return '上传器中没有选择的文件'
  }

  return null // All validations passed
}

// Submit form with upload
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    // Check if we have a selected file that needs uploading
    if (!selectedVideoFile.value && !form.videoPath) {
      ElMessage.error('请选择视频')
      return
    }

    isSubmitting.value = true

    try {
      let videoUrl = form.videoPath

      // If we have a selected file but no uploaded URL, upload first
      if (selectedVideoFile.value && !form.videoPath) {
        console.log('Starting upload process...')
        console.log('videoUploaderRef.value:', videoUploaderRef.value)
        console.log('selectedVideoFile.value:', selectedVideoFile.value)

        // Validate uploader state before proceeding
        const validationError = validateUploaderState()
        if (validationError) {
          throw new Error(validationError)
        }

        ElMessage.info('正在上传视频...')

        try {
          const uploadResult = await videoUploaderRef.value!.uploadFile()
          console.log('Upload result:', uploadResult)

          if (uploadResult.success && uploadResult.data && uploadResult.data.fileUrl) {
            videoUrl = uploadResult.data.fileUrl
            ElMessage.success('视频上传成功')
          } else {
            throw new Error(uploadResult.message || '视频上传失败：未获取到文件URL')
          }
        } catch (uploadError: any) {
          console.error('Upload error details:', uploadError)
          throw new Error(`视频上传失败: ${uploadError.message || uploadError}`)
        }
      }

      // Validate that we have a video URL before creating
      if (!videoUrl) {
        throw new Error('无法获取视频URL，无法创建视频记录')
      }

      // Create video with uploaded URL
      const videoData: any = {
        ...form,
        videoPath: videoUrl,
        tags: form.tags.map((tag) => {
          // @ts-ignore
          return tag.id ? tag.id : tag
        })
      }
      if (isActive.value) {
        const gameInfo = bettingStore.gameType.find((item) => item.gameType === form.gameType)!
        videoData.gameTypeCode = gameInfo.gameTypeCode
        videoData.gameTypeLongName = gameInfo.gameTypeLongName
        videoData.gameTypeName = gameInfo.gameTypeName
        videoData.gameTypeShortName = gameInfo.gameTypeShortName
        videoData.gameType = form.gameType
        videoData.gamePublishYear = form.year
        videoData.gameDrawNumber = form.issue
      } else {
        delete videoData.gameType
        delete videoData.gamePublishYear
        delete videoData.gameDrawNumber
      }
      console.log('Creating video with data:', videoData)
      const result = await createVideo(videoData)

      if (result.success && result.data) {
        ElMessage.success('视频创建成功')
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || '视频创建失败')
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      ElMessage.error(error.message || '提交失败')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
    isSubmitting.value = false
  }
}

// Handle file selection for preview
const handleFileSelected = (file: File | null) => {
  console.log('File selected:', file)
  selectedVideoFile.value = file

  if (!file) {
    videoPreviewUrl.value = ''
    form.videoPath = ''
  }
}

// Handle preview URL creation
const handlePreviewReady = (previewUrl: string) => {
  console.log('Preview ready:', previewUrl)
  videoPreviewUrl.value = previewUrl
}

// Handle upload success (for backward compatibility)
const handleUploadSuccess = (response: any) => {
  console.log('Upload success:', response)
  if (response.data && response.data.fileUrl) {
    form.videoPath = response.data.fileUrl
  }
}

// Handle upload error
const handleUploadError = (error: any) => {
  console.error('Upload error:', error)
  ElMessage.error(`上传失败: ${error.message || error}`)
}
const handleGameTypeChange = async (gt: string | undefined) => {
  console.log('handleGameTypeChange', gt)
  form.issue = ''
  await loadIssueOptions({ gameType: gt!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const handleYearChange = async () => {
  await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const handleIfActiveChange = async () => {
  // Clear validation errors for fields that are no longer required
  if (formRef.value) {
    if (form.ifActive === 'n') {
      formRef.value.clearValidate(['gameType', 'year', 'issue'])
    } else {
      formRules.gameType = [{ required: isActive.value, message: '请选择彩种', trigger: 'change' }]
      formRules.year = [{ required: isActive.value, message: '请选择年份', trigger: 'change' }]
      formRules.issue = [{ required: isActive.value, message: '请选择期数', trigger: 'change' }]
    }
  }

  await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
// Initialize component
onMounted(async () => {
  console.log('Initializing component...')
  // Load initial data
  await whitelist.loadWhitelistData()
  tagList.value = await getFormattedVideoTagList()
  form.year = yearOptions.value[0].value
  // Debug: Check if videoUploaderRef is available
  console.log('videoUploaderRef after mount:', videoUploaderRef.value)
})
</script>

<style scoped lang="scss">
.video-form {
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .input-with-button {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-height: 500px;

    .el-input {
      flex: 1;
    }
    .video-player {
      flex: 1;
    }
  }
}

.button-row {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 10px 0;
}
</style>
