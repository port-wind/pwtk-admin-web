import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IReqAdvertisementCreateQueryParams,
  IReqAdvertisementGetOneQueryParams,
  IReqAdvertisementlistBlurSiteIdQueryParams,
  IReqAdvertisementlistBlurSiteNameQueryParams,
  IReqAdvertisementListData,
  IReqAdvertisementListQueryParams
} from './type'

// 新增
export const reqAdvertisementCreate = (data: IReqAdvertisementCreateQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/tk/advertisement/create', data)
}
export interface IReqAdvertisementDeleteQueryParams {
  siteId: string
}
// 删除
export const reqAdvertisementDelete = (data: IReqAdvertisementDeleteQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/tk/advertisement/delete', data)
}
export interface IReqAdvertisementEditQueryParams extends IReqAdvertisementCreateQueryParams {
  siteId: string
}
// 更新
export const reqAdvertisementEdit = (data: IReqAdvertisementEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/tk/advertisement/edit', data)
}

// webgw/tk/advertisement/detail
export const reqAdvertisementGetOne = (
  data: IReqAdvertisementGetOneQueryParams
): Promise<IBaseResponse<IReqAdvertisementListData>> => {
  return http.post('webgw/tk/advertisement/detail', data)
}

// 查询广告大全列表
export const reqAdvertisementList = (
  data: IReqAdvertisementListQueryParams
): Promise<IResponse<IReqAdvertisementListData>> => {
  return http.post('webgw/tk/advertisement/list', data)
}
export interface IReqAdvertisementExistSiteNameQueryParams {
  siteName: string
}
// 检查网站名称是否已存在
export const reqAdvertisementExistSiteName = (
  data: IReqAdvertisementExistSiteNameQueryParams
): Promise<IBaseResponse<boolean>> => {
  return http.post('webgw/tk/advertisement/existSiteName', data)
}

export const reqAdvertisementlistBlurSiteId = (
  data: IReqAdvertisementlistBlurSiteIdQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/tk/advertisement/listBlurSiteId', data)
}

export const reqAdvertisementlistBlurSiteName = (
  data: IReqAdvertisementlistBlurSiteNameQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/tk/advertisement/listBlurSiteName', data)
}
