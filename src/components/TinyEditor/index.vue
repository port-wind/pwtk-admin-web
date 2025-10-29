<template>
  <div class="tinymce-wrapper">
    <textarea :id="id"></textarea>
  </div>
</template>

<script setup lang="ts">
import { uploadSingle } from '@/api/system/upload'
import type { FileUploadRequest } from '@/api/system/upload/types'
import { onMounted, onBeforeUnmount, watch } from 'vue'
const isDev = location.origin.includes('http://localhost')

interface Props {
  modelValue: string
  height?: number
  mergetagsList?: Array<{
    title?: string
    value?: string
    menu?: Array<{
      title?: string
      value: string
    }>
  }>
}

const { VITE_STORY_TYPE, VITE_CDN_URL, VITE_STORAGE_BUCKET } = webConfigApi

const props = withDefaults(defineProps<Props>(), {
  height: 500
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const id = `tinymce-${Date.now()}`

const getEditor = () => {
  // @ts-ignore
  return tinymce.get(id)
}

onMounted(() => {
  // @ts-ignore
  tinymce.init({
    selector: `textarea#${id}`,
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion',
    height: props.height,
    autosave_restore_when_empty: false,
    skin: 'oxide',
    content_css: 'default',
    editimage_cors_hosts: ['picsum.photos'],
    menubar: false, // 'file edit view insert format tools table help', // 启用顶部菜单栏
    toolbar: [
      // 第一行工具栏
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
      'align numlist bullist | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | save print | pagebreak anchor | ltr rtl',
      // 第二行工具栏
      (props.mergetagsList && props.mergetagsList.length > 0 ? 'customMergeTags | ' : '') +
        'customStyleDiv | code preview | link image media table codesample | searchreplace | visualblocks pagebreak'
    ],
    // 扩展配置
    fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 26px 28px 30px 32px 36px 48px 56px 72px',
    font_formats:
      '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;' +
      '苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;' +
      '宋体=simsun,serif;' +
      '仿宋体=FangSong,serif;' +
      '黑体=SimHei,sans-serif;' +
      'Arial=arial,helvetica,sans-serif;' +
      'Arial Black=arial black,avant garde;' +
      'Times New Roman=times new roman,times;',
    branding: false,
    promotion: false,
    base_url: isDev ? '/tinymce' : '/admin/tinymce',
    license_key: 'gpl',
    // 图片上传配置
    images_upload_handler: async (blobInfo, progress) => {
      try {
        // 创建一个 File 对象
        const file = new File([blobInfo.blob()], blobInfo.filename(), {
          type: blobInfo.blob().type
        })

        // 构建上传数据
        const uploadData: FileUploadRequest = {
          uploadTarget: blobInfo.filename(),
          file: file,
          storageType: VITE_STORY_TYPE,
          env: VITE_STORAGE_BUCKET,
          fileType: 'img',
          uploadFrom: 'bbs/icon',
          storageStyle: 6
        }

        // 配置请求选项
        const requestOptions = {
          baseurl: 'https://upload.pwtk.cc',
          contenttype: 'multipart/form-data'
        }

        // 调用上传接口
        const response = await uploadSingle(uploadData, requestOptions)

        // 返回图片URL
        if (response.success && response.data) {
          // 需要转换为: https://stt.pwtk.cc/devmedia/bbs/mainboard/icon/xxx.jpg
          const imagePath = response.data.path
          // 构建完整的图片 URL
          const imageUrl = `${VITE_CDN_URL}${imagePath}`
          return imageUrl
        } else {
          throw new Error('上传失败')
        }
      } catch (error) {
        throw new Error('图片上传失败')
      }
    },
    // 扩展配置
    extended_valid_elements: 'span[*]', // 允许span标签的所有属性
    paste_data_images: false, // 允许粘贴图片
    paste_as_text: false, // 允许粘贴格式
    browser_spellcheck: true, // 启用浏览器拼写检查
    contextmenu: 'link image table editStyleDiv', // 右键菜单
    setup: (editor) => {
      // 样式编辑对话框函数
      const openStyleDialog = (isEdit = false) => {
        const selectedNode = editor.selection.getNode()
        const selectedContent = editor.selection.getContent()

        // 初始化数据
        let initialData = {
          backgroundType: 'solid', // 'solid' 或 'gradient'
          backgroundColor: '#f0f0f0',
          gradientType: 'linear', // 'linear' 或 'radial'
          gradientAngle: '45',
          gradientColor1: '#667eea',
          gradientColor2: '#764ba2',
          gradientColor3: '',
          textColor: '#333333',
          borderRadius: '8',
          padding: '15px 20px',
          margin: '0px 0px'
        }

        // 如果是编辑模式，解析现有样式
        if (isEdit && selectedNode && selectedNode.style) {
          const style = selectedNode.style
          const computedStyle = window.getComputedStyle(selectedNode)

          // 解析背景
          if (style.background && style.background.includes('gradient')) {
            initialData.backgroundType = 'gradient'
            // 尝试解析渐变参数
            const gradientMatch = style.background.match(/(linear|radial)-gradient\(([^)]+)\)/)
            if (gradientMatch) {
              initialData.gradientType = gradientMatch[1]
              // 这里可以进一步解析渐变参数，但为了简化，暂时保持默认值
            }
          } else if (style.backgroundColor) {
            initialData.backgroundColor = style.backgroundColor
            initialData.backgroundType = 'solid'
          } else if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            initialData.backgroundColor = computedStyle.backgroundColor
            initialData.backgroundType = 'solid'
          }

          // 解析其他样式
          if (style.color) initialData.textColor = style.color
          if (style.borderRadius) initialData.borderRadius = style.borderRadius.replace('px', '')
          if (style.padding) initialData.padding = style.padding
          if (style.margin) initialData.margin = style.margin
        }

        // 打开对话框
        editor.windowManager.open({
          title: '设置容器样式',
          body: {
            type: 'panel',
            items: [
              {
                type: 'selectbox',
                name: 'backgroundType',
                label: '背景类型',
                items: [
                  { text: '纯色', value: 'solid' },
                  { text: '渐变', value: 'gradient' }
                ]
              },
              {
                type: 'colorinput',
                name: 'backgroundColor',
                label: '背景颜色 (仅纯色模式)'
              },
              {
                type: 'selectbox',
                name: 'gradientType',
                label: '渐变类型 (仅渐变模式)',
                items: [
                  { text: '线性渐变', value: 'linear' },
                  { text: '径向渐变', value: 'radial' }
                ]
              },
              {
                type: 'input',
                name: 'gradientAngle',
                label: '渐变角度 (仅线性渐变)',
                placeholder: '0-360度'
              },
              // 渐变颜色
              {
                type: 'colorinput',
                name: 'gradientColor1',
                label: '渐变颜色 1 (起始 0%)'
              },
              {
                type: 'colorinput',
                name: 'gradientColor2',
                label: '渐变颜色 2 (结束 100%)'
              },
              {
                type: 'colorinput',
                name: 'gradientColor3',
                label: '渐变颜色 3 (中间 50% 可选)'
              },
              {
                type: 'colorinput',
                name: 'textColor',
                label: '文字颜色'
              },
              {
                type: 'input',
                name: 'borderRadius',
                label: '圆角 (px)',
                placeholder: '例: 8'
              },
              {
                type: 'input',
                name: 'padding',
                label: '内边距',
                placeholder: '例: 10px 20px'
              },
              {
                type: 'input',
                name: 'margin',
                label: '外边距',
                placeholder: '例: 10px 0'
              }
            ]
          },
          buttons: [
            {
              type: 'cancel',
              text: '取消'
            },
            {
              type: 'submit',
              text: '确定',
              primary: true
            }
          ],
          initialData: initialData,
          onSubmit: (api) => {
            const data = api.getData()
            console.log('Dialog data:', data) // 调试信息

            // 构建样式字符串
            let styleStr = ''

            // 背景处理
            if (data.backgroundType === 'gradient') {
              // 构建渐变字符串
              const gradientColors = []

              // 收集填写的颜色并自动计算位置
              if (data.gradientColor1 && data.gradientColor2) {
                if (data.gradientColor3) {
                  // 三色渐变: 0%, 50%, 100%
                  gradientColors.push(`${data.gradientColor1} 0%`)
                  gradientColors.push(`${data.gradientColor3} 50%`)
                  gradientColors.push(`${data.gradientColor2} 100%`)
                } else {
                  // 两色渐变: 0%, 100%
                  gradientColors.push(`${data.gradientColor1} 0%`)
                  gradientColors.push(`${data.gradientColor2} 100%`)
                }
              } else if (data.gradientColor1) {
                // 如果只有一个颜色，创建到透明的渐变
                gradientColors.push(`${data.gradientColor1} 0%`)
                gradientColors.push(`${data.gradientColor1} 100%`)
              }

              if (gradientColors.length > 0) {
                if (data.gradientType === 'radial') {
                  styleStr += `background: radial-gradient(circle, ${gradientColors.join(', ')});`
                } else {
                  // 线性渐变
                  const angle = data.gradientAngle || '45'
                  styleStr += `background: linear-gradient(${angle}deg, ${gradientColors.join(', ')});`
                }
                console.log('Generated gradient style:', styleStr) // 调试信息
              }
            } else {
              // 纯色背景
              if (data.backgroundColor) {
                styleStr += `background-color: ${data.backgroundColor};`
              }
            }

            if (data.textColor) {
              styleStr += `color: ${data.textColor};`
            }

            if (data.borderRadius) {
              styleStr += `border-radius: ${data.borderRadius}px;`
            }

            if (data.padding) {
              styleStr += `padding: ${data.padding};`
            }

            if (data.margin) {
              styleStr += `margin: ${data.margin};`
            }

            // 添加一些默认样式使容器更美观
            styleStr += 'display: block; box-sizing: border-box;'

            // 处理编辑或新建
            if (isEdit && selectedNode) {
              // 编辑模式：更新现有元素的样式
              if (selectedNode.nodeName === 'DIV') {
                // 保存当前内容
                const innerHTML = selectedNode.innerHTML
                // 创建新的带样式的div
                const newDiv = `<div style="${styleStr}">${innerHTML}</div>`
                // 选中整个节点
                editor.selection.select(selectedNode)
                // 替换为新的内容
                editor.selection.setContent(newDiv)
              } else {
                // 如果不是DIV，包装成DIV
                const content = selectedNode.innerHTML || selectedNode.textContent
                const wrappedContent = `<div style="${styleStr}">${content}</div>`
                // 选中整个节点
                editor.selection.select(selectedNode)
                // 替换选中内容
                editor.selection.setContent(wrappedContent)
              }
              // 触发内容变更事件
              editor.nodeChanged()
            } else {
              // 新建模式：插入包装后的内容
              const wrappedContent = `<div style="${styleStr}">${selectedContent || '请输入内容'}</div>`

              // 如果有选中内容，替换选中内容；否则在光标处插入
              if (selectedContent) {
                editor.selection.setContent(wrappedContent)
              } else {
                editor.insertContent(wrappedContent)
              }
            }

            api.close()
          }
        })
      }

      // 注册自定义样式div按钮
      editor.ui.registry.addButton('customStyleDiv', {
        text: '样式容器',
        icon: 'embed-page',
        tooltip: '添加样式容器',
        onAction: () => {
          openStyleDialog(false)
        }
      })

      // 注册右键菜单项
      editor.ui.registry.addContextMenu('editStyleDiv', {
        update: (element) => {
          // 检查当前元素或其父元素是否有样式
          let node = element
          while (node && node !== editor.getBody()) {
            if (node.nodeType === 1 && node.hasAttribute('style')) {
              return 'editStyleDiv'
            }
            node = node.parentNode
          }
          return ''
        }
      })

      // 注册右键菜单的编辑样式项
      editor.ui.registry.addMenuItem('editStyleDiv', {
        text: '编辑元素样式',
        icon: 'edit-block',
        onAction: () => {
          openStyleDialog(true)
        }
      })

      // 只有在有合并标签数据时才注册按钮
      if (props.mergetagsList && props.mergetagsList.length > 0) {
        // 注册自定义合并标签按钮（使用菜单按钮）
        editor.ui.registry.addMenuButton('customMergeTags', {
          text: '合并标签',
          icon: 'template',
          tooltip: '插入合并标签',
          fetch: (callback) => {
            // 构建菜单项
            const buildMenuItems = (list) => {
              const items = []
              list.forEach((item) => {
                if (item.menu) {
                  // 有子菜单（一级分类）
                  // @ts-ignore
                  items.push({
                    type: 'nestedmenuitem',
                    text: item.title,
                    getSubmenuItems: () => buildMenuItems(item.menu)
                  })
                } else if (item.value && item.title) {
                  // 普通项（二级菜单项），必须同时有 tagKey（value）和 tagValue（title）
                  const displayText = `{{${item.value}}} --- ${item.title}` // 显示格式：{{tagKey}} --- tagValue
                  // @ts-ignore
                  items.push({
                    type: 'menuitem',
                    text: displayText,
                    onAction: () => {
                      const tag = `{{${item.value}}}`
                      editor.insertContent(
                        `<span class="merge-tag" contenteditable="false" data-merge-tag="${item.value}">${tag}</span>&nbsp;`
                      )
                    }
                  })
                }
                // 如果既没有 menu 也没有 value，则跳过不显示
              })
              return items
            }

            callback(buildMenuItems(props.mergetagsList))
          }
        })
      }

      // 原有的事件监听
      editor.on('input change', () => {
        const content = editor.getContent()
        emit('update:modelValue', content)
      })

      // 添加合并标签的样式
      editor.on('init', () => {
        const styleContent = `
          .merge-tag {
            background-color: #e8f4f8;
            border: 1px solid #b8d4e0;
            border-radius: 3px;
            padding: 2px 6px;
            margin: 0 2px;
            color: #0066cc;
            font-family: monospace;
            font-size: 0.9em;
            display: inline-block;
            cursor: default;
            user-select: none;
          }
          .merge-tag:hover {
            background-color: #d0e8f0;
            border-color: #90c0d8;
          }
        `

        const doc = editor.getDoc()
        const style = doc.createElement('style')
        style.textContent = styleContent
        doc.head.appendChild(style)
      })
    },
    init_instance_callback: (editor) => {
      editor.setContent(props.modelValue || '')
    }
  })
})

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    const editor = getEditor()
    if (editor && newValue !== editor.getContent()) {
      editor.setContent(newValue || '')
    }
  }
)

// 销毁编辑器
onBeforeUnmount(() => {
  const editor = getEditor()
  if (editor) {
    editor.destroy()
  }
})
</script>

<style>
.tinymce-wrapper {
  width: 100%;
}
</style>
