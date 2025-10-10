interface LeaderboardWinner {
  userId: number // The ID of the user
  loginId: string // The login identifier or username
  nickname: string // The nickname of the user
  value: number // The score or value associated with this leaderboard
}

// Main interface combining all leaderboard types
export interface IGetWinnerData {
  heatWinner: LeaderboardWinner // 热度榜冠军
  scoreWinner: LeaderboardWinner // 积分榜冠军
  fansWinner: LeaderboardWinner // 粉丝榜冠军
}

export interface IGetHeatQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (optional)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序, 可选值为 ASC 或 DESC (optional)
  searchId?: string // 登录账号或用户ID (optional)
  nickname?: string // 用户昵称 (optional)
}

export interface IGetHeatData {
  ranking: number // 排行，从1开始
  userId: number // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  status: string // 用户状态
  acquireFavoriteCount: number // 被收藏数
  acquireLikeCount: number // 被喜欢数
  updateTime: string // 更新时间，格式为 yyyy-MM-dd HH:mm:ss
}

export interface IGetFansQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (optional)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选值为 ASC 或 DESC)
  searchId?: string // 登录账号或用户ID (optional)
  nickname?: string // 用户昵称 (optional)
}
export interface IGetFansData {
  ranking: number // 排行，从1开始
  userId: number // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  status: string // 用户状态
  fansCount: number // 粉丝数
  updateTime: string // 更新时间，格式为 yyyy-MM-dd HH:mm:ss
}

export interface IGetScoreQueryParams {
  page: number // 页码，从 0 开始
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (optional)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选值为 ASC 或 DESC)
  searchId?: string // 登录账号或用户ID (optional)
  nickname?: string // 用户昵称 (optional)
}

export interface IGetScoreData {
  ranking: number // 排行，从 1 开始
  userId: number // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  status: string // 用户状态
  score: number // 当前积分
  publishCount: number // 当前发帖数
  updateTime: string // 更新时间，格式为 yyyy-MM-dd HH:mm:ss
}
