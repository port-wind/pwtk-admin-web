<template>
  <el-form ref="formRef" :model="queryForm" :rules="rules" class="domain-info-form dialog-form">
    <el-row :gutter="20" class="row-center" style="padding: 0 50px">
      <!-- 左列 -->
      <el-col :span="12" class="long-col">
        <el-form-item label="Logo:" prop="logo">
          <UploadLogo
            @chose-file-url="
              (url) => {
                queryForm.logo = url
              }
            "
          />
        </el-form-item>
        <el-form-item label="内部名称:" prop="websiteInnerName">
          <el-input style="width: 80%" clearable placeholder="内部名称" v-model="queryForm.websiteInnerName"></el-input>
        </el-form-item>
        <el-form-item label="用户ID:" prop="ownerUserId">
          <AutoChoseLoginId v-model="queryForm.ownerUserId" />
        </el-form-item>
        <el-form-item label="绑定模板:" prop="websiteTemplateRef">
          <!-- <ChoseTemplate /> -->
          <AutoChoseTemplate
            :owner-user-id="ownerUserId"
            v-model="queryForm.websiteTemplateRef"
            :disabled="!queryForm.ownerUserId"
            placeholder="模版ID"
            select
          />
          <!-- <el-autocomplete
            v-model="addForm.websiteTemplateRef"
            :disabled="disableTemplate"
            clearable
            :fetch-suggestions="querySearchTemplateRef"
            placeholder="绑定模板 | ID"
            @blur="handleBlurTemplateRef"
            @select="handleSelectTemplateRef"
            :trigger-on-focus="false"
          >
            <template #default="{ item }">
              <div class="autocomplete-item">
                <div>{{ item.value.templateName }} | {{ item.value.templateId }}</div>
              </div>
            </template>
          </el-autocomplete> -->
        </el-form-item>
        <el-form-item label="语言列表:" prop="langCodes">
          <el-select multiple placeholder="语言" :disabled="isDisabled" v-model="queryForm.langCodes">
            <el-option v-for="item in langRange" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区列表:" prop="areaCodes">
          <el-select multiple placeholder="地区" :disabled="isDisabled" v-model="queryForm.areaCodes">
            <el-option v-for="item in areaRange" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      </el-col>
      <!-- 右列 -->
      <el-col :span="12" class="long-col">
        <el-form-item label="icon:" prop="icon">
          <UploadLogo
            @chose-file-url="
              (url) => {
                queryForm.icon = url
              }
            "
          />
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
        <el-form-item label="CDN地址:" prop="cdnUrl">
          <el-input clearable placeholder="CDN地址" v-model="queryForm.cdnUrl" />
        </el-form-item>
        <el-form-item label="在线客服代码:" prop="onlineServiceCode">
          <el-input
            clearable
            :autosize="{ minRows: 2, maxRows: 6 }"
            show-word-limit
            resize="vertical"
            type="textarea"
            placeholder="在线客服代码"
            v-model="queryForm.onlineServiceCode"
          />
        </el-form-item>
        <el-form-item label="备注:" prop="memo">
          <el-input
            clearable
            :autosize="{ minRows: 2, maxRows: 6 }"
            show-word-limit
            type="textarea"
            resize="vertical"
            placeholder="备注"
            v-model="queryForm.memo"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 新增的按钮容器 -->
  </el-form>
  <div class="button-row">
    <el-button
      @click="
        () => {
          emit('closeDialog')
        }
      "
    >
      取消
    </el-button>
    <el-button type="primary" @click="handleAddNewWebSubmit">提交</el-button>
  </div>
</template>
<script setup lang="ts">
import { listBlurTemplateWithUserInfo, reqListBlurTemplateAndSketchCode, reqWebsiteCodeAdd } from '@/api/site'
import { Ref } from 'vue'
import { optionsArea, optionsLang, websiteStatus } from '@/const/options'
import i18n from '@/locales'
import { addTypeToObjects } from '@/utils/dataFormat'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { reqUserList } from '@/api/user'
import { FileType } from '@/api/system/upload/types'
// import ChoseTemplate from './choseTemplate.vue'
import UploadLogo from './comps/uploadLogo.vue'
import AutoChoseUserId from '@/components/autoChoseUserId/index.vue'

const { t } = i18n.global as any
const emit = defineEmits(['call-parent-method', 'closeDialog'])
const langRange = ref<any>([])
const areaRange = ref<any>([])

const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})

