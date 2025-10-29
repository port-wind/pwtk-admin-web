<template>
  <el-dialog v-model="rulesDialogVisible" class="custom-tabs-dialog" destroy-on-close @closed="onCancel">
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="currentDomain ? '域名信息' : '域名'" name="domain_tabs_panel">
        <el-form :model="queryForm" label-width="auto" ref="ruleFormRef" :rules="rules" v-loading="isLoading">
          <el-row :gutter="20" style="padding: 0 50px">
            <!-- 左列 -->
            <el-col :span="12" class="long-col">
              <el-form-item label="logo:" prop="logo">
                <FileImageUpload v-model="queryForm.logo" type="info" :upload-from="EUploadFrom.DOMAIN_LOGO" />
              </el-form-item>
              <el-form-item label="域名:" prop="domain" :required="true">
                <div v-if="currentDomain" class="template_id_text">
                  <el-text>{{ currentDomain }}</el-text>
                  <copy :content="currentDomain"></copy>
                </div>
                <div v-else>
                  <el-input v-model.trim="queryForm.domain" autocomplete="off" />
                </div>
              </el-form-item>
              <el-form-item label="用户ID:" prop="ownerUserId">
                <div v-if="currentDomain && currentOwnerUserId" style="width: 100%">
                  <el-text>{{ resObject.userName }} - {{ queryForm.ownerUserId }}</el-text>
                  <copy :content="queryForm.ownerUserId"></copy>
                </div>
                <div v-else style="width: 100%">
                  <!-- <SelectUserId v-model="queryForm.ownerUserId" id="userId" placeholder="用户ID | ID" /> -->
                  <SelectUserIdAndNickname
                    v-model="queryForm.ownerUserId!"
                    id="userId"
                    :group="['nickname', 'loginId']"
                    placeholder="用户昵称｜帐号"
                    style="width: 165px"
                  />
                </div>
              </el-form-item>
              <el-form-item label="绑定站点ID:" prop="websiteRef">
                <SelectBindSiteId
                  :disabled="!queryForm.ownerUserId"
                  :owner-user-id="queryForm.ownerUserId"
                  v-model="queryForm.websiteRef"
                />
              </el-form-item>
              <el-form-item label="域名类型:" prop="domainType" required>
                <el-select style="width: 80%" v-model="queryForm.domainType" placeholder="域名类型">
                  <el-option v-for="item in domainType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="域名来源:" prop="domainFrom">
                <el-select style="width: 80%" v-model="queryForm.domainFrom" placeholder="域名来源">
                  <el-option v-for="item in domainFrom" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="落地页:" prop="landingPage">
                <el-select style="width: 80%" v-model="queryForm.landingPage" placeholder="落地页">
                  <el-option v-for="item in landingPage" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="默认推广码:" prop="promotionCode">
                <el-input v-model="queryForm.promotionCode" autocomplete="off" />
              </el-form-item>
              <el-form-item label="关键字:" prop="keyWords">
                <el-input v-model="queryForm.keyWords" autocomplete="off" placeholder="请输入关键字" />
              </el-form-item>
              <el-form-item label="网站描述:" prop="descriptions">
                <el-input
                  :maxlength="textAreaLimit"
                  show-word-limit
                  type="textarea"
                  v-model="queryForm.descriptions"
                  :rows="4"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入网站描述"
                />
              </el-form-item>
              <el-form-item label="创建时间:" prop="createTime" v-if="currentDomain">
                <span>{{ unitFormatDate(queryForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </el-form-item>
              <el-form-item label="关于我们:" prop="aboutUsUrl">
                <TextEditorUploadHtml
                  v-model="queryForm.aboutUsUrl"
                  :upload-from="EUploadFrom.DOMAIN_HTML_FILE"
                  ref="TextEditorRef"
                />
              </el-form-item>
            </el-col>
            <!-- 右列 -->
            <el-col :span="12" class="long-col">
              <el-form-item label="icon:" prop="icon">
                <FileImageUpload v-model="queryForm.icon" type="info" :upload-from="EUploadFrom.DOMAIN_ICON" />
              </el-form-item>
              <el-form-item label="状态:" prop="domainStatus">
                <el-radio-group v-model="queryForm.domainStatus">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="提示APP下载:" prop="isAppDownloadHint">
                <el-radio-group v-model="queryForm.isAppDownloadHint" @change="onRadioChange">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
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
                  :disabled="queryForm.isAppDownloadHint === 'n'"
                  placeholder="请输入下载链接"
                />
              </el-form-item>
              <el-form-item label="配置SSL证书:" prop="isSupportSsl">
                <div style="width: 80%" class="duan">
                  <el-radio-group @change="handleChangeIsSupportSsl" v-model="queryForm.isSupportSsl">
                    <el-radio value="y">是</el-radio>
                    <el-radio value="n">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item label="SSL证书到期日期:" prop="sslExpiry">
                <el-date-picker
                  style="width: 80%"
                  :disabled="queryForm.isSupportSsl === 'n'"
                  v-model="queryForm.sslExpiry!"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="强制HTTPS访问:" prop="isForceHttps">
                <el-radio-group style="width: 80%" :disabled="disableSsl" v-model="queryForm.isForceHttps">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="语言列表:" prop="langCodes">
                <LanguageSelectByWebsiteId
                  :website-id="queryForm.websiteRef"
                  v-model="queryForm.langCodes"
                  :disabled="!queryForm.websiteRef"
                  placeholder="语言"
                />
              </el-form-item>
              <el-form-item label="地区列表:" prop="areaCodes">
                <AreaSelectByWebsiteId
                  :website-id="queryForm.websiteRef"
                  v-model="queryForm.areaCodes"
                  :disabled="!queryForm.websiteRef"
                  placeholder="地区"
                />
              </el-form-item>

              <el-form-item label="官方域名列表:" prop="officialDomainList">
                <el-input
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.officialDomainList"
                  :rows="6"
                  maxlength="3000"
                  show-word-limit
                  resize="vertical"
                  placeholder="请使用英文逗号分隔，ex. www.baidu.com, www.google.com,…."
                />
              </el-form-item>
              <el-form-item label="备用域名列表:" prop="backDomainList">
                <el-input
                  :autosize="{ minRows: 4, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.backDomainList"
                  :rows="6"
                  maxlength="3000"
                  show-word-limit
                  resize="vertical"
                  placeholder="请使用英文逗号分隔，ex. www.baidu.com, www.google.com,…."
                />
              </el-form-item>
              <el-form-item label="OPS管理代码:" prop="opsManageCode">
                <el-input
                  v-model="queryForm.opsManageCode"
                  maxlength="8"
                  placeholder="请输入OPS管理代码"
                  show-word-limit
                  type="text"
                />
              </el-form-item>
              <el-form-item label="在线客服代码:" prop="onlineServiceCode">
                <el-input
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="queryForm.onlineServiceCode"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder="请输入客服代码"
                />
              </el-form-item>
              <el-form-item label="统计代码:" :prop="'statsCodeJsUrl' + (staticCodeModel == 1 ? '' : staticCodeModel)">
                <div class="code-wrapper">
                  <div>
                    <el-select v-model="staticCodeModel" placeholder="请选择" style="width: 100%">
                      <el-option label="统计代码1" :value="1" />
                      <el-option label="统计代码2" :value="2" />
                      <el-option label="统计代码3" :value="3" />
                      <el-option label="统计代码4" :value="4" />
                    </el-select>
                  </div>
                  <div>
                    <el-input
                      v-if="staticCodeModel == 1"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeJsUrl"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="请输入初始化代码"
                    />
                    <el-input
                      v-if="staticCodeModel == 2"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeJsUrl2"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="请输入初始化代码"
                    />
                    <el-input
                      v-if="staticCodeModel == 3"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeJsUrl3"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="请输入初始化代码"
                    />
                    <el-input
                      v-if="staticCodeModel == 4"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeJsUrl4"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="请输入初始化代码"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="初始化代码:" :prop="'statsCodeInit' + (initCodeModel == 1 ? '' : initCodeModel)">
                <div class="code-wrapper">
                  <div>
                    <el-select v-model="initCodeModel" placeholder="Select" style="width: 100%">
                      <el-option label="初始化代码1" :value="1" />
                      <el-option label="初始化代码2" :value="2" />
                      <el-option label="初始化代码3" :value="3" />
                      <el-option label="初始化代码4" :value="4" />
                    </el-select>
                  </div>
                  <div>
                    <el-input
                      v-if="initCodeModel == 1"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeInit"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="初始化代码1"
                    />
                    <el-input
                      v-if="initCodeModel == 2"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeInit2"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="初始化代码2"
                    />
                    <el-input
                      v-if="initCodeModel == 3"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeInit3"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="初始化代码3"
                    />
                    <el-input
                      v-if="initCodeModel == 4"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                      type="textarea"
                      v-model="queryForm.statsCodeInit4"
                      :rows="4"
                      maxlength="3000"
                      show-word-limit
                      resize="vertical"
                      placeholder="初始化代码4"
                    />
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  :maxlength="textAreaLimit"
                  show-word-limit
                  type="textarea"
                  v-model="queryForm.memo"
                  :rows="4"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="!currentWebsiteRef && currentDomain" lazy label="站点列表" name="site_list">
        <NewWebsiteTable
          v-if="currentOwnerUserId && currentDomain"
          :domain="currentDomain"
          :dialogHeight="dialogHeight"
          :originOwnerUserId="currentOwnerUserId"
          @onCallback="onCallbackFromWebsiteTable"
        ></NewWebsiteTable>
        <div v-else>还没有指定用户, 或着当前用户没有可用模版</div>
      </el-tab-pane>
      <el-tab-pane v-if="currentWebsiteRef && currentDomain" lazy label="绑定站点" name="bind_site">
        <NewWebsiteBand :domain="currentDomain" @onCallback="onCallbackWebsiteBand"></NewWebsiteBand>
      </el-tab-pane>
      <el-tab-pane v-if="currentWebsiteRef && currentDomain" lazy label="绑定模版" name="bind_template">
        <NewTemplateBand :domain="currentDomain"></NewTemplateBand>
      </el-tab-pane>
      <el-tab-pane v-if="currentWebsiteRef && currentDomain" lazy label="引用草图" name="refer_sketch">
        <NewSketchBand :domain="currentDomain"></NewSketchBand>
      </el-tab-pane>
    </el-tabs>
    <div class="submit-wrapper" v-if="showSubmitBar">
      <div class="btn">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="isSumitFormLoading" @click="submitForm(ruleFormRef)">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage, type FormRules, type FormInstance } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import axios from 'axios'
import { domainType, domainFrom, textAreaLimit, landingPage } from '@/const/options'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import { addDomain, editDomain, getDomainDetail } from '@/api/site/domain'
import type { IAddDomainQueryParams, IGetDomainDetailQueryParams } from '@/api/site/domain/types'
import NewWebsiteTable from './NewWebsiteTable.vue'
import { uploadSingle } from '@/api/system/upload/index'
import { getExistDomain } from '@/api/site/nav'
import { unitFormatDate } from '@/utils/dateFormat'
import { domainRegex } from '@/const/commonSet'
import { createDomainValidator } from '@/utils/validators'

const { VITE_PROXY_UPLOAD, VITE_CDN_URL } = webConfigApi
const dialogHeight = computed(() => {
  return window.innerHeight * 0.8
})
const ruleFormRef = ref<FormInstance>()
const isLoading = ref(false)
const isSumitFormLoading = ref(false)
const activeTab = ref('domain_tabs_panel')
const rulesDialogVisible = ref(false)
const currentDomain = ref<string>('')
const showSubmitBar = computed(() => {
  return activeTab.value === 'domain_tabs_panel'
})
const currentWebsiteRef = ref<string | undefined>('')
const currentOwnerUserId = ref<string>('')
/**
 * 统计代码
 */
const staticCodeModel = ref(1)
/**
 * 初始化代码
 */
const initCodeModel = ref(1)
const updateFirstTabAndMoveToFirstTab = (value) => {
  console.log('🚀 ~ updateFirstTabAndMoveToFirstTab ~ value:', value)
}
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

// 绑定后的操作
const onCallbackFromWebsiteTable = () => {
  fetchData(currentDomain.value)
  activeTab.value = 'domain_tabs_panel'
}

// 解除绑定的操作
const onCallbackWebsiteBand = () => {
  currentWebsiteRef.value = ''
  queryForm.websiteRef = ''
  fetchData(currentDomain.value)
  activeTab.value = 'domain_tabs_panel'
}
const onClosed = () => {
  resetForm()
  emits('onClose', !!currentDomain.value)
  rulesDialogVisible.value = false
  Object.assign(resObject, {})
}
const onCancel = () => {
  resetForm()
  emits('onClose', true)
  rulesDialogVisible.value = false
  Object.assign(resObject, {})
}
const disableSsl = ref<boolean>(true)
const handleChangeIsSupportSsl = (val: string | number | boolean | undefined) => {
  if (val === 'y') {
    disableSsl.value = false
  } else {
    disableSsl.value = true
    queryForm.isForceHttps = 'n'
    queryForm.sslExpiry = ''
  }
}

const onRadioChange = () => {
  queryForm.appDownloadUrl = ''
  ruleFormRef.value?.resetFields('appDownloadUrl')
}

const rules = reactive<FormRules<IAddDomainQueryParams>>({
  appDownloadUrl: [
    {
      validator: createDomainValidator('域名格式不正确'),
      trigger: 'blur'
    }
  ],
  domain: [
    // { required: !currentDomain.value, message: '域名不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!currentDomain.value && !value) {
          callback(new Error('域名不能为空'))
        }

        // const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/
        // if (!domainPattern.test(value)) {
        //   callback(new Error('域名格式不正确'))
        // }

        if (currentDomain.value) {
          callback()
        } else {
          getExistDomain({ domain: value }).then((res) => {
            if (res?.data) {
              callback(new Error('域名已经使用过了'))
            } else {
              callback()
            }
          })
        }
      },
      trigger: 'blur'
    },
    {
      validator: createDomainValidator('域名格式不正确'),
      trigger: 'blur'
    }
  ],
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
  statsCodeInit2: [
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
  statsCodeInit3: [
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
  statsCodeInit4: [
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
  ],
  statsCodeJsUrl2: [
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
  statsCodeJsUrl3: [
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
  statsCodeJsUrl4: [
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
  // 去掉验证， 用户输入域名比较随意
  // officialDomainList: [
  //   {
  //     validator: (rule: any, value: string, callback: Function) => {
  //       // Check if value is empty first
  //       if (!value) {
  //         callback()
  //         return
  //       }
  //       // Split the value by commas and trim whitespace
  //       const domains = value.split(',').map((domain) => domain.trim())
  //       // Check each domain
  //       for (const domain of domains) {
  //         if (!domain) {
  //           callback(new Error('域之间的域不能为空'))
  //           return
  //         }
  //         if (!domainRegex.test(domain)) {
  //           callback(new Error(`"${domain}"不合法，请输入合法域名`))
  //           return
  //         }
  //       }

  //       callback()
  //     },
  //     trigger: 'blur'
  //   }
  // ],
  // backDomainList: [
  //   {
  //     validator: (rule: any, value: string, callback: Function) => {
  //       // Check if value is empty first
  //       if (!value) {
  //         callback()
  //         return
  //       }

  //       // Split the value by commas and trim whitespace
  //       const domains = value.split(',').map((domain) => domain.trim())

  //       // Regular expression for valid domain name
  //       // const domainRegex = /^(?:www\.)?[\w-]+\.[\w-]+\.[\w-]+$/

  //       // Check each domain
  //       for (const domain of domains) {
  //         if (!domain) {
  //           callback(new Error('域之间的域不能为空'))
  //           return
  //         }
  //         if (!domainRegex.test(domain)) {
  //           callback(new Error(`"${domain}"不合法，请输入合法域名`))
  //           return
  //         }
  //       }

  //       callback()
  //     },
  //     trigger: 'blur'
  //   }
  // ]
})

const initQueryForm = (): IAddDomainQueryParams => ({
  domain: '',
  appDownloadUrl: '',
  statsCodeJsUrl: '',
  statsCodeJsUrl2: '',
  statsCodeJsUrl3: '',
  statsCodeJsUrl4: '',
  statsCodeInit: '',
  statsCodeInit2: '',
  statsCodeInit3: '',
  statsCodeInit4: '',
  aboutUsUrl: '',
  ownerUserId: '',
  websiteRef: '', // 有这个值代表此域名已经绑定了, 没有就还没绑定网站
  onlineServiceCode: '',
  keyWords: '',
  cdnUrl: '',
  domainStatus: 'y',
  domainType: 'f',
  domainFrom: '',
  hasStatsCode: undefined,
  backDomainList: '',
  officialDomainList: '',
  langCodes: [],
  areaCodes: [],
  landingPage: 'p',
  isSupportSsl: 'n',
  isAppDownloadHint: 'n',
  isForceHttps: 'n',
  sslExpiry: '',
  opsManageCode: '',
  memo: '',
  descriptions: '',
  promotionCode: '',
  icon: '',
  logo: '',
  createTime: ''
})

const queryForm = reactive<IAddDomainQueryParams>(initQueryForm())

const resetForm = () => {
  ruleFormRef.value?.resetFields()
  activeTab.value = 'domain_tabs_panel'
  currentWebsiteRef.value = ''
  currentOwnerUserId.value = ''
  staticCodeModel.value = 1
  initCodeModel.value = 1
  Object.assign(queryForm, initQueryForm())
  Object.assign(resObject, {})
}

const submitForm = async (formEl: FormInstance | undefined) => {
  await formEl?.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSumitFormLoading.value = true
        let res

        // addWebsiteConfig
        if (currentDomain.value) {
          const queryEdit: IAddDomainQueryParams = {
            ...queryForm,
            domain: currentDomain.value!,
            sslExpiry: queryForm?.sslExpiry
          }
          if (!queryForm.websiteRef) {
            //@ts-ignore
            queryEdit.websiteInnerName = ''
            //@ts-ignore
            queryEdit.websiteTitle = ''
            queryEdit.websiteRef = ''
          }
          const aboutUsUrlPath = await uploadSumit()
          queryEdit.aboutUsUrl = aboutUsUrlPath
          // editDomainConfig
          res = await editDomain(queryEdit)
        } else {
          const query: IAddDomainQueryParams = {
            ...queryForm
          }
          const aboutUsUrlPath = await uploadSumit()
          query.aboutUsUrl = aboutUsUrlPath
          // add website
          res = await addDomain(query)
        }
        if (res.success) {
          ElMessage({
            message: currentDomain.value ? '更新成功' : '已添加',
            type: 'success'
          })
          // 关闭dailog
          resetForm()
          onClosed()
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

const openDialog = (domain?: string) => {
  currentDomain.value = domain!
  rulesDialogVisible.value = true
  activeTab.value = 'domain_tabs_panel'
  staticCodeModel.value = 1
  initCodeModel.value = 1
  if (domain) {
    fetchData(domain)
  }
}
export interface IExpose {
  openDialog: (domain: string) => void
}
// 分发方法
defineExpose<IExpose>({
  openDialog
})

interface IResObject {
  userName: string | undefined
  createTime: string | undefined
  websiteInnerName: string | undefined
  websiteTitle: string | undefined
}

const resObject = reactive<IResObject>({
  userName: '',
  createTime: '',
  websiteInnerName: '',
  websiteTitle: ''
})
const fetchData = async (domain: string) => {
  isLoading.value = true
  try {
    const query: IGetDomainDetailQueryParams = {
      domain
    }
    const res = await getDomainDetail(query)
    if (res.success) {
      Object.assign(queryForm, res.data)
      queryForm.langCodes = res.data?.langCodes
      queryForm.areaCodes = res.data?.areaCodes
      /**
       * web 域名是否绑定网站, currentWebsiteRef
       */

      currentOwnerUserId.value = res.data?.ownerUserId!
      currentWebsiteRef.value = res.data?.websiteRef
      resObject.userName = res.data?.userName
      resObject.createTime = res.data?.createTime
      resObject.websiteInnerName = res.data?.websiteInnerName
      resObject.websiteTitle = res.data?.websiteTitle
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

.code-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
