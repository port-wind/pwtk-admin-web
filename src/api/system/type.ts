export interface IOperationLogListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  username?: string // 操作人 (可选)
  path?: string // 接口路径 (可选)
  beginTime?: string // 开始时间 (格式: yyyy-MM-dd HH:mm:ss) (可选)
  endTime?: string // 结束时间 (格式: yyyy-MM-dd HH:mm:ss) (可选)
}

export interface IOperationLogListData {
  id: number // 操作记录唯一标识 (int64)
  accountId: number // 操作人ID (int64)
  accountName: string // 操作人用户名
  path: string // 接口路径
  interfaceDesc: string // 接口描述
  params: string // 参数
  ip: string // 操作IP
  createTime: string // 操作时间 (格式: yyyy-MM-dd HH:mm:ss)
}
export interface IMenu {
  parentId?: number // int64 - Parent directory ID (optional)
  type: number // int32 - Type: 0 for menu, 1 for button (required)
  name: string // string - Name (required)
  nameEn?: string // string - English name (optional)
  path?: string // string - Path (optional)
  component?: string // string - Frontend component route (optional)
  perms?: string // string - Permission identifier (optional)
  orderNum?: number // int32 - Sort order (optional)
}

export interface IMenupageData extends IMenu {
  id: string
}

export interface IEditresourceQueryParams extends IMenu {
  id: string
}

export interface IAddresourceQueryParams extends IMenu {}

export interface IMenulistQueryParams {
  name?: string
  type?: number //  0页面资源 1.按钮资源
}
export interface IMenuExtends extends IMenu {
  // id?: string
  // parentId: number // int64 - Parent directory number
  // type: number // int32 - Type (0 for menu, 1 for button)
  // path: string // Route path
  // name: string // Menu name
  // nameZh: string // Chinese name
  // nameEn: string // English name
  // component: string // Frontend component route
  // perms: string // Permission identifier
  // orderNum: number // int32 - Sort order
  hasParent: boolean // Whether it has a parent
  selected: boolean // Whether it is selected
  createTime: string // Creation timestamp (format: yyyy-MM-dd HH:mm:ss)
  modifyTime: string // Modification timestamp (format: yyyy-MM-dd HH:mm:ss)
  hasChildren?: boolean // Whether it has children
  children?: IMenuExtends[] // Array of child menu items
}

export interface IDeletesourceQueryParams {
  id: string
}

export interface IGetMobileListData {
  id: number // 唯一标识符 (int64)
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  cid?: string // 客户 ID
  countryCode?: string // 国家代码
  mobile?: string // 手机号
  authCode?: string // 验证码
}

export interface IGetMobileListQueryParams {
  page: number // 页码, 默认 0
  size: number // 每页显示条数, 默认 0
  sortName?: string // 排序字段名称
  sortOrder?: 'ASC' | 'DESC' // 排序方向
  mobileCountryCode?: string // 国际区号 (最多 5 位)
  mobile?: string // 检索手机号 (最多 16 位)
}
