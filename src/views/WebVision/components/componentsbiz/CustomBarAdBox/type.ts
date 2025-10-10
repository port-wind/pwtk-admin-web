// export interface IComponentProperty {
//   componentId: string
//   componentName: string
//   componentType: string
//   pageCode: string
//   isView: 'y' | 'n'
//   status: 'y' | 'n'
//   componentRef?: string
//   websiteId?: string
//   sketchCodeList?: string
//   pageRenderingSeq?: number
//   componentSort?: string
// }

import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<CustomBarType> {
  // configParamJson: CustomBarType
}

export interface CustomBarType {
  model: 's1' | 's2' | 's3'
  title?: string
  itemData: ItemData[]
}

export interface ItemData {
  link: string
  text: string
  content?: string
}

// export interface AdItem {
//   text: string // 广告文字内容
//   link?: string // 点击链接
//   icon?: string // 图标路径（可选）
//   highlight?: string // 高亮文字（可选）
//   subtext?: string // 副标题（可选）
//   action?: string // 行动按钮文字（可选）
// }

// export interface CustomBarAdConfig {
//   model?: 's1' | 's2' | 's3' // 显示模式：s1-滚动文字 s2-卡片式 s3-横幅式
//   itemData?: AdItem[] // 广告数据列表
//   configParamJson?:
//     | string
//     | {
//         model?: 's1' | 's2' | 's3'
//         itemData?: AdItem[]
//       }

//   // 基础组件属性
//   componentId?: string
//   componentName?: string
//   componentType?: string
//   pageCode?: string
//   isView?: 'y' | 'n'
// }
