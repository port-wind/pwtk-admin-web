export interface IListBlurTemplateWithUserInfoQueryParams {
  /**
   * 模版ID(长度最 长8位) Validate[max: 8; ]
   */
  templateId?: string
  /**
   * 用户ID(长度最长32位)
   */
  ownerUserId?: string
}

export interface ISetWebSiteListIdQueryParams {
  domain: string // 必填项，最大长度为 255 字符
  domainStatus?: 'y' | 'n' //可选项，表示绑定或解绑状态："y" 代表绑定，"n" 代表解绑
  websiteId?: string //* 站点 ID
}

export interface ISetBingWebSiteData {
  /**
   * 任务 ID
   */
  taskId?: number

  /**
   * 站点 ID
   */
  websiteId: string

  /**
   * 站点内部名称
   */
  websiteInnerName?: string

  /**
   * 站点标题
   */
  websiteTitle?: string

  /**
   * 创建时间，格式为 "yyyy-MM-dd HH:mm:ss"
   */
  createTime?: string

  /**
   * 所属用户 ID
   */
  ownerUserId?: string

  /**
   * 所属用户名称
   */
  userName?: string

  /**
   * 关键字
   */
  keyWords?: string

  /**
   * 在线客服代码
   */
  onlineServiceCode?: string

  /**
   * 统计代码
   */
  hasStatsCode?: string

  /**
   * 支持的语言列表
   */
  langCodes?: string[]

  /**
   * 可访问地区列表
   */
  areaCodes?: string[]

  /**
   * 备注
   */
  memo?: string

  /**
   * 引用模板 ID
   */
  websiteTemplateRef?: string

  /**
   * 站点状态
   * "y": 启用, "m": 维护, "c": 关闭
   */
  websiteStatus?: 'y' | 'm' | 'c'

  /**
   * CDN 地址
   */
  cdnUrl?: string

  /**
   * 统计代码 JS URL
   */
  statsCodeJsUrl?: string

  /**
   * 统计代码初始化代码
   */
  statsCodeInit?: string

  /**
   * 站点描述
   */
  describe?: string

  /**
   * 模板 ID
   */
  templateName?: string

  /**
   * 是否源代码站
   * "y": 是, "n": 否
   */
  isSourceCode?: 'y' | 'n'

  /**
   * icon 地址
   */
  icon?: string

  /**
   * logo 地址
   */
  logo?: string

  /**
   * 联系方式
   */
  contactType?: string

  /**
   * APP 下载连接
   */
  appDownloadUrl?: string

  /**
   * 页面代码
   */
  pageCode?: string
}

export interface IListBlurTemplateWithUserInfoData {
  templateId: string // 模板ID
  templateName: string // 模板名称
  sketchCode: string // 模板草图代码
  langCodes: string[] // 适用的语言列表
  areaCodes: string[] // 适用的地区列表
}
export interface IGetWebSiteInfoQueryParams {
  page: number // 页码 (int32)，必填
  size: number // 每页显示条数 (int32)，必填
  ownerUserId: string // 所属用户ID (必填，最大长度 255，正整数)
  sortName?: string // 排序字段名 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序方向 (ASC/DESC，默认 ASC)，可选
  websiteId?: string // 网站ID (最大长度 255，正整数)
  websiteTemplateRef?: string // 模板ID (可选，最大长度 255)
}

export interface IReqTemplateListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  templateId?: string // 模板ID (最长8位)
  templateName?: string // 模板名称 (最长128位)
  sketchCode?: string // 模板草图代码 (最长8位)
  isSysTemplate?: string // 是否系统模板 (长度最大1位)
  ownerUserId?: string // 用户ID (长度最大32位)
}
export interface IReqTemplateListData {
  templateId: string // 模板ID
  templateName: string // 模板名称
  sketchCode: string // 模板草图代码
  sketchName: string // 草图名称
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  sysTemplateRef: string // 引用的系统模板ID
  sysTemplateRefName: string // 引用的系统模板ID名称
  isSysTemplate: string // 是否系统模板
  ownerUserId: string // 用户ID (int64)
  loginId: string // loginId
  onlineServiceCode: string // 在线客服代码
  theme: string // 主题
  loginStyle: string[] // 登录方式
  thirdLoginStyle: string[] // 支持的第三方登录方式
  memo: string // 备注
  templateStatus: 'y' | 'n' | 'm' // 模板状态 (y, 启用; n, 关闭; m, 维护)
  cdnUrl: string // CDN地址
  hasStatsCode: string // 是否有统计代码
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
  icon: string // ICON
  logo: string // LOGO
  appDownloadUrl: string // app下载连接
}

