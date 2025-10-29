<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      ></Toolbar>
      999
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="modelValue"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
      />
    </div>
    <div style="margin-top: 10px">
      <textarea v-model="modelValue" readonly style="width: 100%; height: 200px; outline: none"></textarea>
    </div>

    <!-- HTML编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑HTML"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-input v-model="editingHtml" type="textarea" :rows="10" placeholder="请输入HTML内容" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateHtml">更新</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import { Boot } from '@wangeditor/editor'
import { onBeforeUnmount, ref, shallowRef, onMounted, defineComponent } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { webVisionToolbarKeys } from '../TextEditor/constant'
import { ElMessage } from 'element-plus'

// 自定义源代码编辑按钮
class SourceCodeButton {
  constructor() {
    this.title = '编辑源代码'
    this.tag = 'button'
    this.iconSvg =
      '<svg t="1753247465250" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2341" width="200" height="200"><path d="M434.12811 654.18527l-16.884181 16.884181c-4.707105 4.707105-12.279404 4.707105-16.884181 0l-118.496253-118.496253c-4.707105-4.707105-4.707105-12.279404 0-16.884181l118.496253-118.496253c4.707105-4.707105 12.279404-4.707105 16.884181 0l16.884181 16.884181c4.707105 4.707105 4.707105 12.279404 0 16.884181l-93.118817 93.118817 93.118817 93.118817C438.835215 642.008194 438.835215 649.580494 434.12811 654.18527zM473.115219 744.848206l-21.591286-6.037374c-5.935045-1.637254-9.618867-7.572299-8.18627-13.20036l96.188668-369.917058c1.534926-5.730389 7.981613-9.004897 14.325972-7.265314l23.126212 6.242031c6.344359 1.739582 10.335165 7.776956 8.80024 13.507345l-99.258519 369.610073C485.087639 743.313281 479.050265 746.48546 473.115219 744.848206zM749.401819 552.675527l-118.496253 118.496253c-4.707105 4.707105-12.279404 4.707105-16.884181 0l-16.884181-16.884181c-4.707105-4.707105-4.707105-12.279404 0-16.884181l93.118817-93.118817-93.118817-93.118817c-4.707105-4.707105-4.707105-12.279404 0-16.884181l16.884181-16.884181c4.707105-4.707105 12.279404-4.707105 16.884181 0l118.496253 118.496253C754.006595 540.396123 754.006595 547.968422 749.401819 552.675527zM823.794544 919.522734l-628.500849 0 0-814.533826 455.668232 0 0 128.012791c0 16.065554 14.121315 29.061257 31.41481 29.061257L823.794544 262.062956 823.794544 919.522734 823.794544 919.522734zM722.080144 145.203957l59.759768 58.634156-59.759768 0L722.080144 145.203957zM886.624163 231.364445c0-0.102328 0-0.102328 0-0.204657 0-0.61397-0.102328-1.22794-0.204657-1.841911 0-0.102328 0-0.204657 0-0.306985-0.409313-2.865194-1.22794-5.525732-2.455881-7.981613l0 0c-0.61397-1.22794-1.330269-2.455881-2.046567-3.581493-0.102328-0.102328-0.204657-0.204657-0.204657-0.409313-0.306985-0.511642-0.716299-0.920955-1.023284-1.432597-0.102328-0.204657-0.306985-0.306985-0.409313-0.511642-0.306985-0.306985-0.511642-0.61397-0.818627-1.023284-0.204657-0.204657-0.409313-0.511642-0.61397-0.716299-0.204657-0.204657-0.409313-0.409313-0.61397-0.61397-0.204657-0.204657-0.409313-0.409313-0.716299-0.716299l-171.40002-156.767063c-4.809433-4.604777-11.358449-7.674628-18.521435-8.493255 0 0 0 0-0.102328 0-0.716299-0.102328-1.432597-0.102328-2.148896-0.204657-0.204657 0-0.306985 0-0.511642 0-0.306985 0-0.61397 0-1.023284 0l-515.223344 0c-17.293495 0-31.210153 12.995703-31.210153 29.061257l0 872.758669c0 16.065554 14.018987 29.061257 31.210153 29.061257l686.82802 0c17.293495 0 31.210153-12.995703 31.210153-29.061257l0-715.684621C886.624163 232.490057 886.624163 231.876087 886.624163 231.364445z" fill="#272636" p-id="2342"></path></svg>'
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor) {
    return ' 1 '
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor) {
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor) {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor, value) {
    if (this.isDisabled(editor)) return
    // 触发HTML编辑对话框
    if (window.$wangEditor && window.$wangEditor.openHtmlDialog) {
      window.$wangEditor.openHtmlDialog()
    }
  }
}

