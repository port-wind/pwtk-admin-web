import type { AxiosPromise } from 'axios'
import http from '@/utils/http/index'
import type {
  ICreatePredictRData,
  ICreatePredictRQueryParams,
  IFavoriteBodyParameter,
  IFavoriteData,
  IGetIpTopListData,
  IReqBbsCommentListPostIssueData,
  IReqBbsCommentListPostIssueQueryParams,
  IReqBbsCommentStatusPostIssueQueryParams,
  IReqBbsForumListPostIssueQueryParams,
  IReqBlocklistData,
  IReqBlocklistQueryParams,
  IReqDeviceVisitData,
  IReqDeviceVisitQueryParams,
  IReqExpertStatisticsData,
  IReqExpertStatisticsQueryParams,
  IReqFavoriteData,
  IReqFavoriteQueryParams,
  IReqGetRuleListData,
  IReqHistoricalChampionData,
  IReqHistoricalChampionQueryParams,
  IReqIsExitQueryParams,
  IReqLikeData,
  IReqLikeQueryParams,
  IReqListDeviceFavoriteData,
  IReqListDeviceFavoriteQueryParams,
  IReqListDeviceLikeData,
  IReqListDeviceLikeQueryParams,
  IReqListDeviceRelationshipData,
  IReqListDeviceRelationshipQueryParams,
  IReqListDeviceViewHistoryData,
  IReqListDeviceViewHistoryQueryParams,
  IReqListDeviceVoteData,
  IReqListDeviceVoteQueryParams,
  IReqListPostIssueQueryParams,
  IReqListUserLikeData,
  IReqListUserLikeQueryParams,
  IReqListUserRelationshipData,
  IReqListUserRelationshipQueryParams,
  IReqListUserViewHistoryData,
  IReqListUserViewHistoryQueryParams,
  IReqListUserVoteData,
  IReqListUserVoteQueryParams,
  IReqNewspaperIssuePostListData,
  IReqNewspaperIssuePostListQueryParams,
  IReqPlatformSwitchInfoData,
  IReqPlatformSwitchInfoQueryParams,
  IReqRelationshipData,
  IReqRelationshipQueryParams,
  IReqRuleChangeQueryParams,
  IReqSixKingGalleryData,
  IReqSixKingGalleryQueryParams,
  IReqSixKingListData,
  IReqSixKingListQueryParams,
  IReqUpdateUserData,
  IReqUpdateUserQueryParams,
  IReqUserCreateQueryParams,
  IReqUserEditQueryParams,
  IReqUserListByUserIdAndNameData,
  IReqUserListByUserIdAndNameQueryParams,
  IReqUserListData,
  IReqUserListFilterData,
  IReqUserListFilterQueryParams,
  IReqUserListQueryParams,
  IReqUserQueryData,
  IReqUserQueryQueryParams,
  IReqUserRewardListData,
  IReqUserRewardListQueryParams,
  IReqUserVisitData,
  IReqUserVisitQueryParams,
  IReqWinningStreakListData,
  IReqWinningStreakListQueryParams,
  ISelectDomainAndIdNameQueryParams,
  ISetTransferScoreQueryParams,
  RewardSettingItem
} from './type'
import type { IBaseResponse, IResponse } from '@/api/type'
import showErrorMessage from '@/utils/showErrorMessage'
//获取用户列表 精准 模糊查询

export const reqUserList = (data: IReqUserListQueryParams): Promise<IResponse<IReqUserListData>> => {
  return http.post('/webgw/user/list', data)
}

export const reqUserListByUserIdAndName = (
  data: IReqUserListByUserIdAndNameQueryParams
): Promise<IResponse<IReqUserListByUserIdAndNameData>> => {
  return http.post('/webgw/user/dynamic-search', data)
}

