<script lang="ts" setup>
import { ref } from 'vue'
import { addHttp } from '@/api/bss/attachmentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { UploadRawFile, UploadStatus, UploadUserFile } from 'element-plus'
import EnhancedFileUpload from '@/views/Bbs/bbsPostContentManagement/enhancedFileUpload.vue'

interface Props {
  imageUrl: string
}

const props = defineProps<Props>()

interface IEmits {
  (e: 'choseFileUrl', value: string): void
}
const emits = defineEmits<IEmits>()

const uploadDataHead = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})

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

const uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})

const fileType = ref()

const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  console.log('🚀 ~ handleSuccessOfAttachment ~ val:', val)
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: '', // postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addHttp(params)
    if (response.success) {
      ElMessage.success('上传成功')
      emits('choseFileUrl', attachmentUrl)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const fileList = ref<UploadUserFile[]>([])
const dialogThirdFormData = ref()
//上传
const beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/website/logo').uploadData
}
const handlePictureCardPreview = (file: UploadUserFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleDelete = (file, type = 'logo') => {
  fileList.value = []
}

const handleChange = (first) => {
  const { file } = first
  fileList.value = [file]
}

const handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
const handleExceed = (val: any) => {
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}

const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
</script>

<template>
  <section class="UploadSection">
    <mUpload
      class="custom-upload"
      :show-file-list="false"
      list-type="picture-card"
      :useDefault="true"
      :uploadOption="uploadDataHead"
      mute
      :file-list="fileList"
      :before-upload="beforeUpload"
      @on-success="(val) => handleSuccessOfAttachment(val, 't')"
      @on-change="handleChange"
      @on-remove="handleRemove"
      @on-exceed="handleExceed"
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
          <img :src="file.url" alt="" class="uploaded-image" />
          <div class="overlay">
            <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
              <zoom-in />
            </el-icon>
            <el-icon class="large-icon" @click="handleDelete(file, 'logo')">
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