export interface IReqWebsiteCodeEditQueryParams {
  websiteId: string
  websiteInnerName?: string // 站点内部名称, max length: 128
  websiteTitle?: string // 站点标题, max length: 128
  ownerUserId?: string // 所属用户ID, numeric only
  aboutUsUrl?: string // 关于我们
  keyWords?: string // 关键字, max length: 255
  onlineServiceCode?: string // 在线客服代码, max length: 255
  hasStatsCode?: string // 统计代码, max length: 1
  langCodes?: string[] // 适用的语言列表, max length for array: 255
  areaCodes?: string[] // 适用的地区列表, max length for array: 255
  memo?: string // 备注, max length: 255
  websiteTemplateRef?: string // 引用模版ID, max length: 8
  websiteStatus?: 'y' | 'm' | 'c' // 站点状态; 'y': 启用, 'm': 维护, 'c': 关闭; max length: 1
  cdnUrl?: string // cdn地址, max length: 255
  describe?: string // 站点描述, max length: 255
  statsCodeJsUrl?: string // 统计代码JS URL, max length: 512
  statsCodeInit?: string // 统计代码 初始化代码, max length: 512
  isSourceCode?: 'y' | 'n' // 是否源代码站; 'y': 是, 'n': 否; max length: 1
  componentCount?: string // 组件数量, numeric only, max length: 11
  icon?: string // No comments provided, max length: 255
  logo?: string // No comments provided, max length: 255
  contactType?: string // No comments provided, max length: 255
  appDownloadUrl?: string // app下载连接, max length: 255
}

export interface IReqWebsiteCodeAddQueryParams {
  websiteInnerName: string // 站点内部名称, max length: 128
  websiteTitle: string // 站点标题, max length: 128
  ownerUserId?: string // 所属用户ID, numeric only
  keyWords?: string // 关键字, max length: 255
  onlineServiceCode?: string // 在线客服代码, max length: 255
  hasStatsCode?: string // 统计代码, max length: 1
  aboutUsUrl?: string
  langCodes?: string[] // 适用的语言列表, max length for array: 255
  areaCodes?: string[] // 适用的地区列表, max length for array: 255
  memo?: string // 备注, max length: 255
  websiteTemplateRef?: string // 引用模版ID, max length: 8
  websiteStatus?: 'y' | 'm' | 'c' // 站点状态; 'y': 启用, 'm': 维护, 'c': 关闭; max length: 1
  cdnUrl?: string // cdn地址, max length: 255
  describe?: string // 站点描述, max length: 255
  statsCodeJsUrl?: string // 统计代码JS URL, max length: 512
  statsCodeInit?: string // 统计代码 初始化代码, max length: 512
  isSourceCode?: 'y' | 'n' // 是否源代码站; 'y': 是, 'n': 否; max length: 1
  componentCount?: string // 组件数量, numeric only, max length: 11
  icon?: string // No comments provided, max length: 255
  logo?: string // No comments provided, max length: 255
  contactType?: string // No comments provided, max length: 255
  appDownloadUrl?: string // app下载连接, max length: 255
  createTime?: string
}

export interface IReqSysTemplateListData {
  templateId: string // 模版ID
  templateName: string // 模版名称
  sketchCode: string // 模版草图代码
  sketchName: string // 草图名称
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  sysTemplateRef: string // 引用的系统模版ID
  sysTemplateRefName: string // 引用的系统模版ID名称
  isSysTemplate: string // 是否系统模版
  ownerUserId: number // 用户ID
  loginId: string // loginId
  onlineServiceCode: string // 在线客服代码
  theme: string // 主题
  loginStyle: string[] // 登录方式
  thirdLoginStyle: string[] // 支持的第三方登录方式
  memo: string // 备注
  templateStatus: string // 模版状态 (y: 启用; n: 关闭; m: 维护)
  cdnUrl: string // cdn地址
  hasStatsCode: string // 是否有统计代码
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
  icon: string // ICON
  logo: string // LOGO
  appDownloadUrl: string // app下载连接
}

