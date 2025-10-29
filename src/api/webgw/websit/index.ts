import http from '@/utils/http/index'
import type {
  IEditWebsiteComponentQueryParams,
  IDelWebsiteComponentQueryParams,
  IAddWebsiteComponentQueryParams,
  IFindWebsiteComponentQueryParams,
  IUpdateSitePageRenderingSeqQueryParams,
  IUpdateSitePageRenderingSeqData,
  IFindWebsiteComponentData,
  IDelWebsiteComponentData,
  IGetWebsiteComponentQueryParams,
  IGetWebsiteComponentData,
  IBatchUpsertWebsiteComponentQueryParams,
  IBatchUpsertWebsiteComponentData
} from './types'
import type { IBaseResponse, IResponse } from '@/api/type'

// 获取所有域名 /webgw/domain/getDomainConfig
export const getWebsiteComponent = (
  data: IGetWebsiteComponentQueryParams
): Promise<IResponse<IGetWebsiteComponentData>> => {
  return http.post('webgw/websiteComponent/getWebsiteComponent', data)
}

// 添加域名 / webgw / domain / addDomainCon
export const addWebsiteComponent = (data: IAddWebsiteComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/websiteComponent/addWebsiteComponent', data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delWebsiteComponent = (
  data: IDelWebsiteComponentQueryParams
): Promise<IBaseResponse<IDelWebsiteComponentData[]>> => {
  return http.post('webgw/websiteComponent/delWebsiteComponent', data)
}

// 编辑域名  /editDomainConfig
export const editWebsiteComponent = (data: IEditWebsiteComponentQueryParams): Promise<IResponse<never>> => {
  return http.post('webgw/websiteComponent/editWebsiteComponent', data)
}
//获取组件ID和name
export const findWebsiteComponent = (
  data: IFindWebsiteComponentQueryParams
): Promise<IBaseResponse<IFindWebsiteComponentData[]>> => {
  return http.post('webgw/websiteComponent/findWebsiteComponent', data)
}

export const updateSitePageRenderingSeq = (
  data: IUpdateSitePageRenderingSeqQueryParams
): Promise<IBaseResponse<IUpdateSitePageRenderingSeqData[]>> => {
  return http.post('webgw/websiteComponent/updatePageRenderingSeq', data)
}

export const batchUpsertWebsiteComponent = (
  data: IBatchUpsertWebsiteComponentQueryParams[]
): Promise<IBaseResponse<IBatchUpsertWebsiteComponentData[]>> => {
  return http.post('webgw/websiteComponent/batchUpsertWebsiteComponent', data)
}
