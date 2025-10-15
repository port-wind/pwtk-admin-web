import type { IComponentProperty, ISetStyle } from './index'
import type { IRichtext } from '../richtext/type'

// 富文本组件配置类型
const componentProperties = new Map<String, IComponentProperty<ISetStyle<IRichtext>>>()

componentProperties.set('richtext', {
  component: 'richtext',
  text: '富文本',
  active: false,
  style: 'richtextStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '富文本',
    componentType: 'richtext',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      backColor: 'rgb(249, 249, 249)',
      myValue: []
    }
  }
})

export default componentProperties
