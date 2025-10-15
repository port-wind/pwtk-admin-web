import type { ISetStyle } from '../componentProperties/index'

export interface IStyleMain {
  padding: number
  borderRadius: number
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
  fontWeight: number
  textColor: string
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

// 🎮 动态彩种配置字段类型
export interface GameTypeFieldConfig {
  gameTypeName: string
  gameTypeCode: string
  gameTypeLongName: string
  gameTypeShortName: string
  enabled: boolean
  customData: Record<string, any>
}

export interface ImageForGameTypeConfig {
  title: string
  titlePrefix: string
  subtitle: string
  content: string
  enable: boolean
  showGameType: boolean
  gameType: string
  gameTypeCode: string
  forumId: string
  size: number
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  // 🎮 动态彩种字段 - 支持基于 gameType 的动态配置
  [gameTypeId: string]: any
}

export interface IDatas extends ISetStyle<ImageForGameTypeConfig> {}