const ownerUserId = ref<string>('1301474784437076396')

const initFormData = (): IReqWebsiteCodeAddQueryParams => ({
  websiteInnerName: '',
  websiteTitle: '',
  ownerUserId: '',
  keyWords: '',
  onlineServiceCode: '',
  hasStatsCode: '',
  langCodes: [],
  areaCodes: [],
  memo: '',
  websiteTemplateRef: '',
  websiteStatus: '',
  cdnUrl: '',
  describe: '',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  isSourceCode: '',
  isShown: 'y',
  componentCount: '',
  icon: '',
  logo: '',
  contactType: '',
  appDownloadUrl: ''
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
import EnhancedFileUpload from '@/views/Bbs/bbsPostContentManagement/enhancedFileUpload.vue'
import mUpload from '@/components/mUpload/index.vue'
const fileList2 = ref<any[]>([])
const fileList = ref<any[]>([])

let handleExceed = (val: any) => {
  // console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
interface MimeTypeMapping {
  [mimeType: string]: {
    uploadType: string
    fileType: string
  }
}
interface UploadData {
  fileType: string
  uploadFrom: string
  storageStyle: number
}
interface UploadResult {
  uploadData: UploadData
  fileType: string
}
const defaultMimeTypeMappings: MimeTypeMapping = {
  'image/jpeg': { uploadType: 'img', fileType: 'p' },
  'image/png': { uploadType: 'img', fileType: 'p' },
  'image/gif': { uploadType: 'img', fileType: 'p' },
  'image/svg+xml': { uploadType: 'img', fileType: 'p' },
  'text/plain': { uploadType: 'ico', fileType: 'f' },
  'application/pdf': { uploadType: 'ico', fileType: 'f' },
  'application/msword': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.ms-excel': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.android.package-archive': { uploadType: 'file', fileType: 'a' },
  'application/octet-stream': { uploadType: 'file', fileType: 'e' },
  'video/mp4': { uploadType: 'video', fileType: 'v' },
  'video/webm': { uploadType: 'video', fileType: 'v' },
  'video/ogg': { uploadType: 'video', fileType: 'v' },
  'audio/mpeg': { uploadType: 'video', fileType: 's' },
  'audio/wav': { uploadType: 'video', fileType: 's' },
  'audio/ogg': { uploadType: 'video', fileType: 's' }
}
const changeUploadDataWithCustom = (
  mimeType: string,
  attachmentId: string,
  customMimeTypeMappings: Partial<MimeTypeMapping> = {},
  basePath: string = 'wm/website/logo'
): UploadResult => {
  // console.log(mimeType)
  // console.log('basePath', basePath)

  // Merge custom mappings with default mappings
  const mergedMappings: MimeTypeMapping = {
    ...defaultMimeTypeMappings,
    ...(customMimeTypeMappings as MimeTypeMapping)
  }

  const mapping = mergedMappings[mimeType]

  if (mapping) {
    return {
      uploadData: {
        fileType: mapping.uploadType,
        // uploadFrom: `${basePath}/${attachmentId}`,
        uploadFrom: `${basePath}`,
        // uploadFrom: `test`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }
  const generalType = mimeType.split('/')[0]
  const generalMapping = Object.entries(mergedMappings).find(([key]) => key.startsWith(`${generalType}/`))

  if (generalMapping) {
    const [, mapping] = generalMapping
    return {
      uploadData: {
        fileType: mapping.uploadType,
        uploadFrom: `${basePath}/${attachmentId}`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`)
}
//上传
let beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/website/logo').uploadData
}
let beforeUpload2 = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/website/icon').uploadData
}
const handleDelete = (file, type = 'logo') => {
  // console.log('file', file)
  if (type === 'logo') {
    queryForm.logo = ''
    fileList.value = []
  } else if (type === 'icon') {
    queryForm.icon = ''
    fileList2.value = []
  }
}
const onChoseFileUrl = (val) => {
  console.log('🚀 ~ onChoseFileUrl ~ val:', val)
}

//附件相关
const attachmentData = ref<any[]>([])
const isDisabled = ref(true)
const dialogThirdFormData = ref()
const attachmentFormMode = ref<string>('add')
const attachmentForm = ref()
const queryForm = reactive<IReqWebsiteCodeAddQueryParams>(initFormData())
const formRef = ref<FormInstance>()
// 假设的提交数据函数
const submitData = () => {
  return new Promise((resolve, reject) => {
    // 模拟API调用
    setTimeout(() => {
      // 假设提交成功
      resolve('success')
      // 如果失败，你可以使用 reject(new Error('提交失败'))
    }, 1000)
  })
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
let handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
let templateRefValid = false
let ownerUserIdValid = false
// 添加新的站点
const handleAddNewWebSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid, fields) => {
    // // 提交时候额外验证条件
    // let moreValid = false
    // if (queryForm.websiteTemplateRef === '') {
    //   templateRefValid = true
    // } else {
    //   templateRefValid = backUpWebsiteTemplateRefList.some(
    //     (item) => item.templateId === queryForm.websiteTemplateRef
    //   )
    //   if (!templateRefValid) {
    //     ElMessage.error('该绑定模板ID不存在')
    //   }
    // }
    // if (queryForm.ownerUserId == '') {
    //   ownerUserIdValid = true
    // } else {
    //   ownerUserIdValid = backUpOwnerUserIdList.includes(queryForm.ownerUserId)
    //   if (!ownerUserIdValid) {
    //     ElMessage.error('该用户ID不存在')
    //   }
    // }
    // if (templateRefValid && ownerUserIdValid) {
    //   moreValid = true
    // } else {
    //   moreValid = false
    // }
    // if (valid && moreValid) {
    // console.log('提交成功!')
    // 执行提交逻辑
    // console.log('addForm', addForm.value)
    const query: IReqWebsiteCodeAddQueryParams = {
      ...queryForm
    }
    const res = await reqWebsiteCodeAdd(query)
    if (res.success) {
      ElMessage({
        showClose: true,
        message: t('table.controls') + t('errorCode.0'),
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })

      Object.assign(queryForm, initFormData())
    }
    // }
  })
}

const onSelect = () => {
  console.log('112312321')
}
const handleChange = (first, second) => {
  // console.log('first', first)
  const { file } = first
  fileList.value = [file]
}
const rules = ref<FormRules>({
  appDownloadUrl: [
    {
      required: false,
      message: '下载链接不能为空',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        // console.log('执行1111',value,value);
        if (!checkIsUrlOrNot(value) && value) {
          // console.log('planA');
          callback(new Error('请输入类似https://www.google.com/的URL！'))
        } else {
          // console.log('planB');
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
        // console.log('执行',value);
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
        // console.log('执行',value);
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
const querySearchTemplateRef = async (queryString: string, cb: (arg: any) => void) => {
  // console.log('执行')

  try {
    const response = await listBlurTemplateWithUserInfo({
      ownerUserId: queryForm.ownerUserId,
      templateId: queryString
      // ...defaultPageObj
    })
    if (response.success && response.data) {
      // console.log('response.data', response.data)
      const results = response.data.map((item: any) => ({
        value: item // 这个 value 属性是必须的，用于显示在输入框中
        // 可以添加其他需要的属性
      }))
      backUpWebsiteTemplateRefList = response.data.map((item: any) => item)
      // console.log('backUpWebsiteTemplateRefList', backUpWebsiteTemplateRefList);
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  // console.log('item',item);
  queryForm.ownerUserId = item.userId
  disableTemplate.value = false
}
const handleChange2 = (first, second) => {
  // console.log('first', first)
  const { file } = first
  fileList2.value = [file]
}
const handleBlurOwnerUserId = (event: any) => {
  if (event.target.value == '') {
    ownerUserIdValid = true
    queryForm.websiteTemplateRef = ''
    disableTemplate.value = true
    langRange.value = []
    areaRange.value = []
    queryForm.langCodes = []
    queryForm.areaCodes = []
    isDisabled.value = true
  } else if (backUpOwnerUserIdList.includes(event.target.value)) {
    ownerUserIdValid = true
    disableTemplate.value = false
  } else {
    ownerUserIdValid = false
    ElMessage.error('该用户ID不存在!')
    queryForm.websiteTemplateRef = ''
    disableTemplate.value = true
    langRange.value = []
    areaRange.value = []
    queryForm.langCodes = []
    queryForm.areaCodes = []
    isDisabled.value = true
  }
}
const disableTemplate = ref<boolean>(true)
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response = await reqUserList({ searchId: queryString, ...defaultPageObj })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId, // 这个 value 属性是必须的，用于显示在输入框中
        loginId: item.loginId,
        userId: item.userId
        // 可以添加其他需要的属性
      }))
      backUpOwnerUserIdList = response.data.list.map((item: any) => item.userId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
let uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
// 离开绑定模板input触发 inputを離れると発動する
const handleBlurTemplateRef = (e: any) => {
  if (backUpWebsiteTemplateRefList.some((item) => item.templateId === e.target.value)) {
    templateRefValid = true
    isDisabled.value = false
  } else if (e.target.value == '') {
    templateRefValid = true
    isDisabled.value = true
    queryForm.langCodes = []
    queryForm.areaCodes = []
  } else {
    templateRefValid = false
    isDisabled.value = true
    queryForm.langCodes = []
    queryForm.areaCodes = []
    ElMessage.error('该绑定模板ID不存在!')
  }
}
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import isValidURL, { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import type { IReqWebsiteCodeAddQueryParams } from '@/api/site/type'
const initPostInfo = () => ({
  postId: '',
  forumId: '',
  postContent: '',
  postTime: null,
  postUserId: '',
  enableAnonymous: 'y',
  postGameRef: '',
  postGametypeRef: '',
  postStatus: 'y',
  hasAttachment: 'n',
  viewFlag: 'a',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isBloom: 'n',
  title: ''
})
const postInfo = ref(initPostInfo())
//上传相关
const fileType = ref()
const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  /* if (attachmentTotal.value >= 9) {
    ElMessage.warning('附件数量已达上限')
    return
  } */
  // console.log('val',val);
  queryForm.logo = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addAttachmentHttp(params)
    if (response.success) {
      ElMessage.success('上传成功')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const handleSuccessOfAttachment2 = async (val, prefixPostfixFlag) => {
  /* if (attachmentTotal.value >= 9) {
    ElMessage.warning('附件数量已达上限')
    return
  } */
  // console.log('val',val);
  queryForm.icon = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addAttachmentHttp(params)
    if (response.success) {
      ElMessage.success('上传成功')
      // 保存成功后重新获取数据
      //  uploadSingle.
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

let backUpOwnerUserIdList: string[] = []
let backUpWebsiteTemplateRefList: any[] = []
const defaultPageObj = {
  page: 1,
  size: 100
}
// 辅助检索选择下拉框templateRef
const handleSelectTemplateRef = (item: any) => {
  // console.log('item', item);
  queryForm.websiteTemplateRef = item.value.templateId
  areaRange.value = addTypeToObjects(optionsArea, 'option').filter((areaItem) =>
    item.value.areaCodes.includes(areaItem.value)
  )
  /* setTimeout(() => {
    addForm.value.areaCodes = areaRange.value.map((item) => item.value)
    console.log('addForm.value.areaCodes', addForm.value);
  }, 1000) */
  langRange.value = addTypeToObjects(optionsLang, 'option').filter((langItem) =>
    item.value.langCodes.includes(langItem.value)
  )
  nextTick(() => {
    queryForm.areaCodes = areaRange.value.map((item) => item.value)
    queryForm.langCodes = langRange.value.map((item) => item.value)
    // console.log('addForm.value.areaCodes', addForm.value);
  })

  isDisabled.value = false
  queryForm.langCodes = []
  queryForm.areaCodes = []
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.uploadedFile {
  // background-color: pink;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 0px;
  overflow: hidden;

  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  li {
    list-style: none;
  }
}

.large-icon {
  font-size: 24px;
  /* 设置图标的大小 */
  /* 你可以根据需要调整大小 */
  color: white;
}

.UploadSection {
  display: flex;
  // justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row-reverse;

  /* 水平倒序排列 */
  > div {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .uploaded-image {
    cursor: pointer;
  }
}

.babali:hover .overlay {
  opacity: 1;
  /* 鼠标悬停时显示遮罩层 */
}

.babali {
  margin-right: 10px;
  width: 4rem;
  height: 4rem;
  border: 1px solid #ccc;
  // background-color: pink;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  .uploaded-image {
    position: relative;
    /* 使遮罩层相对于这个容器定位 */
    // width: 100%;
    /* 图片宽度100% */
    // height: 100%;
    // object-fit: contain;
    /* 图片高度100% */

    /* 圆角 */
  }

  .overlay {
    cursor: pointer;
    z-index: 100;
    background-color: blue;
    position: absolute;
    /* 绝对定位 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.8);
    /* 灰色遮罩层，50%透明度 */
    opacity: 0;
    /* 初始透明度为0 */
    transition: opacity 0.3s;
    /* 添加过渡效果 */
  }
}

.dialog-image {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.babaul {
  padding-left: 0px;
}
</style>
