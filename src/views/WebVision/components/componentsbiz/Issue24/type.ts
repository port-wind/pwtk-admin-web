import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<Issue24> {}

// 🎮 动态彩种配置字段类型
export interface GameTypeFieldConfig {
  gameTypeName: string
  gameTypeCode: string
  gameTypeLongName: string
  gameTypeShortName: string
  enabled: boolean
  customData: Record<string, any>
}

// 六肖六码行类型
export type SixZodiacRowType =
  | '六肖'
  | '五肖'
  | '四肖'
  | '三肖'
  | '二肖'
  | '一肖'
  | '内幕消息'
  | '②码中特'
  | '③码中特'
  | '⑤码中特'
  | '⑥码中特'

// 六肖六码行配置
export interface SixZodiacRowConfig {
  advertisementContent?: string
  advertisementTextColor?: string
  advertisementFontSize?: number
}

// 六肖六码期数配置
export interface SixZodiacIssueConfig {
  rowConfigs?: {
    [K in SixZodiacRowType]?: SixZodiacRowConfig
  }
}

// 六肖六码组件配置
export interface SixZodiacSixCodeConfig {
  itemBackgroundColor?: string // 全局设置 - 单个生肖项的背景色
  contentAreaBackgroundColor?: string // 全局设置 - 整个内容区域的背景色
  issueConfigs?: {
    [issueId: string]: SixZodiacIssueConfig
  }
}

export interface Issue24 {
  model: EModel // 24码风格  "24"
  title: string
  titlePrefix: string
  subtitle: string
  enable: boolean
  size: number
  forumId: string
  forumName: string
  mainboardName: string
  mainboardId: string
  forumIcon?: string
  forumStatus?: string
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  // 六肖六码组件专用属性 - 重构为更细化的配置
  sixZodiacSixCodeConfig?: SixZodiacSixCodeConfig
  // 向下兼容的废弃属性
  advertisementContent?: string
  advertisementTextColor?: string
  advertisementFontSize?: number
  itemBackgroundColor?: string
  // 🎮 动态彩种字段 - 支持基于 gameType 的动态配置
  [gameTypeId: string]: any
  dynamicTemplate: string
  dynamicActive: string
}

export enum EModel {
  '24码',
  '胆大胆小',
  '三半波色',
  '杀两肖',
  '尾数大小',
  '平特二尾',
  '吃鱼吃虾',
  '买啥中啥',
  '三炮中特',
  '一句赢钱',
  '平特二肖',
  '绝杀区',
  '中特码段',
  '天地生肖',
  '合数单双',
  '无敌八尾',
  '复式平码',
  '一句解特码',
  '横扫黑庄',
  '六肖六码'
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
