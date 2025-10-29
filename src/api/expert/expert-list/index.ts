import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IGetExpertListData, IGetExpertListQueryParams } from './type'

export const listRulesConfig = (): Promise<any> => {
  return http.get('webgw/expert/listRule')
}

export const uploadRule = (data: any): Promise<any> => {
  return http.post('/webgw/expert/uploadRule', data)
}

export const getExpertList = (data: IGetExpertListQueryParams): Promise<IResponse<IGetExpertListData>> => {
  return http.post('webgw/expert/list', data)
}

export const updateStatus = (data: any): Promise<any> => {
  return http.post('webgw/expert/updateStatus', data)
}
