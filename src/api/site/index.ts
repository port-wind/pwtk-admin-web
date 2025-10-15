import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '@/api/type'
import type { IListTypeCode } from '../betting/types'
import type {
  ISetWebSiteListIdQueryParams,
  IReqSysTemplateListData,
  IGetRefWebsiteConfigQueryParams,
  IGetRefWebsiteConfigData,
  IReqGetALLWebsiteListQueryParams,
  IReqGetALLWebsiteListData,
  IReqClientWebsiteConfigQueryParams,
  IReqClientWebsiteConfigData,
  IReqWebsiteCodeEditQueryParams,
  IReqClientTemplateInfoByWebsiteIdQueryParams,
  IReqClientTemplateInfoByWebsiteIdData,
  IReqSketchInfoByWebsiteIdQueryParams,
  IReqSketchInfoByWebsiteIdData,
  IReqTemplateInfoByTemplateIdQueryParams,
  IReqTemplateInfoByTemplateIdData,
  IReqIsTemplateNameExitQueryParams,
  IGetWebSiteInfoQueryParams,
  ISetBingWebSiteData,
  ISearchPromotionCodeQueryParams,
  ISearchPromotionCodeData,
  IReqWebsiteCodeStatusQueryParams
} from './type'
import { qs } from '@/utils/dataFormat'
import type {
  IListBlurTemplateWithUserInfoData,
  IListBlurTemplateWithUserInfoQueryParams,
  IReqGetALLSketchListData,
  IReqTemplateCreateQueryParams,
  IReqWebsiteCodeAddQueryParams,
  ITemplateListData,
  ITemplateListQueryParams
} from './type'
//网站骨架列表查询
export const reqSketchList = (data: any) => {
  return http.post('/webgw/sketch/list', data)
}
//骨架编辑
export const reqSketchEdit = (data: any) => {
  return http.post('/webgw/sketch/edit', data)
}
//骨架新增
export const reqSketchCreate = (data: any) => {
  return http.post('/webgw/sketch/create', data)
}
//骨架删除
export const reqSketchCodeDelete = (data: any) => {
  return http.post('/webgw/sketch/editStatus', data)
}
//骨架名称是否存在
export const reqExistSketchName = (data: any) => {
  return http.post('/webgw/sketch/existSketchName ', data)
}
//骨架编码是否存在
export const reqExistSketchCode = (data: any) => {
  return http.post('/webgw/sketch/existSketchCode', data)
}
//获取所有骨架列表
export const reqGetALLSketchList = (
  data?: IReqGetALLWebsiteListQueryParams
): Promise<IBaseResponse<IReqGetALLSketchListData[]>> => {
  const queryString = data ? qs(data) : null
  if (queryString) {
    return http.get(`/webgw/sketch/listSketchCode?${queryString}`)
  } else {
    return http.get(`/webgw/sketch/listSketchCode`)
  }
}
//推广码查询
export const reqPromotionCodeSearch = (data: any) => {
  return http.post('/webgw/promotionCode/search', data)
}

export const searchPromotionCode = (
  data: ISearchPromotionCodeQueryParams
): Promise<IResponse<ISearchPromotionCodeData>> => {
  return http.post('/webgw/userPromoteCode/list', data)
}

//推广码删除
export const reqPromotionCodeDelete = (data: any) => {
  return http.post('/webgw/promotionCode/delete', data)
}
//推广码新增
export const reqPromotionCodeAdd = (data: any) => {
  return http.post('/webgw/promotionCode/add', data)
}
//推广码编辑
export const reqPromotionCodeEdit = (data: any) => {
  return http.post('/webgw/promotionCode/update', data)
}
//模版查询
export const reqTemplateList = (data: ITemplateListQueryParams): Promise<IResponse<ITemplateListData>> => {
  return http.post('/webgw/template/list', data)
}
// 通过website的ID获取已绑定的域名和没有绑定的域名
export const reqDomain = (data: any) => {
  return http.post('/webgw/website/getDomain', data)
}
// 域名绑定站点
export const setBingWebSite = (data: ISetWebSiteListIdQueryParams): Promise<IBaseResponse<ISetBingWebSiteData>> => {
  return http.post('/webgw/domain/setBingWebSite', data)
}

