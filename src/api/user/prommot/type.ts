export interface IReqPromoteListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名 (optional)
  sortOrder?: 'DESC' | 'ASC' // 排序方式 (optional)
  searchId?: string // 检索ID (内容为用户ID或登录ID, max length: 20)
  nickname?: string // 邀请人昵称 (max length: 64)
  promotionCode?: string // 邀请码 (max length: 8)
  inviteLowerLimit?: number // 邀请人数下限 (default: 0)
  inviteUpperLimit?: number // 邀请人数上限 (default: 99999)
  awardLowerLimit?: number // 奖励积分下限 (default: 0, max value: 999999999)
  awardUpperLimit?: number // 奖励积分上限 (default: 0, max value: 999999999)
}

export interface IReqPromoteListData {
  userId: string // 邀请人用户ID
  loginId?: string // 邀请人登录ID (optional)
  nickname?: string // 邀请人昵称 (optional)
  status?: string // 邀请人状态 (optional)
  promotionCode: string // 邀请码 (optional)
  inventCount?: number // 邀请人数 (default: 0)
  level1Count?: number // 一级拉新用户数 (default: 0)
  level2Count?: number // 二级拉新用户数 (default: 0)
  updateTime?: string // 更新时间 (format: yyyy-MM-dd HH:mm:ss, optional)
  awardScore?: number // 奖励积分 (default: 0, optional)
}

export interface IReqPromoteListRuleData {
  ruleId: number // 规则ID（修改规则时用）
  bizName: string // 业务名称
  bizDesc: string // 业务名称文字描述
  enable: boolean // 启用/关闭
  currentEnable: boolean // 启用/关闭（正在生效）
  enableItemEditable: boolean // 启用/关闭项是否可编辑
  currentEnableItemEditable: boolean // 启用/关闭项是否可编辑（正在生效）
  value: number // 数值
  currentValue: number // 数值（正在生效）
}

export interface IReqDetailListQueryParams {
  page: number
  size: number
  promotionCode: string
  sortName?: string
  sortOrder?: 'DESC' | 'ASC'
}
export interface IReqDetailListData {
  userId: string // int64
  loginId: string
  nickname: string
  userStatus: string
  promotionCodeList: string[] // array of strings
  cnt: number // int32
  regTime: string // format: yyyy-MM-dd HH:mm:ss
}
