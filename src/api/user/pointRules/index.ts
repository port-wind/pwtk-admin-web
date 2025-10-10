import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IReqPointRulesDetailData,
  IReqPointRulesDetailQueryParams,
  IReqPointRulesStarDetailData,
  IReqPointRulesStarDetailQueryParams
} from './type'

// 获取积分规则列表
export const reqPointRules = (params: any) => {
  return http.post('/webgw/score/listRule', { ...params })
}

// 获取星星规则详情
export const reqStarRulesDetail = (params: any) => {
  return http.post('/webgw/userScore/starList', { ...params })
}

// 获取星星活动列表
export const reqStarActivityList = () => {
  return http.get('/webgw/userScore/listBizType')
}

// 获取积分活动列表
export const reqPointActivityList = () => {
  return http.get('/webgw/userScore/listBizType')
}

// 获取用户积分余额
export const reqUserScoreBalance = () => {
  return http.get('/webgw/userScore/balance')
}

// 积分统计调用，在 /webgw/score/statistics
export const reqScoreStatistics = () => {
  return http.get('/webgw/score/statistics')
}

// 星星统计调用，在 /webgw/star/statistics
export const reqStarStatistics = () => {
  return http.get('/webgw/star/statistics')
}

// 分页获取积分规则列表
export const reqPointRulesList = (params?: any) => {
  if (!params) {
    params = {}
  }
  params.size = params?.size || 999
  params.page = params?.page || 1
  return http.post('/webgw/score/listRule', { ...params })
}

export const reqTaskRewardConfig = () => {
  return http.get('/webgw/reward-score/listRule')
}

// 更新任务奖励配置
export const reqUpdateTaskRewardConfig = (params: any) => {
  return http.post('/webgw/reward-score/updateRule', params)
}

// 分页获取星星规则列表
export const reqStarRulesList = (params?: any) => {
  if (!params) {
    params = {}
  }
  params.size = params?.size || 999
  params.page = params?.page || 1
  return http.post('/webgw/star/listRule', { ...params })
}

// 更新积分规则
export const reqUpdatePointRules = (params: any) => {
  return http.post('/webgw/score/updateRule', params)
}

// 更新星星规则
export const reqUpdateStarRules = (params: any) => {
  return http.post('/webgw/star/updateRule', params)
}

// 获取积分每日限制
export const reqPointDailyLimit = () => {
  return http.get('/webgw/score/dailyLimit')
}

// 获取积分规则详情
export const reqPointRulesDetail = (
  params: IReqPointRulesDetailQueryParams
): Promise<IResponse<IReqPointRulesDetailData>> => {
  return http.post('/webgw/userScore/list', { ...params })
}
// 获取积分规则详情
export const reqPointRulesStarDetail = (
  params: IReqPointRulesStarDetailQueryParams
): Promise<IResponse<IReqPointRulesStarDetailData>> => {
  return http.post('/webgw/userScore/starList', { ...params })
}
