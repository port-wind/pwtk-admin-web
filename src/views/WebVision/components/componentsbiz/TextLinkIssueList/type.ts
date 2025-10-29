import type { ISetStyle } from '../componentProperties/index'
import type { IProcessedIssueItem } from '../hooks/issueList'

export interface IDatas extends ISetStyle<TextLinkIssueList> {}

export interface TextLinkIssueList {
  title: string
  subtitle: string
  links: ILinkItem[]
  enable: boolean
  size: number
  listStyleJSON: TextLinkIssueListStyleJSON
  forumId: string
  forumIcon?: string
  forumName: string
  forumStatus?: string
  mainboardName: string
  mainboardId: string
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface ILinkItem extends IProcessedIssueItem {
  link: string
  _title: string //默认title
}

// 样式配置类型
export interface TextLinkIssueListStyleJSON {
  headerBackgroundColor: string // 标题背景颜色
  headerTextColor: string // 标题文字颜色
  itemsPerRow: number // 每行显示的项目数
  itemSpacing: number // 项目间距
  itemPadding: number // 项目内边距
  itemBorderRadius: number // 项目圆角
  itemBackgroundColor: string // 项目背景颜色
  itemTextColor: string // 项目文字颜色
  itemBorderColor: string // 项目边框颜色
  itemBorderWidth: number // 项目边框宽度
  containerPadding: number // 容器内边距
  itemHoverColor: string // 项目悬停颜色
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
