import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type {
  IReqAddSensitiveWordListQueryParams,
  IReqBatchDeleteSensitiveWordListQueryParams,
  IReqDeleteSensitiveWordListQueryParams,
  IReqSensitiveWordListData,
  IReqSensitiveWordListQueryParams,
  IReqUpdateSensitiveWordListQueryParams
} from './type'

export const reqSensitiveWordList = (
  data: IReqSensitiveWordListQueryParams
): Promise<IResponse<IReqSensitiveWordListData>> => {
  return http.post('webgw/sensitive-word/list', data)
}

export const reqAddSensitiveWordList = (data: IReqAddSensitiveWordListQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sensitive-word/add', data)
}

export const reqBatchAddSensitiveWordList = (
  data: IReqAddSensitiveWordListQueryParams[]
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sensitive-word/batch-add', data)
}

export const reqUpdateSensitiveWordList = (
  data: IReqUpdateSensitiveWordListQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sensitive-word/update', data)
}

export const reqDeleteSensitiveWordList = (
  data: IReqDeleteSensitiveWordListQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sensitive-word/delete', data)
}

export const reqBatchDeleteSensitiveWordList = (
  data: IReqBatchDeleteSensitiveWordListQueryParams[]
): Promise<IBaseResponse<never>> => {
  return http.post('webgw/sensitive-word/batch-delete', data)
}

export const reqEnableStausSensitiveWordList = (term: string): Promise<IBaseResponse<any>> => {
  return http.post('webgw/sensitive-word/enable/' + term, {})
}

export const reqDisableStatusSensitiveWordList = (term: string): Promise<IBaseResponse<any>> => {
  return http.post('webgw/sensitive-word/disable/' + term, {})
}

export const getDetailSensitiveWord = (term: string): Promise<IBaseResponse<{ mapKey: any }>> => {
  return http.get('webgw/sensitive-word/detail/' + term)
}
