import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<TopNavBar> {
  // configParamJson: CustomBarType
}

export interface TopNavBar {
  title?: string
  logo: string
  homeUrl?: string
  isTop?: boolean
}
