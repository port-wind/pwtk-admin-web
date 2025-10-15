<template>
  <div class="room-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="12">
          <!-- Room Name with Refresh Button -->
          <el-form-item label="直播间名称:" prop="name">
            <div class="input-with-button">
              <el-input v-model="form.name" placeholder="请输入房间名称" :disabled="!showOperation" />
              <el-button
                icon="Refresh"
                type="primary"
                :loading="roomNames.isGenerating.value"
                @click="refreshRoomName"
                v-if="showOperation"
              />
            </div>
          </el-form-item>
          <!-- Creator Selection - Changed to use Autocomplete -->
          <el-form-item label="创建人:" prop="creatorId">
            <whiteListUserAutocomplete
              v-model="form.creatorId"
              @select="handleCreatorChange"
              :disabled="!showOperation"
            />
          </el-form-item>
          <!-- Room Description -->
          <el-form-item label="房间简介:" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              rows="4"
              placeholder="请输入房间简介"
              :disabled="!showOperation"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="置顶:" prop="is_pinned">
            <el-radio-group v-model="form.is_pinned" :disabled="!showOperation">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="循环播放:" prop="autoEndAfterAudio">
            <el-radio-group
              v-model="form.autoEndAfterAudio"
              @change="(val) => handleautoEndAfterAudioChange(val as boolean)"
              :disabled="!showOperation"
            >
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
            <span v-if="!form.autoEndAfterAudio" style="margin-left: 10px; color: red; font-size: 12px">
              ※音频播放结束后将自动关闭房间
            </span>
          </el-form-item>
          <el-form-item label="开始结束时间:" prop="startEndTime" v-if="form.autoEndAfterAudio" class="required-field">
            <basicDateRangeSelecter
              v-model="form.timeRange"
              start-placeholder="预计开始时间"
              end-placeholder="预计结束时间"
              :disabled="!showOperation"
              :disable-date-fn="disableDateFn"
            />
          </el-form-item>
          <el-form-item label="开始时间:" prop="startTime" v-else required>
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="预计开始时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled-date="disableDateFn"
              :disabled="!showOperation"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="3"
              placeholder="请输入备注"
              :disabled="!showOperation"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="添加视频:" prop="videoPath" style="margin-bottom: 10px">
            <div class="input-with-button">
              <nativeVideoViewer
                :video-source="videoPreviewUrl || form.videoPath"
                v-if="(videoPreviewUrl || form.videoPath) && !isUploading"
              />

              <!-- Show DeferredVideoUploader when no file selected OR when uploading -->
              <LiveVideoUploader
                v-if="status === 'CREATION'"
                ref="videoUploaderRef"
                :uploadOptions="{ fileFieldName: 'video', params: { uploaderId: '82' } }"
                :showOperation="true"
                :user-id="form.creatorId"
                :style="{
                  display: (!videoPreviewUrl && !form.videoPath) || isUploading ? 'flex' : 'none'
                }"
                @file-selected="handleFileSelected"
                @preview-ready="handlePreviewReady"
                @upload-success="handleUploadSuccess"
                @upload-error="handleUploadError"
              />
            </div>
            <!-- <div
              v-if="(videoPreviewUrl || form.videoPath) && !isUploading"
              style="text-align: center; margin-top: 10px"
            >
              <el-button type="danger" @click="resetVideo">重新上传</el-button>
            </div> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <section class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-if="showOperation && !isUploading"
        type="primary"
        :loading="isSubmitting || isUploading"
        @click="handleSubmit"
      >
        提交
      </el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useRoomNames } from '@/composables/useRoomName'
import { useWhitelist } from '@/composables/useWhiteList'
import { disableDateFn, unitFormatDate } from '@/utils/dateFormat'
import { createLiveTask, getLiveTaskDetail, updateLiveTask } from '@/api/task/liveTaskIndex'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  id: string
}>()
// Set up store and composables
const roomNames = useRoomNames()
const whitelist = useWhitelist()
const videoUploaderRef = ref<InstanceType<any> | null>(null)

