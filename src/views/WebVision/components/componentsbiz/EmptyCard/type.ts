import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<EmptyCard> {}

export interface EmptyCard {
  title: string
  subtitle: string
  content: string
  headerEnable: boolean
  styleHeader: IStyleHeader
  styleMain: IStyleMain
}

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