export interface IReqBingWebsiteDomainQueryParams {
  /**
   * 页码
   * @default 0
   */
  page: number

  /**
   * 每页显示条数
   * @default 0
   */
  size: number

  /**
   * 排序字段名称 (可选)
   */
  sortName?: string

  /**
   * 排序方式 (可选)
   * ASC for ascending order, DESC for descending order
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * 域名 (可选)
   * 长度最大为 255
   */
  domain?: string

  /**
   * 域名状态 (可选)
   * y: 启用, c: 关闭, n: 维护
   */
  domainStatus?: 'y' | 'c' | 'n'

  /**
   * 是否强制 https 访问 (可选)
   * y: 强制访问, n: 不强制访问
   */
  isForceHttps?: 'y' | 'n'

  /**
   * 推广码 (可选)
   */
  promotionCode?: string

  /**
   * 域名类型 (可选)
   * t: 管理端, n: 客户端
   */
  domainType?: 't' | 'n'

  /**
   * 域名创建时间 (可选)
   * Format: yyyy-MM-dd HH:mm:ss
   */
  createTime?: string

  /**
   * 绑定的站点 ID
   */
  websiteRef: string

  /**
   * 所属用户 (可选)
   */
  ownerUserId?: string
}
export interface IReqBingWebsiteDomainData {
  /**
   * 页码
   * @default 0
   */
  page: number

  /**
   * 每页显示条数
   * @default 0
   */
  size: number

  /**
   * 排序字段名称 (可选)
   */
  sortName?: string

  /**
   * 排序方式 (可选)
   * ASC for ascending order, DESC for descending order
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * 域名 (可选)
   * 长度最大为 255
   */
  domain?: string

  /**
   * 域名状态 (可选)
   * y: 启用, c: 关闭, n: 维护
   */
  domainStatus?: 'y' | 'c' | 'n'

  /**
   * 是否强制 https 访问 (可选)
   * y: 强制访问, n: 不强制访问
   */
  isForceHttps?: 'y' | 'n'

  /**
   * 推广码 (可选)
   */
  promotionCode?: string

  /**
   * 域名类型 (可选)
   * t: 管理端, n: 客户端
   */
  domainType?: 't' | 'n'

  /**
   * 域名创建时间 (可选)
   * Format: yyyy-MM-dd HH:mm:ss
   */
  createTime?: string

  /**
   * 绑定的站点 ID
   */
  websiteRef: string

  /**
   * 所属用户 (可选)
   */
  ownerUserId?: string

  isShown?: string
}
// 已绑定域名中检索域名
export const reqBingWebsiteDomain = (
  data: IReqBingWebsiteDomainQueryParams
): Promise<IResponse<IReqBingWebsiteDomainData>> => {
  return http.post('/webgw/website/getBingWebsiteDomain', data)
}

export interface IBatchUpdateDomainListQueryParams {
  domain: string
  isShown: string
}
// 已绑定域名中检索域名
export const batchUpdateDomainList = (data: IBatchUpdateDomainListQueryParams[]): Promise<IBaseResponse<boolean>> => {
  return http.post('/webgw/domain/batchUpdateDomainList', data)
}
// 未绑定域名中检索域名
export const reqUnBingWebsiteDomain = (data: any) => {
  return http.post('/webgw/website/getUnBingWebsiteDomain', data)
}

interface IReqTemplateUpdateStatusQueryParams {
  templateId: string
  templateStatus: string
}
//模版修改状态
export const reqTemplateUpdateStatus = (data: IReqTemplateUpdateStatusQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/template/editStatus', data)
}

//模版新增
export const reqTemplateCreate = (data: IReqTemplateCreateQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/template/create', data)
}

