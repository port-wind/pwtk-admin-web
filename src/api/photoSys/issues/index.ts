import type { Ref } from 'vue'
import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type { IGetCommentDetailByPostIdData, IGetCommentDetailByPostIdQueryParams } from './type'

const prefix = ''
export const create = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaperIssue/create', data)
}

export const del = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaperIssue/del', data)
}

export const update = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaperIssue/update', data)
}

export const clearCache = (data: { gameType: string }): Promise<IBaseResponse<boolean>> => {
  return http.post('webgw/gameTypeNewspaperIssue/clearCache', data)
}

export const list = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  if (data.year === 'L') {
    delete data.year
  }
  return http.post<any>('webgw/gameTypeNewspaperIssue/list', data)
}

export const getDetailById = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaperIssue/getDetailById', data)
}
export const gameTypeNewspaperSeriesCount = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaperIssue/selectSeriesCount', data)
}
export const getIssueListByParams = (params: any) => {
  return http.post<any>('webgw/tk/gameTypePlatform/issueList', params)
}

export const getExplainDetailByPostId = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/detailByPostId', data)
}

export const getPaperCommentDetailByPostId = (
  data: IGetCommentDetailByPostIdQueryParams
): Promise<IResponse<IGetCommentDetailByPostIdData>> => {
  return http.post('webgw/tk/newspaperIssuePost/postList', data)
}

export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/list', data)
}

export const getNewspaperIssuePostList = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/listTree', data)
}

export const replyIssuePost = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/replyPost', data)
}

export const likeIssuePost = (data: any) => {
  return http.post<any>('webgw/like/toggle', data)
}

export const starIssuePost = (data: any) => {
  return http.post<any>('webgw/favorite/toggle', data)
}

export const cancelStarIssuePost = (data: any) => {
  return http.post<any>('webgw/favorite/toggle', data)
}

export const dislikeIssuePost = (data: any) => {
  return http.post<any>('webgw/like/toggle', data)
}
export const likeIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/like', data)
}
export const getGraphicUsers = (data: { issueId: string }) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/getGraphicUsers', data)
}

export const starIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/favorite', data)
}

export const dislikeIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/tk/newspaperIssuePost/dislike', data)
}

export const batchVerify = (data: any) => {
  return http.post<any>('webgw/issueMapping/batchVerify', data)
  // return new Promise((resolve, reject) => {
  //   resolve({
  //     code: 200,
  //     message: 'success',
  //     data: data.map((fileName: string, index: number) => {
  //       return {
  //         fileName,
  //         success: index % 2 === 0,
  //         reason: index % 2 === 0 ? '' : '文件格式不正确'
  //       }
  //     })
  //   })
  // })
}
const transformToTargetFormat = (inputData: any) => {
  const commonAttribute = {
    issue: inputData.issue,
    year: inputData.year,
    isColorful: inputData.isColorful,
    isTop: inputData.isTop,
    isSelected: inputData.isSelected,
    isHot: inputData.isHot,
    isBloom: inputData.isBloom,
    isRecommended: inputData.isRecommended,
    commentFlag: inputData.commentFlag,
    voteFlag: inputData.voteFlag,
    isAllAnnotateContent: inputData.isAllAnnotateContent,
    isOverwrite: inputData.isOverwrite
  }

  const issueList = inputData.issueList.map((item: any) => ({
    fileId: item.targetId,
    imgPath: item.imgPath
  }))

  return {
    commonAttribute,
    issueList
  }
}
export const batchSave = (data: any) => {
  console.log('batchSave origin', data)
  console.log('batchSave target', transformToTargetFormat(data))

  return http.post<any>('webgw/gameTypeNewspaperIssue/batchSave', transformToTargetFormat(data))
}
export const graphicSolutionGroup = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  if (data.year === 'L') {
    delete data.year
  }
  if (data.postYear === 'L') {
    delete data.postYear
  }
  return http.post<any>(`webgw/${prefix}tk/newspaperIssuePost/graphicSolutionGroup`, data)
}

export interface IUpdateGraphicSolutionQueryParams {
  postId: number // 评论所属的帖子ID
  status: 'y' | 'n' // 状态：y启用，n删除标志
  isHot?: 'y' | 'n' // 是否热门
  isSelected?: 'y' | 'n' // 是否精选
  isTop?: 'y' | 'n' // 是否置顶
  isRecommended?: 'y' | 'n' // 是否推荐
  isBloom?: 'y' | 'n' // 是否爆款
}

export interface IUpdateGraphicSolutionData {}

export const updateGraphicSolution = (data: IUpdateGraphicSolutionQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post(`webgw/${prefix}tk/newspaperIssuePost/updateStatus`, data)
}

export const updateStatusByIdList = (data: any): Promise<IBaseResponse<any>> => {
  return http.post(`webgw/${prefix}tk/newspaperIssuePost/updateStatusByIds`, data)
}

export function useIssuesApi(postType?: Ref<string>, imageExplainId?: Ref<string>) {
  const injectSiteId = (params: any = {}) => {
    if (imageExplainId?.value) {
      params.imageExplainId = imageExplainId?.value
      params.threadPostId = imageExplainId?.value
    }
    return {
      ...params,
      postType: postType?.value === 'a' ? (params.replyLevel === 'children' ? 'c' : 'a') : postType?.value
    }
  }
  const injectField = (params: any = {}) => {
    return {
      ...params,
      threadPostId: params.replyLevel === 'children' ? params.threadPostId : imageExplainId?.value,
      postType: postType?.value === 'a' ? 'c' : postType?.value
    }
  }

  return {
    cancelStarIssuePost: (params?: any) => cancelStarIssuePost(injectSiteId(params)),
    dislikeIssuePost: (params?: any) => dislikeIssuePost(injectSiteId(params)),
    getNewspaperIssuePostList: (params?: any) => getNewspaperIssuePostList(injectSiteId(params)),
    likeIssuePost: (params?: any) => likeIssuePost(injectSiteId(params)),
    replyIssuePost: (params?: any) => replyIssuePost(injectField(params)),
    starIssuePost: (params?: any) => starIssuePost(injectSiteId(params))
  }
}
