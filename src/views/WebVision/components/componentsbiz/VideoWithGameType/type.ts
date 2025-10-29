import type { ISetStyle } from '../componentProperties/index'

export interface IVideoItem {
  id: string
  title: string
  imageUrl: string
  videoUrl: string
  enabled: boolean
  order: number
}

export interface IStyleMain {
  containerPadding: number
  backgroundColor: string
  borderRadius: number
  margin: number
  boxShadow: string
  textColor: string
  fontSize: number
  fontWeight: number
  textAlign: 'left' | 'center' | 'right'
  lineHeight: string
}

export interface IStyleHeader {
  backgroundColor: string
  isGradient: boolean
  headerBgColor: string
  headerBg: string
  headerBg2: string
  subTitleColor: string
  titleColor: string
  titleSize: number
  titleWeight: number | string
  subTitleSize: number
}

export interface VideoWithGameTypeConfig {
  text: string
  title: string
  subtitle: string
  enable: boolean
  heights: number // Component height (as percentage of viewport height)
  videoHeightPercent: number // Video height as percentage of component height
  minHeight: number // Minimum component height in pixels
  position: number
  textPosition: number
  backgroundColor: string
  borderColor: string
  textColor: string
  gameType: string
  defaultGameName: string
  size: number
  forumId: string
  videos: IVideoItem[]
  styleHeader: IStyleHeader
  styleMain: IStyleMain
  selectedGameTypes: any[]
  templateObj: {
    videos: IVideoItem[]
  }
}
export interface IDatas extends ISetStyle<VideoWithGameTypeConfig> {}
