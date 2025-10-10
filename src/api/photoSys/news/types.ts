export interface IGameTypePlatformBodyParameter {
  page: number
  size: number
}

export interface IGameType {
  /**
   * 游戏类型ID
   */
  gameType: string
  /**
   * 游戏类型简称
   */
  gameTypeShortName: string
  /**
   * 游戏类型名称
   */
  gameTypeName: string
  /**
   * 游戏类型全名
   */
  gameTypeLongName: string
  /**
   * 区域代码
   */
  areaCode: string
  /**
   * 分类
   */
  classifier: string
  /**
   * 游戏类型代码
   */
  gameTypeCode: string
}

export interface NewspaperQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: 'ASC' | 'DESC' | string // 排序方向
  newspaperCode?: string // 报纸编码
  seriesCode?: string // 图纸系列编码
  seriesName?: string
  gameType?: number | string // 彩种
  newspaperName?: string // 名称
  newspaperShortName?: string // 简称
  newspaperLongName?: string // 全称
  layoutCode?: string // 版面
  layoutARef?: string // 版面A
  layoutBRef?: string // 版面B
  layoutCRef?: string // 版面C
  layoutDRef?: string // 版面D
  newspaperDesc?: string // 描述
  memo?: string // 备注
  isColorful?: 'y' | 'n' | string // 是否彩色
  isRecommended?: 'y' | 'n' | string // 是否推荐
  isHot?: 'y' | 'n' | string // 是否热门
  isTop?: 'y' | 'n' | string // 是否置顶
  isBloom?: 'y' | 'n' | string // 是否爆款
  isSelected?: 'y' | 'n' | string // 是否精选
  commentFlag?: 'y' | 'n' | string // 评论标记
  voteFlag?: 'y' | 'n' | string // 投票标记
  recommendTop?: 'y' | 'n' | string // 推荐置顶
}

export interface Newspaper {
  newspaperCode: string
  seriesCode: string
  seriesName: string
  gameType: number
  newspaperName: string
  newspaperShortName: string
  newspaperLongName: string
  layoutCode: string
  layoutARef: string
  layoutBRef: string
  layoutCRef: string
  layoutDRef: string
  newspaperDesc: string
  memo: string
  recommendTop: string
  recommendResource: string
  recommendSortNo: number
  isColorful: string
  isRecommended: string
  isHot: string
  isTop: string
  isBloom: string
  isSelected: string
  commentFlag: string
  voteFlag: string
  status: string
  page: number
  size: number
  newspaperGroupId: number
  newsLayoutRelations: any[]
  listBySerialsCode: any[]
  latestIssue: LatestIssue
}

interface LatestIssue {
  issueId: number
  issue: number
  year: number
  name: string
  likeCount: number
  userLikeCount: number
  deviceLikeCount: number
  totalLikeCount: number
  favoriteCount: number
  randomFavoriteCount: number
  threadCount: number
  readCount: number
  randomReadCount: number
  seriesCode: string
  seriesName: string
  newspaperCode: string
  newspaperName: string
  gameType: number
  imgPath: string
  isColorful: string
  isTop: string
  isSelected: string
  isHot: string
  isBloom: string
  isRecommended: string
  commentFlag: string
  voteFlag: string
  isAllAnnotateContent: string
  annotateContent: string
  graphicUserId: number
  status: string
  page: number
  size: number
  limit: number
  start: number
  sortName: string
  sortOrder: 'ASC' | 'DESC'
  createTime: string
  updateTime: string
  favoriteTime: string
  likeTime: string
  predictFlag: string
  gcFlag: string
  score: number
  replyCount: number
  likeStatus: string
  favoriteStatus: string
  seriesLikeStatus: string
  seriesCount: number
  postId: number
  type: string
  forumId: string
  postUserId: string
  nickname: string
  avatar: string
  isIncreaseReadCount: string
  issues: number[]
  seriesCodes: string[]
  isOverwrite: string
  issueLastNum: string
  recommendResource: string
}
