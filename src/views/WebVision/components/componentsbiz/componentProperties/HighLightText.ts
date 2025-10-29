import type { HighLightTextConfig } from '../HighLightText/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<HighLightTextConfig>>>()

componentProperties.set('HighLightText', {
  component: 'HighLightText',
  text: '高亮文本',
  active: false,
  style: 'HighLightTextStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '高亮文本',
    componentType: 'HighLightText',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '支持多种高亮样式的文本组件',
    pageCode: '',
    configParamJson: {
      text: '<p>记住域名 <span style="color: rgb(255, 0, 0);">71</span><span style="color: rgb(0, 0, 255);">75</span><span style="color: rgb(0, 255, 0);">.com</span> 永不失联！</p>',
      page: 1,
      size: 10,
      gameType: '2032',
      forumId: '',
      isAll: 'y',
      issueGroup: 1
    }
  }
})

export default componentProperties