//模版编辑
export const reqTemplateEdit = (data: IReqTemplateCreateQueryParams): Promise<IResponse<never>> => {
  return http.post('/webgw/template/edit', data)
}

//检查ownerUserId和模板ID有没有绑定的站点
export const getRefWebsiteConfig = (
  data: IGetRefWebsiteConfigQueryParams
): Promise<IResponse<IGetRefWebsiteConfigData>> => {
  return http.post('/webgw/website/getRefWebsiteConfig', data)
}
//获取所有的模版ID
export const reqGetAllTemplateId = () => {
  return http.get('/webgw/template/listTemplate ')
}
export interface IReqIsTemplateIdExitQueryParams {
  templateId: string
}
//模版ID是否存在
export const reqIsTemplateIdExit = (data: IReqIsTemplateIdExitQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/template/existTemplate', data)
}
//模版名称是否存在
export const reqIsTemplateNameExit = (data: IReqIsTemplateNameExitQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw/template/existTemplateName', data)
}

//通过模糊查询获取所有的模版ID(查询出的是处于有效状态的模版ID)
export const reqListBlurTemplate = (data: any) => {
  return http.post('/webgw/template/listBlurTemplate', data)
}
export interface IReqListBlurTemplateAndSketchCodeQueryParams {
  templateId: string
  ownerUserId: string
}
export interface IReqListBlurTemplateAndSketchCodeData {
  templateId: string // 模版ID
  templateName: string // 模版名称
  sketchCode: string // 模版草图代码
  langCodes: string[] // 适用的语言列表
  areaCodes: string[] // 适用的地区列表
}
// https://dev-torna.pwtk.cc/#/view/r2jRVK2G
//通过模糊查询获取所有的模版ID和模版ID对应的模版名称和草图代码(查询出的是处于有效状态的模版ID)
export const reqListBlurTemplateAndSketchCode = (
  data: IReqListBlurTemplateAndSketchCodeQueryParams
): Promise<IBaseResponse<IReqListBlurTemplateAndSketchCodeData[]>> => {
  return http.post('/webgw/template/listBlurTemplateAndSketchCode', data)
}
// cyu panya mezurai  miti hiyoukakaru  youyuu semaku tomamerareru anzei reiji fukuro jikannkakaru matase omikagi jizenn nagare nidai mottosumuzu kauhituyougaaru anzen torikumeru いちだいふ kaikei jizenn tani nidai  reijikauhituyou okyaku
// speed wadai sport  3.kokunai saisin kazu 4.kuruma uten itijikann tanosimikudasai   1. 4 s  seikai jidousya speed degisn sport  kokunai kazu jisai  norukuruma modal
//获取模板list
export const getTemplateIdList = (data: { websiteId: string; ownerUserId: string }) => {
  return http.post('/webgw/domain/getTemplateIdList', data)
}

//通过模糊查询获取所有的模版ID(查询出的是传入用户Id的，处于有效状态的模版ID)
export const listBlurTemplateWithUserInfo = (
  data: IListBlurTemplateWithUserInfoQueryParams
): Promise<IBaseResponse<IListBlurTemplateWithUserInfoData[]>> => {
  return http.post('/webgw/template/listBlurTemplateWithUserInfo', data)
}

//已经绑定的站点模板下拉列表 模糊匹配
export const reqListTemplate = (data: any) => {
  return http.post('/webgw/website/getlistTemplate', data)
}
//模糊查询获取所有的模版ID website all table
export const reqListBlurTemplateWithoutStatus = (data: any) => {
  return http.post('/webgw/template/listBlurTemplateWithoutStatus', data)
}

//获取所有站点
export const reqGetALLWebsiteList = (
  data: IReqGetALLWebsiteListQueryParams
): Promise<IResponse<IReqGetALLWebsiteListData>> => {
  return http.post('/webgw/website/getWebsiteConfig', data)
}