export const reqUserListByUserId = async (req: any) => {
  const newReq = {
    ...req,
    searchId: req.userId
  }
  delete newReq.userId
  try {
    const response: any = await reqUserList(newReq)
    if (response.success) {
      return response
    }
    showErrorMessage(response)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
//获取用户列表 精准 模糊查询
export const reqUserListFilter = (data: IReqUserListFilterQueryParams): Promise<IResponse<IReqUserListFilterData>> => {
  return http.post('/webgw/user/listfilter', data)
}

export interface ISelectIdAndNameQueryParams {
  websiteId?: string | undefined
  ownerUserId?: string | undefined
  websiteTemplateRef?: string | undefined
  domain?: string | undefined
}

//获取用户列表 精准 模糊查询
export const selectIdAndName = (data?: ISelectIdAndNameQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw/website/selectIdAndName', data)
}
//获取用户列表 精准 模糊查询
export const selectDomainAndIdName = (data: ISelectDomainAndIdNameQueryParams): Promise<IBaseResponse<any>> => {
  return http.post('/webgw/domain/selectDomainAndIdName', data)
}
//获取用户列表辅助查询 模糊
export const reqUserQuery = (data: IReqUserQueryQueryParams): Promise<IResponse<IReqUserQueryData>> => {
  return http.post('/webgw/user/query', data)
}
//编辑用户
export const reqUserEdit = (data: IReqUserEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/user/edit', data)
}

export interface IUpdateUserPassword {
  userId: string
  sha1Password: string
  salt: string
  secret: string
}
/**
 * salt: 1234
 * secret = ?
 *
 * 密文<br>
 * 规则：base64（sha1（盐 + 用户ID + base64（sha1（密码明文））））
 */
export const updateUserPassword = (data: IUpdateUserPassword): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/user/updatePwd', data)
}

//新增用户
export const reqUserCreate = (data: IReqUserCreateQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/user/add', data)
}
//更新用户状态
export const reqUpdateUser = (data: IReqUpdateUserQueryParams): Promise<IResponse<IReqUpdateUserData>> => {
  return http.post('/webgw/user/status', data)
}
//查询单个用户详情
export const reqUserInfo = (userId: string): Promise<IBaseResponse<IReqUserListData>> => {
  return http.get(`/webgw/user/${userId}`)
}

export interface ISendMessageUserIdData {
  code: string
  expire: string
}

//查询单个用户详情
export const sendMessageUserId = (userId: string): Promise<IBaseResponse<ISendMessageUserIdData>> => {
  return http.get(`/webgw/user/sendMsg/${userId}`)
}

export interface IResetUserPassword {
  userId: number // int64 用户ID
  sha1Password: string // 64 位密码签名 (base64(sha1(密码明文)))
  salt: string // 8 位加盐值
  secret: string // 128 位密文 (base64(sha1(盐 + 用户ID + sha1(密码明文))))
}

//查询单个用户详情
export const resetUserPassword = (data: IResetUserPassword): Promise<IBaseResponse<IReqUserListData>> => {
  return http.post(`/webgw/user/updatePwd`, data)
}

//检查登录账户是否已存在
export const reqIsExit = (userId: IReqIsExitQueryParams): Promise<IBaseResponse<never>> => {
  return http.get(`/webgw/user/${userId}`)
}
//检查用户ID是否已存在
export const reqIsId = (userId: string) => {
  return http.get(`/webgw/user/${userId}`)
}
//查询用户黑名单
export const reqBlocklist = (data: IReqBlocklistQueryParams): Promise<IResponse<IReqBlocklistData>> => {
  return http.post('/webgw/userBlocklist/list', data)
}
//用户关系（关注/被关注）
export const reqRelationship = (data: IReqRelationshipQueryParams): Promise<IResponse<IReqRelationshipData>> => {
  return http.post('/webgw/userRelationship/list', data)
}
//用户收藏相关
export const reqFavorite = (data: IReqFavoriteQueryParams): Promise<IResponse<IReqFavoriteData>> => {
  return http.post('/webgw/userFavorite/list', data)
}
//用户点赞相关
export const reqLike = (data: IReqLikeQueryParams): Promise<IResponse<IReqLikeData>> => {
  return http.post('/webgw/userLike/list', data)
}
//查看完整手机号码
export const reqShowMobile = (userId: any): Promise<IBaseResponse<string>> => {
  return http.get(`/webgw/user/showMobile/${userId}`)
}

//用户访客
export const reqUserVisit = (data: IReqUserVisitQueryParams): Promise<IResponse<IReqUserVisitData>> => {
  return http.post(`/webgw/visit/listUserVisitor`, data)
}
//匿名访客
export const reqDeviceVisit = (data: IReqDeviceVisitQueryParams): Promise<IResponse<IReqDeviceVisitData>> => {
  return http.post(`/webgw/visit/listDeviceVisitor`, data)
}
//用户点赞
export const reqListUserLike = (data: IReqListUserLikeQueryParams): Promise<IResponse<IReqListUserLikeData>> => {
  return http.post(`/webgw/like/listUserLike`, data)
}
//匿名点赞
export const reqListDeviceLike = (data: IReqListDeviceLikeQueryParams): Promise<IResponse<IReqListDeviceLikeData>> => {
  return http.post(`/webgw/like/listDeviceLike`, data)
}
/**
 *
 * @param data IFavoriteBodyParameter
 * @returns
 */
//用户收藏
export const reqListUserFavorite = (data: IFavoriteBodyParameter): Promise<AxiosPromise<IResponse<IFavoriteData>>> => {
  return http.post(`/webgw/favorite/listUserFavorite`, data)
}
//匿名收藏
export const reqListDeviceFavorite = (
  data: IReqListDeviceFavoriteQueryParams
): Promise<IResponse<IReqListDeviceFavoriteData>> => {
  return http.post(`/webgw/favorite/listDeviceFavorite`, data)
}
//用户投票
export const reqListUserVote = (data: IReqListUserVoteQueryParams): Promise<IResponse<IReqListUserVoteData>> => {
  return http.post(`/webgw/vote/listUserVote`, data)
}
//匿名投票
export const reqListDeviceVote = (data: IReqListDeviceVoteQueryParams): Promise<IResponse<IReqListDeviceVoteData>> => {
  return http.post(`/webgw/vote/listDeviceVote`, data)
}
//用户浏览历史
export const reqListUserViewHistory = (
  data: IReqListUserViewHistoryQueryParams
): Promise<IResponse<IReqListUserViewHistoryData>> => {
  return http.post(`/webgw/viewhistory/listUserViewHistory`, data)
}
//匿名浏览历史
export const reqListDeviceViewHistory = (
  data: IReqListDeviceViewHistoryQueryParams
): Promise<IResponse<IReqListDeviceViewHistoryData>> => {
  return http.post(`/webgw/viewhistory/listDeviceViewHistory`, data)
}
//用户关注
export const reqListUserRelationship = (
  data: IReqListUserRelationshipQueryParams
): Promise<IResponse<IReqListUserRelationshipData>> => {
  return http.post(`/webgw/relationship/listUserRelationship`, data)
}
//匿名关注
export const reqListDeviceRelationship = (
  data: IReqListDeviceRelationshipQueryParams
): Promise<IResponse<IReqListDeviceRelationshipData>> => {
  return http.post(`/webgw/relationship/listDeviceRelationship`, data)
}
//获取用户期数
export const reqListUserVoteIssue = () => {
  return http.get('/webgw/vote/listUserVoteIssue')
}
//获取用户评论图库列表
export const reqNewspaperIssuePostList = (
  data: IReqNewspaperIssuePostListQueryParams
): Promise<IResponse<IReqNewspaperIssuePostListData>> => {
  return http.post('/webgw/tk/newspaperIssuePost/list', data)
}
//获取用户评论图库期数列表
export const reqListPostIssue = (data: IReqListPostIssueQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw/tk/newspaperIssuePost/listPostIssue', data)
}
//获取用户帖子期数列表
export const reqBbsForumListPostIssue = (
  data: IReqBbsForumListPostIssueQueryParams
): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw/bbsForumPost/listPostIssue', data)
}

