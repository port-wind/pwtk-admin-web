import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<Videoss> {}

export interface Videoss {
  text: string
  src: string
  autoplay: boolean
  coverUrl: string
}
