/* eslint-disable no-unused-vars */
export enum EOrderState {
  PENDING_VALIDATION = 0, // 发起付款待验证
  VERIFIED_WAITING_PAYMENT = 1, // 已经验证，等待付款
  PAYMENT_SUCCESS = 2, // 付款成功
  TIMEOUT = 3, // 超时
  ERROR = 4, // 异常
  MANUAL_CREDIT = 5, // 人工到账
  CANCELED = 6 // 已取消
}

export interface IReqPaymentListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段
  sortOrder?: 'ASC' | 'DESC' // 排序顺序
  userId?: number | string // 用户 ID
  nickname?: string // 用户昵称
  payOrderId?: number | string // 支付订单号
  paySerialNo?: string // 第三方支付流水号
  beginCreateTime?: string // 开始创建时间 (yyyy-MM-dd HH:mm:ss)
  endCreateTime?: string // 结束创建时间 (yyyy-MM-dd HH:mm:ss)
  device?: string // 设备类型
  businessType?: string // 业务类型
  states?: EOrderState[] // 订单状态列表
  isTimeout?: boolean // 是否超时
  beginOperateTime?: string // 人工处理开始时间 (yyyy-MM-dd HH:mm:ss)
  endOperateTime?: string // 人工处理结束时间 (yyyy-MM-dd HH:mm:ss)
}

export interface IReqPaymentListData {
  payOrderId: number // 订单号;充值订单号
  bizType: string // 业务类型; 购买积分等
  bizId: number // 业务 ID
  amount: number // 支付金额
  score: number // 支付金额兑换成的等价积分数
  userId: number // 用户 ID
  createTime: string // 创建时间 (yyyy-MM-dd HH:mm:ss)
  state: EOrderState // 订单状态
  paySerialNo?: string // 支付平台流水号
  callbackTime?: string // 支付回调时间 (yyyy-MM-dd HH:mm:ss)
  callbackTimeout?: string // 支付超时时间 (yyyy-MM-dd HH:mm:ss)
  operateTime?: string // 人工到账时间 (yyyy-MM-dd HH:mm:ss)
  operateId?: number // 操作人 ID
  operateName?: string // 操作人账号
  nickname?: string // 用户昵称
  userLoginId?: string // 用户登录 ID
  cancelTime?: string // 取消时间 (yyyy-MM-dd HH:mm:ss)
  checkTime?: string // 最后一次校验时间 (yyyy-MM-dd HH:mm:ss)
  payErrorMsg?: string // 支付失败异常原因
  device?: string // 支付客户端类型
  businessType?: string // 支付业务端类型
  ipInfo?: string // IP 地址
}

// 提现规则平台信息
export interface IWithdrawalRuleItem {
  platName: string // 平台名称
  enable: boolean // 是否启用
  platId: string // 平台 ID
}

// 提现规则响应数据
export interface IWithdrawalListRuleData {
  withdrawalEnable: boolean // 提现功能是否启用
  withdrawalLowerLimitValue?: number // 提现下限
  withdrawalLowerLimitEnable?: boolean // 提现下限是否启用
  ruleList: IWithdrawalRuleItem[] // 规则列表
}
