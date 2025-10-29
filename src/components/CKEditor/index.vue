<template>
  <div class="ckeditor-wrapper">
    <ckeditor
      :value="modelValue"
      :config="editorConfig"
      @input="handleInput"
      @ready="handleReady"
      @focus="handleFocus"
      @blur="handleBlur"
      tag-name="textarea"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { component as ckeditor } from '@mayasabha/ckeditor4-vue3'
// import { uploadCOS } from '@/views/WebVision/const/upload'
import { uploadSingle } from '@/api/system/upload'
import type { FileUploadRequest } from '@/api/system/upload/types'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi
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

// 编辑器配置
const editorConfig = computed(() => ({
  height: typeof props.height === 'number' ? props.height : props.height,
  language: 'zh-cn',
  placeholder: props.placeholder,
  readOnly: props.disabled,
  skin: 'moono',
  contentsCss: [
    'body {font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;}'
  ],
  toolbar: [
    { name: 'document', items: ['Source', '-', 'Preview', '-', 'Templates'] },
    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
    {
      name: 'paragraph',
      items: [
        'NumberedList',
        'BulletedList',
        '-',
        'Outdent',
        'Indent',
        '-',
        'Blockquote',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock'
      ]
    },
    { name: 'links', items: ['Link', 'Unlink'] },
    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
    '/',
    { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] }
  ],
  removeButtons: '',
  format_tags: 'p;h1;h2;h3;pre',
  removeDialogTabs: 'image:advanced;link:advanced',
  allowedContent: true,
  extraPlugins: 'uploadimage,font,colorbutton,justify,showblocks,maximize',
  uploadUrl: '', // 使用自定义上传处理
  imageUploadUrl: '', // 使用自定义上传处理
  fontSize_sizes: '12/12px;13/13px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px',
  font_names:
    '宋体/SimSun;黑体/SimHei;微软雅黑/Microsoft YaHei;' +
    'Arial/Arial, Helvetica, sans-serif;Times New Roman/Times New Roman, Times, serif;',
  on: {
    fileUploadRequest: (evt: any) => {
      const fileLoader = evt.data.fileLoader
      const file = fileLoader.file

      // 取消默认的上传处理
      evt.stop()

      const param = {
        fileType: 'img', // 提供一个默认值
        uploadFrom: 'user/profile/header',
        storageStyle: 6
      }

      // 如果你能确保 fileType 一定有值，可以使用类型断言
      const formData: FileUploadRequest = {
        uploadTarget: file.name,
        file: file,
        storageType: VITE_STORY_TYPE,
        env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
        ...param
      } as FileUploadRequest // 使用类型断言
      const obj = {
        baseurl: VITE_PROXY_UPLOAD,
        contenttype: 'multipart/form-data'
        // clientType: 'Web'
      }
      // 使用腾讯云COS上传
      uploadSingle(formData, obj)
        .then((url) => {
          fileLoader.uploadTotal = 1
          fileLoader.uploaded = 1
          fileLoader.responseData = { uploaded: 1, url }
          evt.sender.fire('fileUploadResponse', { fileLoader })
        })
        .catch((error) => {
          console.error('Image upload error:', error)
          fileLoader.uploadTotal = 1
          fileLoader.uploaded = 0
          fileLoader.responseData = { uploaded: 0, error: { message: 'Upload failed' } }
          evt.sender.fire('fileUploadResponse', { fileLoader })
        })
    }
  }
}))

// 事件处理函数
const handleInput = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
}

const handleReady = (editor: any) => {
  emit('ready', editor)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}
</script>

<style scoped lang="less">
.ckeditor-wrapper {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 0px;

  :deep(.cke) {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  :deep(.cke_top) {
    background: #f5f7fa;
    border-bottom: 1px solid #dcdfe6;
  }

  :deep(.cke_bottom) {
    background: #f5f7fa;
    border-top: 1px solid #dcdfe6;
  }

  :deep(.cke_chrome) {
    border: none;
    box-shadow: none;
  }

  :deep(.cke_toolgroup) {
    border: 1px solid #dcdfe6;
    background: #fff;
  }

  :deep(.cke_button) {
    &:hover {
      background: #ecf5ff;
    }

    &.cke_button_on {
      background: #ecf5ff;
    }
  }

  :deep(.cke_combo_button) {
    border: 1px solid #dcdfe6;
    background: #fff;

    &:hover {
      background: #ecf5ff;
    }
  }

  :deep(.cke_combo_on) {
    .cke_combo_button {
      background: #ecf5ff;
    }
  }
}
</style>
