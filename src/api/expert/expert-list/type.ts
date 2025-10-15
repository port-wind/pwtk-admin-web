export interface IGetExpertListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段
  sortOrder?: 'ASC' | 'DESC' // 排序顺序
  loginOrUserId?: string // 登录ID或用户ID（模糊匹配）
  nickname?: string // 昵称
  status?: '0' | '1' // 状态 0未启用，1启用
  applyStartTime?: number // 申请开始时间
  applyEndTime?: number // 申请结束时间
  updateStartTime?: number // 更新开始时间
  updateEndTime?: number // 更新结束时间
}
export interface IGetExpertListData {
  userId: string // 用户ID
  loginId: string // 登录ID
  avatar: string // 头像
  nickname: string // 昵称
  fans: number // 粉丝数
  vipLevel: number // 用户等级
  status: '1' | '2' // 专家状态（1生效中，2已过期）
  expertWay: '1' | '2' // 申请方式（1自己申请，2参与竞选）
  handler: string // 操作人
  createTime: string // 申请时间 (yyyy-MM-dd HH:mm:ss)
  updateTime: string // 更新时间 (yyyy-MM-dd HH:mm:ss)
}
