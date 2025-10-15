<template>
  <!-- 上传组件 -->
  <el-upload
    :data="fileData"
    :accept="acceptTypes"
    :show-file-list="false"
    :fileList="fileList"
    :on-success="onSuccessOriginal"
    :on-preview="onPreview"
    :on-remove="handleFileRemove"
    :on-error="onError"
    :on-progress="onProgress"
    :on-change="onChange"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :http-request="httpRequest ? httpRequest : handelCustomRequest"
    :on-exceed="onExceed"
    v-bind="$attrs"
  >
    <!-- 上传触发器插槽 -->
    <!-- <slot name="trigger">
      <el-button type="primary">点击上传</el-button>
    </slot> -->
    <slot name="uploadArea"></slot>
    <slot name="uploadTip"></slot>

    <template #file="{ file }">
      <slot name="file" :file="file"></slot>
    </template>
    <!-- 上传提示插槽（已注释） -->
    <!-- <template #tip>
      <div class="el-upload__tip">{{ uploadTip }}</div>
    </template> -->
  </el-upload>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { sessionCache } from '@/hooks/useSession'
import { AddRequest, fileUploadOption, FileUploadRequest } from '@/api/system/upload/types'
import { addHttp, uploadSingle } from '@/api/system/upload/index'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi
// 定义组件属性
const props = defineProps({
  // 用户自定义上传方法
  httpRequest: {
    type: Function
  },
  beforeUpload: {
    type: Function,
    default: null
  },
  fileList: {
    type: Array
  },
  uploadOption: {
    type: Object as PropType<fileUploadOption>
  },
  onPreview: {
    type: Function
  },
  onRemove: {
    type: Function
  },
  mute: {
    type: Boolean,
    default: false
  },
  useDefault: {
    type: Boolean,
    default: false
  },
  acceptTypes: {
    type: String
  }
})

// 上传响应数据
const responseData = ref()
// 上传文件列表
const fileList = ref(props.fileList)

// 上传提示
const uploadTip = ref('')
// 接受的文件类型

// 查询是否有父级调用
const slots = useSlots()

// 上传前置拦截 获取到file文件对象方便接下来上传
const fileData = ref()

// 文件类型映射
const fileTypeMap = {
  img: 'image/*',
  ico: '.ico',
  video: 'video/*',
  file: '.txt,.pdf,.doc,.docx'
}

// 定义组件事件
const emits = defineEmits([
  'on-preview',
  'on-remove',
  'on-success',
  'on-error',
  'on-progress',
  'on-change',
  'before-upload',
  'before-remove',
  'on-exceed',
  'on-selectAuto',
  'on-reqData',
  'upload-rejected'
])

/**
 * 上传文件的自定义处理函数
 * @param {object} options 上传的相关信息
 * @property {File} options.file 上传的文件
 * @property {string} options.file.name 上传的文件名
 * @property {Array<File>} options.fileList 上传的文件列表
 * @return {Promise<void>}
 */
