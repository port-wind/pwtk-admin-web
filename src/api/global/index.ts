import type { IGameType, IGameTypePlatformBodyParameter, IPointEvent, IStarBizType } from '@/api/global/types'
import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'

//获取游戏类型 彩种
export const getGameTypePlatformList = (data: IGameTypePlatformBodyParameter): Promise<IResponse<IGameType>> => {
  return http.post('webgw/tk/gameTypePlatform/list', data) // 作为通用接口，业务上只需要 status=y的数据，其他数据不需要
}

// 获取积分活动列表
export const reqStarActivityList = (): Promise<IResponse<IPointEvent>> => {
  return http.get('/webgw/userScore/listBizType')
}

// 获取星星活动列表
export const getStarBizTypeList = (): Promise<IBaseResponse<IStarBizType[]>> => {
  return http.get('/webgw/userScore/listStarBizType')
}
