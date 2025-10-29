/**
 * 组件数据类型
 */
export interface TableData {
  componentId: string // 组件ID
  templateId: string // 模板ID
  componentType: string // 组件类型
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
  memo: string // 备注
  websiteId: string
  pageCode: string
}
export interface AddRequest {
  templateId: string // 模板ID (必填)
  componentType: string // 组件类型 (必填)
  componentName: string // 组件名称 (必填)
  pageRenderingSeq?: number // 页面渲染顺序 (必填) - Validate ]
  configParamJson?: string // 组件参数配置 (可选)
  status?: 'y' | 'n' // 状态 (可选); y: 有效; n: 无效;
  isView?: 'y' | 'n' // 是否可见 (可选); y: 可见; n: 不可见;
  memo?: string // 备注 (可选)
}
export interface EditRequest {
  componentId: string // 组件ID (必填)
  templateId?: string // 模版ID (可选)
  componentType?: string // 组件类型 (可选)
  componentName?: string // 组件名称 (可选)
  pageRenderingSeq?: number // 页面渲染顺序 (可选) - Validate ]
  configParamJson?: string // 组件参数配置 (可选)
  status?: 'y' | 'n' // 状态 (可选); y: 有效; n: 无效;
  isView?: 'y' | 'n' // 是否可见 (可选); y: 可见; n: 不可见;
  memo?: string // 备注 (可选)
}
export interface DelRequest {
  componentId: string[] // 组件ID
}

export interface IGetComponentListQueryParams {
  templateId: string // 组件ID
}
export interface IGetComponentListData {
  componentId: string // 组件ID
  templateId: string // 模版ID
  componentType: string // 组件类型
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
  memo: string // 备注
  pageCode: string
}

export interface IUpdatePageRenderingSeqQueryParams {
  templateId: string // 组件ID,
  list: IGetComponentListData[]
}

export interface IGetTemplateComponentQueryParams {
  page: number // 页码，必填，默认 0
  size: number // 每页显示条数，必填，默认 0
  sortName?: string // 排序字段名，可选
  sortOrder?: 'ASC' | 'DESC' // 排序方向，可选，默认 ASC
  componentId?: string // 组件ID，可选，默认 0
  templateId?: string // 模板ID，可选，最大长度 128
  componentType?: string // 组件类型，可选，最大长度 128
  componentName?: string // 组件名称，可选，最大长度 128
  configParamJsonOff?: string // 组件参数配置开关，可选，1:显示 2:不显示，默认 1，最大长度 1
  pageCode?: string // 页码code，可选
}
export interface IGetTemplateComponentData {
  componentId?: string // 组件ID，可选
  templateId?: string // 模板ID，可选
  componentType?: string // 组件类型，可选
  componentName?: string // 组件名称，可选
  pageRenderingSeq?: number // 页面渲染顺序，可选
  configParamJson?: string // 组件参数配置，可选
  status?: 'y' | 'n' // 状态，可选，y:有效, n:无效
  isView?: 'y' | 'n' // 是否可见，可选，y:可见, n:不可见
  memo?: string // 备注，可选
  pageCode?: string // 页码code，可选
}

export interface IAddTemplateComponentQueryParams {
  componentType: string // 组件类型，必填
  templateId: string // 模板ID，必填，最大长度 8，需符合正则
  componentName: string // 组件名称，必填
  pageRenderingSeq?: number // 页面渲染顺序，可选，需符合正则
  configParamJson?: string // 组件参数配置，可选
  status?: 'y' | 'n' // 状态，可选，y:有效, n:无效
  isView?: 'y' | 'n' // 是否可见，可选，y:可见, n:不可见
  memo?: string // 备注，可选
  pageCode?: string // 页码code，可选
}

export interface IEditTemplateComponentQueryParams extends IAddTemplateComponentQueryParams {
  componentId: string
}

export interface IDelTemplateComponentQueryParams {
  componentId: string[]
}

export interface IBatchUpsertTemplateComponentQueryParams {
  componentId?: string // 组件ID，不指定表示新增，指定表示更新
  templateId?: string // 模板ID，最多8位，字母数字 - _
  componentType?: string // 组件类型
  componentName?: string // 组件名称
  pageRenderingSeq?: number // 页面渲染顺序，仅数字
  configParamJson?: string // 组件参数配置，JSON字符串
  status?: 'y' | 'n' // 状态: y=有效, n=无效
  isView?: 'y' | 'n' // 是否可见: y=可见, n=不可见
  memo?: string // 备注
  pageCode?: string // 页码code
}

export interface IBatchUpsertTemplateComponentData {
  componentId: string // 组件ID
  templateId: string // 模板ID
  componentType: string // 组件类型
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置（JSON 字符串）
  status: 'y' | 'n' // 状态: y=有效, n=无效
  isView: 'y' | 'n' // 是否可见: y=可见, n=不可见
  memo: string // 备注
  pageCode: string // 页码 code
}

export interface ICopyTemplateByIdQueryParams {
  templateId: string // 源
  copyToTemplateId: string // 目标
}
