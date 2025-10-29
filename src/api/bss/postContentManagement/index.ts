import http from '@/utils/http/index'
import type {
  ICreateBbsPostQueryParams,
  DelRequest,
  DelResponse,
  IUpdateBbsPostQueryParams,
  EditResponse,
  IReqHttpBBsForumListQueryParams,
  GetResponse,
  GetTreeRequest,
  GetTreeResponse,
  AddReplyRequest,
  AddReplyResponse,
  ActionRequest,
  IReqHttpBBsForumListData,
  IReqCommentsListQueryParams,
  IReqCommentsListData,
  IGetBbsForumPostByIdQueryParams,
  IGetBbsForumPostByIdData,
  ILastIssuePostParams,
  IPostPredictionRule,
  DetailPredictionData,
  PredictionInfo
} from './types'
import type { IBaseResponse, IResponse } from '@/api/type'
import { GameTypeMap } from '@/const/commonSet'
import type { HistoryItem } from '@/api/photoSys/gameResult'

enum api {
  // 用户评论里面显示的列表
  CommentList = 'webgw/bbsForumPost/myComments',
  //查询
  GetAll = 'webgw/bbsForumPost/list',
  //创建
  AddOne = 'webgw/bbsForumPost/createPost',
  //获取单个
  GetOne = 'webgw/bbsForumPost/selectPostById',
  // 删除
  DeleteOne = 'webgw/bbsForumPost/delete',
  //修改
  EditOne = 'webgw/bbsForumPost/edit',
  // 获取树列表
  GetTreeList = 'webgw/bbsForumPost/listTree',
  //新增回复
  AddReply = 'webgw/bbsForumPost/replyPost',

  Like = 'webgw/bbsForumPost/like',
  Dislike = 'webgw/bbsForumPost/dislike',
  Favorite = 'webgw/bbsForumPost/favorite'
}

export const reqCommentsList = (data: IReqCommentsListQueryParams): Promise<IResponse<IReqCommentsListData>> => {
  return http.post(api.CommentList, data)
}

export const getBbsForumPostById = (
  data: IGetBbsForumPostByIdQueryParams
): Promise<IBaseResponse<IGetBbsForumPostByIdData>> => {
  return http.post(api.GetOne, data)
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttpBBsForumList = (
  data: IReqHttpBBsForumListQueryParams
): Promise<IResponse<IReqHttpBBsForumListData>> => {
  return http.post(api.GetAll, data)
}

export const createBbsPost = (data: ICreateBbsPostQueryParams): Promise<IBaseResponse<ICreateBbsPostQueryParams>> => {
  if (!data.title) {
    if (data.postContent) {
      data.title = data.postContent.slice(0, 10)
    } else {
      data.title = '帖子标题'
    }
  }
  return http.post(api.AddOne, data)
}
export const getPostDetail = (data: { postId: string }): Promise<IBaseResponse<any>> => {
  return http.post('webgw/bbsForumPost/detail', data)
}
// 开奖历史表
export const getHittedHistory = (data: {
  gameTypeName: string
  year: string
  issue: string
}): Promise<IBaseResponse<{ list: HistoryItem[] }>> => {
  const { year, issue, gameTypeName } = data
  const gameType = GameTypeMap[gameTypeName]
  return http.post(`webgw/${gameType}/list`, { year, issue, sortOrder: 'DESC', page: 1, size: 10 })
}

export interface IGetPostPredictionRulesQueryParams {
  gameType: string
  /**
   * forumId: userPublic , lottery
   */
  forumId: string
}

export const getPostPredictionRules = (
  data: IGetPostPredictionRulesQueryParams
): Promise<IBaseResponse<IPostPredictionRule[]>> => {
  return http.post('webgw/bbsForumPost/postPredictionRules', data)
}

export const getLotteryRules = (data: IGetPostPredictionRulesQueryParams): Promise<IBaseResponse<any>> => {
  return http.post('webgw/bbsForumPost/lotteryRules', data)
}

export const getLotteryContentByPredictions = (predictions: PredictionInfo[]): Promise<IBaseResponse<any>> => {
  // const result = { postContent: 'test content' }
  // return new Promise((resolve) => {
  //   resolve({ success: true, data: result })
  // })
  return http.post('webgw/bbsForumPost/getLotteryContentByPredictions', { predictions })
}
export const lastIssuePost = (data: ILastIssuePostParams): Promise<IBaseResponse<any>> => {
  return http.post('webgw/bbsForumPost/lastIssuePost', data)
}
// 删除域名  /webgw/domain/delDomainConfig
export const delHttp = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const updateBbsPost = (data: IUpdateBbsPostQueryParams): Promise<IResponse<never>> => {
  return http.post(api.EditOne, data)
}

export const updateStatus = (data: any): Promise<IResponse<any>> => {
  return http.post('webgw/bbsForumPost/updateStatus', { ...data, status: data.postStatus })
}
export const updatePostStatusByIdList = (data: any): Promise<IResponse<any>> => {
  return http.post('webgw/bbsForumPost/updateStatusByIdList', data)
}
export const reqTreeHttp = (data: GetTreeRequest) => {
  return http.post<GetTreeResponse>(api.GetTreeList, data)
}

// 新增回复
export const addReplyHttp = (data: AddReplyRequest) => {
  return http.post<AddReplyResponse>(api.AddReply, data)
}

export const likeHttp = (data: Partial<ActionRequest>) => {
  return http.post('webgw/like/toggle', data)
}

export const dislikeHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw/like/toggle', data)
}

export const favoriteHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw/favorite/toggle', data)
}
export const cancelFavoriteHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw/favorite/toggle', data)
}

export const postReviewRule = (data: any) => {
  return http.post('webgw/bbsForumPost/postReviewRule', data)
}

export const postReviewRuleUpdate = (data: any) => {
  return http.post('webgw/bbsForumPost/postReviewRuleUpdate', data)
}

export const postReviewAudit = (data: any): Promise<IBaseResponse<any>> => {
  return http.post('webgw/bbsForumPost/reviewPost', data)
}
