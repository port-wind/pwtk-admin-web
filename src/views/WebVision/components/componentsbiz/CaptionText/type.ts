import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<CaptionTextConfig> {}

export interface CaptionTextConfig {
  text: string
  title: string
  subtitle: string
  enable: boolean
  name: string // 标题内容
  description: string // 描述内容
  wordSize: number // 标题大小
  descriptionSize: number // 描述大小
  wordWeight: number // 标题粗细
  positions: 'left' | 'center' | 'right' // 显示位置
  descriptionWeight: number // 描述粗细
  wordColor: string // 标题颜色
  descriptionColor: string // 描述颜色
  backColor: string // 背景颜色
  borderBott: boolean // 底部分割线
  wordHeight: number // 框体高度
  more: IMoreConfig // 更多配置
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface IMoreConfig {
  show: boolean // 是否显示查看更多
  type: number // 样式选择
  text: string // 自定义文字
  httpType: number // 链接类型
  http: string // 链接
}

export interface IStyleMain {
  containerPadding: number
  backgroundColor: string
  borderRadius: number
  margin: number
  boxShadow: string
}

export interface IStyleHeader {
  backgroundColor: string
  isGradient: boolean
  headerBgColor: string
  headerBg: string
  headerBg2: string
  subTitleColor: string
  titleColor: string
}