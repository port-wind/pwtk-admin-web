import type { MyTestComponentConfig } from '../MyTestComponent/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<MyTestComponentConfig>>>()

componentProperties.set('MyTestComponent', {
  component: 'MyTestComponent',           // 中间预览组件名称
  text: '测试组件',                 // 左侧显示名称
  active: false,                    // 是否可编辑
  style: 'MyTestComponentStyle',          // 右侧配置组件名称
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '测试组件',
    componentType: 'MyTestComponent',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '自定义测试组件',
    pageCode: '',
    configParamJson: {
      backgroundColor: '#f5f5f5',    // 默认浅灰色背景
      text: '这是一个测试组件组件',               // 默认显示文本
      textColor: '#333333',          // 默认文字颜色
      textAlign: 'center',           // 默认居中对齐
      padding: 16,                   // 默认内边距
      minHeight: 100,                // 默认最小高度
      borderRadius: 0,               // 默认无圆角
      fontSize: 14,                  // 默认字体大小
      fontWeight: 400                // 默认字体粗细
    }
  }
})

export default componentProperties