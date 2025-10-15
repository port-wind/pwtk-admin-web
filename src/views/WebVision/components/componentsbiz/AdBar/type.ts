import type { ISetStyle } from '../componentProperties/index'
export interface IDatas extends ISetStyle<AdBarConfigType> {}

export interface AdBarConfigType {
  adData: AdBarItemType[]
}

// 广告项类型
export interface AdBarItemType {
  index: number
  img: string
  link: string
  name: string
}
