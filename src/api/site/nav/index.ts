import http from '@/utils/http/index'
import type { getOneNavigationData, delNavigationData, getTemplates } from './types'
import type { IBaseResponse } from '@/api/type'

enum api {
  GetAll = '/webgw/navigation/list',
  AddOne = '/webgw/navigation/create',
  DeleteOne = '/webgw/navigation/del',
  EditOne = '/webgw/navigation/update',
  GetOne = '/webgw/navigation/treeListByDomain',
  GetOneFamily = '/webgw/navigation/familyByDomain',
  GetlistDomain = '/webgw/navigation/listDomain',
  GetlistTemplates = '/webgw/naviTemplate/queryTemplates',
  QueryUrls = '/webgw/navigation/queryUrls',
  TreeList = '/webgw/navigation/treeList',
  TreeListByPage = '/webgw/navigation/treeListByPage',
  getDomainConfigBbsAndNaviga = '/webgw/domain/getDomainConfigBbsAndNaviga',
  getExistDomain = '/webgw/domain/existDomain'
}

// 获取所有导航配置
export const reqNavigationConfig = (data: any) => {
  return http.post(api.GetAll, data)
}

// 添加导航配置
export const addNavigationConfig = (data: any) => {
  return http.post(api.AddOne, data)
}

// 删除导航配置
export const delNavigationConfig = (data: delNavigationData) => {
  return http.post(api.DeleteOne, data)
}

// 编辑导航配置
export const editNavigationConfig = (data: any) => {
  return http.post(api.EditOne, data)
}

// 获取单个导航配置
export const reqTreeListByDomain = (data: getOneNavigationData) => {
  return http.post(api.GetOneFamily, data)
}
// 获取动态搜索域名
export const fetchDomainList = (data: getOneNavigationData) => {
  return http.post(api.GetlistDomain, data)
}
// 获取动态搜索域名
export const queryTemplates = (data: getTemplates) => {
  return http.post(api.GetlistTemplates, data)
}

export interface IQueryDomainConfigBbsAndNavigaQueryParams {
  domain: string
}

export interface IQueryDomainConfigBbsAndNavigaData {
  taskId: number // int64, 任务 ID
  domain: string // 域名
  ownerUserId: string // 所属用户 ID
  userName: string // 所属用户名称
  websiteRef: string // 绑定的站点 ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置 SSL 证书 (可能是 'yes' | 'no' 这种格式)
  cdnUrl: string // CDN 地址
  domainStatus: string // 域名状态
  domainType: 'f' | 'm' | 'z' | 'p' | 'b' // 域名类型 (前端、管端、总管、前端永久、前端备用)
  domainFrom: string // 域名来源
  hasStatsCode: string // 是否有统计代码
  areaCodes: string[] // 可以访问的地区列表
  langCodes: string[] // 支持的语言列表
  landingPage: string // 落地页
  isForceHttps: string // 是否强制 HTTPS 访问
  sslExpiry: string // SSL 证书到期日期 (格式: yyyy-MM-dd HH:mm:ss)
  isAppDownloadHint: string // 是否提示 App 下载
  opsManageCode: string // OPS 管理代码
  memo?: string // 备注 (可选)
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  statsCodeJsUrl: string // 统计代码 JS URL
  statsCodeInit: string // 统计代码初始化代码
  websiteTitle: string // 站点标题
  websiteInnerName: string // 站点内部名称
  icon: string // 网站 ICON
  logo: string // 网站 LOGO
  appDownloadUrl: string // APP 下载链接
}

// 获取动态搜索域名
export const queryDomainConfigBbsAndNaviga = (
  data: IQueryDomainConfigBbsAndNavigaQueryParams
): Promise<IBaseResponse<IQueryDomainConfigBbsAndNavigaData[]>> => {
  return http.post(api.getDomainConfigBbsAndNaviga, data)
}

export const getExistDomain = (data: { domain: string }): Promise<IBaseResponse<boolean>> => {
  return http.post(api.getExistDomain, data)
}

// 获取动态URL
export const queryUrls = (data: { targetUrl: string }) => {
  return http.post(api.QueryUrls, data)
}
// 获取树状list
export const fetchTreeList = (data: any) => {
  return http.post(api.TreeList, data)
}
// 获取树状list
export const fetchTreeListByPage = (data: { page: number; size: number }) => {
  return http.post(api.TreeListByPage, data)
}
