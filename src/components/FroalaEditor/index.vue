<template>
  <div class="froala-editor-wrapper">
    <froala
      :tag="'textarea'"
      v-model="editorContent"
      :config="editorConfig"
      @initialized="onInitialized"
      @contentChanged="onContentChanged"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import VueFroala from 'vue-froala-wysiwyg'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/third_party/embedly.min.js'
import 'froala-editor/js/languages/zh_cn.js'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
import { uploadSingle } from '@/api/system/upload'
import type { FileUploadRequest } from '@/api/system/upload/types'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

// Props 类型定义
interface Props {
  modelValue: string
  placeholder?: string
  height?: string | number
  disabled?: boolean
  toolbarButtons?: string[]
}

// Props 定义
const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: '300px',
  disabled: false,
  toolbarButtons: () => [
    'fullscreen',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'subscript',
    'superscript',
    '|',
    'fontFamily',
    'fontSize',
    'color',
    'inlineStyle',
    'paragraphStyle',
    '|',
    'paragraphFormat',
    'align',
    'formatOL',
    'formatUL',
    'outdent',
    'indent',
    'quote',
    '|',
    'insertLink',
    'insertImage',
    'insertVideo',
    'insertTable',
    'emoticons',
    'fontAwesome',
    'specialCharacters',
    'insertHR',
    'selectAll',
    'clearFormatting',
    '|',
    'print',
    'help',
    'html',
    '|',
    'undo',
    'redo'
  ]
})

// Emits 定义
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'ready', editor: any): void
  (e: 'change', value: string): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

// 编辑器内容
const editorContent = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 编辑器实例
const editorInstance = ref<any>(null)

// 编辑器配置
const editorConfig = computed(() => ({
  placeholderText: props.placeholder,
  heightMin: typeof props.height === 'number' ? props.height : parseInt(props.height as string),
  language: 'zh_cn',
  toolbarButtons: props.toolbarButtons,
  toolbarButtonsXS: props.toolbarButtons,
  toolbarButtonsSM: props.toolbarButtons,
  toolbarButtonsMD: props.toolbarButtons,
  attribution: false,
  charCounterCount: true,
  imageUploadURL: VITE_PROXY_UPLOAD,
  imageUploadParams: {
    fileType: 'img',
    uploadFrom: 'user/profile/header',
    storageStyle: 6,
    storageType: VITE_STORY_TYPE,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod'
  },
  imageUploadMethod: 'POST',
  imageMaxSize: 5 * 1024 * 1024,
  imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
  events: {
    'image.beforeUpload': function (images: File[]) {
      const image = images[0]
      if (!image) return false

      const formData: FileUploadRequest = {
        uploadTarget: image.name,
        file: image,
        storageType: VITE_STORY_TYPE,
        env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
        fileType: 'img',
        uploadFrom: 'user/profile/header',
        storageStyle: 6
      }

      const obj = {
        baseurl: VITE_PROXY_UPLOAD,
        contenttype: 'multipart/form-data'
      }

      uploadSingle(formData, obj)
        .then((response) => {
          this.image.insert(response.url, false, null, this.image.get())
        })
        .catch((error) => {
          console.error('Image upload error:', error)
        })

      return false
    }
  }
}))

// 事件处理函数
const onInitialized = (editor: any) => {
  editorInstance.value = editor
  emit('ready', editor)

  // 设置只读状态
  if (props.disabled) {
    editor.edit.off()
  }
}

const onContentChanged = () => {
  emit('change', editorContent.value)
}

const onFocus = () => {
  emit('focus')
}

const onBlur = () => {
  emit('blur')
}

// 监听 disabled 变化
watch(
  () => props.disabled,
  (newValue) => {
    if (editorInstance.value) {
      if (newValue) {
        editorInstance.value.edit.off()
      } else {
        editorInstance.value.edit.on()
      }
    }
  }
)

// 组件销毁时清理
onBeforeUnmount(() => {
  if (editorInstance.value) {
    editorInstance.value.destroy()
  }
})
</script>

<style lang="less">
.froala-editor-wrapper {
  .fr-box {
    border-radius: 4px;
    border-color: #dcdfe6;

    &.fr-basic {
      .fr-element {
        min-height: v-bind('typeof props.height === "number" ? `${props.height}px` : props.height');
        color: #333;
        padding: 16px;
        font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
          Arial, sans-serif;
      }

      .fr-wrapper {
        background: #fff;
        border-radius: 0 0 4px 4px;
      }
    }
  }

  .fr-toolbar {
    border-color: #dcdfe6;
    border-radius: 4px 4px 0 0;
    background: #f5f7fa;

    .fr-command.fr-btn {
      color: #606266;

      &:hover {
        background: #ecf5ff;
      }

      &.fr-active {
        color: #409eff;
        background: #ecf5ff;
      }
    }
  }

  .fr-second-toolbar {
    border-color: #dcdfe6;
    border-radius: 0 0 4px 4px;
  }

  .fr-wrapper {
    .fr-placeholder {
      color: #999;
    }

    .fr-view {
      font-size: 14px;
      line-height: 1.5;

      p {
        margin: 0;
        padding: 0;
      }

      blockquote {
        border-left: 4px solid #dcdfe6;
        margin: 1em 0;
        padding: 0.5em 1em;
        background: #f5f7fa;
        color: #666;
      }

      pre {
        background: #f5f7fa;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        padding: 1em;
        color: #333;
        font-family: Menlo, Monaco, Consolas, Courier, monospace;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;

        td,
        th {
          border: 1px solid #dcdfe6;
          padding: 0.5em;
        }

        th {
          background: #f5f7fa;
          font-weight: bold;
        }
      }

      img {
        max-width: 100%;
        height: auto;
      }

      a {
        color: #409eff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .fr-popup {
    border-color: #dcdfe6;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .fr-buttons {
      background: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;
    }

    .fr-arrow {
      border-bottom-color: #dcdfe6;
    }
  }
}
</style>
