import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IReqDetailListQueryParams,
  IReqDetailListData,
  IReqPromoteListData,
  IReqPromoteListQueryParams,
  IReqPromoteListRuleData
} from './type'

export interface IReqPromoteListRule<T> {
  enable: boolean
  delayEffect: boolean
  effectTime?: string
  list: T[]
  ruleList?: T[]
}
export const reqPromoteListRule = (): Promise<IBaseResponse<IReqPromoteListRule<IReqPromoteListRuleData>>> => {
  return http.get('/webgw/promote/listRule')
}

export const reqPromoteList = (data: IReqPromoteListQueryParams): Promise<IResponse<IReqPromoteListData>> => {
  return http.post('/webgw/promote/list', data)
}

export interface IReqPromoteUploadRuleQueryParams {
  ruleId: number
  enable: boolean
  value: number
}
export const reqPromoteUploadRule = (
  data: IReqPromoteListRule<IReqPromoteUploadRuleQueryParams>
): Promise<IResponse<never>> => {
  return http.post('/webgw/promote/uploadRule', data)
}

export const reqDetailList = (data: IReqDetailListQueryParams): Promise<IResponse<IReqDetailListData>> => {
  return http.post('/webgw/promote/detailList', data)
}
