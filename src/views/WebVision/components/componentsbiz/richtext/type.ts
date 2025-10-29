import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<IRichtext> {}

export interface IRichtext {
  backColor: string
  myValue: string[]
}
