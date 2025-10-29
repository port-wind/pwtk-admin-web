import type { IComponentProperty, ISetStyle } from './index'

// HeaderBarBox组件配置类型
export interface HeaderBarBoxConfigType {
  backgroundColor: string
  logoSrc: string
  middleSrc: string
  backToHome: boolean
  bgImg: string
  bgColor: string
  textColor: string
  model: string
  gradient: string
  Attr: {
    sticky: boolean
    offsetTop: number
  }
  theme: {
    primary: string
    secondary: string
    gradient: string
  }
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<HeaderBarBoxConfigType>>>()

componentProperties.set('HeaderBarBox', {
  component: 'HeaderBarBox',
  text: 'HeaderBarBox',
  active: false,
  style: 'HeaderBarBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: 'Header模块',
    componentType: 'HeaderBarBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      backgroundColor: '',
      logoSrc: '',
      middleSrc: '',
      backToHome: false,
      bgImg: '',
      bgColor: '',
      textColor: '',
      model: '',
      gradient: '',
      Attr: {
        sticky: false,
        offsetTop: 0
      },
      theme: {
        primary: '',
        secondary: '',
        gradient: ''
      }
    }
  }
})

export default componentProperties