export interface IReqGetALLSketchListData {
  sketchCode: string
  sketchName: string
}

export interface IReqTemplateCreateQueryParams {
  templateId: string // 模版ID (长度最长8位, 验证: ^[A-Za-z0-9-_]+$)
  templateName: string // 模版名称 (长度最长128位)
  sketchCode: string // 模版草图代码 (长度最长8位)
  ownerUserId: string // 用户ID (长度最长32位)
  sysTemplateRef?: string // 引用的系统模版ID (长度最长8位, 可选)
  isSysTemplate?: string // 是否系统模版 (长度最长1位, 可选)
  onlineServiceCode?: string // 在线客服代码 (长度最长512位, 可选)
  theme?: string // 主题 (长度最长8位, 可选)
  loginStyle?: string[] // 登录方式 (长度最长128位, 可选)
  thirdLoginStyle?: string[] // 支持的第三方登录方式 (长度最长255位, 可选)
  memo?: string // 备注 (长度最长255位, 可选)
  templateStatus?: string // 模版状态 (长度最长1位, 可选)
  cdnUrl?: string // cdn地址 (长度最长255位, 可选)
  statsCodeJsUrl?: string // 统计代码JS URL (长度最长512位, 可选)
  statsCodeInit?: string // 统计代码 初始化代码 (可选)
  icon?: string // ICON (可选)
  logo?: string // LOGO (可选)
  appDownloadUrl?: string // app下载连接 (可选)
}

export interface ITemplateListQueryParams {
  /**  当前页码   */
  page: number
  /**  每页大小   */
  size: number
  /**  系统模板标识   */
  isSysTemplate?: 'y' | 'n' | 'L'
  /**  拥有者名称   */
  ownerName?: string
  /**  拥有者用户ID   */
  ownerUserId?: string
  /**  草图代码   */
  sketchCode?: string
  /**  排序字段名称   */
  sortName?: string
  /**  排序顺序   * 可选值为 "ASC" 或 "DESC" */
  sortOrder?: 'ASC' | 'DESC'
  /**  模板ID   */
  templateId?: string
  /**  模板名称   */
  templateName?: string
}

export interface ITemplateListData {
  /**
   * 模版ID
   */
  templateId: string

  /**
   * 模版名称
   */
  templateName: string

  /**
   * 模版草图代码
   */
  sketchCode: string

  /**
   * 草图名称
   */
  sketchName: string

  /**
   * 创建时间
   */
  createTime: Date // 使用 Date 类型来表示 LocalDateTime

  /**
   * 引用的系统模版ID
   */
  sysTemplateRef: string

  /**
   * 引用的系统模版ID名称
   */
  sysTemplateRefName: string

  /**
   * 是否系统模版
   */
  isSysTemplate: string

  /**
   * 用户ID
   */
  ownerUserId: number // 使用 number 类型来表示 Long

  /**
   * loginId
   */
  loginId: string

  /**
   * 在线客服代码
   */
  onlineServiceCode: string

  /**
   * 主题
   */
  theme: string

  /**
   * 登录方式
   */
  loginStyle: string[]

  /**
   * 支持的第三方登录方式
   */
  thirdLoginStyle: string[]

  /**
   * 备注
   */
  memo: string

  /**
   * 模版状态 (y, 启用; n, 关闭; m, 维护)
   */
  templateStatus: string

  /**
   * cdn地址
   */
  cdnUrl: string

  /**
   * 是否有统计代码
   */
  hasStatsCode: string

  /**
   * 统计代码JS URL
   */
  statsCodeJsUrl: string

  /**
   * 统计代码初始化代码
   */
  statsCodeInit: string
}

