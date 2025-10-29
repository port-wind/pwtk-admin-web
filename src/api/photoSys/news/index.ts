import http from '@/utils/http/index'
import type { Newspaper, NewspaperQueryParams } from './types'
import type { IResponse } from '@/api/type'

export const create = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/create', data)
}

export const del = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/del', data)
}

export const update = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/update', data)
}

export const list = (data: NewspaperQueryParams): Promise<IResponse<Newspaper>> => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  return http.post<any>('webgw/gameTypeNewspaper/list', data)
}

export const getDetailById = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/getDetailByNewspaperCode', data)
}

export const updateStatusApi = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/updateStatus', data)
}

export const listBySeriesCode = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/listBySeriesCode', data)
}
export const getSerialAndGroup = (data: { seriesCode?: string; id?: string }) => {
  return http.post<any>('webgw/gameTypeNewspaper/getSerialAndGroup', data)
}

export const allListBySeriesCode = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/allListBySeriesCode', data)
}

export const checkNewsCode = (data: any) => {
  return http.post<any>('webqw/gameTypeNewspaper/checkNewsCode', data)
}
export const getRecommendTop = (data: any): any => {
  return http.post<any>('webgw/gameTypeNewspaper/getRecommendTop', data)
}

export const editRecommendTop = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/editRecommendTop', data)
}
export const updateRecommend = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/updateRecommend', data)
}
