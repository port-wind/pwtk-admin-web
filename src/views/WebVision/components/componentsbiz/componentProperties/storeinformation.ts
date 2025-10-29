import type { IComponentProperty, ISetStyle } from './index'

// 店铺信息组件配置类型
export interface StoreinformationConfigType {
  text: string
  bakcgroundImg: string // 背景图片
  headPortrait: string // 店铺头像
  rubiksCubeType: number // 类型
  name: string // 店铺名称
  Discount: string // 优惠信息
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<StoreinformationConfigType>>>()

componentProperties.set('storeinformation', {
  component: 'storeinformation',
  text: '店铺信息',
  active: false,
  style: 'storeinformationstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '店铺信息',
    componentType: 'storeinformation',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '店铺信息',
      bakcgroundImg: '',
      headPortrait: '',
      rubiksCubeType: 0,
      name: '店铺名称',
      Discount: '在线支付满150减30，满100减20'
    }
  }
})

export default componentProperties