export interface IGetRefWebsiteConfigQueryParams {
  ownerUserId: string
  websiteTemplateRef: string
}
export interface IGetRefWebsiteConfigData {
  taskId: number // 任务ID
  websiteId: string // 站点ID
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes: string[] // 支持的语言列表
  areaCodes: string[] // 可访问地区列表
  memo: string // 备注
  websiteTemplateRef: string // 引用模版ID
  websiteStatus: string // 站点状态 (y: 启用, m: 维护, c: 关闭)
  cdnUrl: string // cdn地址
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
  describe: string // 站点描述
  templateName: string // 模板名称
  isSourceCode: string // 是否源代码站 (y: 是, n: 否)
  icon: string // icon
  logo: string // logo
  contactType: string // 联系方式
  appDownloadUrl: string // app下载连接
  pageCode: string // 页面代码
}

export interface IReqGetALLWebsiteListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: 'ASC' | 'DESC' // 排序方向
  websiteId?: string // 网站ID, 最大长度64, 仅允许字母、数字、空格
  websiteInnerName?: string // 网站内部名称, 最大长度128
  websiteTitle?: string // 网站标题, 最大长度128
  ownerUserId?: string // 所有者用户ID
  websiteTemplateRef?: string // 网站模板引用, 最大长度128
  langCodes?: string[] // 适用的语言列表, 最大长度255
  areaCodes?: string[] // 适用的地区列表, 最大长度255
  pageCode?: string // 组件区分code, 最大长度255
}
export interface IReqGetALLWebsiteListData {
  taskId: number // 任务ID (int64)
  websiteId: string // 站点ID
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间，格式为 yyyy-MM-dd HH:mm:ss
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes?: string[] // 支持的语言列表 (可选)
  areaCodes?: string[] // 可访问地区列表 (可选)
  memo?: string // 备注 (可选)
  websiteTemplateRef: string // 引用模板ID
  websiteStatus: 'y' | 'm' | 'c' // 站点状态 'y': 启用, 'm': 维护, 'c': 关闭
  cdnUrl?: string // CDN地址 (可选)
  statsCodeJsUrl?: string // 统计代码 JS URL (可选)
  statsCodeInit?: string // 统计代码初始化代码 (可选)
  describe?: string // 站点描述 (可选)
  templateName: string // 模板名称
  isSourceCode: 'y' | 'n' // 是否源代码站 'y': 是, 'n': 否
  icon?: string // 图标 (可选)
  logo?: string // Logo (可选)
  contactType?: string // 联系方式 (可选)
  appDownloadUrl?: string // APP下载链接 (可选)
  pageCode?: string // 页面标识代码 (可选)
}

