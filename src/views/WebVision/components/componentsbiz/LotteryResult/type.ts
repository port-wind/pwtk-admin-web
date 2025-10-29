import type { ISetStyle } from '../componentProperties/index'

// 组件在 WebVision 中的完整数据结构
export interface IDatas extends ISetStyle<LotteryResult> {}


/**
 * 组件的 configParamJson 的最终结构
 */
export interface LotteryResult {
  apiEndpoint: string // 用于获取数据的 API 地址
  defaultTabId: string // 默认选中的 Tab ID
  lotteries: LotteryInfo[] // 所有彩票种类的数据
}


/**
 * 单个开奖号码的结构
 */
export interface LotteryNumber {
  value: string // 号码值，如 '32'
  color: 'green' | 'blue' | 'red' // 球的颜色
  zodiac: string // 生肖，如 '狗'
  element: string // 五行，如 '火'
}

/**
 * 单个彩票种类的数据结构
 */
export interface LotteryInfo {
  id: string // 唯一标识，如 'macau'
  name: string // Tab上显示的完整名称，如 '澳门六合彩'
  displayName: string // 左侧显示的名称，如 '澳门彩'
  issue: string // 期数，如 '162期'
  numbers: LotteryNumber[] // 开奖号码列表
}
