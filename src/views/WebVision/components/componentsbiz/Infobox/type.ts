import type { ISetStyle } from '../componentProperties/index'

/**
 * 组件的 configParamJson 的最终结构
 */
export interface Infobox {
  line1: string
  line2: string
  line3: string
  styleJSON: IStyleJSON
}

export interface IStyleJSON {
  backgroundColor: string
  textColor: string
  textAlign: string
}

// 组件在 WebVision 中的完整数据结构
export interface IDatas extends ISetStyle<Infobox> {}
