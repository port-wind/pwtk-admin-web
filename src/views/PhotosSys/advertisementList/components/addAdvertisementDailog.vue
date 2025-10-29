<template>
  <el-dialog v-model="rulesDialogVisible" class="custom-tabs-dialog" destroy-on-close @closed="onClosed">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="广告大全" name="template_detail">
        <el-form :model="queryForm" label-width="auto" ref="ruleFormRef" :rules="rules" v-loading="isLoading">
          <el-row :gutter="20">
            <el-col :span="22" :offset="2">
              <el-form-item label="站点图标:" prop="siteLogo">
                <FileMultipleImageUpload
                  :max-upload-count="5"
                  v-model="queryForm.siteLogo"
                  type="info"
                  :upload-from="EUploadFrom.ADVERTISE"
                  accept="image/png, image/jpeg, image/gif, image/svg+xml"
                  @on-change="onChange"
                />
                <!-- 单文件上传  -->
              </el-form-item>
            </el-col>
            <!-- 左列 -->
            <el-col :span="10" :offset="2">
              <el-form-item v-if="currentSiteId" label="ID">
                <div class="template_id_text">
                  <el-text>{{ currentSiteId }}</el-text>
                  <copy :content="currentSiteId"></copy>
                </div>
              </el-form-item>
              <el-form-item label="名称:" prop="siteName">
                <el-input v-model.trim="queryForm.siteName" />
              </el-form-item>

              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="彩种:" prop="focusGameType">
                    <GameTypeList
                      v-model="queryForm.focusGameType"
                      multiple
                      @onSelect="onSelect"
                      collapse-tags
                      collapse-tags-tooltip
                      :max-collapse-tags="1"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="排序编号:" prop="sortNum">
                    <el-input-number v-model="queryForm.sortNum" :min="0" controls-position="right" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="URL1:" prop="siteUrl1">
                <el-input v-model="queryForm.siteUrl1" />
              </el-form-item>
              <el-form-item label="URL2:" prop="siteUrl2">
                <el-input v-model="queryForm.siteUrl2" />
              </el-form-item>
              <el-form-item label="URL3:" prop="siteUrl3">
                <el-input v-model="queryForm.siteUrl3" />
              </el-form-item>
              <el-form-item label="URL4:" prop="siteUrl4">
                <el-input v-model="queryForm.siteUrl4" />
              </el-form-item>
              <el-form-item label="URL5:" prop="siteUrl5">
                <el-input v-model="queryForm.siteUrl5" />
              </el-form-item>
            </el-col>
            <!-- 右列 -->
            <el-col :span="10">
              <el-form-item label="推荐:" prop="isTop">
                <el-radio-group v-model="queryForm.isRecommended">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="热门:" prop="isHot">
                <el-radio-group v-model="queryForm.isHot">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="置顶:" prop="isBloom">
                <el-radio-group v-model="queryForm.isBloom">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="精选:" prop="isSelected">
                <el-radio-group v-model="queryForm.isSelected">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="爆款:" prop="isTop">
                <el-radio-group v-model="queryForm.isTop">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="创建时间:" v-if="queryForm.createTime">
                {{ unitFormatDate(queryForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
              <el-form-item label="站点简介:" prop="siteDesc">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder=""
                  maxlength="255"
                  :rows="2"
                  v-model="queryForm.siteDesc"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder=""
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
import { ElMessage, FormRules, type FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import { InternalRuleItem } from '@/components/mForm/rule'
import { createUrlValidator } from '@/utils/validators'
import {
  IReqAdvertisementEditQueryParams,
  reqAdvertisementCreate,
  reqAdvertisementEdit,
  reqAdvertisementExistSiteName,
  reqAdvertisementGetOne
} from '@/api/photoSys/advertisement'
import {
  IReqAdvertisementCreateQueryParams,
  IReqAdvertisementGetOneQueryParams
} from '@/api/photoSys/advertisement/type'
import { unitFormatDate } from '@/utils/dateFormat'

const ruleFormRef = ref<FormInstance>()
const isLoading = ref(false)
const isSumitFormLoading = ref(false)
const activeTab = ref('template_detail')
const rulesDialogVisible = ref(false)
const createTime = ref<string>()
const currentSiteId = ref<string | undefined>()
const currentSiteName = ref<string | undefined>('')
const showSubmitBar = computed(() => {
  return activeTab.value === 'template_detail'
})
const emits = defineEmits(['onClose'])

const onClosed = () => {
  resetForm()
  emits('onClose')
  rulesDialogVisible.value = false
}

const checkIsSiteName = (rule: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
  if (currentSiteName.value === value) {
    callback()
    return
  }
  reqAdvertisementExistSiteName({
    siteName: value
  }).then((res) => {
    if (res.data) {
      callback(new Error('模版名称已经存在'))
    } else {
      callback()
    }
  })
}

const onSelect = () => {
  ruleFormRef.value?.validateField('focusGameType')
}

const onChange = () => {
  ruleFormRef.value?.clearValidate('siteLogo')
}

const rules = reactive<FormRules<IReqAdvertisementCreateQueryParams>>({
  siteName: [{ validator: checkIsSiteName, trigger: 'blur', message: '模版名称已经存在' }],
  siteLogo: [{ required: true, trigger: 'change', message: '请添加logo' }],
  focusGameType: [{ required: true, message: '请选择彩种', trigger: 'blur' }],
  siteUrl1: [
    { required: true, message: '请填写URL' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ],
  siteUrl2: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl3: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl4: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl5: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }]
})

const initQueryForm = (): IReqAdvertisementCreateQueryParams => ({
  siteLogo: [],
  siteName: '',
  isRecommended: 'n',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isBloom: 'n',
  focusGameType: [],
  siteUrl1: '',
  siteUrl2: '',
  siteUrl3: '',
  siteUrl4: '',
  siteUrl5: '',
  siteDesc: '',
  memo: '',
  sortNum: 0
})

const queryForm = reactive<IReqAdvertisementCreateQueryParams>(initQueryForm())

const resetForm = () => {
  ruleFormRef.value?.resetFields()
  currentSiteId.value = ''
  currentSiteName.value = ''
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSumitFormLoading.value = true
        let res
        // update template
        if (currentSiteId.value) {
          const queryEdit: IReqAdvertisementEditQueryParams = {
            ...queryForm,
            siteId: currentSiteId.value
          }
          res = await reqAdvertisementEdit(queryEdit)
        } else {
          const query: IReqAdvertisementCreateQueryParams = {
            ...queryForm
          }
          // add template
          res = await reqAdvertisementCreate(query)
        }
        if (res.success) {
          ElMessage({
            message: currentSiteId.value ? '更新成功' : '已添加',
            type: 'success'
          })
          // 关闭dailog
          rulesDialogVisible.value = false
          activeTab.value = 'template_detail'
          resetForm()
        } else {
          ElMessage({
            message: res.errMessage,
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

const openDailog = (siteId?: string) => {
  rulesDialogVisible.value = true
  activeTab.value = 'template_detail'
  if (siteId) {
    currentSiteId.value = siteId
    fetchData(siteId)
  } else {
    currentSiteId.value = ''
  }
}
export interface IExpose {
  openDailog: (id: string) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})

const fetchData = async (siteId) => {
  isLoading.value = true
  try {
    // getClientWebsiteConfig
    const query: IReqAdvertisementGetOneQueryParams = {
      siteId
    }
    const res = await reqAdvertisementGetOne(query)
    if (res.success && res.data) {
      Object.assign(queryForm, res.data)
      createTime.value = res.data?.createTime
      currentSiteId.value = res.data.siteId
      currentSiteName.value = res.data.siteName
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
.input-sitename {
  width: 100%;
}

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
