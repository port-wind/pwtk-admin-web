import type { ISetStyle } from '../componentProperties/index'

export interface IDatas extends ISetStyle<NewsPaperCategoryList> {}

export interface NewsPaperCategoryList {
  title: string
  description: string
  categories: CategoryTab[]
  defaultActiveTab: number
  enable: boolean
  listStyleJSON: CategoryListStyleJSON
}

// 单个标签页类型
export interface CategoryTab {
  id: string
  name: string
  enabled: boolean
  items: CategoryItem[]
}

// 单个分类项类型
export interface CategoryItem {
  id: string
  text: string
  link: string
  enabled: boolean
  isMoreButton: boolean // 是否为"查看更多"按钮
  buttonColor: string // 按钮颜色
  textColor: string // 文字颜色
}

// 样式配置类型
export interface CategoryListStyleJSON {
  headerBackgroundColor: string // 标题背景颜色
  headerTextColor: string // 标题文字颜色
  activeTabColor: string // 激活标签页颜色
  inactiveTabColor: string // 非激活标签页颜色
  tabTextDefaultColor: string // 标签页文字默认颜色
  tabTextColor: string // 标签页文字颜色
  itemsPerRow: number // 每行显示的项目数
  itemSpacing: number // 项目间距
  itemPadding: number // 项目内边距
  itemBorderRadius: number // 项目圆角
  itemBackgroundColor: string // 项目背景颜色
  itemTextColor: string // 项目文字颜色
  itemBorderColor: string // 项目边框颜色
  itemBorderWidth: number // 项目边框宽度
  moreButtonColor: string // 更多按钮颜色
  moreButtonTextColor: string // 更多按钮文字颜色
  containerPadding: number // 容器内边距
} 