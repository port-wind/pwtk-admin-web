export interface IBbsListQueryParams {
  page: number // 页码 (Page number), default: 0
  size: number // 每页显示条数 (Items per page), default: 0
  sortName?: string // Field to sort by (optional)
  sortOrder?: 'ASC' | 'DESC' // Sort order (optional), can be 'ASC' or 'DESC', default: 'ASC'
  siteId?: string // 站点ID (Site ID, optional)
  siteName?: string // 名称 (Site name, optional)
  focusGameType?: string[] // 专注彩种 (Focus game type, optional array)
  isRecommended?: 'y' | 'n' // 是否推荐 (Is recommended, optional); 'y' = yes, 'n' = no
  isTop?: 'y' | 'n' // 是否置顶 (Is top, optional); 'y' = yes, 'n' = no
  isBloom?: 'y' | 'n' // 是否爆款 (Is bloom/hot item, optional); 'y' = yes, 'n' = no
}

export interface IBbsListData {
  // 站点ID (Site ID)
  siteId?: string

  // LOGO (Site logo URL or identifier)
  siteLogo?: string

  // 名称 (Site name)
  siteName?: string

  // 创建时间 (Creation time, format: yyyy-MM-dd HH:mm:ss)
  createTime?: string

  // 是否推荐 (Is recommended); 'y' = yes, 'n' = no
  isRecommended?: 'y' | 'n'

  // 是否热门 (Is hot); 'y' = yes, 'n' = no
  isHot?: 'y' | 'n'

  // 是否精选 (Is selected); 'y' = yes, 'n' = no
  isSelected?: 'y' | 'n'

  // 是否置顶 (Is top); 'y' = yes, 'n' = no
  isTop?: 'y' | 'n'

  // 是否爆款 (Is bloom/hot item); 'y' = yes, 'n' = no
  isBloom?: 'y' | 'n'

  // 专注彩种 (Focus game type, array of strings)
  focusGameType?: string[]

  // 可用URL1 (Available URL 1)
  siteUrl1?: string

  // 可用URL2 (Available URL 2)
  siteUrl2?: string

  // 可用URL3 (Available URL 3)
  siteUrl3?: string

  // 可用URL4 (Available URL 4)
  siteUrl4?: string

  // 可用URL5 (Available URL 5)
  siteUrl5?: string

  // 站点简介 (Site description)
  siteDesc?: string

  // 备注 (Memo/remarks)
  memo?: string

  // 排序编号 (Sort number), default: 0
  sortNum?: number

  // 是否是super的数据 (Is super data); assumed 'y' = yes, 'n' = no
  gcFlag?: 'y' | 'n'
}
