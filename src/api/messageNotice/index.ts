import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IReqAnnouncementAddQueryParams,
  IReqAnnouncementDeleteQueryParams,
  IReqAnnouncementEditQueryParams,
  IReqAnnouncementEditStatusQueryParams,
  IReqAnnouncementListData,
  IReqAnnouncementListQueryParams,
  IReqListBlurTemplateData,
  IReqListBlurTemplateQueryParams,
  IReqListScopeValuesData,
  IReqListScopeValuesQueryParams,
  IReqMaintainAddQueryParams,
  IReqMaintainDeleteQueryParams,
  IReqMaintainEditQueryParams,
  IReqMaintainListQueryParams,
  IReqPlanEditStatusQueryParams
} from './type'

//消息维护计划管理获取列表
export const reqMaintainList = (data: IReqMaintainListQueryParams): Promise<IResponse<never>> => {
  return http.post('/webgw/maintain/list', data)
}

// 消息维护计划管理编辑
export const reqMaintainEdit = (data: IReqMaintainEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/maintain/edit', data)
}

// 消息维护计划管理删除
export const reqMaintainDelete = (data: IReqMaintainDeleteQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/maintain/delete', data)
}

// 消息维护计划管理新增
export const reqMaintainAdd = (data: IReqMaintainAddQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/maintain/add', data)
}
// 消息维护计划管理状态变更
export const reqPlanEditStatus = (data: IReqPlanEditStatusQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/maintain/editStatus', data)
}

// 消息维护计划模糊查询获取所有的模版ID
export const reqListScopeValues = (
  data: IReqListScopeValuesQueryParams
): Promise<IBaseResponse<IReqListScopeValuesData>> => {
  return http.post('/webgw/maintain/scopeValues', data)
}

//公告列表获取
export const reqAnnouncementList = (
  data: IReqAnnouncementListQueryParams
): Promise<IResponse<IReqAnnouncementListData>> => {
  return http.post('/webgw/announcement/list', data)
}

// 公告管理编辑
export const reqAnnouncementEdit = (data: IReqAnnouncementEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/announcement/edit', data)
}

// 公告管理删除
export const reqAnnouncementDelete = (data: IReqAnnouncementDeleteQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/announcement/delete', data)
}

// 公告管理新增
export const reqAnnouncementAdd = (data: IReqAnnouncementAddQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/announcement/create', data)
}

// 公告管理状态变更
export const reqAnnouncementEditStatus = (
  data: IReqAnnouncementEditStatusQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/announcement/editStatus', data)
}

// 公告模糊查询获取所有的模版ID
export const reqListBlurTemplate = (
  data: IReqListBlurTemplateQueryParams
): Promise<IBaseResponse<IReqListBlurTemplateData>> => {
  return http.post('/webgw/announcement/scopeValues', data)
}

// 公告列表获取（排序）
export const reqAnnouncementListWithSort = (data: any): Promise<IResponse<any>> => {
  return http.get('/webgw/announcement/list-with-sort', data)
}

// 公告列表排序
export const reqAnnouncementSort = (data: string[]): Promise<IResponse<any>> => {
  return http.post('/webgw/announcement/set-sort', data)
}
