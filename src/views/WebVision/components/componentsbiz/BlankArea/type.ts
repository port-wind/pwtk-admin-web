import type { ISetStyle } from '../componentProperties/index'

export interface BlankAreaConfig {
  backgroundColor: string // 背景颜色
  text: string // 显示文本内容
  textColor: string // 文字颜色
  textAlign: 'left' | 'center' | 'right' // 文字对齐方式
  padding: number // 内边距
  minHeight: number // 最小高度
  borderRadius: number // 圆角
  fontSize: number // 字体大小
  fontWeight: number // 字体粗细
}

export interface IDatas extends ISetStyle<BlankAreaConfig> {}
