import type { IComponentProperty, ISetStyle } from './index'

// 广告大全-翻页组件配置类型
export interface WebAdMoreBoxConfigType {
  model: string
  title: string
  pageSize: number
  showPagination: boolean
  adType: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<WebAdMoreBoxConfigType>>>()

componentProperties.set('WebAdMoreBox', {
  component: 'WebAdMoreBox',
  text: '广告大全-翻页',
  active: false,
  style: 'WebAdMoreBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '广告大全翻页模块',
    componentType: 'WebAdMoreBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      title: '广告大全',
      pageSize: 6,
      showPagination: true,
      adType: 'banner'
    }
  }
})

export default componentProperties