export interface IReqSetWebSiteListIdQueryParams {
  ownerUserId: string
  websiteId?: string
}
export interface IReqSetWebSiteListIdData {
  taskId: number // Task ID (int64)
  websiteId: string // 站点ID
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间 (Format: yyyy-MM-dd HH:mm:ss)
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes: string[] // 支持的语言列表
  areaCodes: string[] // 可访问地区列表
  memo: string // 备注
  websiteTemplateRef: string // 引用模版ID
  websiteStatus: string // 站点状态 (y: 启用; m: 维护; c: 关闭)
  cdnUrl: string // CDN地址
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
  describe: string // 站点描述
  templateName: string // 模板ID
  isSourceCode: string // 是否源代码站 (y: 是; n: 否)
  icon: string // Icon
  logo: string // Logo
  contactType: string // 联系方式
  appDownloadUrl: string // App下载连接
  pageCode: string // 页面代码
}
//获取站点Idlist 模糊查询
export const reqSetWebSiteListId = (
  data: IReqSetWebSiteListIdQueryParams
): Promise<IBaseResponse<IReqSetWebSiteListIdData[]>> => {
  return http.post('/webgw/domain/setWebSiteListId', data)
}

//获取启用的站点list
export const getWebSiteInfo = (data: IGetWebSiteInfoQueryParams): Promise<IResponse<IListTypeCode>> => {
  return http.post('/webgw/domain/getWebSiteInfo', data)
}

//站点删除
export const reqWebsiteCodeDelete = (data: any) => {
  return http.post('/webgw/website/delWebsiteConfig', data)
}

//站点状态
export const reqWebsiteCodeStatus = (data: IReqWebsiteCodeStatusQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/website/editWebsiteStatus', data)
}

//站点新增
export const reqWebsiteCodeAdd = (data: IReqWebsiteCodeAddQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/website/addWebsiteConfig', data)
}
//检查旧的ownerUserId有没有绑定的domain
export const checkUserDomain = (data: any) => {
  return http.post('/webgw/website/checkUserDomain', data)
}
//站点编辑
export const reqWebsiteCodeEdit = (data: IReqWebsiteCodeEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw/website/editWebsiteConfig', data)
}

// 通过website的Id获取模板信息
export const reqClientTemplateInfoByWebsiteId = (
  data: IReqClientTemplateInfoByWebsiteIdQueryParams
): Promise<IBaseResponse<IReqClientTemplateInfoByWebsiteIdData>> => {
  return http.post('/webgw/website/getTemplate', data)
}
// 通过website的ID获取草图信息
export const reqSketchInfoByWebsiteId = (
  data: IReqSketchInfoByWebsiteIdQueryParams
): Promise<IBaseResponse<IReqSketchInfoByWebsiteIdData>> => {
  return http.post('/webgw/website/getSketch', data)
}
// 通过webSiteId获取信息
export const reqClientWebsiteConfig = (
  data: IReqClientWebsiteConfigQueryParams
): Promise<IBaseResponse<IReqClientWebsiteConfigData>> => {
  return http.post('/webgw/website/getClientWebsiteConfig', data)
}

// 通过模版ID查询模版信息（完全匹配）
export const reqTemplateInfoByTemplateId = (
  data: IReqTemplateInfoByTemplateIdQueryParams
): Promise<IBaseResponse<IReqTemplateInfoByTemplateIdData>> => {
  return http.post('/webgw/template/getTemplateInfoByTemplateId', data)
}
// 通过模糊查询获取所有的模版ID
/* export const reqListBlurTemplate = (data: any) => {
  return http.post('/webgw/template/listBlurTemplate', data)
} */
// 查询草图编码对应的对应的语言列表和适用的地区列表,这个请求到的优先级比reqClientWebsiteSketch权重要高。修正：站点详情权重大于template大于sketch
export const reqLangAndAreaCodesBasedOnSketch = (data: any) => {
  return http.post('/webgw/sketch/langAndAreaCodes', data)
}

