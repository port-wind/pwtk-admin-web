<template>
  <el-tab-pane label="草图信息" :name="firstTabName" class="m_tabs_pane">
    <el-scrollbar>
      <el-row justify="center">
        <el-col :span="20">
          <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
            <el-form-item label="草图代码:" align="left" prop="sketchCode">
              <el-input
                v-if="!distinguish"
                v-model.trim="addForm.sketchCode"
                :disabled="distinguish"
                placeholder="请输入8位长度代码"
                maxlength="8"
                autocomplete="off"
              />
              <span v-else>
                <span>
                  {{ addForm.sketchCode }}
                </span>
                <copy :content="addForm.sketchCode"></copy>
              </span>
            </el-form-item>
            <el-form-item label="草图名称:" align="left" prop="sketchName">
              <el-input
                v-model.trim="addForm.sketchName"
                placeholder="请输入草图名称"
                maxlength="32"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item label="草图类型:" align="left" prop="sketchType">
              <el-radio-group v-model="addForm.sketchType">
                <el-radio v-for="item in optionsSketch" :key="item.value" :label="item.label" :value="item.value" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="草图状态:" align="left" prop="sketchStatus">
              <el-radio-group v-model="addForm.sketchStatus">
                <el-radio value="y">启用</el-radio>
                <el-radio value="n">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="语言列表:" align="left" prop="langCodes">
              <el-select v-model="addForm.langCodes" multiple placeholder="请选择语言">
                <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="地区列表:" align="left" prop="areaCodes">
              <el-select v-model="addForm.areaCodes" multiple placeholder="请选择地区">
                <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="distinguish" label="创建时间:" align="left" prop="createTime">
              <span>
                {{ unitFormatDate(addForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </span>
            </el-form-item>
            <el-form-item label="备注:" align="left" prop="memo">
              <el-input
                type="textarea"
                show-word-limit
                placeholder="请输入备注"
                maxlength="255"
                :rows="2"
                v-model="addForm.memo"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-scrollbar>
    <div class="button-row" v-if="isDisplayHandleButton">
      <el-button @click.stop="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitInfo(formRef)">
        {{ isEdit ? '更新' : '提交' }}
      </el-button>
    </div>
  </el-tab-pane>
</template>
<script setup lang="ts">
import i18n from '@/locales'
const { t } = i18n.global as any
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
import {
  reqSketchEdit,
  reqSketchCreate,
  reqExistSketchName,
  reqExistSketchCode,
  reqSketchInfoBySketchCode
} from '@/api/site/index'
import { optionsLang, optionsArea, optionsSketch } from '@/const/options'
import { firstTabName } from '@/views/Site/sketchManagement/components/data'
const emit = defineEmits<{
  (e: 'closeButton'): void
  (e: 'cancel'): void
  (e: 'update:active-name', value: string): void
}>()
const props = defineProps({
  formInfo: {
    type: Object
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  isDisplayHandleButton: {
    type: Boolean,
    default: false
  },
  sketchCode: {
    type: String,
    default: ''
  },
  sketchName: {
    type: String,
    default: ''
  }
})

const initAddForm = () => ({
  sketchCode: '',
  sketchName: '',
  memo: '',
  langCodes: [],
  areaCodes: [],
  sketchStatus: 'y',
  sketchType: 'nav',
  createTime: 0
})

const addForm: any = ref(initAddForm())

onMounted(() => {
  if (props.isEdit) {
    reqSketchInfoBySketchCode({ sketchCode: props.sketchCode }).then((res) => {
      if (res.success) {
        addForm.value = { ...initAddForm(), ...res.data }
      } else {
        ElMessage({
          showClose: true,
          message: res.errMessage,
          type: 'error'
        })
      }
    })
  } else {
    addForm.value = { ...initAddForm() }
  }
})
const distinguish = computed(() => props.isEdit)
const formRef: any = ref()
const checkExitSketchCode = async (rule: any, value: any, callback: any) => {
  if (distinguish.value) {
    callback()
  } else {
    let sketchCode = addForm.value.sketchCode
    let res = await reqExistSketchCode({
      sketchCode
    })
    if (res.data) {
      callback(new Error('草图编码已经存在'))
    } else {
      callback()
    }
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = /^[A-Za-z0-9-_]+$/
  if (!pwdRegex.test(value)) {
    callback(new Error('请输入英文,数字,符号-,符号_组成值'))
  } else {
    callback()
  }
}
const checkSketchNameExit = async (rule: any, value: any, callback: any) => {
  let sketchCode = ''
  let sketchName = ''
  if (distinguish.value) {
    sketchCode = addForm.value.sketchCode
    sketchName = addForm.value.sketchName
  } else {
    sketchCode = ''
    sketchName = addForm.value.sketchName
  }
  let res = await reqExistSketchName({
    sketchCode,
    sketchName
  })
  if (res.data.length != 0) {
    callback(new Error('草图名称已经存在'))
  } else {
    callback()
  }
}
const rulesAddFrom = ref({
  sketchCode: [
    { required: true, message: '请输入草图编码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur', message: '请输入英文,数字,符号-,符号_组成值' },
    { validator: checkExitSketchCode, trigger: 'blur' }
  ],
  sketchName: [
    { required: true, message: '请输入草图名称', trigger: 'blur' },
    { validator: checkSketchNameExit, trigger: 'blur', message: '草图名称已经存在' }
  ]
})
const submitInfo = (formRefval) => {
  if (distinguish.value) {
    editFormInfo(formRefval)
  } else {
    addFormInfo(formRefval)
  }
}
const addFormInfo = async (formRefVal) => {
  isLoading.value = true
  formRefVal.validate((valid, fields) => {
    if (valid) {
      formRefVal.validate(async (valid, fields) => {
        if (valid) {
          try {
            let res = await reqSketchCreate({ ...addForm.value })
            if (res.success) {
              ElMessage({
                showClose: true,
                message: t('table.controls') + t('errorCode.0'),
                type: 'success'
              })
              closeHand(false)
            } else {
              showErrorMessage(res)
            }
          } catch (err) {
            console.error(err)
          } finally {
            isLoading.value = false
          }
        } else {
          console.log('error submit!', fields)
          isLoading.value = false
        }
      })
    } else {
      console.log('error submit!', fields)
      isLoading.value = false
    }
  })
}
const editFormInfo = async (formRefVal) => {
  isLoading.value = true
  await formRefVal.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqSketchEdit({ ...addForm.value })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand(true)
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false
      }
    } else {
      isLoading.value = false
    }
  })
}
watch(
  () => props.formInfo,
  (newVal) => {
    addForm.value = { ...initAddForm(), ...newVal }
  },
  { deep: true }
)

const closeDialog = () => {
  Object.assign(addForm.value, initAddForm())
  formRef.value.clearValidate()
  emit('cancel')
}

const closeHand = (isEdit: boolean) => {
  emit('closeButton', isEdit)
}
const isLoading = ref(false)
</script>
<style scoped>
.m-level-table-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.m-level-table-inside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cc-table {
  flex: 1;
}
</style>
