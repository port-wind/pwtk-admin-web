export interface NoticeBarConfig {
  noticeText?: string          // 公告文字内容
  icon?: string               // 图标路径
  alt?: string                // 图标alt文字
  backColor?: string          // 背景色
  textColor?: string          // 文字颜色
  closable?: boolean          // 是否可关闭
  scrollable?: boolean        // 文字过长时是否滚动
  configParamJson?: string | {
    noticeText?: string
    icon?: string
    alt?: string
    backColor?: string
    textColor?: string
    closable?: boolean
    scrollable?: boolean
  }
  
  // 基础组件属性
  componentId?: string
  componentName?: string
  componentType?: string
  pageCode?: string
  isView?: 'y' | 'n'
}