//获取所有的系统模版列表
export const reqSysTemplateList = (): Promise<IBaseResponse<IReqSysTemplateListData[]>> => {
  return http.get('/webgw/template/getSysTemplate')
}

export const getSysTemplateRef = (): Promise<IBaseResponse<string[]>> => {
  return http.get('/webgw/template/getSysTemplateRef')
}
// 通过模糊查询获取所有的草图Code
export const reqSearchSketchCode = (data: any) => {
  return http.post('/webgw/sketch/listBlurSketchCode', data)
}
export interface IReqSketchInfoBySketchCodeQueryParams {
  sketchCode: string
}
export interface IReqSketchInfoBySketchCodeData {
  sketchCode: string // 草图编码
  sketchName: string // 草图名称
  sketchType: string // 草图类型
  langCodes: string[] // 适用的语言列表
  memo: string // 备注
  areaCodes: string[] // 适用的地区列表
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  sketchStatus: 'y' | 'n'
}
//通过草图编码查询草图信息
export const reqSketchInfoBySketchCode = (
  data: IReqSketchInfoBySketchCodeQueryParams
): Promise<IBaseResponse<IReqSketchInfoBySketchCodeData>> => {
  return http.post('/webgw/sketch/getSketchInfoBySketchCode', data)
}
//域名解绑站点
export const unBingWebsite = (data: any) => {
  return http.post('/webgw/domain/setUnBingWebSite', data)
}
//通过草图代码,获取绑定该草图代码的模版id列表(有分页功能)
export const listTemplateBySketchCodeWithPage = (data: any) => {
  return http.post('/webgw/template/listTemplateBySketchCodeWithPage', data)
}

export interface IGetBingTemplateWebsiteQueryParams {
  page: number /** 页码 @default 0   */
  size: number /** 每页显示条数 @default 0   */
  sortName?: string /** 排序字段名称 (可选)   */
  sortOrder?: 'ASC' | 'DESC' /** 排序方式 (可选) ASC for ascending order, DESC for descending order   */
  websiteTemplateRef: string /** 模版ID 长度最长8位，允许字母、数字、短横线和下划线 Example: "example1"   */
} /** * 任务ID * @default 0 */
export interface IGetBingTemplateWebsiteData {
  taskId: number /** * 站点ID */
  websiteId: string /** * 站点内部名称 */
  websiteInnerName: string /** * 站点标题 */
  websiteTitle: string /** * 创建时间 * Format: yyyy-MM-dd HH:mm:ss */
  createTime: string /** * 所属用户ID */
  ownerUserId: string /** * 所属用户Name */
  userName: string /** * 关键字 */
  keyWords: string /** * 在线客服代码 */
  onlineServiceCode: string /** * 统计代码 */
  hasStatsCode: string /** * 支持的语言列表 */
  langCodes: string[] /** * 可访问地区列表 */
  areaCodes: string[] /** * 备注 */
  memo: string /** * 引用模版ID */
  websiteTemplateRef: string /** * 站点状态 * y: 启用, m: 维护, c: 关闭 */
  websiteStatus: 'y' | 'm' | 'c' /** * CDN 地址 */
  cdnUrl: string /** * 统计代码 JS URL */
  statsCodeJsUrl: string /** * 统计代码初始化代码 */
  statsCodeInit: string /** * 站点描述 */
  describe: string /** * 模板名称 */
  templateName: string /** * 是否源代码站 * y: 是, n: 否 */
  isSourceCode: 'y' | 'n' /** * Icon */
  icon: string /** * Logo */
  logo: string /** * 联系方式 */
  contactType: string /** * APP 下载连接 */
  appDownloadUrl: string /** * 页面代码 */
  pageCode: string
}
//通过引用模板ID获取绑定模板的站点
export const getBingTemplateWebsite = (
  data: IGetBingTemplateWebsiteQueryParams
): Promise<IResponse<IGetBingTemplateWebsiteData>> => {
  return http.post('/webgw/website/getBingTemplateWebsite', data)
}
