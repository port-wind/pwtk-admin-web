export interface IReqSensitiveWordListQueryParams {
  page: number // 页码 (page number)
  size: number // 每页显示条数 (items per page)
  sortName?: string // 排序字段名 (sort field name, optional)
  sortOrder?: 'ASC' | 'DESC' // 排序方向 (sort direction, optional)
  id?: number // 敏感词ID (sensitive word ID, optional)
  word?: string // 敏感词内容 (sensitive word content, optional)
  status?: number // 敏感词状态：1 表示启用，0 表示禁用 (status: 1 enabled, 0 disabled, optional)
  statusDesc?: string // 敏感词状态描述 (status description, optional)
  createdAt?: string // 创建时间 (creation time, format: yyyy-MM-dd HH:mm:ss, optional)
  startTime?: string
  endTime?: string
}

export interface IReqSensitiveWordListData {
  createdAt: number
  id: string
  status: number
  statusDesc: string
  word: string
}

export interface IReqAddSensitiveWordListQueryParams {
  word: string
  status: number // 1.启动，0. 禁用
}

export interface IReqUpdateSensitiveWordListQueryParams {
  id: string
  word: string
  status: number
}

export interface IReqDeleteSensitiveWordListQueryParams {
  id: string
  word: string
}

export interface IReqBatchDeleteSensitiveWordListQueryParams {
  id: string
  word: string
}
