<template>
  <el-dialog v-model="rulesDialogVisible" class="custom-tabs-dialog" destroy-on-close @closed="onClosed">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="currentTemplateId ? '模版详情' : '模版'" name="template_detail">
        <el-form :model="queryForm" label-width="auto" ref="ruleFormRef" :rules="rules" v-loading="isLoading">
          <el-row :gutter="20">
            <!-- 左列 -->
            <el-col :span="10" :offset="2">
              <el-form-item label="Logo:" prop="logo">
                <FileImageUpload v-model="queryForm.logo" type="info" :upload-from="EUploadFrom.TEMPLATE_LOGO" />
              </el-form-item>
              <el-form-item label="模板ID:" prop="templateId">
                <div v-if="currentTemplateId" class="template_id_text">
                  <el-text>{{ currentTemplateId }}</el-text>
                  <copy :content="currentTemplateId"></copy>
                </div>
                <div v-else>
                  <el-input
                    v-model.trim="queryForm.templateId"
                    placeholder="8位长度代码"
                    maxlength="8"
                    autocomplete="off"
                  />
                </div>
              </el-form-item>
              <el-form-item label="模板名称:" prop="templateName">
                <el-input
                  v-model.trim="queryForm.templateName"
                  placeholder="模板名称"
                  maxlength="20"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="引用的草图代码:" prop="sketchCode">
                <SelectSketchCode v-model="queryForm.sketchCode" placeholder="请选择模板草图代码" />
              </el-form-item>
              <el-form-item label="引用的系统模板:" prop="sysTemplateRef">
                <SelectSystemTemplate v-model="queryForm.sysTemplateRef" />
              </el-form-item>
              <el-form-item label="用户ID:" prop="ownerUserId">
                <!-- <SelectUserIdAndNickename v-model="queryForm.ownerUserId" id="userId" placeholder="所属用户 | ID" /> -->
                <SelectUserIdAndNickname
                  v-model="queryForm.ownerUserId!"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                />
              </el-form-item>
            </el-col>
            <!-- 右列 -->
            <el-col :span="10">
              <el-form-item label="icon:" prop="icon">
                <FileImageUpload v-model="queryForm.icon" type="info" :upload-from="EUploadFrom.TEMPLATE_ICON" />
              </el-form-item>
              <el-form-item label="主题:" prop="theme">
                <el-input v-model.trim="queryForm.theme" maxlength="8" placeholder="主题" autocomplete="off" />
              </el-form-item>
              <el-form-item label="支持的登录方式:" prop="loginStyle">
                <el-select v-model="queryForm.loginStyle" multiple placeholder="请选择支持的登录方式">
                  <el-option
                    v-for="item in optionsSupportLogin"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="第三方登录方式:" prop="thirdLoginStyle">
                <el-select v-model="queryForm.thirdLoginStyle" multiple placeholder="请选择第三方登录方式">
                  <el-option
                    v-for="item in optionsSupportLogin"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" prop="templateStatus">
                <el-radio-group v-model="queryForm.templateStatus" placeholder="请选择模板状态">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="m">维护</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="createTime" label="创建时间:" prop="createTime">
                {{ unitFormatDate(createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20" :offset="2">
              <el-form-item label="统计代码链接:" prop="statsCodeJsUrl">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="代码链接"
                  :rows="1"
                  v-model="queryForm.statsCodeJsUrl"
                  maxlength="512"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="初始化代码:" prop="statsCodeInit">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="初始化代码"
                  :rows="2"
                  v-model="queryForm.statsCodeInit"
                  maxlength="512"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="20" :offset="2">
              <el-form-item label="CDN地址:" prop="cdnUrl">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="CDN地址"
                  :rows="2"
                  v-model="queryForm.cdnUrl"
                  maxlength="255"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col> -->
            <el-col :span="20" :offset="2">
              <el-form-item label="客服代码:" prop="onlineServiceCode">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="客服代码"
                  :rows="2"
                  v-model="queryForm.onlineServiceCode"
                  maxlength="512"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="下载APP链接:" prop="appDownloadUrl">
                <el-input
                  clearable
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.appDownloadUrl"
                  :rows="4"
                  maxlength="205"
                  show-word-limit
                  resize="vertical"
                  placeholder="下载APP链接"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="2">
              <el-form-item label="备注:" prop="memo">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="备注"
                  maxlength="255"
                  :rows="2"
                  v-model="queryForm.memo"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="currentTemplateId" label="模板路径" name="templatePath">
        <TemplatePath :template-id="currentTemplateId" :template-name="currentTemplateName" />
      </el-tab-pane>
      <el-tab-pane v-if="currentTemplateId" label="引用草图" name="refer_sketch">
        <SketchRef :sketch-code="currentSketchCode" />
      </el-tab-pane>
    </el-tabs>
    <div class="submit-wrapper" v-if="showSubmitBar">
      <div class="btn">
        <el-button @click="rulesDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="isSumitFormLoading" @click="submitForm(ruleFormRef)">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import i18n from '@/locales'
const { t } = i18n.global as any
import {
  IReqIsTemplateIdExitQueryParams,
  reqIsTemplateIdExit,
  reqIsTemplateNameExit,
  reqTemplateCreate,
  reqTemplateEdit,
  reqTemplateInfoByTemplateId
} from '@/api/site'

import { IReqTemplateInfoByTemplateIdQueryParams, IReqTemplateCreateQueryParams } from '@/api/site/type'
import { optionsSupportLogin } from '@/const/options'
import { ElMessage, FormRules, type FormInstance } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { InternalRuleItem } from '@/components/mForm/rule'
import TemplatePath from '@/views/Site/templateManagement/components/templatePath.vue'
import SketchRef from '@/views/Site/templateManagement/components/sketchRef.vue'
const ruleFormRef = ref<FormInstance>()

const isLoading = ref(false)
const isSumitFormLoading = ref(false)
const activeTab = ref('template_detail')
const rulesDialogVisible = ref(false)
const createTime = ref<string>()
const currentTemplateId = ref<string | undefined>('')
const currentTemplateName = ref<string | undefined>('')
const currentSketchCode = ref<string | undefined>('')
const showSubmitBar = computed(() => {
  return activeTab.value === 'template_detail'
})
const emits = defineEmits(['onClose'])

const onClosed = () => {
  resetForm()
  emits('onClose')
  rulesDialogVisible.value = false
}

const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = /^[A-Za-z0-9-_]+$/
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}

const checkIsTemplateId = (rule: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
  // 修改
  if (currentTemplateId.value || currentTemplateId.value === value) {
    callback()
  }

  // 新增
  if (!currentTemplateId.value && value) {
    const query: IReqIsTemplateIdExitQueryParams = {
      templateId: value
    }
    reqIsTemplateIdExit(query).then((res) => {
      if (res.success) {
        if (res.data) {
          callback(new Error('模版ID已经存在'))
        } else {
          callback()
        }
      } else {
        callback(new Error('参数不合法, 只允许使用字母数字字符、破折号和下划线'))
      }
    })
  }
}

const checkIsTemplateName = (rule: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
  // 修改
  if (currentTemplateName.value || currentTemplateName.value === value) {
    callback()
  }
  // 新增
  if (!currentTemplateName.value && value) {
    reqIsTemplateNameExit({
      templateId: queryForm.templateId,
      templateName: value
    }).then((res) => {
      if (res.success) {
        if (res.data && res.data.length > 0) {
          callback(new Error('模版名称已经存在'))
        } else {
          callback()
        }
      } else {
        callback(new Error('参数不合法, 只允许使用字母数字字符、破折号和下划线'))
      }
    })
  }
}

const rules = reactive<FormRules<IReqTemplateCreateQueryParams>>({
  appDownloadUrl: [
    {
      required: false,
      message: '下载链接不能为空',
      trigger: 'blur'
    },
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
  templateId: [
    { required: !currentTemplateId.value, message: '草图编码', trigger: 'blur' },
    { validator: checkIsTemplateId, trigger: 'blur' }
  ],
  templateName: [
    { required: !currentTemplateName.value, trigger: 'blur', message: '模版名称不能为空' },
    { validator: checkIsTemplateName, trigger: 'blur' }
  ],
  ownerUserId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  sketchCode: [{ required: true, message: '请选择草图代码', trigger: 'blur' }],
  statsCodeInit: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符', trigger: 'blur' }],
  statsCodeJsUrl: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符', trigger: 'blur' }]
})

const initQueryForm = (): IReqTemplateCreateQueryParams => ({
  templateId: '',
  templateName: '',
  sketchCode: '',
  ownerUserId: '',
  sysTemplateRef: '',
  isSysTemplate: '',
  onlineServiceCode: '',
  theme: '',
  loginStyle: [],
  thirdLoginStyle: [],
  memo: '',
  templateStatus: 'y',
  cdnUrl: '',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  icon: '',
  logo: '',
  appDownloadUrl: ''
})

const queryForm = reactive<IReqTemplateCreateQueryParams>(initQueryForm())

const resetForm = () => {
  ruleFormRef.value?.resetFields()
  currentTemplateId.value = ''
  currentTemplateName.value = ''
  currentSketchCode.value = ''
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSumitFormLoading.value = true
        let res
        // update template
        if (currentTemplateId.value) {
          const queryEdit: IReqTemplateCreateQueryParams = {
            ...queryForm,
            templateId: currentTemplateId.value
          }
          res = await reqTemplateEdit(queryEdit)
        } else {
          const query: IReqTemplateCreateQueryParams = {
            ...queryForm
          }
          // add template
          res = await reqTemplateCreate(query)
        }
        if (res.success) {
          ElMessage({
            message: currentTemplateId.value ? '更新成功' : '已添加',
            type: 'success'
          })
          // 关闭dailog
          rulesDialogVisible.value = false
          activeTab.value = 'template_detail'
          resetForm()
        } else {
          ElMessage({
            message: '更新失败,请稍后再试试',
            type: 'error'
          })
        }
      } catch (error) {
        ElMessage({
          message: '提交出错',
          type: 'error'
        })
      } finally {
        isSumitFormLoading.value = false
      }
    } else {
      console.info('error submit!', fields)
    }
  })
}

