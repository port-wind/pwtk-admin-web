<template>
  <!-- 新增广告/编辑广告-->
  <el-dialog v-model="dialogVisible" :close-on-click-modal="false" @close="closeDialog" class="tabs-dialog">
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="广告" name="first" class="m_tabs_pane">
        <el-scrollbar>
          <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
            <el-form-item label="广告图片：" prop="logo">
              <FileImageUpload
                v-model="addForm.logo"
                type="info"
                :upload-from="EUploadFrom.ANNOUNCEMENT_LOGO"
                ref="fileImageUploadRef"
                :immediate="true"
                :acceptRules="imageRules"
                :useDefault="false"
                @update:modelValue="handleLogoChange"
              />
              <span style="font-size: 12px; color: red; margin-left: 10px">*推荐尺寸为730 px * 213 px</span>
            </el-form-item>
            <el-form-item label="广告名称：" prop="name">
              <el-input
                v-model="addForm.name"
                placeholder="请输入广告名称"
                autocomplete="off"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="广告时间：" prop="startEndTime" class="required-field">
              <!-- :disable-date-fn="disableDateFn" -->

              <TimeSelect v-model:startDate="addForm.startTime" v-model:endDate="addForm.endTime"></TimeSelect>
            </el-form-item>
            <el-form-item label="彩种：" prop="gameType">
              <!-- <GameTypeList
                v-if="!props.id"
                v-model="addForm.gameType"
                style="width: 100px"
                withDefault
                :allGame="false"
              /> -->
              <GameTypeListMulti
                v-if="!props.id"
                v-model="addForm.gameType"
                style="width: 200px"
                withDefault
                :allGame="false"
              />
              <span v-else>
                {{
                  addForm.gameTypeList
                    .map((g) => gameTypeList.find((item) => item.value === g.toString())?.label)
                    .join(',')
                }}
              </span>
            </el-form-item>
            <el-form-item label="URL：" prop="url">
              <el-input v-model="addForm.url" placeholder="请输入链接地址" autocomplete="off" />
            </el-form-item>
            <el-form-item label="广告状态：" prop="status">
              <el-radio-group v-model="addForm.status">
                <el-radio value="y">启用</el-radio>
                <el-radio value="n">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注：" prop="desc">
              <el-input
                v-model="addForm.desc"
                type="textarea"
                :rows="4"
                maxlength="200"
                show-word-limit
                placeholder="请输入广告描述..."
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item v-if="addForm.createTime" label="创建时间：" prop="">
              {{ unitFormatDate(addForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
            </el-form-item>

            <!-- 广告图片上传 -->
          </el-form>
        </el-scrollbar>
        <div class="button-row">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="submitInfo">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import TimeSelect from '@/components/timeSelect2/index.vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import { reqAdvertisementById, reqAdvertisementCreate, reqAdvertisementEdit } from '@/api/advertisement'
import type { IAdvertisementCreateData, IAdvertisementEditData } from '@/api/advertisement/types'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
import { getImageDimensionsURL } from '@/utils/dataFormat'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import { useBettingStore } from '@/stores/bettingStore'

// Props
interface Props {
  visible: boolean
  id: string
}
const bettingStore = useBettingStore()
const gameTypeList = computed(() => {
  return bettingStore.getAllGetGameType().map((item) => ({
    value: item.gameType,
    label: item.gameTypeName
  }))
})
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  id: ''
})
const widthAndHeightRule = async (file: any) => {
  const { width, height } = await getImageDimensionsURL(file)
  if (width && height) {
    const isCorrectSize = width === 730 && height === 213
    if (!isCorrectSize) {
      ElMessage.error(`图片尺寸必须为 730px x 213px,当前尺寸：${width}px x ${height}px`)
    }
    return isCorrectSize
  }

  // 如果无法获取尺寸信息
  ElMessage.warning('无法获取图片尺寸信息')
  return false
}
const sizeRule = async (file: any) => {
  const UPLOAD_FILE_LIMIT = 1 // 1M
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    // eslint-disable-next-line no-alert
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  return true
}
const imageRules = ref<Function[]>([sizeRule])
// Emits
const emit = defineEmits(['update:visible', 'success'])

// Refs
const fileImageUploadRef = ref<any>(null)
const formRef = ref<any>(null)

// Reactive data
const activeTab = ref('first')
const isLoading = ref(false)
// Form data initialization
const initForm = () => ({
  id: undefined as number | undefined,
  name: '',
  desc: '',
  url: '',
  sort: 0,
  logo: '',
  status: 'y' as 'y' | 'n',
  startTime: '',
  endTime: '',
  createTime: '',
  timeRange: [],
  gameType: [gameTypeList.value[0].value],
  gameTypeList: [] as string[]
})

const addForm = reactive(initForm())
function autoEndAfterAudioValidation(rule, value, callback) {
  console.log('autoEndAfterAudio', addForm.startTime)

  // If autoEndAfterAudio is true, both start and end time in timeRange are required
  if (!addForm.startTime) {
    callback(new Error('请选择预计开始时间'))
    return
  }

  if (!addForm.endTime) {
    callback(new Error('请选择预计结束时间'))
    return
  }

  // Validate that endTime is after startTime
  const startDateTime = new Date(addForm.startTime)
  const endDateTime = new Date(addForm.endTime)

  if (endDateTime <= startDateTime) {
    callback(new Error('预计结束时间必须晚于预计开始时间'))
    return
  }

  callback()
}
// Form rules
const rulesAddFrom = ref({
  startEndTime: [{ validator: autoEndAfterAudioValidation, trigger: 'change' }],
  name: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
  url: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!checkIsUrlOrNot(value) && value) {
          callback(new Error('请输入类似https://www.google.com/的URL！'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  logo: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
  sort: [{ type: 'number', message: '排序必须为数字', trigger: 'blur' }]
})

// Computed
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const distinguish = computed(() => {
  return !!props.id
})
const closeDialog = () => {
  emit('update:visible', false)
}

// Methods
const submitInfo = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      isLoading.value = true
      try {
        // Convert dates to timestamps (no formatting, just timestamps)
        let res
        if (distinguish.value) {
          // Edit mode - include id
          const editData: IAdvertisementEditData = {
            ...addForm,
            startTime: Number(addForm.startTime),
            endTime: Number(addForm.endTime),
            id: addForm.id!
          }
          res = await reqAdvertisementEdit(editData)
        } else {
          // Create mode - no id
          const createData: IAdvertisementCreateData = {
            ...addForm,
            startTime: Number(addForm.startTime),
            endTime: Number(addForm.endTime),
            gameTypeList: addForm.gameType.map((item) => item)
          }
          res = await reqAdvertisementCreate(createData)
        }

        if (res.success) {
          ElMessage({
            showClose: true,
            message: distinguish.value ? '编辑成功' : '新增成功',
            type: 'success'
          })
          emit('success')
          closeDialog()
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
        ElMessage.error('操作失败')
      } finally {
        isLoading.value = false
      }
    }
  })
}

// Add this method to handle logo changes and trigger validation
const handleLogoChange = (value: string) => {
  addForm.logo = value
  // Manually trigger form validation for the logo field
  nextTick(() => {
    if (formRef.value) {
      formRef.value.validateField('logo')
    }
  })
}
const getDetailById = async (id: string) => {
  try {
    isLoading.value = true
    const res = await reqAdvertisementById(id)
    if (res.success) {
      Object.assign(addForm, res.data)
    } else {
      showErrorMessage(res)
    }
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  console.log('addForm', addForm)

  if (props.id) {
    await getDetailById(props.id)
  }
})
</script>

<style scoped lang="less">
.button-row {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
.required-field {
  :deep(.el-form-item__label)::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>
