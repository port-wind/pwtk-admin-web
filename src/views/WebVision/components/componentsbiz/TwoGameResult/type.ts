import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<TwoGameResult> {}
export interface TwoGameResult {
  model: 's1' | 's2' | 's3' | 's4' | 's5'
  isHistory: boolean
  isNextIssue: boolean
  isIssue: boolean
  isGifAd: boolean
  isLongName: boolean
  isIcon: boolean
  isOpenTime: boolean
  imageUrl: string
  showArray: string[]
  noTab: boolean
  gameStyle: IGameStyle

}

export interface IGameStyle {
  
}

// model
// isHistory
// isNextIssue
// isIssue
// isGifAd
// isLongName
// isIcon
// showArray
// noTab

// configParamJson 的结构
export interface ImageStyleJSON {}

// 定义类型
export type GameIconKeys = '2032' | '1' | '84' | '3995' | '5' | '6'
import am from '@/assets/images/county/am.png'
import xg from '@/assets/images/county/xg.png'
import tw from '@/assets/images/county/tw-96.png'
import xjp from '@/assets/images/county/xjp-96.png'
// 定义图标枚举
export const GAME_ICONS: Record<GameIconKeys, string> = {
  '2032': am.src,
  '1': xg.src,
  '84': tw.src,
  '3995': xjp.src,
  '5': am.src,
  '6': tw.src
} as const
