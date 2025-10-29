import type { BaseResponse } from '@/api/type'
export interface GetRequest {
  page: number // 页码，从 0 开始
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: 'ASC' | 'DESC' // 排序顺序
  mainboardId?: string // 主板ID
  bbsId?: string // bbs ID
  mainbordName?: string // 主板名称
  mainboardStatus?: string // 主板状态
  createTime?: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  regStartTime?: string // 注册开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  regEndTime?: string // 注册截止时间 (格式: yyyy-MM-dd HH:mm:ss)
  isRecommended?: string // 是否推荐
  isHot?: string // 是否热门
  isTop?: string // 是否置顶
  isSelected?: string // 是否精选
  isBloom?: string // 是否爆款（字段名已修正）
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}
export interface AddRequest {
  mainboardId: string // 主板ID
  bbsId: string // 论坛ID
  mainbordName?: string // 主板名称
  mainboardIcon?: string // 主板icon
  mainboardStatus?: string // 主板状态
  createTime?: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  mainboardId: string // 主板ID
  bbsId: string // 论坛ID
  mainbordName?: string // 主板名称
  mainboardIcon?: string // 主板icon
  mainboardStatus?: string // 主板状态
  createTime?: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  attachmentId: string
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  mainboardId: string // 主板ID
  bbsId: string // 论坛ID
  mainbordName: string // 主板名称
  mainboardIcon: string // 主板icon
  mainboardStatus: string // 主板状态
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'
