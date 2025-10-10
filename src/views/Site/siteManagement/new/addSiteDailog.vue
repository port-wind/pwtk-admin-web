<template>
  <el-dialog v-model="rulesDialogVisible" class="custom-tabs-dialog" destroy-on-close @closed="onClosed">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="currentWebSiteId ? '站点详情' : '站点'" name="site_detail">
        <el-form :model="queryForm" label-width="auto" ref="ruleFormRef" :rules="rules" v-loading="isLoading">
          <el-row :gutter="20" style="padding: 0 50px">
            <!-- 左列 -->
            <el-col :span="12">
              <el-form-item label="Logo:" prop="logo">
                <FileImageUpload v-model="queryForm.logo" type="info" :upload-from="EUploadFrom.SITE_LOGO" />
              </el-form-item>
              <el-form-item label="站点ID:" prop="websiteId" v-if="currentWebSiteId">
                <div class="websitId_text">
                  <el-text>{{ currentWebSiteId }}</el-text>
                  <copy :content="currentWebSiteId"></copy>
                </div>
              </el-form-item>
              <el-form-item label="内部名称:" prop="websiteInnerName">
                <el-input
                  style="width: 80%"
                  clearable
                  placeholder="内部名称"
                  v-model="queryForm.websiteInnerName"
                ></el-input>
              </el-form-item>
              <el-form-item label="用户ID:" prop="ownerUserId">
                <SelectUserIdAndNickname
                  v-model="queryForm.ownerUserId!"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                />
                <!-- <SelectUserId v-model="queryForm.ownerUserId" id="userId" placeholder="用户ID | ID" /> -->
              </el-form-item>
              <el-form-item label="绑定模板:" prop="websiteTemplateRef">
                <AutoChoseTemplate
                  :owner-user-id="queryForm.ownerUserId"
                  v-model="queryForm.websiteTemplateRef"
                  :disabled="!queryForm.ownerUserId"
                  placeholder="模版ID"
                  select
                />
              </el-form-item>
              <el-form-item label="语言列表:" prop="langCodes">
                <LanguageSelect
                  :owner-user-id="queryForm.ownerUserId"
                  :template-id="queryForm.websiteTemplateRef"
                  v-model="queryForm.langCodes"
                  :disabled="!queryForm.websiteTemplateRef"
                  placeholder="语言"
                />
              </el-form-item>
              <el-form-item label="地区列表:" prop="areaCodes">
                <AreaSelect
                  :owner-user-id="queryForm.ownerUserId"
                  :template-id="queryForm.websiteTemplateRef"
                  v-model="queryForm.areaCodes"
                  :disabled="!queryForm.websiteTemplateRef"
                  placeholder="地区"
                />
              </el-form-item>
              <el-form-item label="统计代码URL:" prop="statsCodeJsUrl">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.statsCodeJsUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="初始化代码:" prop="statsCodeInit">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.statsCodeInit"
                  :rows="4"
                  maxlength="512"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="下载APP链接:" prop="appDownloadUrl">
                <el-input
                  clearable
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.appDownloadUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="关于我们:" prop="aboutUsUrl">
                <TextEditorUploadHtml
                  ref="TextEditorRef"
                  v-model="queryForm.aboutUsUrl"
                  :upload-from="EUploadFrom.SITE_HTML_FILE"
                />
              </el-form-item>
            </el-col>
            <!-- 右列 -->
            <el-col :span="12">
              <el-form-item label="icon:" prop="icon">
                <FileImageUpload v-model="queryForm.icon" type="info" :upload-from="EUploadFrom.SITE_ICON" />
              </el-form-item>
              <el-form-item label="标题:" prop="websiteTitle">
                <el-input clearable placeholder="标题" v-model="queryForm.websiteTitle" />
              </el-form-item>
              <el-form-item label="站点描述:" prop="describe">
                <el-input clearable placeholder="站点描述" v-model="queryForm.describe" />
              </el-form-item>
              <el-form-item label="关键字:" prop="keyWords">
                <el-input clearable placeholder="关键字" v-model="queryForm.keyWords" />
              </el-form-item>
              <el-form-item label="状态:" prop="websiteStatus">
                <el-radio-group v-model="queryForm.websiteStatus">
                  <el-radio v-for="item in websiteStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- <el-form-item label="CDN地址:" prop="cdnUrl">
                <el-input
                  clearable
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.cdnUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder="CDN地址"
                />
              </el-form-item> -->
              <el-form-item label="在线客服代码:" prop="onlineServiceCode">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  show-word-limit
                  resize="vertical"
                  type="textarea"
                  placeholder="在线客服代码"
                  v-model="queryForm.onlineServiceCode"
                  :rows="4"
                  maxlength="225"
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  placeholder="备注"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  v-model="queryForm.memo"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="创建时间:" prop="createTime" v-if="currentWebSiteId">
                <el-text>{{ unitFormatDate(queryForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}</el-text>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="currentWebSiteId" lazy label="绑定模板" name="bind_template_detail">
        <BindTemplateDetail :websiteId="currentWebSiteId" />
      </el-tab-pane>
      <el-tab-pane v-if="currentWebSiteId" lazy label="引用草图" name="sketch_template_detail">
        <SketchTemplateDetail :websiteId="currentWebSiteId" />
      </el-tab-pane>
      <el-tab-pane v-if="currentWebSiteId" label="已绑定域名" name="fourth">
        <DomainTab
          :websiteId="currentWebSiteId"
          :domainType="1"
          :activeTab="activeTab"
          ref="domainBindTabRef"
          :ownerUserId="queryForm.ownerUserId"
        ></DomainTab>
      </el-tab-pane>
      <el-tab-pane v-if="currentWebSiteId" label="未绑定域名" name="fifth">
        <DomainTab
          :websiteId="currentWebSiteId"
          :domainType="2"
          :activeTab="activeTab"
          ref="domainUnBindTabRef"
          :ownerUserId="queryForm.ownerUserId"
        ></DomainTab>
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
import { reqClientWebsiteConfig, reqWebsiteCodeAdd, reqWebsiteCodeEdit } from '@/api/site'
import type {
  IReqClientWebsiteConfigQueryParams,
  IReqWebsiteCodeAddQueryParams,
  IReqWebsiteCodeEditQueryParams
} from '@/api/site/type'
import { websiteStatus } from '@/const/options'
import { ElMessage, type FormRules, type FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import BindTemplateDetail from '@/views/Site/siteManagement/new/bindTemplateDetail.vue'
import SketchTemplateDetail from './sketchTemplateDetail.vue'

import { unitFormatDate } from '@/utils/dateFormat/index'
const ruleFormRef = ref<FormInstance>()

const isLoading = ref(false)
const isSumitFormLoading = ref(false)
const activeTab = ref('site_detail')
const rulesDialogVisible = ref(false)
const currentWebSiteId = ref<string>()
const showSubmitBar = computed(() => {
  return activeTab.value === 'site_detail'
})
const emits = defineEmits(['onClose'])

const TextEditorRef = ref()

const uploadSumit = async (): Promise<string> => {
  try {
    const path = await TextEditorRef.value!.submit()
    return path
  } catch (error) {
    return ''
  }
}

const onClosed = () => {
  resetForm()
  emits('onClose')
  rulesDialogVisible.value = false
}

const rules = reactive<FormRules<IReqWebsiteCodeAddQueryParams>>({
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
  websiteInnerName: [{ required: true, message: '请输入内部名称', trigger: 'blur' }],
  websiteTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  statsCodeInit: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('不能包含中文字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  statsCodeJsUrl: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('不能包含中文字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const filterLangCodes = ref<string[]>([])
const filterAreaCodes = ref<string[]>([])

const initQueryForm = (): IReqWebsiteCodeAddQueryParams => ({
  websiteInnerName: '',
  websiteTitle: '',
  ownerUserId: '',
  aboutUsUrl: '',
  keyWords: '',
  onlineServiceCode: '',
  hasStatsCode: '',
  langCodes: [],
  areaCodes: [],
  memo: '',
  websiteTemplateRef: '',
  websiteStatus: 'y',
  cdnUrl: '',
  describe: '',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  isSourceCode: undefined,
  componentCount: '',
  icon: '',
  logo: '',
  contactType: '',
  appDownloadUrl: ''
})

const queryForm = reactive<IReqWebsiteCodeAddQueryParams>(initQueryForm())

const resetForm = () => {
  ruleFormRef.value?.resetFields()
  currentWebSiteId.value = ''
  filterLangCodes.value = []
  filterAreaCodes.value = []
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSumitFormLoading.value = true
        let res
        // addWebsiteConfig
        if (currentWebSiteId.value) {
          const queryEdit: IReqWebsiteCodeEditQueryParams = {
            websiteId: currentWebSiteId.value,
            ...queryForm
          }

          const aboutUsUrlPath = await uploadSumit()
          queryEdit.aboutUsUrl = aboutUsUrlPath

          res = await reqWebsiteCodeEdit(queryEdit)
        } else {
          const query: IReqWebsiteCodeAddQueryParams = {
            ...queryForm
          }

          const aboutUsUrlPath = await uploadSumit()
          query.aboutUsUrl = aboutUsUrlPath

          // add website
          res = await reqWebsiteCodeAdd(query)
        }
        if (res.success) {
          ElMessage({
            message: currentWebSiteId.value ? '更新成功' : '已添加',
            type: 'success'
          })
          // 关闭dailog
          rulesDialogVisible.value = false
          activeTab.value = 'site_detail'
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

const openDailog = (websiteId?: string) => {
  currentWebSiteId.value = websiteId
  rulesDialogVisible.value = true
  activeTab.value = 'site_detail'
  if (websiteId) {
    fetchData(websiteId)
  }
}
export interface IExpose {
  openDailog: (id: string) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})

const fetchData = async (websiteId) => {
  isLoading.value = true
  try {
    // getClientWebsiteConfig
    const query: IReqClientWebsiteConfigQueryParams = {
      websiteId
    }
    const res = await reqClientWebsiteConfig(query)
    if (res.success) {
      Object.assign(queryForm, res.data)
      queryForm.langCodes = res.data?.langCodes
      queryForm.areaCodes = res.data?.areaCodes
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

// queryForm.ownerUserId

watch(
  () => queryForm.ownerUserId,
  (newVal) => {
    if (!newVal) {
      // ruleFormRef.value?.resetFields(['websiteTemplateRef','areaCodes','langCodes'])
      queryForm.websiteTemplateRef = ''
      queryForm.areaCodes = []
      queryForm.langCodes = []
    }
  }
)

watch(
  () => queryForm.websiteTemplateRef,
  (newVal) => {
    if (!newVal) {
      queryForm.areaCodes = []
      queryForm.langCodes = []
    }
  }
)
</script>

<style lang="less">
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