// const uploaderId = computed(() => '82')
const videoPreviewUrl = ref<string>('')
// Set up refs for form and loading states
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const isSubmitting = ref(false)

// Track if upload is in progress to show uploader during upload
const isUploading = computed(() => {
  return videoUploaderRef.value?.isUploading || false
})

type Status =
  | 'pending_transcoding'
  | 'pending_start'
  | 'transcoding'
  | 'streaming'
  | 'transcoding_failed'
  | 'streaming_failed'
  | 'canceled'
  | 'completed'
export type TaskFormStatus = Status | 'CREATION' | 'EDIT'
const status = ref<TaskFormStatus>('CREATION')
const editMode = computed(() => status.value === 'EDIT')

const selectedVideoFile = ref<File | null>(null)
const getRightNow = (autoEndAfterAudio: boolean) => {
  const time = new Date().getTime()
  return autoEndAfterAudio ? time : unitFormatDate(time, 'yyyy-MM-dd HH:mm:ss')!
}
const form = reactive<any>({
  id: '',
  name: '',
  creatorId: '',
  description: '',
  startTime: getRightNow(false) as string,
  endTime: '',
  autoEndAfterAudio: false,
  remark: '',
  videoPath: '',
  is_pinned: false,
  timeRange: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)]
})
const showOperation = computed(
  () => status.value === 'CREATION' || form.status === 'pending_transcoding' || form.status === 'pending_start'
)

function autoEndAfterAudioValidation(rule, value, callback) {
  console.log('autoEndAfterAudio', form.autoEndAfterAudio)

  // If autoEndAfterAudio is false, no need to validate
  if (!form.autoEndAfterAudio) {
    callback()
    return
  }

  // If autoEndAfterAudio is true, both start and end time in timeRange are required
  if (!form.timeRange || !form.timeRange[0]) {
    callback(new Error('请选择预计开始时间'))
    return
  }

  if (!form.timeRange || !form.timeRange[1]) {
    callback(new Error('请选择预计结束时间'))
    return
  }

  // Validate that endTime is after startTime
  const startDateTime = new Date(form.timeRange[0])
  const endDateTime = new Date(form.timeRange[1])

  if (endDateTime <= startDateTime) {
    callback(new Error('预计结束时间必须晚于预计开始时间'))
    return
  }

  callback()
}
const formRules = reactive({
  creatorId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  videoPath: [{ required: true, message: '请选择视频', trigger: 'change' }],
  name: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择预计开始时间', trigger: 'change' }],
  startEndTime: [{ validator: autoEndAfterAudioValidation, trigger: 'change' }],
  description: [{ required: true, message: '请输入房间简介', trigger: 'change' }]
})
// Generate a random room name
const refreshRoomName = async () => {
  const name = await roomNames.generateRoomName()
  if (name) {
    form.name = name.replace('语音房', '直播间')
  }
}
const handleCreatorChange = (obj) => {
  console.log('Creator changed:', obj)
  form.creatorNickname = obj.nickname
}

