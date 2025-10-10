import type { IComponentProperty, ISetStyle } from './index'

// 底部导航组件配置类型
export interface TabbarConfigType {
  text: string
  activeColor: string
  inactiveColor: string
  isShowBorder: boolean
  iconWidth: string
  iconHeight: string
  fontSize: string
  Highlight: number
  iconList: any[]
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<TabbarConfigType>>>()

componentProperties.set('tabbar', {
  component: 'tabbar',
  text: '底部导航',
  active: false,
  style: 'tabbarstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '底部导航',
    componentType: 'tabbar',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '底部导航',
      activeColor: '#1989fa',
      inactiveColor: '#7d7e80',
      isShowBorder: true,
      iconWidth: '25',
      iconHeight: '25',
      fontSize: '14',
      Highlight: 0,
      iconList: []
    }
  }
})

export default componentProperties