// 自定义源代码编辑按钮
class ClearCodeButton {
  constructor() {
    this.title = '清空内容'
    this.tag = 'button'
    this.iconSvg =
      '<svg t="1753842771847" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2774" width="200" height="200"><path d="M734.464 390.506667c-13.589333 0-25.557333 11.008-25.557333 24.597333v368.277333a24.469333 24.469333 0 0 1-24.768 24.32h-344.533334a24.682667 24.682667 0 0 1-24.96-24.32v-369.28c0-13.589333-9.962667-24.597333-23.594666-24.597333-13.610667 0-23.573333 11.008-23.573334 24.597333v369.322667c0 40.64 31.36 76.16 72 76.16h344.362667c40.618667 0 75.968-35.477333 75.968-76.16V415.104c0.128-13.44-11.818667-24.597333-25.344-24.597333zM460.629333 685.098667V414.464c0-13.653333-9.962667-24.618667-23.573333-24.618667-13.589333 0-23.594667 10.965333-23.594667 24.618667v270.464c0 13.653333 9.962667 24.597333 23.552 24.597333 13.610667 0 23.616-10.816 23.616-24.426666z m149.397334 0V414.464c0-13.653333-12.16-24.618667-25.557334-24.618667-13.482667 0-25.557333 10.965333-25.557333 24.618667v270.464c0 13.653333 12.074667 24.597333 25.557333 24.597333 13.333333 0 25.557333-10.816 25.557334-24.426666z m218.090666-392.576H708.906667v-50.069334c0-40.64-33.258667-71.466667-73.493334-71.466666l-246.741333-0.192c-40.618667 0-74.026667 30.805333-74.026667 71.466666v50.261334H195.52c-13.589333 0-24.64 9.962667-24.64 23.552 0 13.610667 11.008 23.573333 24.64 23.573333h632.597333c13.568 0 24.618667-9.962667 24.618667-23.573333 0-13.589333-11.093333-23.552-24.618667-23.552z m-170.581333 0h-295.04v-50.069334c0-13.610667 12.757333-24.469333 26.346667-24.469333h246.570666c13.461333 0 22.442667 10.645333 22.442667 24.469333l-0.32 50.069334z" fill="#333333" p-id="2775"></path></svg>'
  }

  getValue(editor) {
    return ''
  }

  isActive(editor) {
    return true
  }

  isDisabled(editor) {
    return false
  }

  exec(editor, value) {
    if (this.isDisabled(editor)) return
    // 调用全局方法清空内容
    if (window.$wangEditor && window.$wangEditor.handleClearContent) {
      window.$wangEditor.handleClearContent()
    }
  }
}

// 注册自定义按钮
const sourceCodeButtonConf = {
  key: 'sourceCodeButton',
  factory() {
    return new SourceCodeButton()
  }
}

const clearCodeButtonConf = {
  key: 'clearCodeButton',
  factory() {
    return new ClearCodeButton()
  }
}

Boot.registerMenu(sourceCodeButtonConf)
Boot.registerMenu(clearCodeButtonConf)

export default defineComponent({
  name: 'WangEditor',
  components: {
    Editor,
    Toolbar
  },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'clearContent'],
  setup(props, { emit }) {
    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef()

    // 对话框相关状态
    const dialogVisible = ref(false)
    const editingHtml = ref('')

    // 编辑器配置
    const mode = 'default'
    const toolbarConfig = {
      toolbarKeys: [
        ...webVisionToolbarKeys,
        'sourceCodeButton', // 添加自定义按钮
        'clearCodeButton' // 添加自定义按钮
      ]
    }
    const editorConfig = { placeholder: '请输入内容...' }

    onMounted(() => {
      window.$wangEditor = {
        // 将openHtmlDialog方法暴露给全局，供自定义按钮调用
        openHtmlDialog: () => {
          const editor = editorRef.value
          if (editor == null) {
            ElMessage.warning('编辑器未初始化')
            return
          }
          editingHtml.value = editor.getHtml()
          dialogVisible.value = true
        },
        // 将handleClearContent方法暴露给全局，供自定义按钮调用
        handleClearContent: () => {
          emit('clearContent')
        }
      }
    })

    // 组件卸载时清理全局变量
    onBeforeUnmount(() => {
      if (window.$wangEditor) {
        window.$wangEditor = null
      }
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    // 更新HTML内容
    const updateHtml = () => {
      const editor = editorRef.value
      if (editor == null) {
        ElMessage.warning('编辑器未初始化')
        return
      }
      try {
        editor.setHtml(editingHtml.value)
        dialogVisible.value = false
        ElMessage.success('更新成功')
      } catch (error) {
        ElMessage.error('HTML格式错误，请检查后重试')
      }
    }

    // 编辑器回调函数
    const handleCreated = (editor) => {
      console.log('created', editor)
      editorRef.value = editor
    }

    const handleChange = (editor) => {
      emit('update:modelValue', editor.getHtml())
    }

    const handleDestroyed = (editor) => {
      // console.log('destroyed', editor)
    }

    const handleFocus = (editor) => {
      console.log('focus', editor)
    }

    const handleBlur = (editor) => {
      console.log('blur', editor)
    }

    const customAlert = (info, type) => {
      alert(`【自定义提示】${type} - ${info}`)
    }

    const insertText = () => {
      const editor = editorRef.value
      if (editor == null) return
      editor.insertText('hello world')
    }

    const printHtml = () => {
      const editor = editorRef.value
      if (editor == null) return
      console.log(editor.getHtml())
    }

    const disable = () => {
      const editor = editorRef.value
      if (editor == null) return
      editor.disable()
    }

    return {
      editorRef,
      dialogVisible,
      editingHtml,
      mode,
      toolbarConfig,
      editorConfig,
      updateHtml,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      insertText,
      printHtml,
      disable,
      modelValue: props.modelValue
    }
  }
})
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
