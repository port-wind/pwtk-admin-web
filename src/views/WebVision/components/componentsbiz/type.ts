/**
 * 查询网站大全列表(默认根据排序顺序降序排序，表字段名(sort_num))(传gameTypeCode)
 * https://dev-torna.pwtk.cc/#/view/K8M0Z3D2
 * API: tk/website/listPage
 * module
 */
export interface IBizTkWebsiteListPageModel {
  siteId: string
  siteLogo: string
  siteName: string
  createTime: string
  /** 是否推荐 */
  isRecommended: string
  /** 是否热门 */
  isHot: string
  /** 是否精选 */
  isSelected: string
  /** 是否置顶 */
  isTop: string
  /**是否爆款 */
  isBloom: string
  /** 彩种 专注彩种（a6,hk6,tw6,sg6,xa6）  */
  focusGameType: string[]
  siteUrl1: string
  siteUrl2: string
  siteUrl3: string
  siteUrl4: string
  siteUrl5: string
  siteDesc: string
  memo: string
  sortNum: number
}

export const CircleNumberMap = {
  1: '①',
  2: '②',
  3: '③',
  4: '④',
  5: '⑤',
  6: '⑥',
  7: '⑦',
  8: '⑧',
  9: '⑨',
  10: '⑩',
  11: '⑪',
  12: '⑫',
  13: '⑬',
  14: '⑭',
  15: '⑮',
  16: '⑯',
  17: '⑰',
  18: '⑱',
  19: '⑲',
  20: '⑳'
}
export const ChineseNumberMap = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
  11: '十一',
  12: '十二',
  13: '十三',
  14: '十四',
  15: '十五',
  16: '十六',
  17: '十七',
  18: '十八',
  19: '十九',
  20: '二十'
}
