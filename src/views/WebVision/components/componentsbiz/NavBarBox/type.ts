import type { ISetStyle } from '../componentProperties/index'
export interface IDatas extends ISetStyle<NavBarBox> {}
export interface NavBarBox {
  itemData: Array<TabItem>
  tabsAttr: {
    sticky: boolean
    offsetTop: number
    animated: boolean
    swipeable: boolean
    lineWidth: number
    lineHeight: number
    color: string
  }
  bgColor: string
  model: 's1' | 's2' | 's3'
  scrollOffset: number
  onTabChange: (tab: any) => void
  backgroundColor: string
  textColor: string
  activeColor: string
  showLogo: boolean
  logoSrc: string
  menuItems: Array<{
    text: string
    url: string
    icon?: string
    active: boolean
  }>
  layout: 'horizontal' | 'vertical'
  sticky: boolean
}

// NavBarBox 组件类型定义
export interface TabItem {
  id: string
  name: string
  disabled?: boolean
  [key: string]: any
}
