import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IGameTypeSeriesDetails, IGameTypeSeriesListParameter } from '@/api/photoSys/series/types'

// Query game type series list
export const listGameTypeSeries = (data: IGameTypeSeriesListParameter): Promise<IResponse<IGameTypeSeriesDetails>> => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  return http.post('webgw/tk/gameTypeSeries/list', data)
}

// Create new game type series
export const createGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/tk/gameTypeSeries/create', data)
}

// Edit game type series
export const editGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/tk/gameTypeSeries/edit', data)
}

// Delete game type series
export const deleteGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/tk/gameTypeSeries/delete', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/list', data)
}

export const getGameTypeSeriesDetail = (data: any) => {
  return http.post<any>('webgw/tk/gameTypeSeries/detail', data)
}

//查询目前最大的排序号
export const getMaxSortNo = () => {
  return http.post<any>('webgw/tk/gameTypeSeries/getMaxSortNo', {})
}

//判断排序号是否存在
export const checkSortNoExist = (data: any) => {
  return http.post<any>('webgw/tk/gameTypeSeries/isSortNoExist', data)
}
