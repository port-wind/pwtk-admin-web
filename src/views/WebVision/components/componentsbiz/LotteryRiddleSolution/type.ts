import type { ISetStyle } from '../componentProperties/index'
import type { IProcessedIssueItem } from '../hooks/issueList'

/**
 * 组件的 configParamJson 的最终结构
 */
export interface LotteryRiddleSolution {
  title: string
  subtitle: string
  mainTitle: string
  subTitle: string
  gameType: string
  year: number
  forumId: string
  forumName: string
  mainboardId: string
  mainboardName: string
  forumIcon?: string
  forumStatus?: string
  size: number
  enable: boolean
  links: ILinkItem[]
  listStyleJSON: LotteryRiddleSolutionStyleJSON
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface ILinkItem extends IProcessedIssueItem {
  link: string
  _title: string //默认title
}

// 样式配置类型
export interface LotteryRiddleSolutionStyleJSON {
  headerBackgroundColor: string // 标题背景颜色
  headerTextColor: string // 标题文字颜色
  itemSpacing: number // 项目间距
  itemPadding: number // 项目内边距
  itemBorderRadius: number // 项目圆角
  itemBackgroundColor: string // 项目背景颜色
  itemTextColor: string // 项目文字颜色
  itemBorderColor: string // 项目边框颜色
  itemBorderWidth: number // 项目边框宽度
  containerPadding: number // 容器内边距
  riddleTextColor: string // 谜语文字颜色
  answerTextColor: string // 答案文字颜色
  resultTextColor: string // 结果文字颜色
}

export interface IStyleMain {
  numberSize: number
  numberSpacing: number
  padding: number
  showPeriod: boolean
  borderRadius: number
  showStatus: boolean
  showResult: boolean
  headerTextColor: string
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

// 谜语数据项
export interface IRiddleItem {
  issue: string
  issueShort: string
  type: string
  result?: string
  teNum?: string | number
  totalSize?: string
  numInfo?: any[]
  highlightZodiacs?: string[]
  color?: string
}

// 组件在 WebVision 中的完整数据结构
export interface IDatas extends ISetStyle<LotteryRiddleSolution> {}
