import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IGameType, IGameTypePlatformBodyParameter } from '@/api/global/types'

export const gameTypePlatformList = (data: IGameTypePlatformBodyParameter): Promise<IResponse<IGameType>> => {
  return http.post('/webgw/tk/gameTypePlatform/list', data)
}
export const gameTypePlatformCreate = (data: any) => {
  return http.post('/webgw/tk/gameTypePlatform/create', data)
}
export const gameTypePlatformUpdate = (data: any) => {
  return http.post('/webgw/tk/gameTypePlatform/update', data)
}
export const gameTypePlatformListAll = (data: any) => {
  return http.post('/webgw/tk/gameTypePlatform/listAll', data)
}
