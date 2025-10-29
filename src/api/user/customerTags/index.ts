import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'

export interface IReqCustomerTagsQueryParams {
  page: number // Page number
  size: number // Items per page
  sortName?: string // Sort field name (optional)
  sortOrder?: 'ASC' | 'DESC' // Sort direction (optional)
  tagName?: string // Tag name (optional, max length 20)
  flag?: string // Tag type (optional, max length 10)
  state?: 'y' | 'n' // Status (optional): y = normal, n = disabled
}

export interface IReqCustomerTagsData {
  tagId: string // Tag ID (int64)
  tagName: string // Tag name
  flag: string // Tag type
  state: 'y' | 'n' // Status: y = normal, n = disabled
  createTime: string // Creation/modification time (format: yyyy-MM-dd HH:mm:ss)
}

// 获取用户标签列表
export const reqCustomerTags = (params: IReqCustomerTagsQueryParams): Promise<IResponse<IReqCustomerTagsData>> => {
  return http.post('/webgw/userTag/list', { ...params })
}

export interface IUploadCustomerTagsQueryParams {}
export interface IUploadCustomerTagsData {}
// 上传用户标签
export const uploadCustomerTags = (
  data: IUploadCustomerTagsQueryParams
): Promise<IResponse<IUploadCustomerTagsData>> => {
  return http.post('/webgw/userTag/upload', data)
}

export interface IUpdateCustomerTagsQueryParams {
  tagId: number // Tag ID (required)
  tagName: string // Tag name (required, max length 20)
  flag: string // Tag type (required, max length 10)
  state?: 'y' | 'n' // Status (optional): y = normal, n = disabled
}
export interface IUpdateCustomerTagsData {}
// 更新用户标签
export const updateCustomerTags = (
  data: IUpdateCustomerTagsQueryParams
): Promise<IBaseResponse<IUpdateCustomerTagsData>> => {
  // 后台需要以数组形式接受参数
  return http.post('/webgw/userTag/update', [data])
}

export interface IGetAllCustomerTagsData {}
// 获取所有用户标签
export const getAllCustomerTags = (): Promise<IResponse<IGetAllCustomerTagsData>> => {
  return http.get('/webgw/userTag/getAllGroupByType')
}

export interface IUploadCustomerTagsRelationQueryParams {}
export interface IUploadCustomerTagsRelationData {}
// 上传用户标签关系
export const uploadCustomerTagsRelation = (
  data: IUploadCustomerTagsRelationQueryParams
): Promise<IResponse<IUploadCustomerTagsRelationData>> => {
  return http.post('/webgw/userTag/uploadTagRelation', data)
}
