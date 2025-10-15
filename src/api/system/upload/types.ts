import type { BaseResponse } from '@/api/type'
export type StorageType = 's3' | 'r2'
export type Env = 'dev' | 'test' | 'uat' | 'prod'
export type FileType = 'img' | 'ico' | 'video' | 'file'

export interface fileUploadOption {
  fileType: FileType
  uploadFrom: string
  storageStyle: number
}

export interface FileUploadRequest extends fileUploadOption {
  uploadTarget: string // 原始文件名+文件后缀: 666.png
  storageType: StorageType // 存储类型: s3, r2
  env: Env // 环境变量: dev, test, uat, prod
  file: File // 文件，不能大于10M
}

export interface FileUploadRequestWithIssueNumber extends FileUploadRequest {
  issueNumber: string
}

export interface FileUploadResponse extends BaseResponse {
  data: {
    path: string //文件uri， 例如: {env}media/{uploadFrom}/{uploadType}/24/12/{uploadTarget}
    size: string
  }
}

type SortOrder = 'ASC' | 'DESC'

export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: SortOrder // 排序顺序
  fileNameOrId?: string // 文件名称或ID
  uploadUser?: string // 上传用户ID
  uploadStartTime?: string // 上传开始时间
  uploadEndTime?: string // 上传结束时间
}

export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface TableData {
  uploadId: string // 上传ID
  fileType: string // 文件类型
  fileFrom: string // 文件来源
  fileTarget: string // 文件目标
  fileName: string // 文件名
  storageType: string // 存储类型
  storageStyle: string // 存储风格
  env: string // 环境
  recordTime: string // 记录时间，格式: yyyy-MM-dd HH:mm:ss
  uploadUser: number // 上传用户
  biz: string // 业务
}

export interface AddRequest {
  fileType: FileType
  uploadFrom: string // 客户端保留路径: sketch_code/site_template/site_id
  uploadTarget: string // 原始文件名+文件后缀: 666.png
  storageType: StorageType // 存储类型: s3, r2
  storageStyle: number
  uploadUser: string //用户ID
  biz: 'upload'
  env: Env // 环境变量: dev, test, uat, prod
  fileSize: string // 大小
}

export interface AddResponse extends BaseResponse {}
