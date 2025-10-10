<template>
  <div class="room-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="12">
          <!-- Room Name with Refresh Button -->
          <el-form-item label="语音房名称:" prop="name">
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
          <!-- Top State Selection -->
          <el-form-item label="置顶:" prop="state">
            <el-radio-group v-model="form.state" :disabled="!showOperation">
              <el-radio value="ON_TOP">是</el-radio>
              <el-radio value="CANCEL_ON_TOP">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- Room Description -->
          <el-form-item label="房间简介:" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              rows="3"
              placeholder="请输入房间简介"
              :disabled="!showOperation"
            />
          </el-form-item>
          <el-form-item label="添加音频:" prop="audioUrl" style="margin-bottom: 10px">
            <div class="input-with-button">
              <audioViewer :audio-source="form.audioUrl" />
              <fileUploaderBtn
                :uploadOptions="{ fileFieldName: 'audio', params: { uploaderId: uploaderId } }"
                :showOperation="showOperation"
                :audio-info="form.audioInfo"
                @file-selected="handleFileSelected"
                @upload-success="handleUploadSuccess"
              />
            </div>
          </el-form-item>
          <el-form-item label="" style="margin-bottom: 3px">
            <el-link type="primary" @click="toAudioConvertTool">音频转换工具链接</el-link>
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
        <el-col :span="12">
          <!-- Game Type Selection -->
          <el-form-item label="彩种:" prop="lotteryType">
            <GameTypeList v-model="form.lotteryType" @onSelect="handleGameTypeChange" :disabled="!showOperation" />
          </el-form-item>

          <!-- Series Selection -->
          <el-form-item label="关联系列:" prop="seriesId">
            <el-select
              v-model="form.seriesId"
              placeholder="请选择关联系列"
              :disabled="!form.lotteryType || seriesLoading || !showOperation"
              :loading="seriesLoading"
              @change="handleSeriesChange"
              clearable
              filterable
            >
              <el-option
                v-for="item in seriesList"
                :key="item.seriesCode"
                :label="item.seriesName"
                :value="item.seriesCode"
              />
            </el-select>
          </el-form-item>

          <!-- Newspaper Selection -->
          <el-form-item label="关联报纸:" prop="newspaperId">
            <el-select
              v-model="form.newspaperId"
              placeholder="请选择关联报纸"
              :disabled="!form.seriesId || newspaperLoading || !showOperation"
              :loading="newspaperLoading"
              @change="handleNewspaperChange"
              clearable
              filterable
            >
              <el-option
                v-for="item in newspaperList"
                :key="item.newspaperCode"
                :label="item.newspaperName"
                :value="item.newspaperCode"
              />
            </el-select>
          </el-form-item>

          <!-- Issue Selection -->
          <el-form-item label="关联期刊:" prop="journalId">
            <el-select
              v-model="form.journalId"
              placeholder="请选择关联期刊"
              :disabled="!form.newspaperId || issueLoading || !showOperation"
              :loading="issueLoading"
              @change="handleIssueChange"
              clearable
            >
              <el-option v-for="item in issueList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="背景图:" prop="customizedImg">
            <FileImageUpload
              v-model="form.customizedImg"
              type="info"
              :disabled="!showOperation"
              :upload-from="EUploadFrom.CHAT_IMG"
              ref="fileImageUploadRef"
              :immediate="true"
            />
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
        </el-col>
      </el-row>
    </el-form>
    <section class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        v-if="showOperation"
        type="primary"
        :loading="isSubmitting || seriesLoading || newspaperLoading || issueLoading"
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
import {
  listGameTypeSeries as getGameTypeSeries,
  getNewsPaperList as getGameTypeNewspaper
} from '@/api/photoSys/series'
import { list as getIssueList } from '@/api/photoSys/issues'
import { useRoomNames } from '@/composables/useRoomName'
import { useWhitelist } from '@/composables/useWhiteList'
import { createVoiceRoomTask, getVoiceRoomTaskDetail, updateVoiceRoomTask } from '@/api/task'
import { disableDateFn, unitFormatDate } from '@/utils/dateFormat'
import type { AudioInfo } from './fileUploaderBtn.vue'
import { audioConvertToolUrl } from '@/utils/http'
import { EUploadFrom } from '@/components/uploadImage/type'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps<{
  id: string
}>()
const editMode = computed(() => !!props.id)
// Set up store and composables
const roomNames = useRoomNames()
const whitelist = useWhitelist()
const uploaderId = computed(() => '82')
// Set up refs for form and loading states
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const seriesLoading = ref(false)
const newspaperLoading = ref(false)
const issueLoading = ref(false)
const isSubmitting = ref(false)
// Data for selections
interface SeriesItem {
  seriesCode: string
  seriesName: string
}

