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

enum api {
  //查询
  GetAll = 'webgw/bbs/list ',
  //创建
  AddOne = '/webgw/bbs/create',
  // 删除
  DeleteOne = '/webgw/bbs/delete',
  //修改
  EditOne = '/webgw/bbs/edit'
  // GetOne = '/webgw/domain/getUserDomainConfig'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp: (data: GetRequest) => Promise<GetResponse> = (data: GetRequest) => {
  return http.post(api.GetAll, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addHttp: (data: Partial<AddRequest>) => Promise<AddResponse> = (data: Partial<AddRequest>) => {
  return http.post(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delHttp: (data: DelRequest) => Promise<DelResponse> = (data: DelRequest) => {
  return http.post(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editHttp: (data: EditRequest) => Promise<EditResponse> = (data: EditRequest) => {
  return http.post(api.EditOne, data)
}

//精准查询bbs
export const queryHttp = (data: any) => {
  return http.post('webgw/bbs/getByBbsId', data)
}
