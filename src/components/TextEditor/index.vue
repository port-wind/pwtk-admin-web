<template>
  <div class="wangeditor-text-editor-border">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
    <Editor
      :class="editorClass"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import { shallowRef, ref, onBeforeUnmount, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IToolbarConfig } from '@wangeditor/editor'
import { defaultToolbarKeys, simpleToolbarKeys } from './constant'

interface IProps {
  modelValue: string | undefined
  placeholder: string
  mode?: string
}

const props = withDefaults(defineProps<IProps>(), {
  mode: 'default'
})

const emits = defineEmits(['update:modelValue', 'update:text'])
const editorRef = shallowRef<any>(null)

// 使用 ref 替代 computed
const valueHtml = ref('&nbsp;')

// 初始化和更新 valueHtml 的逻辑
// const updateValueHtml = (value: string) => {
//   const reg = /^<span\b[^>]*>.*<\/span>$/
//   // https://github.com/wangeditor-team/wangEditor/issues/5635
//   // wangeditor 工具issue 处理
//   if (reg.test(value)) {
//     valueHtml.value = '<p>' + value + '</p>'
//   } else {
//     valueHtml.value = value
//   }
// }

// 初始设置 valueHtml
// updateValueHtml(props.modelValue)

const isEdit = ref(false)
const editorClass = computed(() => ({
  'editor-area': true, // 固定类名
  'show-place-holder': isEdit.value // 当 valueHtml 不为空时，添加 isEdit 类
}))

// 处理换行符转换的工具函数
const convertNewlinesToParagraphs = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return text
  }

  // 检查是否包含 \n 字符
  if (!text.includes('\n')) {
    return text
  }

  // 检查是否已经是 HTML 格式（包含标签）
  const isHtml = /<[^>]+>/.test(text)

  if (isHtml) {
    // 如果是 HTML 格式，需要提取内容并重新组织
    // 先移除外层的 span 标签，提取样式
    const spanMatch = text.match(/^<span[^>]*style="([^"]*)"[^>]*>(.*)<\/span>$/s)
    if (spanMatch) {
      const style = spanMatch[1]
      const content = spanMatch[2]

      // 将内容按 \n 分割成段落
      const lines = content.split('\n').filter((line) => line.trim() !== '')

      // 为每一行创建一个段落，保持原有样式
      const paragraphs = lines.map((line) => `<p><span style="${style}">${line.trim()}</span></p>`).join('')

      return paragraphs
    }
  }

  // 如果不是 HTML 格式，直接将每行转换为段落
  const lines = text.split('\n').filter((line) => line.trim() !== '')
  return lines.map((line) => `<p>${line.trim()}</p>`).join('')
}

watch(
  () => props.modelValue,
  (newVal) => {
    valueHtml.value = convertNewlinesToParagraphs(newVal)
  },
  {
    immediate: true
  }
)

// default tools
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: defaultToolbarKeys
}

if (props.mode == 'simple') {
  toolbarConfig.toolbarKeys = simpleToolbarKeys
} else if (props.mode == 'default') {
  toolbarConfig.toolbarKeys = defaultToolbarKeys
}

const editorConfig: Record<string, any> = { placeholder: props.placeholder || '请输入正文' }

// 销毁时销毁编辑器实例
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})

// 回调函数
const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例
}

// const toolbar = DomEditor.getToolbar(editor) 查看toolbar 内容
const handleChange = (editor: any) => {
  isEdit.value = editor.getText() === '' ? true : false
  emits('update:modelValue', editor.getText())
  emits('update:text', editor.getText())
}

const handleDestroyed = (editor: any) => {
  // console.log('destroyed', editor)
}
</script>

<style lang="less">
.wangeditor-text-editor-border.w-e-full-screen-container {
  z-index: 10;
  border: none;
  position: fixed;
}

.wangeditor-text-editor-border {
  border: 1px solid #c9d8db;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 240px;
  position: relative;
}

.w-e-text-container {
}

.w-e-text-container .w-e-scroll {
  position: relative;
}

.show-place-holder .w-e-scroll::before {
  content: '请输入正文...';
  position: absolute;
  left: 10px;
  top: 1px;
  line-height: 21px;
  color: var(--w-e-textarea-slight-color);
  pointer-events: none;
  user-select: none;
  font-style: italic;
}

.wangeditor-text-editor-border .editor-area {
  flex: 1;
  overflow: auto;
}

// 去掉默认的
.w-e-text-placeholder {
  display: none !important;
}

.w-e-text-container [data-slate-editor] p {
  margin: 0;
}
</style>
