import type { IComponentProperty, ISetStyle } from './index'

// 商品组件配置类型
export interface ListswitchingConfigType {
  text: string
  commodityType: number
  moditystyle: number
  borderRadius: number
  pageMargin: number
  commodityMargin: number
  textWeight: number
  positions: string
  priceofcommodity: boolean
  purchasebutton: boolean
  commoditycorner: boolean
  purchasebuttonType: number
  commoditycornertype: number
  commodityTagColor: string
  tagPosition: number
  imageList: any[]
  purchase: string
  commoditylisttype: number
  commoditylisttypetab: Array<{
    text: string
    imageList: any[]
  }>
  tabColor: string
  showMore: boolean
  moreUrl: any
  bgImg: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<ListswitchingConfigType>>>()

componentProperties.set('Listswitching', {
  component: 'Listswitching',
  text: '商品',
  active: false,
  style: 'ListswitchingStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '商品',
    componentType: 'Listswitching',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '商品',
      commodityType: 0,
      moditystyle: 0,
      borderRadius: 0,
      pageMargin: 15,
      commodityMargin: 10,
      textWeight: 400,
      positions: 'left',
      priceofcommodity: true,
      purchasebutton: true,
      commoditycorner: true,
      purchasebuttonType: 0,
      commoditycornertype: 0,
      commodityTagColor: '#07c160',
      tagPosition: 0,
      imageList: [],
      purchase: '马上抢',
      commoditylisttype: 0,
      commoditylisttypetab: [
        {
          text: '分组',
          imageList: []
        },
        {
          text: '分组',
          imageList: []
        }
      ],
      tabColor: '#f39800',
      showMore: false,
      moreUrl: null,
      bgImg: ''
    }
  }
})

export default componentProperties
