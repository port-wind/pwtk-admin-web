import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IGetComponentListQueryParams,
  IUpdatePageRenderingSeqQueryParams,
  IGetTemplateComponentQueryParams,
  IGetTemplateComponentData,
  IAddTemplateComponentQueryParams,
  IEditTemplateComponentQueryParams,
  IDelTemplateComponentQueryParams,
  IGetComponentListData,
  IBatchUpsertTemplateComponentQueryParams,
  IBatchUpsertTemplateComponentData,
  ICopyTemplateByIdQueryParams
} from './types'

// 获取所有域名 /webgw/domain/getDomainConfig
/**
 * Deprecated  use getTemplateComps
 * @param data
 * @returns
 */
export const getTemplateComponent = (
  data: IGetTemplateComponentQueryParams
): Promise<IResponse<IGetTemplateComponentData>> => {
  return http.post('webgw/templateComponent/getTemplateComponent', data)
}

// webgw/templateComponent/getTemplateComps

export const getTemplateComps = (
  data: IGetTemplateComponentQueryParams
): Promise<IResponse<IGetTemplateComponentData>> => {
  return http.post('webgw/templateComponent/getTemplateComps', data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addTemplateComponent = (data: IAddTemplateComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/templateComponent/addTemplateComponent', data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delTemplateComponent = (data: IDelTemplateComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/templateComponent/delTemplateComponent', data)
}

// 编辑域名  /editDomainConfig
export const editTemplateComponent = (data: IEditTemplateComponentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/templateComponent/editTemplateComponent', data)
}
//获取组件ID和name
export const getComponentList = (
  data: IGetComponentListQueryParams
): Promise<IBaseResponse<IGetComponentListData[]>> => {
  return http.post('webgw/templateComponent/getComponentList', data)
}

// 更新模板渲染顺序
export const updatePageRenderingSeq = (
  data: IUpdatePageRenderingSeqQueryParams
): Promise<IBaseResponse<IGetComponentListData[]>> => {
  return http.post('webgw/templateComponent/updatePageRenderingSeq', data)
}

// /webgw/templateComponent/batchUpsertTemplateComponent

export const batchUpsertTemplateComponent = (
  data: IBatchUpsertTemplateComponentQueryParams[]
): Promise<IBaseResponse<IBatchUpsertTemplateComponentData[]>> => {
  return http.post('webgw/templateComponent/batchUpsertTemplateComponent', data)
}

// /webgw/templateComponent/batchCopyTemplateComponent

export const copyTemplateById = (data: ICopyTemplateByIdQueryParams): Promise<IBaseResponse<Boolean>> => {
  return http.post('webgw/templateComponent/batchCopyTemplateComponent', data)
}
