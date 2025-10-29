import http from '@/utils/http/index'
import type {
  AddRequest,
  AddResponse,
  DelRequest,
  DelResponse,
  EditRequest,
  EditResponse,
  IReqHttpData,
  IReqHttpQueryParams
} from './types'
import type { IResponse } from '@/api/type'

enum api {
  GetAll = 'webgw/bbsForumAttachment/list',
  //创建
  AddOne = '/webgw/bbsForumAttachment/create',
  // 删除
  DeleteOne = '/webgw/bbsForumAttachment/delete',
  //修改
  EditOne = '/webgw/bbsForumAttachment/edit'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: IReqHttpQueryParams): Promise<IResponse<IReqHttpData>> => {
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
