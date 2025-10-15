export interface IReqAdvertisementCreateQueryParams {
  siteLogo?: string[] // LOGO (max length: 255)
  siteUrl1?: string // 可用URL1 (must match URL regex, max length: 255)
  siteUrl2?: string // 可用URL2 (must match URL regex, max length: 255)
  siteUrl3?: string // 可用URL3 (must match URL regex, max length: 255)
  siteUrl4?: string // 可用URL4 (must match URL regex, max length: 255)
  siteUrl5?: string // 可用URL5 (must match URL regex, max length: 255)
  siteDesc?: string // 站点简介 (max length: 512)
  memo?: string // 备注 (max length: 255)
  createTime?: string
  siteName: string // 名称 (max length: 64)
  isRecommended: 'y' | 'n' // 是否推荐
  isHot: 'y' | 'n' // 是否热门
  isSelected: 'y' | 'n' // 是否精选
  isTop: 'y' | 'n' // 是否置顶
  isBloom: 'y' | 'n' // 是否爆款
  focusGameType: string[] // 专注彩种
  sortNum: number // 排序编号 (max value: 2147483647)
}

export interface IReqAdvertisementListQueryParams {
  page: number // 页码 (int32)
  size: number // 每页显示条数 (int32)
  sortName?: string // 排序字段名称
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (枚举: ASC, DESC)
  siteId?: string // 站点ID
  siteName?: string // 站点名称
  focusGameType?: string[] // 专注彩种
  isRecommended?: 'y' | 'n' // 是否推荐
  isTop?: 'y' | 'n' // 是否置顶
  isBloom?: 'y' | 'n' // 是否爆款
}
export interface IReqAdvertisementListData {
  siteId: string // 站点ID
  siteLogo: string // LOGO
  siteName: string // 站点名称
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  isRecommended: 'y' | 'n' // 是否推荐
  isHot: 'y' | 'n' // 是否热门
  isSelected: 'y' | 'n' // 是否精选
  isTop: 'y' | 'n' // 是否置顶
  isBloom: 'y' | 'n' // 是否爆款
  focusGameType: string[] // 专注彩种
  siteUrl1?: string // 可用URL1
  siteUrl2?: string // 可用URL2
  siteUrl3?: string // 可用URL3
  siteUrl4?: string // 可用URL4
  siteUrl5?: string // 可用URL5
  siteDesc?: string // 站点简介
  memo?: string // 备注
  sortNum: number // 排序编号 (int64)
  gcFlag: 'ugc' | 'pgc' | 'ogc' // 内容类型标识
}

export interface IReqAdvertisementlistBlurSiteIdQueryParams {
  siteId: string
}
export interface IReqAdvertisementlistBlurSiteNameQueryParams {
  siteName: string
}

export interface IReqAdvertisementGetOneQueryParams {
  siteId: string
}
