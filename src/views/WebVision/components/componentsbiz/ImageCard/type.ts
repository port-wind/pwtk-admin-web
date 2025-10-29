import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<ImageCard> {}
export interface ImageCard {
  imageUrl: string
  title: string
  description: string
  link: string
  enable: boolean
  imageStyleJSON: ImageStyleJSON
}

// configParamJson 的结构
export interface ImageStyleJSON {
  enableHeight: boolean
  height?: number
  borderRadius?: number
}
