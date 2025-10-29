<script lang="ts" setup>
import { ref } from 'vue'
import type { UploadRawFile, UploadStatus, UploadUserFile } from 'element-plus'
import { addHttp } from '@/api/bss/attachmentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import getImageUrl from '@/utils/getImageUrl'
import EnhancedFileUpload from '@/views/Bbs/bbsPostContentManagement/enhancedFileUpload.vue'
import {
  defaultMimeTypeMappings,
  EUploadFrom,
  type IMimeTypeMapping,
  type IUploadResult
} from '@/components/uploadImage/type'

interface Props {
  modelValue: string | undefined
  type: 'post' | 'info'
  uploadFrom: EUploadFrom
  attachmentId?: string
  immediate?: boolean
  acceptRules?: Function[]
  useDefault?: boolean
  disabled?: boolean
  storageStyle?: number
  // post 只所有跟帖子相关的上传后,需要更新 接口 API bbsForumAttachment/create
  // info 信息, 头像, 上传相关的
}
const props = withDefaults(defineProps<Props>(), {
  useDefault: true // 设置默认值为 true
})
const srcFilePath = ref<string>()
const emits = defineEmits(['update:modelValue'])
const { VITE_CDN_URL } = webConfigApi
const uploadDataHead = ref({
  fileType: 'img',
  uploadFrom: 'wm/website/logo', // wm/website/icon
  storageStyle: props.storageStyle || 6
})

export interface UploadFile {
  name: string
  percentage?: number
  status: UploadStatus
  size?: number
  response?: unknown
  uid: number
  url?: string
  raw?: UploadRawFile
}

// uploadTarget: 1326967372203953983.png
// file: (binary)
// storageType: S3
// env: dev
// fileType: img
// uploadFrom: wm/website/icon
// storageStyle: 6

const changeUploadDataWithCustom = (
  mimeType: string,
  basePath: EUploadFrom,
  attachmentId: string | undefined
): IUploadResult => {
  const mergedMappings: IMimeTypeMapping = {
    ...defaultMimeTypeMappings
  }

  const mapping = mergedMappings[mimeType]

  if (mapping) {
    return {
      uploadData: {
        fileType: mapping.uploadType,
        uploadFrom: `${basePath}`,
        storageStyle: props.storageStyle || 6
        // uploadFrom: `${basePath}/${attachmentId}`,
        // uploadFrom: `test`,
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
        storageStyle: props.storageStyle || 6
      },
      fileType: mapping.fileType
    }
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`)
}

const uploadData = ref({
  fileType: 'img',
  uploadFrom: 'wm/website/logo',
  storageStyle: props.storageStyle || 6
})

const fileType = ref()
const fileList = ref<UploadUserFile[]>([])

const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  const { raw } = val.file
  const result = changeUploadDataWithCustom(raw.type, props.uploadFrom, props.attachmentId)
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  // update fileList only after validated successfully
  fileList.value = [val.file]
  emits('update:modelValue', attachmentUrl)
  // 只有帖子才调用此接口
  const params = {
    attachmentUrl,
    forumPostId: '', // postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    if (props.type === 'post' && props.attachmentId) {
      const response = await addHttp(params)
      if (response.success) {
        ElMessage.success('上传成功')
      } else {
        showErrorMessage(response)
      }
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

// it should be called from inside the component, but I do not have the time to test it.
// so let it be called from outside.
const clearFileList = () => {
  emits('update:modelValue', '')
  fileList.value = []
}
defineExpose({
  clearFileList
})
watch(
  () => props.modelValue,
  (newVal) => {
    srcFilePath.value = newVal
    if (newVal) {
      fileList.value = [
        {
          name: '',
          url: VITE_CDN_URL + newVal
        }
      ]
    } else {
      fileList.value = []
    }
  },
  { immediate: props.immediate }
)

const handlePictureCardPreview = (file: UploadUserFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleDelete = (file, type = 'logo') => {
  fileList.value = []
  emits('update:modelValue', '')
}

const handleChange = (first) => {
  // this function is called when the file is selected
  // no matter validate success or not.
  // so DO NOT update fileList here
  console.log('🚀 ~ handleChange ~ first:', first)
  // const { file } = first
  // fileList.value = [file]
}

const handleRemove = (val: any) => {
  console.log('🚀 ~ handleRemove ~ val:', val)
}
const handleExceed = (val: any) => {
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
const handleUploadRejected = (file: File) => {
  console.log(JSON.stringify(fileList.value))

  clearFileList()
}
//上传
const beforeUpload = async (val: File): Promise<boolean> => {
  // Run acceptRules validation first using array methods instead of for...of loop
  if (props.acceptRules && props.acceptRules.length > 0) {
    try {
      // Use Promise.all to run all validations concurrently
      const validationResults = await Promise.all(
        props.acceptRules.map(async (rule) => {
          try {
            return await rule(val)
          } catch (error) {
            console.error('Validation rule error:', error)
            return false
          }
        })
      )

      // Check if all validations passed
      const allValid = validationResults.every((result) => result === true)

      if (!allValid) {
        console.log('Validation failed, stop upload:', fileList.value)
        // Validation failed, stop upload
        // handleUploadRejected(val)
        return false
      }
    } catch (error) {
      console.error('Validation error:', error)
      // handleUploadRejected(val)
      return false
    }
  }

  // Continue with existing upload logic if validation passes
  uploadDataHead.value = changeUploadDataWithCustom(val.type, props.uploadFrom, props.attachmentId).uploadData
  console.log('🚀 ~ beforeUpload ~ uploadDataHead:', uploadDataHead)

  return true
}
const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
</script>

<template>
  <section class="UploadSection">
    <mUpload
      class="custom-upload"
      :show-file-list="false"
      accept-types="image/*"
      list-type="picture-card"
      :useDefault="props.useDefault"
      :uploadOption="uploadDataHead"
      :disabled="disabled"
      mute
      :file-list="fileList"
      :before-upload="beforeUpload"
      @on-success="handleSuccessOfAttachment"
      @on-change="handleChange"
      @on-remove="handleRemove"
      @on-exceed="handleExceed"
      @upload-rejected="handleUploadRejected"
    >
      <template #uploadArea>
        <el-icon>
          <Plus />
        </el-icon>
      </template>
      <template #file="{ file }">
        <EnhancedFileUpload :key="file.uid" :file="file" @remove="handleRemove" />
      </template>
    </mUpload>
    <el-dialog class="dialog-image" v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <div class="uploadedFile" v-if="fileList.length === 1">
      <ul class="babaul">
        <li v-for="file in fileList" :key="file.uid" class="babali">
          <AsyncImage fit="cover" :src="getImageUrl(srcFilePath)" />
          <div class="overlay">
            <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
              <zoom-in />
            </el-icon>
            <el-icon class="large-icon" @click="handleDelete(file, 'logo')" v-if="!disabled">
              <Delete />
            </el-icon>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="less">
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

.custom-upload {
  .el-upload--picture-card {
    height: 4rem;
    width: 4rem;
  }
}
</style>
