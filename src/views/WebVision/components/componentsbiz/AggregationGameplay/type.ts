import type { ISetStyle } from '../componentProperties/index'

export interface IStyleMain {
  showResult: any
  showStatus: any
  showPeriod: any
  padding: number
  borderRadius: number
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  fontSize: number
  fontWeight: number
  textColor: string
  numberSize?: number
  numberSpacing?: number
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
export interface AggregationGameplay {
  title: string
  subtitle: string
  bottomTitle: string
  bottomTitleFontColor: string
  bottomTitleFontSize: number
  bottomTitleFontWeight: number
  bottomTitleBackgroundColor: string
  content: string
  enable: boolean
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  size: number
  forumId: string
  forumName: string
  forumStatus?: string
  mainboardName: string
  mainboardId: string
  forumIcon?: string
}

export interface IDatas extends ISetStyle<AggregationGameplay> {}
