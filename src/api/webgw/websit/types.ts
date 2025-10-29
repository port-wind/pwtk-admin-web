export interface TableData {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
  pageCode: string // 页面编码
}

export interface IGetWebsiteComponentQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: 'ASC' | 'DESC' // 排序方向
  componentId?: string // 组件ID
  websiteId?: string // 站点ID
  componentType?: string // 组件类型，最大长度128
  componentName?: string // 组件名称，最大长度128
  configParamJsonOff?: '1' | '2' // 组件参数配置开关，1:显示 2:不显示
  pageCode?: string // 页码code
}
export interface IGetWebsiteComponentData {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效, n: 无效
  isView: 'y' | 'n' // 是否可见; y: 可见, n: 不可见
  pageCode: string // 页码code
  componentDTO: IGetWebsiteComponentData
}

export interface IAddWebsiteComponentQueryParams {
  websiteId: string // 站点ID
  componentType?: string // 组件类型
  componentRef?: string // 引用组件ID
  componentName?: string // 组件名称
  pageRenderingSeq?: number // 页面渲染顺序，默认为0
  configParamJson?: string // 组件参数配置
  memo?: string // 备注
  status?: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView?: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
  pageCode: string // 页面编码
}

export interface IEditWebsiteComponentQueryParams {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
  pageCode: string
}

export interface IDelWebsiteComponentQueryParams {
  componentId: string[] // 组件ID
  pageCode: string
}
export interface IDelWebsiteComponentData {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
}

export interface IFindWebsiteComponentQueryParams {
  websiteId: string // 组件ID
}
export interface IFindWebsiteComponentData extends TableData {}
export interface GetByIdResponse {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
}

export interface IUpdateSitePageRenderingSeqQueryParams {
  list?: { componentId: string; pageRenderingSeq: number }[] // 组件列表，可选
  websiteId?: string // 网点ID，可选，最大长度 32，需符合正则 /^[0-9-_]+$，仅修改页面顺序时需要
}

export interface IUpdateSitePageRenderingSeqData extends TableData {}

export interface updateRendSeqResponse {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo: string // 备注
  status: 'y' | 'n' // 状态; y: 有效; n: 无效;
  isView: 'y' | 'n' // 是否可见; y: 可见; n: 不可见;
}

export interface IBatchUpsertWebsiteComponentQueryParams {
  componentId?: string /** 组件ID，如果不指定表示新增，指定表示更新 */
  websiteId?: string /** 模板ID，最大长度为8，必须匹配  */
  componentType?: string /** 组件类型 */
  componentName?: string /** 组件名称 */
  pageRenderingSeq?: number /** 页面渲染顺序，仅数字  */
  configParamJson?: string /** 组件参数配置，JSON 字符串 */
  status?: 'y' | 'n' /** 状态：y（有效），n（无效） */
  isView?: 'y' | 'n' /** 是否可见：y（可见），n（不可见） */
  memo?: string /** 备注 */
  pageCode?: string /** 页码 code */
}

export interface IBatchUpsertWebsiteComponentData {
  websiteId: string /** 模板ID，最大长度为8，必须匹配  */
  componentId?: string /** 组件ID，如果不指定表示新增，指定表示更新 */
  componentType?: string /** 组件类型 */
  componentName?: string /** 组件名称 */
  pageRenderingSeq?: number /** 页面渲染顺序，仅数字  */
  configParamJson?: string /** 组件参数配置，JSON 字符串 */
  status?: 'y' | 'n' /** 状态：y（有效），n（无效） */
  isView?: 'y' | 'n' /** 是否可见：y（可见），n（不可见） */
  memo?: string /** 备注 */
  pageCode?: string /** 页码 code */
  componentDTO: IBatchUpsertWebsiteComponentData & ITemplate
}

interface ITemplate {
  templateId: string
}
