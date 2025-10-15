export interface IGetCommentDetailByPostIdQueryParams {
  page: number // 页码，从 0 开始
  size: number // 每页显示条数
  sortName?: string // 排序字段名，可选
  sortOrder?: 'ASC' | 'DESC' // 排序方式，可选，枚举
  gameType?: number | string // 彩种
  year?: number // 期刊发布年份
  issue?: number // 期刊期数
  userId?: number | string // 用户 ID（int64）
  issueName?: string // 图纸名称，模糊搜索
  postContent?: string // 评论内容，模糊查询
  newspaperName?: string // 报纸名称，模糊搜索
  postType?: 'p' | 'c' | string // 为空: 全部; p: 查询期刊评论; c: 查询图解评论
  tagId?: string // 标签ID
  startDate?: string // 开始时间
  endDate?: string // 结束时间
}

export interface IGetCommentDetailByPostIdData {
  postId: number
  postContent: string
  isAllPostContent?: 'y' | 'n'
  postTime: string // yyyy-MM-dd HH:mm:ss
  postUserId: number
  postThreadSeq: number
  likeCount: number
  favoriteCount: number
  likeStatus?: 'y' | 'n'
  favoriteStatus?: 'y' | 'n'
  threadCount: number
  readCount: number
  threadPostId?: number
  postIdPath?: string
  isAnonymous?: 'y' | 'n'
  enableAnonymous?: 'y' | 'n'
  viewFlag?: 'a' | 'u' | 'r' | 'f'
  postYear?: number
  postIssue?: number
  issueId?: number
  issueName?: string
  postGameRef?: string
  postGametypeRef?: number
  hasAttachment?: 'y' | 'n'
  isEdited?: 'y' | 'n'
  lastEditTime?: string
  fromIp?: string
  fromClientFlag?: string
  userMakeSenseCount?: number
  userMakeNoSenseCount?: number
  clientMakeSenseCount?: number
  clientMakeNoSenseCount?: number
  isMakeSense?: 'y' | 'n'
  isHot?: 'y' | 'n'
  isSelected?: 'y' | 'n'
  isTop?: 'y' | 'n'
  isRecommended?: 'y' | 'n'
  isBloom?: 'y' | 'n'
  isAuthor?: 'y' | 'n'
  postType?: 'p' | 'a' | 'c'
  status?: string
  attachments?: Attachment[]
  attachmentList?: AttachmentItem[]
  avatar?: string
  nickname?: string
  vipLevel?: number
  issueDTO?: Issue
  createTime?: string
  updateTime?: string
  favoriteTime?: string
  likeTime?: string
  predictFlag?: 'y' | 'n'
  gcFlag?: 'ogc' | 'ugc' | 'pgc'
  score?: number
  replyCount?: number
  seriesLikeStatus?: 'y' | 'n'
  seriesCount?: number
  forumId?: string
  type?: string
  isIncreaseReadCount?: 'y' | 'n'
  issues?: number[]
  seriesCodes?: string[]
  isOverwrite?: 'y' | 'n'
  recommendResource?: string
  replyPost?: IGetCommentDetailByPostIdData // 被回复的评论（递归）
  loginId?: string
  userLikeCount?: number
  deviceLikeCount?: number
  totalLikeCount?: number
  userFavoriteCount?: number
  deviceFavoriteCount?: number
  totalFavoriteCount?: number
}

interface Attachment {
  fileType: 'p' | 'f' | 'a' | 'e' | 'v' | 's' | 'm' // 图片、文件、APK、EXE、视频、音频、音乐
  url: string
}

interface AttachmentItem {
  attachmentId: number
  issuePostId: number
  attachmentType: 'p' | 'f' | 'a' | 'e' | 'v' | 's' | 'm'
  createTime: string
  attachmentStatus?: string
  isView?: string
  prefixPostfixFlag?: 'h' | 't'
  attachmentUrl?: string
}

interface Issue {
  issueId: number
  issue: number
  year: number
  name: string
  likeCount: number
  userLikeCount: number
  deviceLikeCount: number
  totalLikeCount: number
  favoriteCount: number
  randomFavoriteCount?: number
  threadCount: number
  readCount: number
  randomReadCount?: number
  seriesCode?: string
  seriesName?: string
  newspaperCode?: string
  newspaperName?: string
  gameType: number
  imgPath?: string
  isColorful?: 'y' | 'n'
  isTop?: 'y' | 'n'
  isSelected?: 'y' | 'n'
  isHot?: 'y' | 'n'
  isBloom?: 'y' | 'n'
  isRecommended?: 'y' | 'n'
  commentFlag?: 'y' | 'n'
  voteFlag?: 'y' | 'n'
  isAllAnnotateContent?: 'y' | 'n'
  annotateContent?: string
  graphicUserId?: number
  status?: string
}
