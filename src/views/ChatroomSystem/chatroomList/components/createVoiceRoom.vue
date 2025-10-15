<template>
  <div class="room-form">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1">
      <el-row>
        <el-col :span="12">
          <!-- Room Name with Refresh Button -->
          <el-form-item label="语音房名称:" prop="title">
            <div class="input-with-button">
              <el-input v-model="form.title" placeholder="请输入房间名称" />
              <el-button
                icon="Refresh"
                type="primary"
                :loading="roomNames.isGenerating.value"
                @click="refreshRoomName"
              />
            </div>
          </el-form-item>
          <!-- Creator Selection - Changed to use Autocomplete -->
          <el-form-item label="创建人:" prop="userId">
            <whiteListUserAutocomplete v-model="form.userId" />
          </el-form-item>
          <!-- Top State Selection -->
          <el-form-item label="置顶:" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio value="ON_TOP">是</el-radio>
              <el-radio value="CANCEL_ON_TOP">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- Room Description -->
          <el-form-item label="语音房简介:" prop="note">
            <el-input v-model="form.note" type="textarea" rows="3" placeholder="请输入房间简介" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- Game Type Selection -->
          <el-form-item label="彩种:" prop="gameType">
            <GameTypeList v-model="form.gameType" @onSelect="handleGameTypeChange" />
          </el-form-item>

          <!-- Series Selection -->
          <el-form-item label="关联系列:" prop="gameSerialNo">
            <el-select
              v-model="form.gameSerialNo"
              placeholder="请选择关联系列"
              :disabled="!form.gameType || isLoading"
              :loading="isLoading"
              @change="handleSeriesChange"
              clearable
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
          <el-form-item label="关联报纸:" prop="newspaperCode">
            <el-select
              v-model="form.newspaperCode"
              placeholder="请选择关联报纸"
              :disabled="!form.gameSerialNo || isLoading"
              :loading="isLoading"
              @change="handleNewspaperChange"
              clearable
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
          <el-form-item label="关联期刊:" prop="issueId">
            <el-select
              v-model="form.issueId"
              placeholder="请选择关联期刊"
              :disabled="!form.newspaperCode || isLoading"
              :loading="isLoading"
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
              :upload-from="EUploadFrom.CHAT_IMG"
              ref="fileImageUploadRef"
              :immediate="true"
            />
          </el-form-item>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { batchCreateRoom, onTopRoom, reqChatRoomList } from '@/api/chat'
import {
  listGameTypeSeries as getGameTypeSeries,
  getNewsPaperList as getGameTypeNewspaper
} from '@/api/photoSys/series'
import { list as getIssueList } from '@/api/photoSys/issues'
import { useModalsStore } from '@/stores/modalStore'
import { useRoomNames } from '@/composables/useRoomName'
import { useWhitelist } from '@/composables/useWhiteList'
import { EUploadFrom } from '@/components/uploadImage/type'

// Import only the truly reusable composables

// Set up store and composables
const modalsStore = useModalsStore()
const roomNames = useRoomNames()
const whitelist = useWhitelist()

// Set up refs for form and loading states
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const isSubmitting = ref(false)
const formRules = reactive({
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  title: [{ required: true, message: '请输入房间名称', trigger: 'change' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }],
  seriesCode: [{ required: true, message: '请选择系列', trigger: 'change' }],
  newspaperCode: [{ required: true, message: '请选择报纸', trigger: 'change' }],
  gameSerialNo: [{ required: true, message: '请选择关联系列', trigger: 'change' }],
  issueId: [{ required: true, message: '请选择期刊', trigger: 'change' }]
})
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
// Define emits
const emit = defineEmits<{
  (_: 'refresh'): void
}>()

const seriesList = ref<SeriesItem[]>([])
const newspaperList = ref<NewspaperItem[]>([])
const issueList = ref<IssueItem[]>([])

// Form data structure
interface RoomForm {
  title: string
  type: string
  gameType: string
  userId: string
  gameSerialNo: string
  seriesName: string
  state: string
  newspaperCode: string
  newspaperName?: string
  note: string
  issueId: string
  issueName?: string
  seatState: number
  speakState: number
  joinState: number
  gameReleaseYear: string
  serialPeriodNo: string
  backgroundImg: string
  customizedImg?: string
}

const form = reactive<RoomForm>({
  title: '',
  type: 'BACKEND',
  gameType: '',
  userId: '',
  gameSerialNo: '',
  state: 'CANCEL_ON_TOP',
  newspaperCode: '',
  note: '',
  issueId: '',
  seriesName: '',
  newspaperName: '',
  issueName: '',
  seatState: 1,
  speakState: 1,
  joinState: 1,
  gameReleaseYear: '',
  serialPeriodNo: '',
  backgroundImg: '',
  customizedImg: ''
})