const openDailog = (templateId?: string) => {
  rulesDialogVisible.value = true
  activeTab.value = 'template_detail'
  if (templateId) {
    currentTemplateId.value = templateId
    fetchData(templateId)
  } else {
    currentTemplateId.value = ''
  }
}
export interface IExpose {
  openDailog: (id: string) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})

const fetchData = async (templateId) => {
  isLoading.value = true
  try {
    // getClientWebsiteConfig
    const query: IReqTemplateInfoByTemplateIdQueryParams = {
      templateId
    }
    const res = await reqTemplateInfoByTemplateId(query)
    if (res.success) {
      Object.assign(queryForm, res.data)
      createTime.value = res.data?.createTime
      currentTemplateName.value = res.data?.templateName
      currentSketchCode.value = res.data?.sketchCode
    } else {
      ElMessage({
        type: 'warning',
        message: '数据读取失败'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="less">
.template_id_text {
  display: flex;
  justify-content: center;
}

.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 10px;
}

//  custom-tabs-dialog
.custom-tabs-dialog {
  margin-top: 80px;
  padding: 10px;
  height: calc(100vh - 8.5rem);
  width: 78%;
  position: relative;
  border-radius: 0.6rem;
}

.custom-tabs-dialog .el-dialog__header {
  padding: 0;
  position: absolute;
  right: -15px;
  top: -15px;
  z-index: 1;
  border-radius: 100%;
  background: #e4e7ed;
  height: 40px;
  width: 40px;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn {
  height: 40px;
  width: 40px;
  line-height: 1;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: red;
}

.custom-tabs-dialog .el-dialog__body {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-tabs-dialog .el-dialog__body .el-tabs {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
}

.custom-tabs-dialog .el-dialog__body .el-tabs .el-tabs__content {
  flex: 1;
  overflow-y: auto;
}
</style>
