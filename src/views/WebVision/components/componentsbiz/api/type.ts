import type { ResponseType } from 'axios'

export interface BaseResponse {
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
}

export interface IBaseResponse<T> {
  data?: T
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
}

interface IData<T> {
  total: string
  list: T[]
}
export interface IResponse<T> {
  total: string
  list: any
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
  data: IData<T>
}

export interface AxiosInstanceOptions {
  baseurl?: string
  contenttype?: string
  responseType?: ResponseType
  timeout?: number
  isAdd?: boolean
}

export interface IAccountInfoData {
  id: string
  username: string
  state: number
  createTime: number
  cc: string
  phone: string
  googleSecret: string
  roleIds: string[]
}
