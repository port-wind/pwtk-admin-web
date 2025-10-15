import type { IComponentProperty, ISetStyle } from './index'

// 图文导航组件配置类型
export interface GraphicnavigationConfigType {
  text: string
  imageList: any[] // 图片导航列表
  navigationType: number // 图片导航类型
  imgStyle: number // 图片样式
  backgroundColor: string // 背景颜色
  textColor: string // 文字颜色
  borderRadius: number // 图片倒角
  showSize: number // 一屏显示个数
  textHeight: number // 字体高度
  textSize: number // 字体大小
  bgImg: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<GraphicnavigationConfigType>>>()

componentProperties.set('graphicnavigation', {
  component: 'graphicnavigation',
  text: '图文导航',
  active: false,
  style: 'graphicnavigationstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '图文导航',
    componentType: 'graphicnavigation',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '图文导航',
      imageList: [],
      navigationType: 0,
      imgStyle: 0,
      backgroundColor: 'rgb(255, 255, 255)',
      textColor: 'rgb(0, 0, 0)',
      borderRadius: 0,
      showSize: 5,
      textHeight: 24,
      textSize: 12,
      bgImg: ''
    }
  }
})

export default componentProperties