const handelCustomRequest = async (options: any) => {
  const param = {
    fileType: props.uploadOption?.fileType ?? 'img', // 提供一个默认值
    uploadFrom: props.uploadOption?.uploadFrom,
    storageStyle: props.uploadOption?.storageStyle || 6
  }

  // 如果你能确保 fileType 一定有值，可以使用类型断言
  const formData: FileUploadRequest = {
    uploadTarget: options.file.name,
    file: options.file,
    storageType: VITE_STORY_TYPE,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
    ...param
  } as FileUploadRequest // 使用类型断言
  const obj = {
    baseurl: VITE_PROXY_UPLOAD,
    contenttype: 'multipart/form-data'
    // clientType: 'Web'
  }
  await uploadSingle(formData, obj)
    .then((response) => {
      nextTick(() => {
        onSuccess(response.data, options.file, options.fileList)
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

/**
 * 上传图片成功
 * @param response 上传的响应结果
 * @param file 上传的图片文件
 * @param fList 上传的文件列表
 * @description
 * 1. 将 fileList.value 指向 fList
 * 2. 上传的图片地址写到 model.value[uploadItem.prop!] 中
 * 3. 触发 on-success 事件
 * 4. 将 responseData.value 置空
 */
const onSuccessOriginal = async (response: any, file: File, fList: any[]) => {
  if (!responseData.value) return
  fileList.value = fList
  // let uploadItem = props.options.find((item) => item.type === 'upload')!
  // model.value[uploadItem.prop!] = { response: responseData.value, file, fileList: fileList.value }
  emits('on-success', { response: responseData.value, file, fileList: fileList.value })
  await nextTick()
  responseData.value = null
}

/**
 * 上传图片成功
 * @param {Object} response 上传成功后服务器返回的结果
 * @param {File} file 上传的文件
 * @param {FileList} fList 上传的文件列表
 */
let onSuccess = async (response: any, file: File, fList: FileList) => {
  // 上传图片成功 给表单上传项赋值
  response && uploadLog(response)
  responseData.value = response
}
const showMessage = (type: 'success' | 'error', message: string) => {
  if (!props.mute) {
    ElMessage[type](message)
  }
}
/**
 * 上传日志记录
 * @param {Object} param 上传成功后服务器返回的结果
 * @description
 * 1. 上传成功后将上传的日志记录到upload_log表中
 * 2. 上传失败后将上传的日志记录到upload_log表中
 */
const uploadLog = async (param) => {
  if (!param && fileData.value.length <= 0) {
    return
  }
  const uploadUser = sessionCache.getCache('userID')
  const formData: AddRequest = {
    storageStyle: props.uploadOption?.storageStyle || 6,
    fileType: props.uploadOption?.fileType ?? 'img',
    uploadFrom: param.data ? param.data.path : param.path ?? '',
    uploadTarget: fileData?.value?.name ?? '',
    storageType: VITE_STORY_TYPE,
    uploadUser,
    biz: 'upload',
    fileSize: fileData?.value?.size ?? 0,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod'
  }
  // console.log(obj)
  try {
    await addHttp(formData)
    showMessage('success', '上传成功')
  } catch (error) {
    ElMessage.error('上传失败')
  }
}
/**
 * 文件超出个数限制时的钩子
 * @param files {File} 超出限制的文件
 * @param fileList {FileList} 文件列表
 * @emits on-exceed
 */
const onExceed = (files: File, fileList: FileList) => {
  emits('on-exceed', { files, fileList })
}
// 上传错误处理
const onError = (err: any, file: File, fileList: FileList) => {
  emits('on-error', { err, file, fileList })
}

const handleFileRemove = (file: File, _fileList: FileList) => {
  emits('on-remove', { file, fileList })
}
// 上传进度处理
const onProgress = (event: any, file: File, fileList: FileList) => {
  emits('on-progress', { event, file, fileList })
}

// 文件状态改变时的钩子
const onChange = (file: File, fileList: FileList) => {
  emits('on-change', { file, fileList })
}

// 上传文件之前的钩子
const beforeUpload = async (file: File) => {
  console.log('beforeUpload', file)
  if (props.useDefault) {
    if (!handleBeforeUpload(file)) {
      return false
    }
  }
  if (props.beforeUpload) {
    return props.beforeUpload(file)
  }
  return handleBeforeUpload(file)
}

// 处理上传前的逻辑
const handleBeforeUpload = (file: File) => {
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    emits('upload-rejected', file, 'Not an image file')
    return false
  }
  fileData.value = file

  return true
}

/**
 * 上传图片前置拦截
 * @param {File} file 上传的文件
 * @param {FileList} fileList 上传的文件列表
 * @return {boolean | Promise} 如果返回 false,则上传将被中断
 */
const beforeRemove = (file: File, fileList: FileList) => {
  emits('before-remove', { file, fileList })
}
</script>

<style scoped>
/* 上传提示样式 */
.el-upload__tip {
  margin-top: 10px;
  color: #999;
}
</style>
