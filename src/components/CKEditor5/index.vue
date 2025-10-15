<template>
  <div class="ckeditor5-wrapper">
    <ckeditor
      v-if="editor"
      v-model="editorData"
      :editor="editor"
      :config="editorConfig"
      :disabled="props.disabled"
      @ready="handleReady"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Ckeditor, useCKEditorCloud } from '@ckeditor/ckeditor5-vue'
import { uploadSingle } from '@/api/system/upload'
import type { FileUploadRequest } from '@/api/system/upload/types'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

// 使用 Cloud 版本的 CKEditor
const cloud = useCKEditorCloud({
  version: '46.0.0',
  translations: ['zh']
})

// Props 类型定义
interface Props {
  modelValue: string
  placeholder?: string
  height?: string | number
  disabled?: boolean
}

// Props 定义
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: '300px',
  disabled: false
})

// Emits 定义
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'ready', editor: any): void
  (e: 'change', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

// 编辑器实例引用
const editorInstance = ref<any>(null)

// 编辑器数据
const editorData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 编辑器实例
const editor = computed(() => {
  if (!cloud.data.value) {
    return null
  }

  return cloud.data.value.CKEditor.ClassicEditor
})

// 编辑器配置
const editorConfig = computed(() => {
  if (!cloud.data.value) {
    return null
  }

  const {
    Essentials,
    Paragraph,
    Heading,
    Bold,
    Italic,
    Link,
    List,
    Image,
    ImageUpload,
    Table,
    TableToolbar,
    BlockQuote,
    SimpleUpload,
    Indent,
    MediaEmbed,
    Font,
    Alignment,
    PasteFromOffice,
    AutoImage
  } = cloud.data.value.CKEditor

  return {
    language: 'zh',
    placeholder: props.placeholder,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Link,
      List,
      Image,
      ImageUpload,
      Table,
      TableToolbar,
      BlockQuote,
      SimpleUpload,
      Indent,
      MediaEmbed,
      Font,
      Alignment,
      PasteFromOffice,
      AutoImage
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        '|',
        'alignment',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'undo',
        'redo'
      ],
      shouldNotGroupWhenFull: true
    },
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg']
      },
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'linkImage'
      ]
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    simpleUpload: {
      uploadUrl: VITE_PROXY_UPLOAD,
      withCredentials: true,
      headers: {
        'X-CSRF-TOKEN': 'CSRF-Token'
      }
    },
    fontSize: {
      options: ['tiny', 'small', 'default', 'big', 'huge', 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48]
    },
    fontFamily: {
      options: ['default', 'Arial', 'SimSun', 'SimHei', 'Microsoft YaHei', 'Times New Roman']
    }
  }
})

// 事件处理函数
const handleReady = (editor: any) => {
  editorInstance.value = editor
  emit('ready', editor)

  // 设置只读状态
  editor.isReadOnly = props.disabled
}

const handleInput = (event: any, editor: any) => {
  const data = editor.getData()
  emit('update:modelValue', data)
  emit('change', data)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}

// 监听 disabled 变化
watch(
  () => props.disabled,
  (newValue) => {
    if (editorInstance.value) {
      editorInstance.value.isReadOnly = newValue
    }
  }
)

// 自定义文件上传处理器
class CustomUploadAdapter {
  private loader: any
  private abortController: AbortController

  constructor(loader: any) {
    this.loader = loader
    this.abortController = new AbortController()
  }

  upload() {
    return this.loader.file.then((file: File) => {
      return new Promise((resolve, reject) => {
        const param = {
          fileType: 'img',
          uploadFrom: 'user/profile/header',
          storageStyle: 6
        }

        const formData: FileUploadRequest = {
          uploadTarget: file.name,
          file: file,
          storageType: VITE_STORY_TYPE,
          env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
          ...param
        }

        const obj = {
          baseurl: VITE_PROXY_UPLOAD,
          contenttype: 'multipart/form-data'
        }

        uploadSingle(formData, obj)
          .then((response) => {
            resolve({
              default: response.url
            })
          })
          .catch((error) => {
            reject(error)
          })
      })
    })
  }

  abort() {
    this.abortController.abort()
  }
}

// 注册自定义上传适配器
function uploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CustomUploadAdapter(loader)
  }
}
</script>

<style scoped lang="less">
.ckeditor5-wrapper {
  width: 100%;

  :deep(.ck-editor) {
    width: 100%;
  }

  :deep(.ck-editor__editable) {
    min-height: v-bind('typeof props.height === "number" ? `${props.height}px` : props.height');
    max-height: 800px;
    overflow-y: auto;
  }

  :deep(.ck-editor__editable_inline) {
    padding: 0 1rem;
    background: #fff;
  }

  :deep(.ck-toolbar) {
    border-color: #dcdfe6;
    background: #f5f7fa;
  }

  :deep(.ck-content) {
    font-size: 14px;
    line-height: 1.5;
    color: #333;

    blockquote {
      border-left: 5px solid #ccc;
      font-style: italic;
      margin-left: 0;
      margin-right: 0;
      overflow: hidden;
      padding-left: 1.5em;
      padding-right: 1.5em;
    }

    code {
      background-color: #f0f0f0;
      padding: 0.1em;
      border-radius: 2px;
    }

    pre {
      padding: 1em;
      color: #353535;
      background: #f0f0f0;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      text-align: left;
      direction: ltr;
      tab-size: 4;
      white-space: pre-wrap;
      font-style: normal;
      min-width: 200px;
    }

    hr {
      margin: 15px 0;
      height: 1px;
      background: #dcdfe6;
      border: none;
    }

    .image {
      text-align: center;
      clear: both;

      img {
        margin: 0 auto;
        max-width: 100%;
        min-width: 50px;
      }

      > figcaption {
        color: #333;
        background-color: #f5f7fa;
        padding: 0.6em;
        font-size: 0.75em;
        outline-offset: -1px;
      }
    }

    table {
      margin: 1em auto;
      border-collapse: collapse;
      min-width: 50%;

      td,
      th {
        padding: 0.5em;
        border: 1px solid #dcdfe6;
        min-width: 2em;
      }

      th {
        font-weight: bold;
        background: #f5f7fa;
      }
    }
  }

  :deep(.ck-focused) {
    border-color: #409eff !important;
    box-shadow: 0 0 0 1px #409eff !important;
  }

  :deep(.ck-button) {
    &:hover {
      background: #ecf5ff !important;
    }

    &.ck-on {
      background: #ecf5ff !important;
      color: #409eff !important;
    }
  }

  :deep(.ck-dropdown__panel) {
    border-color: #dcdfe6 !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  }
}
</style>
