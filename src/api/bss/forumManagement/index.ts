import http from '@/utils/http/index'
import type {
  AddRequest,
  AddResponse,
  BbsForumDTO,
  BbsForumListForPostReq,
  DelRequest,
  DelResponse,
  EditRequest,
  EditResponse,
  IGetBBsForumIdByIdData,
  IGetBBsForumIdByIdQueryParams
} from './types'
import type { IBaseResponse, IResponse } from '@/api/type'

enum api {
  GetAll = '/webgw/bbsForum/list',
  //创建
  AddOne = '/webgw/bbsForum/create',
  // 删除
  DeleteOne = '/webgw/bbsForum/delete',
  //修改
  EditOne = '/webgw/bbsForum/edit',
  // 模糊查询
  SearchList = '/webgw/bbsForum/listForPost'
}

// 获取论坛列表
export const getBBsForumIdById = (data: IGetBBsForumIdByIdQueryParams): Promise<IResponse<IGetBBsForumIdByIdData>> => {
  return http.post(api.GetAll, data)
}

// 模糊搜索
export const getBBsForumIdBySearchValue = (data: BbsForumListForPostReq): Promise<IBaseResponse<BbsForumDTO[]>> => {
  return http.post(api.SearchList, data)
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
  return http.post('webgw/bbsForum/getByForumIdAndMainboardId', data)
}
