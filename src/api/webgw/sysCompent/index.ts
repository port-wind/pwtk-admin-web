import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IEditSysComponentQueryParams,
  IDelSysComponentQueryParams,
  IAddSysComponentQueryParams,
  IGetComponentIdAndNameQueryParams,
  IGetSysComponentQueryParams,
  IGetSysComponentData,
  IRegIdOrNameData,
  IDelSysComData
} from './types'

// 获取所有域名 /webgw/domain/getDomainConfig
export const getSysComponent = (data: IGetSysComponentQueryParams): Promise<IResponse<IGetSysComponentData>> => {
  return http.post('webgw/sysComponent/getSysComponent', data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addSysComponent = (data: IAddSysComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sysComponent/addSysComponent', data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delSysComponent = (data: IDelSysComponentQueryParams): Promise<IBaseResponse<IDelSysComData[]>> => {
  return http.post('webgw/sysComponent/delSysComponent', data)
}

// 编辑域名  /editDomainConfig
export const editSysComponent = (data: IEditSysComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sysComponent/editSysComponent', data)
}

//获取组件ID和name
export const getComponentIdAndName = (
  data: IGetComponentIdAndNameQueryParams
): Promise<IResponse<IRegIdOrNameData>> => {
  return http.post('webgw/sysComponent/getComponentIdAndName', data)
}
