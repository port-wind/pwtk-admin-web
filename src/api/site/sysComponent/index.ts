import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IReqAddSysCompQueryParams,
  IReqEditSysCompQueryParams,
  IReqGetAllCompTypeData,
  IReqGetAllCompTypeQueryParams,
  IReqSysCompListData,
  IReqSysCompListQueryParams
} from './type'

//系统组件列表查询
export const reqSysCompList = (data: IReqSysCompListQueryParams): Promise<IResponse<IReqSysCompListData>> => {
  return http.post('/webgw/sysComponent/getSysComponent', data)
}

//系统组件新增
export const reqAddSysComp = (data: IReqAddSysCompQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/sysComponent/addSysComponent', data)
}

//系统组件编辑
export const reqEditSysComp = (data: IReqEditSysCompQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/sysComponent/editSysComponent', data)
}

//获取所有组件类型
export const reqGetAllCompType = (data: IReqGetAllCompTypeQueryParams): Promise<IResponse<IReqGetAllCompTypeData>> => {
  return http.post('/webgw/sysComponent/getComponentIdAndName', data)
}

//删除系统组件
export const deleteSysComp = (data: { componentId: string }): Promise<IResponse<IReqGetAllCompTypeData>> => {
  return http.post('/webgw/sysComponent/delSysComponent', data)
}
