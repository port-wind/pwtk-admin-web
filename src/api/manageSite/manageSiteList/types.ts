export interface SiteInfo {
  manageId: string // 管理 ID
  siteName: string // 站点名称
  siteStatus: 'y' | 'n' // 站点状态，可能的值为 'y' 或 'n'
  oapiUrl: string // OAPI URL
  createTime: number // 创建时间（时间戳）
  accessKey: string // 访问密钥
  operStatus: 'y' | 'n' // 操作状态，可能的值为 'y' 或 'n'
}