export interface IReqClientWebsiteConfigQueryParams {
  websiteId: string
}
export interface IReqClientWebsiteConfigData {
  taskId: number // int64
  websiteId: string // 站点ID
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  aboutUsUrl?: string // 关于我们
  createTime: string // 创建时间，格式：yyyy-MM-dd HH:mm:ss
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户名称
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes: string[] // 支持的语言列表
  areaCodes: string[] // 可访问地区列表
  memo: string // 备注
  websiteTemplateRef: string // 引用模版ID
  websiteStatus: 'y' | 'm' | 'c' // 站点状态 'y' 启用, 'm' 维护, 'c' 关闭
  cdnUrl: string // CDN地址
  statsCodeJsUrl: string // 统计代码 JS URL
  statsCodeInit: string // 统计代码初始化代码
  describe: string // 站点描述
  templateName: string // 模板ID
  isSourceCode: 'y' | 'n' // 是否源代码站 'y' 是, 'n' 否
  icon: string // icon
  logo: string // logo
  contactType: string // 联系方式
  appDownloadUrl: string // app下载连接
  pageCode: string // app下载页面代码
}
export interface IReqSketchInfoByWebsiteIdQueryParams {
  websiteId: string // 是，站点ID，最大长度 255
  type: '1' | '2' // 是，查询状态：'1' 已绑定域名（默认），'2' 未绑定域名，长度为 1
  domainStatus?: 'y' | 'n' // 否，域名状态：'y' 绑定, 'n' 解绑，长度为 1
  domain?: string // 否，域名，最大长度 255
}
export interface IReqClientTemplateInfoByWebsiteIdQueryParams {
  websiteId: string // 是，站点ID，最大长度 255
  type: '1' | '2' // 是，查询状态：'1' 已绑定域名（默认），'2' 未绑定域名，长度为 1
  domainStatus?: 'y' | 'n' // 否，域名状态：'y' 绑定, 'n' 解绑，长度为 1
  domain?: string // 否，域名，最大长度 255
}
export interface IReqSketchInfoByWebsiteIdData {
  taskId: number // int64, 任务ID
  sketchCode: string // 草图编码
  sketchName: string // 草图名称
  sketchType: string // 草图类型
  langCodes: string[] // 适用的语言列表
  memo: string // 备注
  areaCodes: string[] // 适用的地区列表
  createTime: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  sketchStatus: 'y' | 'n' // 草图状态: 'y' 启用, 'n' 关闭
}
export interface IReqClientTemplateInfoByWebsiteIdData {
  taskId: number // int64
  templateId: string // 模版ID
  templateName: string // 模版名称
  sketchCode: string // 模版草图代码
  sketchName: string // 草图名称
  createTime: string // 创建时间, 格式: yyyy-MM-dd HH:mm:ss
  sysTemplateRef: string // 引用的系统模版ID
  sysTemplateRefName: string // 引用的系统模版ID名称
  isSysTemplate: string // 是否系统模版
  ownerUserId: number // 用户ID (int64)
  loginId: string // 登录ID
  onlineServiceCode: string // 在线客服代码
  theme: string // 主题
  loginStyle: string[] // 登录方式列表
  thirdLoginStyle: string[] // 支持的第三方登录方式列表
  memo: string // 备注
  templateStatus: 'y' | 'n' | 'm' // 模版状态: 'y' 启用, 'n' 关闭, 'm' 维护
  cdnUrl: string // CDN地址
  hasStatsCode: string // 是否有统计代码
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
  icon: string // ICON
  logo: string // LOGO
  appDownloadUrl: string // APP下载连接
  component: TemplateComponent[] // 组件列表
  pageCode: string // 页码code
  componentCount: string // 组件数量
}

interface TemplateComponent {
  componentId: string // 组件ID
  templateId: string // 模版ID
  componentType: string // 组件类型
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  status: 'y' | 'n' // 状态: 'y' 有效, 'n' 无效
  isView: 'y' | 'n' // 是否可见: 'y' 可见, 'n' 不可见
  componentSort: number // 组件排序 (int32)
  memo: string // 备注
}

export interface IReqTemplateInfoByTemplateIdQueryParams {
  templateId: string
}
export interface IReqTemplateInfoByTemplateIdData {
  templateId: string // 模版ID
  templateName: string // 模版名称
  templateInfo: Record<string, string | number | boolean | null>
  sketchCode: string // 模版草图代码
  sketchName: string // 草图名称
  createTime: string // 创建时间
  sysTemplateRef: string // 引用的系统模版ID
  sysTemplateRefName: string // 引用的系统模版ID名称
  isSysTemplate: string // 是否系统模版
  ownerUserId: number // 用户ID
  loginId: string // loginId
  onlineServiceCode: string // 在线客服代码
  theme: string // 主题
  loginStyle: string[] // 登录方式
  thirdLoginStyle: string[] // 支持的第三方登录方式
  memo: string // 备注
  templateStatus: string // 模版状态(y,启用;n,关闭;m,维护)
  cdnUrl: string // cdn地址
  hasStatsCode: string // 是否有统计代码
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
  icon: string // ICON
  logo: string // LOGO
  appDownloadUrl: string // app下载连接
}

export interface IReqIsTemplateNameExitQueryParams {
  templateName: string
  templateId?: string
}

export interface ISearchPromotionCodeQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方式（可选）
  promotionCode?: string // 促销代码（最多 8 个字符）
}

export interface ISearchPromotionCodeData {
  userId: number // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  promotionCode: string // 推广码
  createTime: string // 创建时间（通常是ISO 8601格式的时间字符串）
}

export interface IReqWebsiteCodeStatusQueryParams {
  websiteId: string
  websiteStatus: string
}
