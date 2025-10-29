import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<ImageGridList> {}

export interface ImageGridList {
  title: string
  subtitle: string
  gameType: string
  gridStyleJSON: GridStyleJSON
  styleHeader: IStyleHeader
  // 按彩种分组的图片项数据，key为彩种ID
  [gameTypeId: string]: any
  '2032'?: { gridItems: GridImageItem[] } // 澳彩
  '1'?: { gridItems: GridImageItem[] } // 港彩
  '84'?: { gridItems: GridImageItem[] } // 台彩
  '3995'?: { gridItems: GridImageItem[] } // 新彩
  '5'?: { gridItems: GridImageItem[] } // 新澳彩
  '6'?: { gridItems: GridImageItem[] } // 快乐8
}

// 单个图片项的类型
export interface GridImageItem {
  id: string
  imageUrl: string
  newspaper: string
  title: string
  link: string
  enabled?: boolean
}

// 样式配置类型
export interface GridStyleJSON {
  contentItemPadding: number // 最外面的边框
  columnsPerRow: number // 每行显示的列数
  itemSpacing: number // 项目间距
  itemPadding: number // 项目内边距
  borderRadius: number // 圆角
  imageHeight: number // 图片高度
  titleFontSize: number // 标题字体大小
  titleColor: string // 标题颜色
  backgroundColor: string // 背景颜色
  borderColor: string // 边框颜色
  borderWidth: number // 边框宽度
  hoverEffect: boolean // 悬停效果
  showTitle: boolean // 是否显示标题
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
