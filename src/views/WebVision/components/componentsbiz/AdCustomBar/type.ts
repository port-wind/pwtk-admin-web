import type { ISetStyle } from '../componentProperties/index'
export interface IDatas extends ISetStyle<AdBarType> {}

interface AdBarType {
  total: number
  adData: AdItem[]
}
interface AdItem {
  index: number
  img: string
  link: string
  name: string
}
