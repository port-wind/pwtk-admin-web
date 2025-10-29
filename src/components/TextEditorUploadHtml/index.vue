<template>
  <div>
    <TextEditor placeholder="请输入正文..." v-model="getHTMLContent" mode="simple" style="height: 350px" />
    <!-- <el-button :loading="isLoading" type="primary" @click="uploadFileAboutUs()">上传信息</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { uploadSingle } from '@/api/system/upload/index'
import { EUploadFrom } from '@/components/uploadImage/type'

interface IProps {
  modelValue: string
  uploadFrom: EUploadFrom
}
const props = defineProps<IProps>()
// const emit = defineEmits(['update:modelValue'])
const isLoading = ref(false)

const getHTMLContent = ref('&nbsp;')
const isUploading = ref(false)
const showRefresh = ref(false) // 可选：控制是否显示刷新按钮
const { VITE_PROXY_UPLOAD, VITE_CDN_URL } = webConfigApi

const fetchHtmlContent = async (url: string) => {
  if (!url) return
  try {
    const response = await axios.get(`${VITE_CDN_URL}${url}`)
    getHTMLContent.value = response.data
    // emit('update:modelValue', response.data)
  } catch (error) {
    console.error('获取HTML内容失败:', error)
    getHTMLContent.value = '&nbsp;'
  }
}

const uploadFileAboutUs = (): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    isLoading.value = true
    try {
      const fullHtml = `${getHTMLContent.value}`
      const obj = {
        baseurl: VITE_PROXY_UPLOAD,
        contenttype: 'multipart/form-data',
        notWithGenId: true
      }
      // 创建 Blob 对象（模拟文件）
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
      // 使用 FormData 准备上传数据
      const formData = new FormData()
      formData.append('file', blob, 'output.html')
      // 创建 File 对象
      const file = new File([blob], 'output.html', { type: 'text/html' })
      formData.append('uploadTarget', 'output.html') // 根据你的需求调整
      formData.append('file', file) // 上传的文件
      formData.append('storageType', 'S3')
      formData.append('env', 'dev')
      formData.append('fileType', 'file') // 改为 html，因为上传的是 HTML 文件
      formData.append('uploadFrom', props.uploadFrom) // 根据实际需求调整
      formData.append('storageStyle', '6')
      const res = await uploadSingle(formData, obj)
      if (res.success) {
        isLoading.value = false
        // ElMessage({
        //   type: 'success',
        //   message: '更新成功'
        // })
        // if (res.data?.path) {
        //   emit('update:modelValue', res.data.path)
        // }
        return resolve(res.data.path)
      } else {
        isLoading.value = false
        // ElMessage({
        //   type: 'success',
        //   message: res.success.data
        // })
        return resolve(res.data.path)
      }
    } catch (error) {
      isLoading.value = false
      // ElMessage({
      //   type: 'error',
      //   message: '更新失败'
      // })
    }
  })
}

// 初始化加载
onMounted(() => {
  if (props.modelValue) {
    fetchHtmlContent(props.modelValue)
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    fetchHtmlContent(newVal)
  },
  {
    immediate: true
  }
)

interface IExpose {
  submit: () => Promise<string>
}

const submit = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    uploadFileAboutUs()
      .then((path) => {
        resolve(path)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

defineExpose<IExpose>({
  submit
})

// 可选：手动刷新
const refreshContent = () => {
  fetchHtmlContent(props.modelValue)
}
</script>
