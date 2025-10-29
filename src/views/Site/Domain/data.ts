import type { TableOptions } from '@/components/mTable/types'
//Table需要的数据
export const options: TableOptions[] = [
  { prop: 'domain', slot: 'domain', label: '域名', fixed: 'left', columAttr: { width: 190 } },
  { prop: 'domainFrom', slot: 'domainFrom', label: '来源', columAttr: { width: 80 } },
  { prop: 'domainType', slot: 'domainType', label: '类型', columAttr: { width: 100 } },
  { prop: 'domainStatus', slot: 'domainStatus', label: '状态', columAttr: { width: 100 } },
  { prop: 'landingPage', slot: 'landingPage', label: '落地页', columAttr: { width: 100 } },
  { prop: 'ownerUserId', slot: 'ownerUserId', label: '账户名称 | 账户昵称', columAttr: { width: 150 } },
  { prop: 'websiteTitle', label: '标题', columAttr: { width: 150 } },
  { prop: 'websiteInnerName', label: '站点内部名称', columAttr: { width: 150 } },
  { prop: 'websiteRef', slot: 'websiteRef', label: '綁定站点ID', columAttr: { width: 195 } },
  { prop: 'langCodes', slot: 'langCodes', label: '语言', columAttr: { width: 120 } },
  { prop: 'areaCodes', slot: 'areaCodes', label: '地区', columAttr: { width: 120 } },
  { prop: 'keyWords', label: '关键字', columAttr: { width: 120 } },
  { prop: 'descriptions', label: '描述', columAttr: { width: 150 } },
  { prop: 'promotionCode', label: '默认推广码', columAttr: { width: 120 } },
  { prop: 'isForceHttps', slot: 'isForceHttps', label: '强制HTTPS', columAttr: { width: 100 } },
  { prop: 'isSupportSsl', slot: 'isSupportSsl', label: '配置SSL证书', columAttr: { width: 120 } },
  { prop: 'sslExpiry', slot: 'sslExpiry', label: 'SSL证书到期日', columAttr: { width: 170 } },
  { prop: 'isAppDownloadHint', slot: 'isAppDownloadHint', label: '提示APP下载', columAttr: { width: 120 } },
  { prop: 'opsManageCode', label: 'OPS管理代码', columAttr: { width: 120 } },
  { prop: 'onlineServiceCode', label: '在线客服代码', columAttr: { width: 150 } },
  { prop: 'hasStatsCode', slot: 'hasStatsCode', label: '统计代码', columAttr: { width: 80 } },

  { prop: 'memo', label: '备注', columAttr: { width: 150 } },
  { prop: 'createTime', slot: 'createTime', label: '创建时间', columAttr: { width: 120 } }
]