interface NewspaperItem {
  newspaperCode: string
  newspaperName: string
}

interface IssueItem {
  issueId: string
  year: string
  issue: string
  imgPath: string
  label: string
  value: string
}

const seriesList = ref<SeriesItem[]>([])
const newspaperList = ref<NewspaperItem[]>([])
const issueList = ref<IssueItem[]>([])
type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED'
export type TaskFormStatus = Status | 'CREATION' | 'EDIT'
const status = ref<TaskFormStatus>('CREATION')
const showOperation = computed(() => status.value === 'CREATION' || status.value === 'PENDING')
// Form data structure
interface TaskForm {
  id?: string
  name: string
  type: string
  lotteryType: string
  creatorId: string
  seriesId: string
  seriesName: string
  state: string
  newspaperId: string
  description: string
  journalId: string
  seatState: number
  speakState: number
  joinState: number
  gameReleaseYear: string
  serialPeriodNo: string
  backgroundImg: string
  customizedImg?: string
  audioUrl: string
  startTime: string
  endTime: string
  autoEndAfterAudio: boolean
  remark: string
  creatorNickname: string
  audioInfo?: AudioInfo
  timeRange: [Date, Date]
}
const getRightNow = (autoEndAfterAudio: boolean) => {
  const time = new Date().getTime()
  return autoEndAfterAudio ? time : unitFormatDate(time, 'yyyy-MM-dd HH:mm:ss')!
}
const form = reactive<TaskForm>({
  id: '',
  name: '',
  type: 'BACKEND',
  lotteryType: '',
  creatorId: '',
  seriesId: '',
  seriesName: '',
  state: 'CANCEL_ON_TOP',
  newspaperId: '',
  description: '',
  journalId: '',
  seatState: 1,
  speakState: 1,
  joinState: 1,
  gameReleaseYear: '',
  serialPeriodNo: '',
  backgroundImg: '',
  customizedImg: '',
  audioUrl: '',
  startTime: getRightNow(false) as string,
  endTime: '',
  autoEndAfterAudio: false,
  remark: '',
  creatorNickname: '',
  audioInfo: undefined,
  timeRange: [new Date(), new Date(new Date().getTime() + 60 * 60 * 1000)]
})
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
  audioUrl: [{ required: true, message: '请选择音频', trigger: 'change' }],
  name: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
  lotteryType: [{ required: true, message: '请选择彩种', trigger: 'change' }],
  newspaperId: [{ required: true, message: '请选择报纸', trigger: 'change' }],
  seriesId: [{ required: true, message: '请选择系列', trigger: 'change' }],
  journalId: [{ required: true, message: '请选择期刊', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择预计开始时间', trigger: 'change' }],
  startEndTime: [{ validator: autoEndAfterAudioValidation, trigger: 'change' }]
})
// Generate a random room name
const refreshRoomName = async () => {
  const name = await roomNames.generateRoomName()
  if (name) {
    form.name = name
  }
}
const handleCreatorChange = (obj) => {
  console.log('Creator changed:', obj)
  form.creatorNickname = obj.nickname
}
// Handle game type change
const handleGameTypeChange = async () => {
  // Reset dependent fields
  form.seriesId = ''
  form.newspaperId = ''
  form.journalId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  newspaperList.value = []
  issueList.value = []

  if (!form.lotteryType) return

  seriesLoading.value = true

  try {
    const response = await getGameTypeSeries({
      page: 1,
      size: 999,
      gameType: form.lotteryType
    })

    if (response.success) {
      seriesList.value = response.data.list || []
    } else {
      ElMessage.error('获取彩种系列失败')
    }
  } catch (error) {
    ElMessage.error('获取彩种系列失败')
  } finally {
    seriesLoading.value = false
  }
}

// Handle series change
const handleSeriesChange = async (seriesId: string) => {
  console.log('🚀 ~ handleSeriesChange ~ seriesId:', seriesId)
  // Reset dependent fields
  form.newspaperId = ''
  form.journalId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  newspaperList.value = []
  issueList.value = []

  if (!form.seriesId) return
  const series = seriesList.value.find((item) => item.seriesCode === seriesId)
  if (series) {
    form.seriesName = series.seriesName
  }

  newspaperLoading.value = true

  try {
    const response = await getGameTypeNewspaper({
      page: 1,
      size: 999,
      gameType: form.lotteryType,
      seriesCode: form.seriesId
    })

    if (response.success) {
      newspaperList.value = response.data.list || []
    } else {
      ElMessage.error(response.message || '获取关联报纸失败')
    }
  } catch (error) {
    ElMessage.error('获取关联报纸失败')
  } finally {
    newspaperLoading.value = false
  }
}

