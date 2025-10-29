<template>
  <el-dialog
    v-model="dialogVisible"
    class="tabs-dialog"
    draggable
    overflow
    destroy-on-close
    :close-on-click-modal="false"
    @closed="onClosed"
  >
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane label="页面组件" name="content" class="article-content m_tabs_pane">
        <div class="list-wrapper">
          <el-row :gutter="20">
            <el-col :span="20" :offset="2">
              <el-form :model="queryForm" ref="formRef" :rules="rules" class="single-form">
                <el-form-item label="组件ID:" v-if="queryForm.componentId" prop="componentName">
                  <el-text>
                    {{ queryForm.componentId }}
                    <copy :content="queryForm.componentId" />
                  </el-text>
                </el-form-item>
                <el-form-item label="组件类型" prop="componentType">
                  <el-input
                    v-model="queryForm.componentType"
                    maxlength="64"
                    autocomplete="off"
                    placeholder="请输入组件类型"
                  />
                </el-form-item>
                <el-form-item label="组件名称:" prop="componentName">
                  <el-input
                    v-model="queryForm.componentName"
                    maxlength="64"
                    autocomplete="off"
                    placeholder="请输入组件名称"
                  />
                </el-form-item>
                <el-form-item label="草图代码:" prop="sketchCodeList">
                  <SelectSketchCode v-model="queryForm.sketchCodeList" style="min-width: 160px" />
                </el-form-item>
                <el-form-item label="可见:" prop="isView">
                  <el-radio-group v-model="queryForm.isView">
                    <el-radio value="y">是</el-radio>
                    <el-radio value="n">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="状态:" prop="status">
                  <el-radio-group v-model="queryForm.status">
                    <el-radio value="y">有效</el-radio>
                    <el-radio value="n">无效</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="页面编码" prop="pageCode">
                  <el-input v-model="queryForm.pageCode" placeholder="请输入页面编码，举例: /home" />
                </el-form-item>
                <el-form-item label="备注:" prop="memo">
                  <el-input
                    type="textarea"
                    show-word-limit
                    placeholder="请输入备注"
                    maxlength="128"
                    :rows="9"
                    v-model="queryForm.memo"
                    autocomplete="off"
                  />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
        <div class="button-row">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="() => handleSave(formRef)">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqAddSysComp, reqEditSysComp } from '@/api/site/sysComponent'
import type {
  IReqAddSysCompQueryParams,
  IReqEditSysCompQueryParams,
  IReqSysCompListData
} from '@/api/site/sysComponent/type'
import showErrorMessage from '@/utils/showErrorMessage'
import type { IExpose } from './data'
import type { FormInstance } from 'element-plus'
import i18n from '@/locales'
const { t } = i18n.global

interface IProps {}
const props = defineProps<IProps>()

const initQueryForm = (): IReqAddSysCompQueryParams => ({
  componentName: '',
  componentType: '',
  sketchCodeList: '',
  status: 'y',
  isView: 'y',
  memo: '',
  configParamJson: '',
  componentSort: undefined,
  pageCode: ''
})

const formRef = ref<FormInstance>()
const queryForm = reactive<IReqEditSysCompQueryParams>(initQueryForm())
const emit = defineEmits(['onClose'])
const currentComponenetId = ref('')
const open = (row?: IReqSysCompListData) => {
  dialogVisible.value = true
  if (row?.componentId) {
    currentComponenetId.value = row.componentId
    Object.assign(queryForm, row)
  }
}

defineExpose<IExpose>({
  open
})

const rules = ref({
  componentName: [
    { required: true, message: '请选择组件名称', trigger: 'blur' }
    // { validator: validatePass, trigger: 'blur', message: '请输入英文开头,英文,数字和_组成值' }
  ],
  componentType: [{ required: true, message: '请输入组件类型', trigger: 'blur' }]
  // sketchCodeList: [
  //   {
  //     type: 'array',
  //     required: true,
  //     message: '请选择一个组件类型',
  //     trigger: 'change'
  //   }
  // ]
})

const resetForm = () => {
  Object.assign(queryForm, initQueryForm())
  currentComponenetId.value = ''
}

// State
const activeTab = ref('content')
const dialogVisible = ref(false)
const isLoading = ref(false)

const handleCancel = () => {
  emit('onClose')
  dialogVisible.value = false
}

const isLoading2 = ref(false)

const handleSave = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        const query: IReqAddSysCompQueryParams = {
          ...queryForm
        }

        if (currentComponenetId.value) {
          const res1 = await reqEditSysComp(query)

          if (res1.success) {
            ElMessage({
              message: '添加成功',
              type: 'success'
            })
          } else {
            showErrorMessage(res1)
          }
        } else {
          const res2 = await reqAddSysComp(query)

          if (res2.success) {
            ElMessage({
              message: '添加成功',
              type: 'success'
            })
          } else {
            showErrorMessage(res2)
          }
        }

        dialogVisible.value = false
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}

const onClosed = () => {
  resetForm()
  emit('onClose')
  dialogVisible.value = false
}
</script>

<style scoped lang="less">
.list-wrapper {
  flex: 1;
}

.item {
  text-align: right;
  height: 30px;
  line-height: 30px;
}
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.button-row {
  display: flex;
  justify-content: end;
}

.list-item-wrapper {
  overflow: auto;
  height: calc(100vh - 250px);
}
</style>
