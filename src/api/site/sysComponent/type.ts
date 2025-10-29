export interface IReqSysCompListQueryParams {
  page: number // 页码（必填）
  size: number // 每页显示条数（必填）
  sortName?: string // 排序字段（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方向（可选）
  componentId?: string // 组件ID（仅允许数字和空格）
  componentType?: string // 组件类型：sys -> 系统组件, template -> 模板组件, website -> 网站组件
  componentName?: string // 组件名称
  sketchCodeList?: string // 草图代码数组
  status?: 'y' | 'n' | string // 状态：y=有效，n=无效
  isView?: 'y' | 'n' | string // 是否可见：y=可见，n=不可见
  configParamJsonOff?: '1' | '2' | string // 组件参数配置开关：1=显示（默认），2=不显示
  pageCode?: string // 页码code
}

export interface IReqSysCompListData extends IReqEditSysCompQueryParams {}

export interface IReqAddSysCompQueryParams {
  componenetId?: string
  componentType: string // 组件类型，必填，最大长度 128
  componentName: string // 组件名称，必填，最大长度 128
  configParamJson?: string // 组件参数配置，非必填
  sketchCodeList?: string // 草图代码数组，非必填
  componentSort?: number // 组件排序，非必填，默认 0
  status?: 'y' | 'n' // 状态，有效 y / 无效 n
  isView?: 'y' | 'n' // 是否可见，可见 y / 不可见 n
  memo?: string // 备注，非必填
  pageCode?: string // 页码code，非必填
}

export interface IReqEditSysCompQueryParams extends IReqAddSysCompQueryParams {
  componentId?: string
}

export interface IReqGetAllCompTypeData extends IReqEditSysCompQueryParams {}
export interface IReqGetAllCompTypeQueryParams extends IReqSysCompListQueryParams {}
