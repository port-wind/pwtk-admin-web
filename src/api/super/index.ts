import { qs } from '@/utils/dataFormat'
import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type { ISSOLoginData, ISSOLoginQueryParams } from './types'

enum api {
  GetAll = '/webgw/manageSite/listValidManageSite'
}

// ssoToken cid
export const SSOLogin = (data: ISSOLoginQueryParams): Promise<IBaseResponse<ISSOLoginData>> => {
  const queryString = qs(data)
  return http.get('/ssoLogin?' + queryString)
}

export const reqManageSiteList = (data: any) => {
  return http.post(api.GetAll, data)
}

export const reqWebsitePush = (data: any) => {
  return http.post('/webgw/super/tk/website/push', data)
}

export const reqWebsiteGuaranteePush = (data: any) => {
  return http.post('/webgw/super/tk/website/guarantee/push', data)
}

export const reqBbsPush = (data: any) => {
  return http.post('/webgw/tk/bbs/push', data)
}

export const reqNewsPaperIssuePush = (data: any) => {
  return http.post('/webgw/super/tk/newsPaperIssue/push', data)
}