// Handle newspaper change
const handleNewspaperChange = async () => {
  // Reset dependent fields
  form.journalId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  issueList.value = []

  if (!form.newspaperId) return

  issueLoading.value = true

  try {
    const response = await getIssueList({
      page: 1,
      size: 999,
      gameType: form.lotteryType,
      seriesCode: form.seriesId,
      newspaperCode: form.newspaperId
    })

    if (response.success) {
      issueList.value = (response.data.list || []).map((item) => ({
        ...item,
        label: `${item.year}年 第${item.issue}期`,
        value: item.issueId
      }))
    } else {
      ElMessage.error(response.message || '获取关联期刊失败')
    }
  } catch (error) {
    ElMessage.error('获取关联期刊失败')
  } finally {
    issueLoading.value = false
  }
}

// Handle issue change
const handleIssueChange = () => {
  if (!form.journalId) return

  const selectedIssue = issueList.value.find((item) => item.value === form.journalId)
  if (selectedIssue) {
    form.gameReleaseYear = selectedIssue.year || ''
    form.serialPeriodNo = selectedIssue.issue || ''
    form.backgroundImg = selectedIssue.imgPath || ''
  }
}

// Close modal
const handleCancel = () => {
  emit('close')
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return
  const submitForm = {
    ...form,
    startTime: form.autoEndAfterAudio ? new Date(form.timeRange[0]).getTime() : new Date(form.startTime).getTime(),
    endTime: form.autoEndAfterAudio ? new Date(form.timeRange[1]).getTime() : '',
    autoEndAfterAudio: !form.autoEndAfterAudio
  }
  console.log(submitForm)

  try {
    const valid = await formRef.value.validate()

    if (!valid) return

    // Prepare submission data
    // delete submitForm.state
    if (!submitForm.endTime) delete (submitForm as any).endTime

    isSubmitting.value = true

    try {
      const result = editMode.value ? await updateVoiceRoomTask(submitForm) : await createVoiceRoomTask(submitForm)

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
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
  }
}
const handleFileSelected = (file: File) => {
  console.log('File selected:', file)
  form.audioUrl = ''
}
const handleUploadSuccess = (response: any) => {
  console.log('Upload success:', response)
  // form.audioUrl = `${VITE_TASK_DOMAIN}${response.data.url}`
  form.audioUrl = response.data.url
  // Force validation update for the audioUrl field
  if (formRef.value) {
    formRef.value.validateField('audioUrl')
    console.log('Current audioUrl value:', form.audioUrl)
  }
}
const toAudioConvertTool = () => {
  window.open(audioConvertToolUrl)
}
const handleautoEndAfterAudioChange = (autoEndAfterAudio: boolean) => {
  console.log('autoEndAfterAudio', autoEndAfterAudio)
}
const loadTaskData = async () => {
  isLoading.value = true
  try {
    const response = await getVoiceRoomTaskDetail({ id: props.id })
    console.log('Task detail:', response)

    if (response.success) {
      const detail = response.data
      status.value = detail.status
      form.id = detail.id
      form.audioUrl = detail.audioUrl
      form.name = detail.name
      form.creatorId = detail.creatorId
      form.journalId = detail.journalId
      form.serialPeriodNo = detail.serialPeriodNo
      form.gameReleaseYear = detail.gameReleaseYear
      form.backgroundImg = detail.backgroundImg
      form.customizedImg = detail.customizedImg
      form.description = detail.description
      form.lotteryType = detail.lotteryType
      form.remark = detail.remark
      form.creatorNickname = detail.creatorNickname
      form.autoEndAfterAudio = !detail.autoEndAfterAudio
      form.audioInfo = detail.audioInfo
      if (!form.autoEndAfterAudio) {
        form.startTime = detail.startTime ? unitFormatDate(detail.startTime, 'yyyy-MM-dd HH:mm:ss')! : ''
      } else {
        form.timeRange = [new Date(detail.startTime), new Date(detail.endTime || detail.estimatedEndTime)]
      }
      await handleGameTypeChange()
      form.seriesId = detail.seriesId
      await handleSeriesChange()
      form.newspaperId = detail.newspaperId
      await handleNewspaperChange()
      form.journalId = detail.journalId
      await handleIssueChange()
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
.required-field {
  :deep(.el-form-item__label)::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
