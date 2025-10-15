import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IAddresourceQueryParams,
  IDeletesourceQueryParams,
  IEditresourceQueryParams,
  IGetMobileListData,
  IGetMobileListQueryParams,
  IMenu,
  IMenuExtends,
  IMenulistQueryParams,
  IMenupageData,
  IOperationLogListData,
  IOperationLogListQueryParams
} from './type'

//获取操作日志列表
export const operationLogList = (data: IOperationLogListQueryParams): Promise<IResponse<IOperationLogListData>> => {
  return http.post('/account/operationLog/list', data)
}
// 获取菜单栏列表
export const getmenulist = (): Promise<IBaseResponse<IMenu[]>> => {
  return http.get('/menu/index')
}

export interface IMenupermissionsData {
  permList: string[]
}

//获取权限集
export const menupermissions = (): Promise<IBaseResponse<IMenupermissionsData>> => {
  return http.get('/menu/permissions')
}

//获取资源管理列表
export const menulist = (data: IMenulistQueryParams): Promise<IBaseResponse<IMenuExtends[]>> => {
  return http.post('/menu/list', data)
}

//资源列表新增资源
export const addresource = (data: IAddresourceQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/menu/add', data)
}

//资源列表修改资源
export const editresource = (data: IEditresourceQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/menu/edit', data)
}

//资源列表删除资源
export const deletesource = (data: IDeletesourceQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/menu/delete', data)
}

//资源列表获取路由地址
export const menupage = (): Promise<IResponse<IMenupageData>> => {
  return http.get('/menu/page')
}

// /webgw/mobileAuthCode/list
export const getMobileList = (data: IGetMobileListQueryParams): Promise<IResponse<IGetMobileListData>> => {
  return http.post('/webgw/mobileAuthCode/list', data)
}
