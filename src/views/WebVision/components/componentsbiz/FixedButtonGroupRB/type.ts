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

export interface FixedButtonGroupRBConfig {
  title: string
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
  alignPosition: 'left' | 'center' | 'right'
}
export interface IDatas extends ISetStyle<FixedButtonGroupRBConfig> {}
