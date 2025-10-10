import type { BaseResponse } from '@/api/type'

export interface IReqDomainQueryParams {
  /** 页码，类型为整数，必填 */
  page: number // int32

  /** 每页显示条数，类型为整数，必填 */
  size: number // int32

  /** 排序字段名称，类型为字符串，选填 */
  sortName?: string // string

  /** 排序顺序，类型为枚举，选填 */
  sortOrder?: 'ASC' | 'DESC' // enum

  /** 域名，类型为字符串，选填，最大长度255 */
  domain?: string // string

  /** 所属用户ID，类型为字符串，选填，最大长度128 */
  ownerUserId?: string // string

  /** 绑定的站点ID，类型为字符串，选填，最大长度255 */
  websiteRef?: string // string

  /** 适用的语言列表，类型为数组，选填，最大长度255 */
  langCodes?: string[] // array

  /** 适用的地区列表，类型为数组，选填，最大长度255 */
  areaCodes?: string[] // array

  /** 站点标题，类型为字符串，选填，最大长度128 */
  websiteTitle?: string // string

  /** 站点内部名称，类型为字符串，选填，最大长度128 */
  websiteInnerName?: string // string

  /** 域名状态，类型为字符串，选填，最大长度1 */
  domainStatus?: 'y' | 'n' | string // string
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface IAddDomainQueryParams {
  domain: string // 域名, max length: 255
  ownerUserId?: string // 所属用户ID, optional, must be numeric
  websiteRef?: string // 绑定的站点ID, optional, max length: 32, must be numeric
  onlineServiceCode?: string // 在线客服代码, optional, max length: 255
  keyWords?: string // 关键字, optional, max length: 255
  isSupportSsl?: string // 是否配置ssl证书, optional, max length: 1
  cdnUrl?: string // cdn地址, optional, max length: 255
  domainStatus?: string // 域名状态, optional, max length: 1
  domainType?: string // 域名类型 (f,前端;m,管端;z,总管;p,前端永久;b,前端备用), optional, max length: 1
  domainFrom?: string // 域名来源, optional, max length: 1
  langCodes?: string[] // 适用的语言列表, optional, max length: 255
  areaCodes?: string[] // 适用的地区列表, optional, max length: 255
  landingPage?: string // 落地页, optional, max length: 1
  isForceHttps?: string // 是否强制https访问, optional, max length: 1
  sslExpiry?: string // ssl证书到期日期, optional, max length: 100
  isAppDownloadHint?: string // 是否提示app下载, optional, max length: 1
  opsManageCode?: string // ops管理代码, optional, max length: 8
  memo?: string // 备注, optional, max length: 255
  descriptions?: string // 网站描述, optional, max length: 255
  promotionCode?: string // 默认推广码, optional, max length: 32
  statsCodeInit?: string // Statistics code init, optional, max length: 1000
  statsCodeJsUrl?: string // Statistics code JS URL, optional, max length: 512
  statsCodeInit2?: string // Statistics code init 2, optional, max length: 1000
  statsCodeJsUrl2?: string // Statistics code JS URL 2, optional, max length: 512
  statsCodeInit3?: string // Statistics code init 3, optional, max length: 1000
  statsCodeJsUrl3?: string // Statistics code JS URL 3, optional, max length: 512
  statsCodeInit4?: string // Statistics code init 4, optional, max length: 1000
  statsCodeJsUrl4?: string // Statistics code JS URL 4, optional, max length: 512
  icon?: string // Icon, optional, max length: 1000
  logo?: string // Logo, optional, max length: 1000
  appDownloadUrl?: string // App download URL, optional, max length: 255
  aboutUsUrl?: string // About us URL, optional, max length: 255
  officialDomainList?: string // Official domain list, optional, max length: 4096
  backDomainList?: string // Backup domain list, optional, max length: 4096
  isShown?: string // 是否前端显示, optional, max length: 1
  hasStatsCode?: string
  createTime?: string // 创建时间
}

export interface IEditDomainQueryParams {
  domain: string // 域名 (max length: 255)
  ownerUserId?: string // 所属用户ID (optional, regex: ^[0-9]*$)
  websiteRef?: string // 绑定的站点ID (optional, max length: 32, regex: ^[0-9]*$)
  onlineServiceCode?: string // 在线客服代码 (optional, max length: 255)
  keyWords?: string // 关键字 (optional, max length: 255)
  isSupportSsl?: string // 是否配置ssl证书 (optional, max length: 1)
  cdnUrl?: string // CDN 地址 (optional, max length: 255)
  domainStatus?: string // 域名状态 (optional, max length: 1)
  domainType?: 'f' | 'm' | 'z' | 'p' | 'b' // 域名类型 (optional, max length: 1, predefined values)
  domainFrom?: string // 域名来源 (optional, max length: 1)
  hasStatsCode?: string // 统计代码 (optional, max length: 1)
  langCodes?: string[] // 适用的语言列表 (optional, max length: 255)
  areaCodes?: string[] // 适用的地区列表 (optional, max length: 255)
  landingPage?: string // 落地页 (optional, max length: 1)
  isForceHttps?: string // 是否强制 https 访问 (optional, max length: 1)
  sslExpiry?: string // SSL 证书到期日期 (optional, regex: ^[0-9T:-]*$)
  isAppDownloadHint?: string // 是否提示app下载 (optional, max length: 1)
  opsManageCode?: string // OPS 管理代码 (optional, max length: 8)
  memo?: string // 备注 (optional, max length: 255)
  descriptions?: string // 网站描述 (optional, max length: 255)
  promotionCode?: string // 默认推广码 (optional, max length: 32)
  statsCodeInit?: string // 统计代码初始化 (optional, max length: 1000)
  statsCodeJsUrl?: string // 统计代码 JS 地址 (optional, max length: 1000)
  icon?: string // 图标 (optional, max length: 1000)
  logo?: string // Logo (optional, max length: 1000)
  appDownloadUrl?: string // App 下载地址 (optional, max length: 255)
}

export interface EditRequest {
  appDownloadUrl: string
  userName?: string
  icon: any
  logo: any
  websiteInnerName: string
  createTime: string | number
  statsCodeJsUrl: string
  statsCodeInit: string
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置ssl证书
  cdnUrl: string // cdn地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  langCodes: string[] // 适用的语言列表
  areaCodes: string[] // 适用的地区列表
  landingPage: string // 落地页
  isForceHttps: string // 是否强制https访问
  sslExpiry: string // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // ops管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
}
export const initEditFormModel = (): EditRequest => ({
  appDownloadUrl: '',
  statsCodeInit: '',
  statsCodeJsUrl: '',
  domain: '', // 域名
  ownerUserId: '', // 所属用户ID
  websiteRef: '', // 绑定的站点ID
  onlineServiceCode: '', // 在线客服代码
  keyWords: '', // 关键字
  isSupportSsl: 'n', // 是否配置ssl证书
  cdnUrl: '', // cdn地址
  domainStatus: 'n', // 域名状态
  domainType: '', // 域名类型
  domainFrom: '', // 域名来源
  hasStatsCode: 'n', // 统计代码
  langCodes: [], // 适用的语言列表
  areaCodes: [], // 适用的地区列表
  landingPage: 'p', // 落地页
  isForceHttps: '', // 是否强制https访问
  sslExpiry: '', // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: 'n', // 是否提示app下载
  opsManageCode: '', // ops管理代码
  memo: '', // 备注
  descriptions: '', // 网站描述
  promotionCode: '', // 默认推广码
  icon: null, // Icon图片URL
  logo: null, // Logo图片URL
  websiteInnerName: '', // 网站内部名称
  createTime: '' // 创建时间
})

export interface IGetDomainByFilterData {
  taskId: number // Task ID
  websiteId: string // Site ID
  websiteInnerName: string // Internal site name
  websiteTitle: string // Site title
  createTime: string // Creation time (format: yyyy-MM-dd HH:mm:ss)
  ownerUserId: string // User ID associated with the site
  userName: string // User name associated with the site
  keyWords: string // Keywords
  onlineServiceCode: string // Online customer service code
  hasStatsCode: string // Statistics code
  langCodes: string[] // List of supported languages
  areaCodes: string[] // List of accessible areas
  memo: string // Notes
  websiteTemplateRef: string // Template reference ID
  websiteStatus: 'y' | 'm' | 'c' // Site status: y (enabled), m (maintenance), c (closed)
  cdnUrl: string // CDN URL
  statsCodeJsUrl: string // Statistics code JavaScript URL
  statsCodeInit: string // Initialization code for statistics
  describe: string // Site description
  templateName: string // Template ID
  isSourceCode: 'y' | 'n' // Whether it is a source code site: y (yes), n (no)
  icon: string // Icon
  logo: string // Logo
  contactType: string // Contact type
  appDownloadUrl: string // App download URL
  pageCodeCopy: string // Page code copy (extra field for app download URL duplicate)
}

export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  domain: string
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置ssl证书
  cdnUrl: string // cdn地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  areaCodes: string[] // 可以访问地区列表
  langCodes: string[] // 可以支持语言列表
  landingPage: string[] // 落地页
  isForceHttps: string // 是否强制https访问
  sslExpiry: string // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // ops管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
  createTime: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'

// 定义请求参数接口
export interface IReqDomainData {
  taskId: number // 任务ID
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置ssl证书
  cdnUrl: string // cdn地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型 (f:前端, m:管端, z:总管, p:前端永久, b:前端备用)
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  areaCodes: string[] // 可以访问地区列表
  langCodes: string[] // 可以支持语言列表
  landingPage: string // 落地页
  isForceHttps: string // 是否强制https访问
  sslExpiry: string // ssl证书到期日期
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // ops管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
  createTime: string // 创建时间 (yyyy-MM-dd HH:mm:ss)
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
  statsCodeJsUrl2: string // 统计代码JS URL2
  statsCodeInit2: string // 统计代码 初始化代码2
  statsCodeJsUrl3: string // 统计代码JS URL3
  statsCodeInit3: string // 统计代码 初始化代码3
  statsCodeJsUrl4: string // 统计代码JS URL4
  statsCodeInit4: string // 统计代码 初始化代码4
  websiteTitle: string // 站点标题
  websiteInnerName: string // 站点内部名称
  icon: string // ICON
  logo: string // LOGO
  appDownloadUrl: string // app下载连接
  aboutUsUrl: string // 【关于我们】富文本内容的链接
  officialDomainList: string // 官方域名列表 (半角,号分隔)
  backDomainList: string // 备用域名列表 (半角,号分隔)
  isShown: string // 是否在前端显示
  modifyTime: string // 修改时间 (yyyy-MM-dd HH:mm:ss)
}

export interface IGetWebsiteRefMsgByDomainQueryParams {
  domain: string
  domainStatus?: string
  websiteId?: string
}
export interface IGetWebsiteRefMsgByDomainData {
  taskId: number // int64
  websiteId: string // 站点ID
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间, 格式: yyyy-MM-dd HH:mm:ss
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户名称
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes: string[] // 支持的语言列表
  areaCodes: string[] // 可访问地区列表
  memo: string // 备注
  websiteTemplateRef: string // 引用模版ID
  websiteStatus: string // 站点状态 (y:启用, m:维护, c:关闭)
  cdnUrl: string // cdn地址
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
  describe: string // 站点描述
  templateName: string // 模板ID
  isSourceCode: string // 是否源代码站 (y:是, n:否)
  icon: string // icon
  logo: string // logo
  contactType: string // 联系方式
  appDownloadUrl: string // app下载连接
  pageCode: string // app下载连接
}

export interface IGetDomainDetailQueryParams {
  domain: string // 域名 (required, max length: 255)
  domainStatus?: 'y' | 'n' // 域名状态 (optional, max length: 1; 'y' for 绑定, 'n' for 解绑)
  websiteId?: string // 站点ID (optional, max length: 255; required when binding, optional when unbinding)
}
export interface IGetDomainDetailData {
  taskId: number // 任务ID (int64)
  domain: string // 域名
  aboutUsUrl?: string
  ownerUserId?: string // 所属用户ID (optional)
  userName?: string // 所属用户名 (optional)
  websiteRef?: string // 绑定的站点ID (optional)
  onlineServiceCode?: string // 在线客服代码 (optional)
  keyWords?: string // 关键字 (optional)
  isSupportSsl?: string // 是否配置SSL证书 (optional)
  cdnUrl?: string // CDN地址 (optional)
  domainStatus?: string // 域名状态 (optional)
  domainType?: 'f' | 'm' | 'z' | 'p' | 'b' // 域名类型 ('f' 前端, 'm' 管端, 'z' 总管, 'p' 前端永久, 'b' 前端备用)
  domainFrom?: string // 域名来源 (optional)
  hasStatsCode?: string // 统计代码 (optional)
  areaCodes?: string[] // 可以访问的地区列表 (optional, array of strings)
  langCodes?: string[] // 可以支持的语言列表 (optional, array of strings)
  landingPage?: string // 落地页 (optional)
  isForceHttps?: string // 是否强制HTTPS访问 (optional)
  sslExpiry?: string // SSL证书到期日期 (optional, format: yyyy-MM-ddTHH:mm:ss)
  isAppDownloadHint?: string // 是否提示App下载 (optional)
  opsManageCode?: string // OPS管理代码 (optional)
  memo?: string // 备注 (optional)
  descriptions?: string // 网站描述 (optional)
  promotionCode?: string // 默认推广码 (optional)
  createTime?: string // 创建时间 (optional, format: yyyy-MM-dd HH:mm:ss)
  statsCodeJsUrl?: string // 统计代码JS URL (optional)
  statsCodeInit?: string // 统计代码初始化代码 (optional)
  websiteTitle?: string // 站点标题 (optional)
  websiteInnerName?: string // 站点内部名称 (optional)
  icon?: string // ICON (optional)
  logo?: string // LOGO (optional)
  appDownloadUrl?: string // App下载连接 (optional)
}
