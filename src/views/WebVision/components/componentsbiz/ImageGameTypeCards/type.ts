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
export interface ImageGameTypeCards {
  title: string
  subtitle: string
  content: string
  enable: boolean
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

export interface IDatas extends ISetStyle<ImageGameTypeCards> {}
