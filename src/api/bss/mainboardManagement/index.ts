import http from '@/utils/http/index'
import type {
  AddRequest,
  AddResponse,
  DelRequest,
  DelResponse,
  EditRequest,
  EditResponse,
  GetRequest,
  GetResponse
} from './types'
import type { IResponse } from '@/types/Request'

enum api {
  GetAll = '/webgw/bbsMainboard/list',
  //创建
  AddOne = '/webgw/bbsMainboard/create',
  // 删除
  DeleteOne = '/webgw/bbsMainboard/delete',
  //修改
  EditOne = '/webgw/bbsMainboard/edit'
}

export interface IReqHttpResponse {
  mainboardId?: string
  bbsId?: string
  mainbordName?: string
  createTime?: string
  mainboardIcon?: string
  mainboardStatus?: string
  bbsName?: string
  isRecommended?: string
  isHot?: string
  isTop?: string
  isSelected?: string
  isBloom?: string
  gcFlag?: 'ogc' | 'ugc' | 'pgc' // 如果可枚举，建议用 enum 或字面量类型
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: GetRequest): Promise<IResponse<IReqHttpResponse>> => {
  return http.post(api.GetAll, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addHttp = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delHttp = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editHttp = (data: EditRequest) => {
  return http.post<EditResponse>(api.EditOne, data)
}

//精准查询
export const queryHttp = (data: any) => {
  return http.post('webgw/bbsMainboard/getByMainboardIdAndBbsId', data)
}
