export interface IGetBuyingListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段
  sortOrder?: 'ASC' | 'DESC' // 排序顺序
  id?: number // 买料ID
  userId?: number // 买料userId
  nickname?: string // 买人昵称
  saleUserId?: number // 卖心水人ID
  saleNickname?: string // 卖心水人昵称
  startTime?: number // 开始时间 (时间戳)
  endTime?: number // 结束时间 (时间戳)
  payStatus?: '0' | '1' | '2' // 购买状态 (0未到账，1已到账，2已退回)
  guaranteed?: 'y' | 'n' // 担保支付 (y是, n否)
}

export interface IGetBuyingListData {
  id: number // 买料ID
  userId: number // 购买人ID
  predictionId: number // 心水ID
  predictionUser: number // 卖心水人ID
  beforeBalance: number // 购买前余额
  point: number // 花费积分
  afterBalance: number // 购买后余额
  guaranteed: 'y' | 'n' // 是否包赔：y是，n否
  gameTypeCode: number // 彩种code
  gameTypeName: string // 彩种name
  payStatus: '0' | '1' | '2' // 积分支付状态：0未支付，1已支付，2已退还
  payStatusName: string // 支付状态
  createTime: string // 购买时间，格式：yyyy-MM-dd HH:mm:ss
  updateTime?: string // 更新时间，格式：yyyy-MM-dd HH:mm:ss
  loginId: string // 买心水人账号
  nickname: string // 买心水人昵称
  avatar?: string // 买心水人头像
  saleLoginId: string // 卖心水人账号
  saleUserId: number // 卖心水人userId
  saleNickname: string // 卖心水人昵称
  saleAvatar?: string // 卖心水人头像
}

export interface IListOfSaleIdsQueryParams {
  ruleId: number // Rule ID
  enable: boolean // Enable/Disable
  value: number // Numeric value
}
