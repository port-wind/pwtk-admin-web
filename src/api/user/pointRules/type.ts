export interface IReqPointRulesStarDetailQueryParams {
  /** 页码 */
  page: number // int32, required, default: 0
  /** 每页显示条数 */
  size: number // int32, required, default: 0
  /** 排序字段 */
  sortName?: string // string, optional
  /** 排序方式 */
  sortOrder?: 'ASC' | 'DESC' // enum, optional, default: 'ASC'
  /** 用户ID */
  userId?: number // int64, optional, default: 0
  /** 昵称 */
  nickname?: string // string, optional, max: 64
  /** 查看类型 */
  type?: number // int32, optional
  /** 获取/消耗积分类型 */
  bizTypeCode?: string // string, optional
  /** 开始时间 */
  startTime?: string // string, optional, format: yyyy-MM-dd HH:mm:ss
  /** 结束时间 */
  endTime?: string // string, optional, format: yyyy-MM-dd HH:mm:ss
}
export interface IReqPointRulesStarDetailData {
  /** 用户ID */
  userId: number // int64, required, default: 0
  /** 用户登录ID */
  loginId: string // string, required
  /** 用户昵称 */
  nickname: string // string, required
  /** 星星场景名称 */
  bizName: string // string, required
  /** 星星场景文字描述 */
  bizDesc: string // string, required
  /** 星星场景类型 */
  bizType: number // int32, required, default: 0
  /** 业务类型编码 */
  bizTypeCode: string // string, required
  /** 变动前余额 */
  beforeStar: number // int64, required, default: 0
  /** 星星变动 (获取为正整数，消费为负整数) */
  changeStar: number // int64, required, default: 0
  /** 变动后余额 */
  afterStar: number // int64, required, default: 0
  /** 操作时间 */
  createTime: string // string, required, format: yyyy-MM-dd HH:mm:ss
}

export interface IReqPointRulesDetailQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段
  sortOrder?: 'ASC' | 'DESC' // 排序顺序
  userId?: number // 用户ID
  nickname?: string // 用户昵称
  type?: number // 查看类型 (1: 积分增加, 2: 积分减少)
  bizTypeCode?: string // 获取/消耗积分类型
  startTime?: string // 开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  endTime?: string // 结束时间 (格式: yyyy-MM-dd HH:mm:ss)
}
export interface IReqPointRulesDetailData {
  userId: number // 用户ID
  loginId: string // 用户登录ID
  nickname: string // 用户昵称
  bizName: string // 积分场景名称
  bizDesc: string // 积分场景文字描述
  bizType: number // 积分场景类型
  bizTypeCode: string // 业务类型编码
  beforeScore: number // 变动前余额
  changeScore: number // 积分变动 (获取积分是正整数；消费积分是负整数)
  afterScore: number // 变动后余额
  operatorDesc: string // 操作人文字描述 (用户触发；系统触发)
  createTime: string // 操作时间 (格式: yyyy-MM-dd HH:mm:ss)
  reason?: string // 原因（主要是管理员给用户发放积分）
}
