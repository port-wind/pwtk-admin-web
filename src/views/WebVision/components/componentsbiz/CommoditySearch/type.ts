import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<CommoditySearchConfig> {}

export interface CommoditySearchConfig {
  text: string
  title: string
  subtitle: string
  enable: boolean
  heights: number // 搜索栏高度
  position: number // 显示位置
  sweep: boolean // 显示扫一扫
  borderRadius: number // 框体样式
  textPosition: number // 文本位置
  backgroundColor: string // 背景颜色
  borderColor: string // 框体颜色
  textColor: string // 字体颜色
  hotwords: IHotword[] // 热词列表
  searchStyle: ISearchStyle
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface IHotword {
  id: string
  text: string
  enabled: boolean
  order: number
}

export interface ISearchStyle {
  showIcon: boolean // 显示搜索图标
  iconColor: string // 图标颜色
  placeholder: string // 占位文本
  placeholderColor: string // 占位文本颜色
  inputBackground: string // 输入框背景
  inputBorderColor: string // 输入框边框颜色
  inputBorderWidth: number // 输入框边框宽度
  inputHeight: number // 输入框高度
  inputPadding: number // 输入框内边距
  showScanButton: boolean // 显示扫描按钮
  scanButtonText: string // 扫描按钮文字
  scanButtonColor: string // 扫描按钮颜色
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