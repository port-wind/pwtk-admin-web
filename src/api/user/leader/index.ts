import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IGetFansData,
  IGetFansQueryParams,
  IGetHeatData,
  IGetHeatQueryParams,
  IGetScoreData,
  IGetScoreQueryParams,
  IGetWinnerData
} from './type'

// 获取热度总榜
export const getHeat = (data: IGetHeatQueryParams): Promise<IResponse<IGetHeatData>> => {
  return http.post('/webgw/ranking/heat', data)
}

export interface IGetIntegrateQueryParams {}
export interface IGetIntegrateData {}
// 综合榜
export const getIntegrate = (data: IGetIntegrateQueryParams): Promise<IResponse<IGetIntegrateData>> => {
  return http.post('/webgw/ranking/integrate', data)
}

// 粉丝榜
export const getFans = (data: IGetFansQueryParams): Promise<IResponse<IGetFansData>> => {
  return http.post('/webgw/ranking/fans', data)
}

// 积分榜
export const getScore = (data: IGetScoreQueryParams): Promise<IResponse<IGetScoreData>> => {
  return http.post('/webgw/ranking/score', data)
}

// 榜首
export const getWinner = (): Promise<IBaseResponse<IGetWinnerData>> => {
  return http.get('/webgw/ranking/winner')
}
