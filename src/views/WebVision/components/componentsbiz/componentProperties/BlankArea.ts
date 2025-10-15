import type { BlankAreaConfig } from '../BlankArea/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<BlankAreaConfig>>>()

componentProperties.set('BlankArea', {
  component: 'BlankArea', // 中间预览组件名称
  text: '空白区域', // 左侧显示名称
  active: false, // 是否可编辑
  style: 'BlankAreaStyle', // 右侧配置组件名称
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '空白区域',
    componentType: 'BlankArea',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '可自定义背景颜色和文本的空白区域组件',
    pageCode: '',
    configParamJson: {
      backgroundColor: '#f5f5f5', // 默认浅灰色背景
      text: '请输入文本内容', // 默认提示文本
      textColor: '#333333', // 默认文字颜色
      textAlign: 'center', // 默认居中对齐
      padding: 20, // 默认内边距
      minHeight: 100, // 默认最小高度
      borderRadius: 4, // 默认圆角
      fontSize: 14, // 默认字体大小
      fontWeight: 400 // 默认字体粗细
    }
  }
})

export default componentProperties
