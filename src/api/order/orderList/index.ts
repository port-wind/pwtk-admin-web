import http from '@/utils/http/index'
import type { IReqPaymentListData, IReqPaymentListQueryParams, IWithdrawalListRuleData } from './type'
import type { IBaseResponse, IResponse } from '@/api/type'

//用户支付订单列表
export const reqPaymentList = (data: IReqPaymentListQueryParams): Promise<IResponse<IReqPaymentListData>> => {
  return http.post('/webgw/payment/list', data)
}

export interface IConfirmPaymentQueryParams {
  payOrderId: string
  amount: number
}
//人工到账确认
export const confirmPayment = (data: IConfirmPaymentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/payment/confirm', data)
}

export interface ICancelPaymentQueryParams {
  payOrderId: string
  userId: string
}
//管理端取消未支付的订单
export const cancelPayment = (data: ICancelPaymentQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/payment/cancel', data)
}

//webgw/withdrawal/list
export const reqWithdrawalList = (data: any): Promise<IResponse<any>> => {
  return http.post('/webgw/withdrawal/list', data)
}

//webgw/withdrawal/audit
export const auditWithdrawal = (data: any): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/withdrawal/audit', data)
}

//webgw/withdrawal/listRule
export const reqWithdrawalListRule = (): Promise<IBaseResponse<IWithdrawalListRuleData>> => {
  return http.get('/webgw/withdrawal/listRule')
}

//webgw/withdrawal/uploadRule
export const uploadWithdrawalRule = (data: IWithdrawalListRuleData): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/withdrawal/uploadRule', data)
}
