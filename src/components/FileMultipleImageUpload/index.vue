<script lang="ts" setup>
import { ref, watch } from 'vue'
import { addHttp } from '@/api/bss/attachmentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import getImageUrl from '@/utils/getImageUrl'
import { UploadRawFile, UploadStatus, UploadUserFile } from 'element-plus'
import EnhancedFileUpload from '@/views/Bbs/bbsPostContentManagement/enhancedFileUpload.vue'
import { defaultMimeTypeMappings, EUploadFrom, IMimeTypeMapping, IUploadResult } from '@/components/uploadImage/type'

interface Props {
  modelValue: string[] | undefined // Changed to string array
  type: 'post' | 'info'
  uploadFrom: EUploadFrom
  attachmentId?: string
  maxUploadCount?: number // Added max upload count prop
}
const props = defineProps<Props>()
const srcFilePath = ref<string[] | undefined>()
const emits = defineEmits(['update:modelValue', 'on-change'])
const currentFileNumber = ref(0)
const { VITE_CDN_URL } = webConfigApi
const uploadDataHead = ref({
  fileType: 'img',
  uploadFrom: 'wm/website/logo',
  storageStyle: 6
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
  uploadFrom: 'wm/website/logo',
  storageStyle: 6
})

const fileType = ref()

const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, props.uploadFrom, props.attachmentId)
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  const currentUrls = props.modelValue ? [...props.modelValue] : []
  currentUrls.push(attachmentUrl)
  emits('update:modelValue', currentUrls)

  const params = {
    attachmentUrl,
    forumPostId: '',
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

const fileList = ref<UploadUserFile[]>([])

watch(
  () => props.modelValue,
  (newVal) => {
    srcFilePath.value = newVal
    if (newVal && newVal.length) {
      fileList.value = newVal.map((url) => ({
        name: '',
        url: VITE_CDN_URL + url,
        srcUrl: url
      }))
    } else {
      fileList.value = []
    }
  },
  { immediate: true }
)

const dialogThirdFormData = ref()

const beforeUpload = (val: File) => {
  if (props.maxUploadCount && currentFileNumber.value >= props.maxUploadCount) {
    console.log('🚀 ~ beforeUpload ~ props.maxUploadCount:', props.maxUploadCount)
    // ElMessage({
    //   type: 'error',
    //   message: `最多只能上传 ${props.maxUploadCount} 个文件`
    // })
    return
  }
  currentFileNumber.value = currentFileNumber.value + 1

  uploadDataHead.value = changeUploadDataWithCustom(val.type, props.uploadFrom, props.attachmentId).uploadData
}

const handlePictureCardPreview = (file: UploadUserFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDelete = (index: number, file: UploadUserFile, type = 'logo') => {
  const newFileList = fileList.value.filter((_, i) => i !== index)
  const updatedUrls = newFileList.map((f) => f.url?.replace(VITE_CDN_URL, '')).filter(Boolean) as string[]
  emits('update:modelValue', updatedUrls)
}

const handleChange = (file: UploadUserFile) => {
  if (props.maxUploadCount && fileList.value.length >= props.maxUploadCount) {
    ElMessage.warning(`最多只能上传 ${props.maxUploadCount} 个文件`)
    return
  }
  if (!fileList.value.some((f) => f.uid === file.uid)) {
    fileList.value.push(file)
    emits('on-change')
  }
}

const handleRemove = (val: any) => {
  console.log('🚀 ~ handleRemove ~ val:', val)
  // dialogThirdFormData.value.attachmentUrl = '' // Commented out as may not be needed
}

const handleExceed = (val: any) => {
  ElMessage.warning(`最多只能上传 ${props.maxUploadCount} 个文件`)
}

const dialogVisible = ref<boolean>(false)
const dialogImageUrl = ref<string>('')
const disabledUpload = ref<boolean>(false)

watch(
  () => fileList,
  (newVal) => {
    if (newVal.value.length >= 5) {
      disabledUpload.value = true
    } else {
      disabledUpload.value = false
      currentFileNumber.value = newVal.value.length
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <section :class="{ UploadSection: true, disabled: disabledUpload }">
    <mUpload
      class="custom-upload"
      :show-file-list="false"
      list-type="picture-card"
      :useDefault="true"
      :uploadOption="uploadDataHead"
      mute
      :file-list="fileList"
      :before-upload="beforeUpload"
      @on-success="handleSuccessOfAttachment"
      @on-change="handleChange"
      @on-exceed="handleExceed"
      multiple
      :disabled="disabledUpload"
      :limit="maxUploadCount"
      v-bind="$attrs"
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
    <div class="uploadedFile" v-if="fileList.length > 0">
      <!-- Changed from === 1 to > 0 -->
      <ul class="babaul">
        <li v-for="(file, index) in fileList" :key="file.uid" class="babali">
          <AsyncImage fit="cover" :src="getImageUrl(file.srcUrl)" />
          <!-- Changed to use file.url directly -->
          <div class="overlay">
            <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
              <zoom-in />
            </el-icon>
            <el-icon class="large-icon" @click="handleDelete(index, file, 'logo')">
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
  color: white;
}

.UploadSection {
  display: flex;
  align-items: flex-start;
  flex-direction: row-reverse;

  > div {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .uploaded-image {
    cursor: pointer;
  }

  &.disabled {
    .el-upload--picture-card {
      cursor: not-allowed;
    }
  }
}

.babali:hover .overlay {
  opacity: 1;
}

.babali {
  margin-right: 10px;
  width: 4rem;
  height: 4rem;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  .overlay {
    cursor: pointer;
    z-index: 100;
    background-color: blue;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.8);
    opacity: 0;
    transition: opacity 0.3s;
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
