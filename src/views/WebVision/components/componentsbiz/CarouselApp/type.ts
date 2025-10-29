import type { ISetStyle } from '../componentProperties/index'

export interface IDatas {
  componentId: string
  sketchCodeList: string | string[]
  templateId: string
  pageRenderingSeq: number
  websiteId: string
  componentRef: string
  componentName: string
  componentType: string
  componentSort: string
  status: string
  isView: string
  memo: string
  pageCode: string
  configParamJson: ICarouselApp
}

export interface ICarouselApp {
  tabs: TabItem[]
}

export interface TabItem {
  title: string
  promoText: string
  amount: string
  bannerColor: string
  banner: string
  appIcon: string
  appName: string
  appSize: string
  category: string
  downloads: string
  rating: string
  screenshot: string
  androidDownload?: string
  iosDownload?: string
  webUrl?: string
  statusText: string
}
