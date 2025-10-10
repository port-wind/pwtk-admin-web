export interface SwipeItem {
  index: number               // 轮播项索引
  image: string              // 图片路径
  link?: string              // 点击链接
  alt?: string               // 图片alt文字
  title?: string             // 图片标题
}

export interface SwipeAttrs {
  autoplay?: number          // 自动轮播间隔时间(ms)
  duration?: number          // 切换动画时长(ms)
  showIndicators?: boolean   // 是否显示指示器
  indicatorColor?: string    // 指示器颜色
  loop?: boolean             // 是否循环播放
  touchable?: boolean        // 是否支持手势滑动
  vertical?: boolean         // 是否垂直滚动
}

export interface SwipeConfig {
  model?: 's1' | 's2' | 's3'  // 显示模式：s1-单张轮播 s2-分组轮播 s3-垂直轮播
  groupSize?: number          // 分组大小（模式2使用）
  total?: number              // 显示总数
  swipeData?: SwipeItem[]     // 轮播数据
  otherAttrs?: SwipeAttrs     // 其他属性配置
  configParamJson?: string | {
    model?: 's1' | 's2' | 's3'
    groupSize?: number
    total?: number
    swipeData?: SwipeItem[]
    otherAttrs?: SwipeAttrs
  }
  
  // 基础组件属性
  componentId?: string
  componentName?: string
  componentType?: string
  pageCode?: string
  isView?: 'y' | 'n'
}