// Close modal
const handleCancel = () => {
  emit('close')
}
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
const handleVideoUpload = async () => {
  try {
    const uploadResult = await videoUploaderRef.value!.uploadFile()

    if (uploadResult.success && uploadResult.data && uploadResult.data.fileUrl) {
      const videoUrl = uploadResult.data.fileUrl
      ElMessage.success('视频上传成功')
      return videoUrl
    }
    throw new Error(uploadResult.message || '视频上传失败：未获取到文件URL')
  } catch (uploadError: any) {
    console.error('Upload error details:', uploadError)
    throw new Error(`视频上传失败: ${uploadError.message || uploadError}`)
  }
}
// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  isSubmitting.value = true
  try {
    // If we have a selected file but no uploaded URL, upload first
    if (selectedVideoFile.value && !form.videoPath) {
      // Validate uploader state before proceeding
      const validationError = validateUploaderState()
      if (validationError) {
        throw new Error(validationError)
      }

      ElMessage.info('正在上传视频...')
      await handleVideoUpload()
    }
    if (!form.videoPath) {
      ElMessage.error('请上传视频')
      return
    }
    const valid = await formRef.value.validate()

    if (!valid) return
    const submitForm: any = {
      //   ...form,
      start_time: form.autoEndAfterAudio ? new Date(form.timeRange[0]).getTime() : new Date(form.startTime).getTime(),
      loop_end_time: form.autoEndAfterAudio ? new Date(form.timeRange[1]).getTime() : '',
      enable_loop_streaming: form.autoEndAfterAudio,
      room_name: form.name,
      room_description: form.description,
      created_by_user_id: form.creatorId,
      video_source: form.videoPath,
      trigger_type: 'scheduled',
      task_name: form.name,
      remark: form.remark,
      is_pinned: form.is_pinned
    }
    if (!submitForm.loop_end_time) {
      delete submitForm.loop_end_time
    }
    if (!submitForm.remark) {
      delete submitForm.remark
    }
    if (editMode.value) {
      submitForm.id = props.id
      delete submitForm.video_source
    }

    try {
      const result = editMode.value ? await updateLiveTask(submitForm) : await createLiveTask(submitForm)

      if (result.success && result.data) {
        ElMessage.success(editMode.value ? '任务更新成功' : '任务创建成功')

        // Close modal and refresh parent
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || (editMode.value ? '更新失败' : '创建失败'))
      }
    } catch (error: any) {
      console.log(error)

      ElMessage.error(error.message || (editMode.value ? '更新失败' : '创建失败，请稍后重试'))
    }
  } catch (error) {
    console.log(error)
    ElMessage.error('表单验证失败，请检查必填项')
  } finally {
    isSubmitting.value = false
  }
}
const handleFileSelected = (file: File | null) => {
  console.log('File selected:', file)
  selectedVideoFile.value = file
  form.videoPath = ''

  if (!file) {
    videoPreviewUrl.value = ''
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

const handleautoEndAfterAudioChange = (autoEndAfterAudio: boolean) => {
  console.log('autoEndAfterAudio', autoEndAfterAudio)
}
const loadTaskData = async () => {
  isLoading.value = true
  try {
    const response = await getLiveTaskDetail({ id: props.id })
    console.log('Task detail:', response)

    if (response.success) {
      const detail = response.data
      form.status = detail.status
      form.name = detail.room_name
      form.description = detail.room_description
      form.creatorId = detail.created_by_user_id
      form.videoPath = detail.video_source
      form.autoEndAfterAudio = detail.enable_loop_streaming
      form.remark = detail.remark || ''
      form.is_pinned = detail.is_pinned
      form.startTime = detail.start_time
      form.endTime = detail.end_time || detail.loop_end_time
      if (!form.autoEndAfterAudio) {
        form.startTime = form.startTime ? unitFormatDate(form.startTime, 'yyyy-MM-dd HH:mm:ss')! : ''
      } else {
        form.timeRange = [new Date(form.startTime), new Date(form.endTime)]
      }
    } else {
      ElMessage.error(response.message || '获取任务详情失败')
    }
  } catch (error) {
    ElMessage.error('获取任务详情失败')
  } finally {
    isLoading.value = false
  }
}

// Initialize component
onMounted(async () => {
  console.log('Initializing component...')
  if (props.id) {
    console.log('Loading task data...', props.id)
    status.value = 'EDIT'
    await loadTaskData()
  }
  // Load initial data
  await whitelist.loadWhitelistData()
})
</script>

<style scoped lang="scss">
.room-form {
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .input-with-button {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .el-input {
      flex: 1;
    }
    .audio-player {
      flex: 1;
    }
  }
}
:deep(video) {
  width: 350px;
  max-height: 180px !important;
  flex: 1;
}
.required-field {
  :deep(.el-form-item__label)::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
