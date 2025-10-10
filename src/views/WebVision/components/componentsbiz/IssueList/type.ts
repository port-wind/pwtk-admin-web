import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<IssueList> {}

export interface IssueList {
  title: string
  description: string
  enable: boolean
  maxDisplayCount: number
  issueItems: IssueItem[]
  listStyleJSON: ListStyleJSON
}

export interface IssueItem {
  id: string
  period: string // 期数，如"167期"
  title: string // 主标题，如"一位定单"
  subtitle: string // 副标题，如"二条中特"
  status: string // 状态，如"已嗮幸"
  link?: string // 链接
  enabled: boolean
}

export interface ListStyleJSON {
  // 头部样式
  headerBackgroundColor: string
  headerTextColor: string
  headerPadding: number
  
  // 列表样式
  listBackgroundColor: string
  itemPadding: number
  itemSpacing: number
  itemBorderColor: string
  itemBorderWidth: number
  
  // 文本样式
  periodTextColor: string
  titleTextColor: string
  subtitleTextColor: string
  statusTextColor: string
  
  // 容器样式
  containerPadding: number
  borderRadius: number
}
