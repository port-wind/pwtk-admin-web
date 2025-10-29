import http from '@/utils/http/index'
import type { IGetBuyingListData, IGetBuyingListQueryParams, IListOfSaleIdsQueryParams } from './type'
import type { IBaseResponse, IResponse } from '@/api/type'

export const getBuyingList = (data: IGetBuyingListQueryParams): Promise<IResponse<IGetBuyingListData>> => {
  return http.post('webgw/predict/buyList', data)
}

export const listOfSaleIds = (data: IListOfSaleIdsQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/expert/uploadRule', data)
}
