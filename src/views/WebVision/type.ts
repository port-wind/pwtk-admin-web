import type { UploadUserFile } from 'element-plus'

// 定义 PageSetup 接口
export interface PageSetup {
  name: string
  details?: string
  isPerson?: boolean
  isBack?: boolean
  titleHeight?: number
  bgColor?: string
  bgImg?: string
  configParamJson?: any
  [key: string]: any
}
export interface PageComponent {
  active?: boolean
  type: number
  component: string
  componentId?: string
  componentRef?: string
  componentType?: string
  configParamJson?: string
  templateId?: string
  websiteId?: string
  setStyle?: ComponentStyle
  pageRenderingSeq?: number
  style?: string
  text?: string
  selected?: boolean
}

// 定义 Data 接口，包含页面ID、页面设置和页面组件
export interface Data {
  id: number | null
  pageSetup: PageSetup
  demo?: string
  pageComponents: PageComponent[]
}
export interface Choose {
  deleShow: boolean
  index: number
  /**
   * 模版 template
   * 站点 website,
   * 排列 list,
   * 详情 detail
   */
  tab: string
  currCompName: string // 组件名称
  rightcom: string // 组件名称
  currentproperties: unknown
  offsetY: number
  onlyOne: string[]
  pointer: { show: boolean }
}
export interface ComponentStyle {
  componentType: string
  componentId: string
  componentName: string
  configParamJson: string // 或者更具体的类型
  componentSort?: number
  pageCode?: string
  disabled?: boolean
  isView: 'y' | 'n'
  memo?: string
  status?: 'y' | 'n'
  templateId?: string
}

export interface JSONComponentStyle {
  componentType: string
  componentId: string
  websiteId?: string
  templateId?: string
  componentName: string
  configParamJson: string // 或者更具体的类型
  pageCode?: string
  disabled?: boolean
  isView: 'y' | 'n'
}

//setStyle 的公共部分提取

interface webSiteBaseComponent {
  originalComponentId: string //组件ID
  component: string //组件名称
  text: string //组件名称
  type: string //组件类型（内部用）
  active: boolean //是否选中
  style: string //组件右边显示的样式
  websiteId: string
}
export interface webSiteStyle {
  componentId: string
  websiteId: string
  componentName: string
  componentType: string
  configParamJson: any // 或者更具体的类型
  pageCode?: string
  memo?: string
  disabled?: boolean
  isView: 'y' | 'n'
}

export interface GameResultStyle extends webSiteStyle {
  model: 's1' | 's2' | 's3'
  isHistory: boolean
  isNextIssue: boolean
  isIssue: boolean
  isIcon: boolean
  isLongName: boolean
  showArray: Array<'2032' | '1' | '84' | '3995' | '5'>
}

export interface customBarAdStyle extends webSiteStyle {
  model: 's1' | 's2' | 's3'
  itemData: Array<{
    [key: string]: any
  }>
}

export interface WebAdMoreStyle extends webSiteStyle {
  model: 's1'
}

export interface WebAdStyle extends webSiteStyle {
  model: 's1'
  title: string
  columns: number
  total: number
  gridAttr: {
    [key: string]: any
  }
}

export interface navBBSListBoxStyle extends webSiteStyle {
  model: 's1'
  pageSize: number
  title: string
  bbsId?: string
  forumId?: string
  mainBoardId?: string
  postId?: string
  id?: string
  titleBg?: string
  contentBgImg?: string
}

// adBarStyle
export interface adBarStyle extends webSiteStyle {
  model: 's1'
  total: number
  adData: adBarList[]
}
interface adBarList {
  index: number
  img: string
  link: string
  name: string
}

//swipeStyle
export interface swipeStyleForm {
  componentName: string
  pageCode?: string
  model: 's1' | 's2' | 's3'
  otherAttrs?: {
    [key: string]: any
  }
  groupSize: number
  total: number
  swipeData: swiperItem[]
}
interface swiperItem {
  image?: string
  link?: string
  alt?: string
  name?: string
  content?: string
  index?: number
  uploadList: UploadUserFile[]
}

export interface IDatas {
  page: PageData
  pageComponents: ComponentItem[]
}

export interface PageData {
  name?: string
  details?: string
  bgImg?: string
  [key: string]: any
}

export type EType_SetStuyle =
  | 'componentId'
  | 'sketchCodeList'
  | 'templateId'
  | 'pageRenderingSeq'
  | 'websiteId'
  | 'componentRef'
  | 'componentName'
  | 'componentType'
  | 'componentSort'
  | 'status'
  | 'isView'
  | 'memo'
  | 'pageCode'
  | 'configParamJson'

export interface ComponentItem {
  component: string
  text?: string
  active?: boolean
  style?: string
  setStyle?: Record<EType_SetStuyle, any>
  [key: string]: any
}

export interface ChooseData {
  pointer: { show: boolean }
  index: number
  offsetY: number
  rightcom: string
  setStyle: Record<string, any>
}

export enum ETab {
  /**
   * 页面其他信息 配置栏
   */
  page,
  /**
   * 组件排序栏
   */
  list,
  /**
   * 组件详情，配置栏
   */
  detail
}
