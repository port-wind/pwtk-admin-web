import http from '@/utils/http/index'
import type { IGetSaleListQueryParams, IListPlayTypeData, IGetSaleListData } from './type'
import type { IBaseResponse, IResponse } from '@/api/type'

export const getSaleList = (data: IGetSaleListQueryParams): Promise<IResponse<IGetSaleListData>> => {
  return http.post('webgw/predict/saleList', data)
}

// 玩法列表
export const listPlayType = (): Promise<IResponse<IListPlayTypeData>> => {
  //@ts-ignore
  return http.post('/webgw/predict/type/listPlayType')
}

export const lastIssuePrediction = (data: any): Promise<IBaseResponse<any>> => {
  return http.post('/webgw/predict/lastIssuePrediction', data)
}

export const updateSaleStatusByIds = (data: {
  predictIds: string[]
  reviewStatus: 'y' | 'n'
}): Promise<IBaseResponse<any>> => {
  return http.post('/webgw/predict/updateSaleStatusByIds', data)
}

export const predictSaleDetail = (data: { predictId: string }): Promise<IBaseResponse<any>> => {
  return http.post('/webgw/predict/saleDetail', data)
}
