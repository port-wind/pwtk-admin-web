import http from '@/utils/http/index'
import type {
  IReqDomainQueryParams,
  GetResponse,
  EditRequest,
  EditResponse,
  DelRequest,
  DelResponse,
  IAddDomainQueryParams,
  IReqDomainData,
  IGetWebsiteRefMsgByDomainQueryParams,
  IGetWebsiteRefMsgByDomainData,
  IEditDomainQueryParams,
  IGetDomainDetailQueryParams,
  IGetDomainDetailData
} from './types'
import type { IBaseResponse, IResponse } from '@/api/type'

enum api {
  GetAll = '/webgw/domain/getDomainConfig',
  AddOne = '/webgw/domain/addDomainConfig',
  DeleteOne = '/webgw/domain/delDomainConfig',
  EditOne = '/webgw/domain/editDomainConfig',
  GetOne = '/webgw/domain/getClientDomainConfig',
  GetWebsiteRefMsgByDomain = '/webgw/domain/getWebSite',
  GetTemplateRefMsgByDomain = '/webgw/domain/getTemplate',
  GetSketchRefMsgByDomain = '/webgw/domain/getSketch',
  GetLangCodes = '/webgw/domain/getLangCodes',
  GetAreaCodes = '/webgw/domain/getAreaCodes',
  GetDomainByFilter = '/webgw/domain/selectDomainAndIdName'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqDomain = (data: IReqDomainQueryParams): Promise<IResponse<IReqDomainData>> => {
  return http.post(api.GetAll, data)
}

export interface IGetDomainByFilterQueryParams {
  domain: string
}

// 添加域名  /webgw/domain/addDomainCon
export const addDomain = (data: IAddDomainQueryParams): Promise<IBaseResponse<never>> => {
  return http.post(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delDomain = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editDomain = (data: IAddDomainQueryParams): Promise<IBaseResponse<never>> => {
  return http.post<EditResponse>(api.EditOne, data)
}

// 获取所有用户ID
export const reqAllUserID = (data: {}) => {
  return http.post(api.EditOne, data)
}

// 通过domain获取一条具体信息
export const getDomainDetail = (data: IGetDomainDetailQueryParams): Promise<IBaseResponse<IGetDomainDetailData>> => {
  return http.post(api.GetOne, data)
}
export interface IGetLangCodesQueryParams {
  websiteId: string | undefined
}
export interface IGetLangCodesData {
  sketchLangCodes: string[]
  websiteLangCodes: string[]
}

export interface IGetAreaCodesQueryParams {
  websiteId: string | undefined
}
export interface IGetAreaCodesData {
  sketchAreaCodes: string[]
  websiteAreaCodes: string[]
}
// 获取语言list
export const GetLangCodes = (data: IGetLangCodesQueryParams): Promise<IBaseResponse<IGetLangCodesData>> => {
  return http.post(api.GetLangCodes, data)
}
// 获取地区list
export const GetAreaCodes = (data: IGetAreaCodesQueryParams): Promise<IBaseResponse<IGetAreaCodesData>> => {
  return http.post(api.GetAreaCodes, data)
}

// 通过domain获取绑定的站点信息
export const getWebsiteRefMsgByDomain = (
  data: IGetWebsiteRefMsgByDomainQueryParams
): Promise<IResponse<IGetWebsiteRefMsgByDomainData>> => {
  return http.post(api.GetWebsiteRefMsgByDomain, data)
}
// 通过domain获取模板信息
export const getTemplateRefMsgByDomain = (data: {}) => {
  return http.post(api.GetTemplateRefMsgByDomain, data)
}
// 通过domain获取草图信息
export const getSketchRefMsgByDomain = (data: {}) => {
  return http.post(api.GetSketchRefMsgByDomain, data)
}
