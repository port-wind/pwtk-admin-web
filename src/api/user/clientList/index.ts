import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IReqClientListData, IReqClientListQueryParams } from './type'

//获取客户端列表
export const reqClientList = (data: IReqClientListQueryParams): Promise<IResponse<IReqClientListData>> => {
  return http.post('/webgw/userDevice/list', data)
}

//获取匿名期数
export const reqListDeviceVoteIssue = () => {
  return http.get('/webgw/vote/listDeviceVoteIssue')
}
