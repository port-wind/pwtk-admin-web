import axios from 'axios'
import http from './http'
import type { IBaseResponse, IResponse } from './type'
import type { IForumPost } from '../types/forum'

interface IGetLatestIssueParams {
  newspaperCode: string
  gameType: number
}
interface IGetLatestIssuesParams {
  newspaperCodes: string[]
  gameType: number
}

interface IGetLatestIssueResponse {
  issueId: number
  issue: number
  year: number
  name: string
  likeCount: number
  userLikeCount: number
  deviceLikeCount: number
  totalLikeCount: number
  favoriteCount: number
  likeStatus: string
  favoriteStatus: string
  seriesLikeStatus: string
  threadCount: number
  replyCount: number
  readCount: number
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
  status: string
  page: number
  size: number
  createTime: string // Format: yyyy-MM-dd HH:mm:ss
  updateTime: string // Format: yyyy-MM-dd HH:mm:ss
  favoriteTime: string // Format: yyyy-MM-dd HH:mm:ss
  likeTime: string // Format: yyyy-MM-dd HH:mm:ss
  predictFlag: string
  gcFlag: string
  score: number
  issueLastNum: string
  seriesCount: number
}

export const getLatestIssue = (data: IGetLatestIssueParams): Promise<IBaseResponse<IGetLatestIssueResponse>> => {
  return http.post('/newspaper/latestIssue', data)
}

export const getLatestIssues = (data: IGetLatestIssuesParams): Promise<IBaseResponse<IGetLatestIssueResponse>> => {
  return http.post('/newspaper/latestIssues', data)
}

export interface IGetWebSitePostParams {
  /** 页码 */
  page: number
  /** 每页条数 */
  size: number
  /** 论坛ID */
  forumId: string
  /** 游戏类型 */
  gameType: string
  /** 排序字段 */
  sortName?: string
  /** 排序方式 */
  sortOrder?: 'ASC' | 'DESC'
  /**  是否查询全部帖子 ， false 只查询不同期的 帖子（是否中奖），目前没有确定 */
  isAll?: 'y' | 'n'
  /** 默认是1 。 传2 表示两期中奖结果聚合在一起。 issueGroup  hitDetail: 0001100  */
  issueGroup?: number
}

export const getWebSitePost = (data: IGetWebSitePostParams): Promise<IResponse<IForumPost>> => {
  return http.post('/bbsForumPost/webSitePost', data)
}
// // 查询个人信息接口
// export const accountInfo = (): Promise<IBaseResponse<IAccountInfoData>> => {
//   return http.get('/account/info')
// }

// // 获取类型接口
// export const getSelectType = (data: any) => {
//   return http.get('/dict/getDictByType', data)
// }

// // 用户编号模糊查询
// export const getBlurquery = (data: any) => {
//   return http.get('/user/queryBlurUserId', data)
// }

// // 获取ip地址
// // Constants for cache configuration
// const IP_CACHE_KEY = 'user_ip_data'
// const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

// // Generate unique IDs
// export const generateUniqueIds = (count: number = 1) => {
//   return http.post('/webgw/issueMapping/generateUniqueIds', { count })
// }
