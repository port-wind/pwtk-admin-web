import type { IComponentProperty, ISetStyle } from './index'

// 关注公众号组件配置类型
export interface FollowConfigType {
  text: string
  title: string
  model: string
  jsonData: any[]
  postIdData: any[]
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<FollowConfigType>>>()

componentProperties.set('follow', {
  component: 'follow',
  text: '关注公众号',
  active: false,
  style: 'followStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '关注公众号',
    componentType: 'follow',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '关注公众号',
      title: '关注公众号',
      model: 's1',
      jsonData: [],
      postIdData: []
    }
  }
})

export default componentProperties
