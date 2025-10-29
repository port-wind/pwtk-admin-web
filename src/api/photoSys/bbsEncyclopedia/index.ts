import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IBbsListData, IBbsListQueryParams } from './type'
// Query game type series list
export const list = (data: IBbsListQueryParams): Promise<IResponse<IBbsListData>> => {
  return http.post('webgw/tk/bbs/list', data)
}

// Create new game type series
export const create = (data: any) => {
  return http.post<any>('webgw/tk/bbs/create', data)
}

// Edit game type series
export const edit = (data: any) => {
  return http.post<any>('webgw/tk/bbs/edit', data)
}

// Delete game type series
export const del = (data: any) => {
  return http.post<any>('webgw/tk/bbs/delete', data)
}
export interface IExistSiteNameQueryParams {
  siteName: string
}
// Check if the site name exists
export const existSiteName = (data: IExistSiteNameQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post('webgw/tk/bbs/existSiteName', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/list', data)
}

export const existSiteId = (data: any) => {
  return http.post<any>('webgw/tk/bbs/existSiteId', data)
}

//模糊查询id信息
export const getListBlurSiteId = (data: any) => {
  return http.post<any>('webgw/tk/bbs/listBlurSiteId', data)
}

//模糊查询名称信息
export const getListBlurSiteName = (data: any) => {
  return http.post<any>('webgw/tk/bbs/listBlurSiteName', data)
}
