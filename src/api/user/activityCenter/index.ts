import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IAaddUserActivityQueryParams,
  IEditUserActivityQueryParams,
  IReqHttpActivityCenterData,
  IReqHttpActivityCenterQueryParams
} from './type'

//获取活动中心
export const reqHttpActivityCenter = (
  data: IReqHttpActivityCenterQueryParams
): Promise<IResponse<IReqHttpActivityCenterData>> => {
  return http.post('/webgw/activity/getUserActivity', data)
}

//编辑活动中心
export const editUserActivity = (data: IEditUserActivityQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/activity/editUserActivity', data)
}

//添加活动中心
export const addUserActivity = (data: IAaddUserActivityQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/activity/addUserActivity', data)
}
