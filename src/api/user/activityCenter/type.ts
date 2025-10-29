export interface IReqHttpActivityCenterQueryParams {
  page: number // Page number
  size: number // Items per page
  sortName?: string // Sorting field name (optional)
  sortOrder?: 'ASC' | 'DESC' // Sort direction (optional)
  activityName?: string // Activity name (optional, max length 255)
  beginTime?: string // Start time (optional)
  endTime?: string // End time (optional)
  talents?: string[] // Target audience/objects (optional, max length 255 for each)
  clientType?: string // Client/object type (optional, max length 1)
}
export interface IReqHttpActivityCenterData {
  taskId: number // int64
  activityId: string
  activityName: string
  beginTime: string // Format: yyyy-MM-dd HH:mm:ss
  endTime: string // Format: yyyy-MM-dd HH:mm:ss
  talents: string[] // Array of strings
  url: string
  routeType: string
  clientType: string
  state: string //'0' | '1'
  remark: string
  imgPath: string
  sortNum: number // int64
  createTime: string // Format: yyyy-MM-dd HH:mm:ss
}
export interface IEditUserActivityQueryParams {
  activityId: string // Required, max length 255
  activityName: string // Required, max length 255
  beginTime?: string // Optional, format: yyyy-MM-dd HH:mm:ss
  endTime?: string // Optional, format: yyyy-MM-dd HH:mm:ss
  talents?: string[] // Optional, each item max length 255
  url?: string // Optional, max length 255
  state?: string // Optional, max length 255, typically '0' or '1'
  remark?: string // Optional, max length 255
  imgPath?: string // Optional, max length 255
  sortNum: number // Required, int64 (max value 2147483647)
  createTime?: string
}

export interface IAaddUserActivityQueryParams {
  activityName: string // Required, max length 255
  beginTime: string // Required, format: yyyy-MM-dd HH:mm:ss
  endTime: string // Required, format: yyyy-MM-dd HH:mm:ss
  talents?: string[] // Optional, each item max length 255
  url: string // Required, max length 255
  state?: '0' | '1' // Optional, '0' = disabled, '1' = enabled, max length 1
  remark?: string // Optional, max length 255
  routeType?: '0' | '1' // Optional, '0' = internal, '1' = external, max length 1
  clientType?: 'h' | 'a' | 'i' // Optional, 'h' = h5, 'a' = android, 'i' = ios, max length 1
  imgPath?: string // Optional, max length 255
  sortNum: number // Required, int64 (max value 2147483647)
  createTime?: string
}