//获取用户评论列表
// /webgw/bbsForumPost/commentList
export const reqBbsCommentListPostIssue = (
  data: IReqBbsCommentListPostIssueQueryParams
): Promise<IResponse<IReqBbsCommentListPostIssueData>> => {
  return http.post('/webgw/bbsForumPost/commentList', data)
}

//刷新缓存
export const refreshCache = (data: { gameType: string }): Promise<IBaseResponse<never>> => {
  return http.post('webgw/bbsForumPost/refreshCache', data)
}

export const reqBbsCommentStatusPostIssue = (
  data: IReqBbsCommentStatusPostIssueQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/bbsForumPost/updateStatus', data)
}

//查看完整邮箱号码
export const reqShowEmail = (userId: any) => {
  return http.get(`/webgw/user/showEmail/${userId}`)
}

//获取用户勋章
export const reqUserAchievement = (data: any) => {
  return http.post('/webgw/userMedal/page', data)
}

//设置用户勋章
export const setUserAchievement = (data: any) => {
  return http.post('/webgw/userMedal/set', data)
}

//单个用户积分
export const setTransferScore = (data: ISetTransferScoreQueryParams): Promise<IResponse<never>> => {
  return http.post('/webgw/score/transferScore', data)
}

export const reqUserRewardList = (data: IReqUserRewardListQueryParams): Promise<IResponse<IReqUserRewardListData>> => {
  return http.post('/webgw/userReward/list', data)
}