// Generate a random room name
const refreshRoomName = async () => {
  const name = await roomNames.generateRoomName()
  if (name) {
    form.title = name
  }
}

// Handle game type change
const handleGameTypeChange = async () => {
  // Reset dependent fields
  form.gameSerialNo = ''
  form.newspaperCode = ''
  form.issueId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  newspaperList.value = []
  issueList.value = []

  if (!form.gameType) return

  isLoading.value = true

  try {
    const response = await getGameTypeSeries({
      page: 1,
      size: 999,
      gameType: form.gameType
    })

    if (response.success) {
      seriesList.value = response.data.list || []
    } else {
      ElMessage.error('获取彩种系列失败')
    }
  } catch (error) {
    ElMessage.error('获取彩种系列失败')
  } finally {
    isLoading.value = false
  }
}

// Handle series change
const handleSeriesChange = async (seriesCode: string) => {
  console.log('🚀 ~ handleSeriesChange ~ seriesCode:', seriesCode)
  // Reset dependent fields
  form.newspaperCode = ''
  form.issueId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  newspaperList.value = []
  issueList.value = []

  if (!form.gameSerialNo) return

  const series = seriesList.value.find((item) => item.seriesCode === seriesCode)
  if (series) {
    form.seriesName = series.seriesName
  }

  isLoading.value = true

  try {
    const response = await getGameTypeNewspaper({
      page: 1,
      size: 999,
      gameType: form.gameType,
      seriesCode: form.gameSerialNo
    })

    if (response.success) {
      newspaperList.value = response.data.list || []
    } else {
      ElMessage.error(response.message || '获取关联报纸失败')
    }
  } catch (error) {
    ElMessage.error('获取关联报纸失败')
  } finally {
    isLoading.value = false
  }
}

// Handle newspaper change
const handleNewspaperChange = async () => {
  // Reset dependent fields
  form.issueId = ''
  form.gameReleaseYear = ''
  form.serialPeriodNo = ''
  form.backgroundImg = ''

  // Reset lists
  issueList.value = []

  if (!form.newspaperCode) return

  isLoading.value = true

  try {
    const response = await getIssueList({
      page: 1,
      size: 999,
      gameType: form.gameType,
      seriesCode: form.gameSerialNo,
      newspaperCode: form.newspaperCode
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
    isLoading.value = false
  }
}

// Handle issue change
const handleIssueChange = () => {
  if (!form.issueId) return

  const selectedIssue = issueList.value.find((item) => item.value === form.issueId)
  if (selectedIssue) {
    form.gameReleaseYear = selectedIssue.year || ''
    form.serialPeriodNo = selectedIssue.issue || ''
    form.backgroundImg = selectedIssue.imgPath || ''
  }
}

// Close modal
const handleCancel = () => {
  modalsStore.hideModal('createRoomModal')
  modalsStore.setModalData('createRoomModal', {})
}
const CheckVoiceRoomExist = async (_queryForm = { userId: '' }): Promise<boolean> => {
  if (!_queryForm.userId) {
    console.error('userId is required')
    return false
  }
  const params = {
    ..._queryForm,
    status: '1',
    page: 1,
    size: 1,
    type: 'VOICE'
  }
  try {
    const response = await reqChatRoomList(params)
    if (response.success) {
      const tempList = response!.data?.list
      return tempList.length > 0
    }
    return false
  } catch (error) {
    console.error('Error fetching data:', error)
    return false
  }
}
// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // Prepare submission data
    const submitForm = { ...form }
    const topState = submitForm.state
    // delete submitForm.state

    const isExist = await CheckVoiceRoomExist({ userId: form.userId })
    if (isExist) {
      ElMessage.warning('当前用户已创建语音房，请勿重复创建')
      return
    }
    try {
      isSubmitting.value = true
      const result = await batchCreateRoom({ list: [submitForm] })

      if (result.success && result.data && result.data.length > 0) {
        // Set top state
        await onTopRoom({
          id: result.data[0],
          state: topState
        })

        ElMessage.success('语音房创建成功')

        // Close modal and refresh parent
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || '创建失败')
      }
    } catch (error) {
      ElMessage.error('创建失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
  }
}
// Initialize component
onMounted(async () => {
  console.log('Initializing component...')

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
    gap: 8px;
    width: 100%;

    .el-input {
      flex: 1;
    }
  }
}
</style>
