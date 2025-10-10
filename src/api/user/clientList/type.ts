export interface IReqClientListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  cid?: string // 客户端ID, 最大长度128
  searchId?: string // 检索ID, 模糊匹配用户ID或登录ID, 最大长度20
  businessType?: 'S_WEB' | 'C_APP' | 'C_WEB' | 'C_H5' // 客户端类型
  regIP?: string // 注册IP
  regStartTime?: string // 注册开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  regEndTime?: string // 注册结束时间 (格式: yyyy-MM-dd HH:mm:ss)
}

export interface IReqClientListData {
  cid: string // 客户端ID
  ua: string // 客户端代理 (User Agent)
  regIP: string // 注册IP
  regTime: string // 注册时间 (格式: yyyy-MM-dd HH:mm:ss)
  businessType: 'S_WEB' | 'C_APP' | 'C_WEB' | 'C_H5' // 客户端类型 (可选)
  clientFlag: 'w' | 'h' | 'a' | 'i' // 终端标记 (web, H5, android, iOS 可选)
  os: string // 终端信息 (可选)
  lastUserId: number // 设备最近绑定的用户ID
  lastUserLoginId: string // 设备最近绑定的用户登录ID (可选)
}
