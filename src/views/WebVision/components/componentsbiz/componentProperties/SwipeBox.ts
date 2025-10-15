import type { IComponentProperty, ISetStyle } from './index'

// 轮播组件配置类型
export interface SwipeBoxConfigType {
  model: 's1' | 's2' | 's3'
  otherAttrs: { [key: string]: any }
  swipeData: any[]
  mode: string
  autoplay: number
  loop: boolean
  showIndicators: boolean
  showPagination: boolean
  touchable: boolean
  indicatorColor: string
  indicatorActiveColor: string
  vertical: boolean
  height: number
  itemWidth: string
  itemsPerView: number
  spaceBetween: number
  imageList: any[]
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<SwipeBoxConfigType>>>()

componentProperties.set('SwipeBox', {
  component: 'SwipeBox',
  text: '轮播组件',
  active: false,
  style: 'SwipeBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '轮播组件',
    componentType: 'SwipeBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      otherAttrs: {},
      swipeData: [],
      mode: 'single',
      autoplay: 3000,
      loop: true,
      showIndicators: true,
      showPagination: true,
      touchable: true,
      indicatorColor: 'rgba(255, 255, 255, 0.3)',
      indicatorActiveColor: '#1989fa',
      vertical: false,
      height: 200,
      itemWidth: '100%',
      itemsPerView: 1,
      spaceBetween: 0,
      imageList: []
    }
  }
})

export default componentProperties
