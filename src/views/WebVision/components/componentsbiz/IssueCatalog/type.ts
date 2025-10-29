import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<IssueCatalog> {}

export interface IssueCatalog {
  title: string
  titlePrefix: string
  subtitle: string
  enable: boolean
  size: number
  forumName: string
  mainboardName: string
  // 主版块ID
  mainboardId: string
  // 论坛ID
  forumId: string
  isAll: string
  issueGroup: number
  page: number
  forumIcon?: string
  forumStatus?: string
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  // 🎮 动态彩种字段 - 支持基于 gameType 的动态配置
  [gameTypeId: string]: any
  playGameCode: number // 根据游戏玩法配置模版
  issueListTemplate: { postIssue: string; dynamicTemplate: string }[]
  enableTemplateByPostIssue: boolean // 按照期数配置模版
  dynamicTemplate: string // 动态全局模版
  dynamicActiveBg: string // 背景色
  dynamicActiveBgText: string // 背景对照文字颜色
  dynamicFontSize: number // 全局字体大小

  dynamicActiveText: string // 竞猜预测命中时文字色
  dynamicNoResult: string // 未开奖时显示的文字

  frontExtend_Enable: boolean // 是否启用扩展期数列表
  frontExtend_Content: string // 扩展期数列表
  backendextend_Enable: boolean // 是否启用扩展期数列表
  backendextend_Content: string // 扩展期数列表
}

// 期数目录样式
export interface IStyleMain {
  borderRadius: number
  contentPaddingLeftRight: number
  contentPaddingTopBottom: number
  paddingLeftRight: number
  paddingTopBottom: number
  itemSpacing: number
  listSpacing: number
  backgroundColor: string
  itemBackgroundColor: string
  layout: 'left' | 'center' | 'right' | 'space-around' | 'space-between' | 'space-evenly'
  columnCount: number // 列数
}

// 期数目录标题样式
export interface IStyleHeader {
  borderRadius: number
  padding: number
  backgroundColor: string
  isGradient: boolean
  headerBgColor: string
  headerBg: string
  headerBg2: string
  subTitleColor: string
  titleColor: string
}
