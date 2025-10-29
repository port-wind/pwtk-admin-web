import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { SiteInfo } from './types'
const prefix = '/super'

//获取管理站点
export const reqHttp = (data: any): Promise<IResponse<SiteInfo>> => {
  return http.post('/webgw' + prefix + '/manageSite/list', data)
}

//添加管理站点
export const addHttp = (data: any) => {
  return http.post('/webgw' + prefix + '/websiteManage/addWebsiteManage', data)
}

//修改管理站点
export const editHttp = (data: any) => {
  return http.post('/webgw' + prefix + '/websiteManage/editWebsiteManage', data)
}

//删除管理站点
export const delHttp = (data: any) => {
  return http.post('/webgw' + prefix + '/websiteManage/delWebsiteManage', data)
}