// 上传打赏规则
export const reqRuleChange = (data: any): Promise<IResponse<never>> => {
  return http.post('/webgw/reward/uploadRule', data)
}

// 获取列表  POST /webgw/reward/listRule
export const reqGetRuleList = (): Promise<
  IBaseResponse<{ list: IReqGetRuleListData[]; delayEffect: boolean; effectTime: number }>
> => {
  return http.get('/webgw/reward/listRule')
}

// 六合王
/**
 * 对应六合王 统计接口 获取六合王用户信息接口(这个类型传心水)
 * @param data
 * @returns
 */
export const reqSixKingList = (data: IReqSixKingListQueryParams): Promise<IResponse<IReqSixKingListData>> => {
  return http.post('/webgw/predict/sixKing', data)
}

/**
 * 连胜榜
 * @param data
 * @returns
 */
export const reqWinningStreakList = (
  data: IReqWinningStreakListQueryParams
): Promise<IResponse<IReqWinningStreakListData>> => {
  return http.post('/webgw/predict/continueWinList', data)
}

/**
 * 获取平台切换信息接口
 * @param data
 * @returns
 */
export const reqPlatformSwitchInfo = (
  data: IReqPlatformSwitchInfoQueryParams
): Promise<IBaseResponse<IReqPlatformSwitchInfoData>> => {
  return http.post('/webgw/predict/platformSwitchInfo', data)
}

/**
 * 专家统计
 * @param data
 * @returns
 */
export const reqExpertStatistics = (
  data: IReqExpertStatisticsQueryParams
): Promise<IBaseResponse<IReqExpertStatisticsData>> => {
  return http.post('/webgw/predict/expertStatistics', data)
}

/**
 * 历史冠军
 * @param data
 * @returns
 */
export const reqHistoricalChampion = (
  data: IReqHistoricalChampionQueryParams
): Promise<IResponse<IReqHistoricalChampionData>> => {
  return http.post('/webgw/predict/historicalChampion', data)
}

// /webgw/tk/newspaperIssuePost/userIssuePosts

export const reqSixKingGallery = (data: IReqSixKingGalleryQueryParams): Promise<IResponse<IReqSixKingGalleryData>> => {
  return http.post('/webgw/tk/newspaperIssuePost/userIssuePosts', data)
}

export const createPredictR = (data: ICreatePredictRQueryParams): Promise<IBaseResponse<ICreatePredictRData>> => {
  return http.post('/webgw/predict/createPredictR', data)
}

// ip属地
export const getIpTopList = (): Promise<IBaseResponse<IGetIpTopListData[]>> => {
  return http.get('webgw/ip/top')
}
export interface IReqUserWithdrawalAccountListData {
  platName: string
  platAccount: string
  userName: string
  platId: string
}

// 获取用户提现账号列表
export const reqUserWithdrawalAccountList = (data: {
  userId: string
}): Promise<IBaseResponse<IReqUserWithdrawalAccountListData[]>> => {
  return http.post('/webgw/userWithdrawalAccount/list', data)
}

export interface IReqUserWithdrawalAccountUpdateData {
  userId: string
  accounts: {
    platName: string
    platAccount: string
    userName: string
  }[]
}
// 更新用户提现账号
export const reqUserWithdrawalAccountUpdate = (
  data: IReqUserWithdrawalAccountUpdateData
): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/userWithdrawalAccount/update', data)
}
