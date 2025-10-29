import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<IAuxiliarysegmentationProps> {}
/**
 * 辅助分割线组件属性接口定义
 */
export interface IAuxiliarysegmentationProps {
  /** 空白高度 */
  blankHeight: number
  /** 内边距类型：0-无内边距，1-有内边距 */
  paddType: 0 | 1
  /** 分割线类型：1-显示分割线 */
  segmentationtype?: number
  /** 边框样式 */
  bordertp?: string
  /** 分割线颜色 */
  auxliarColor?: string
  /** 样式配置 */
  /** 内边距 */
  padding?: number
  /** 圆角 */
  borderRadius?: number
  /** 背景色 */
  backgroundColor?: string
}
