import type { IComponentProperty, ISetStyle } from './index'

// 广告大全组件配置类型
export interface WebAdBoxConfigType {
  title: string
  columns: number
  total: number
  gridAttr: {
    clickable: boolean
  }
  tabsData: Array<{
    gameTypeCode: string
  }>
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<WebAdBoxConfigType>>>()

componentProperties.set('WebAdBox', {
  component: 'WebAdBox',
  text: '广告大全',
  active: false,
  style: 'WebAdBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '广告大全模块',
    componentType: 'WebAdBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '精选推荐',
      columns: 3,
      total: 12,
      gridAttr: {
        clickable: true
      },
      tabsData: [
        {
          gameTypeCode: ''
        }
      ]
    }
  }
})

export default componentProperties
