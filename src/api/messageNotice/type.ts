export interface IReqListBlurTemplateQueryParams {
  announcementUserType?: string
  announcementUserValue?: string
}
export interface IReqListBlurTemplateData {
  scopesId: string
  scopesName: string
}

export interface IReqAnnouncementListQueryParams {
  page: number // 页码 (Page number)
  size: number // 每页显示条数 (Number of items per page)
  sortName?: string // 排序字段名 (Field name to sort by, optional)
  sortOrder?: 'ASC' | 'DESC' // 排序方向 (Sort direction, optional)
  announcementTitle?: string // 公告标题 (Announcement title, optional)
  startTime?: string // 开始时间 (Start time, format: yyyy-MM-dd HH:mm:ss, optional)
  endTime?: string // 结束时间 (End time, format: yyyy-MM-dd HH:mm:ss, optional)
  announcementScope?: string // 公告范围 (Announcement scope, optional)
  anTargets?: string[] // 公告针对端点 (Announcement target endpoints, optional array)
  anStatus?: 'y' | 'n' | string // 公告状态 (Announcement status: 'y' for enabled, 'n' for disabled, optional)
}

export interface IReqAnnouncementListData {
  taskId: number // 任务ID
  announcementId: number // 公告ID
  announcementTitle: string // 公告标题
  announcementDesc: string // 公告内容
  isSecretDesc: string // 是否加密（例如：'DESC'）
  createTime: string // 创建时间（格式：yyyy-MM-dd HH:mm:ss）
  startTime: string // 开始时间（格式：yyyy-MM-dd HH:mm:ss）
  endTime: string // 结束时间（格式：yyyy-MM-dd HH:mm:ss）
  announcementScope: string // 公告范围
  anTeamUserId: number // 公告针对团队ID
  anUserId: number // 公告针对用户ID
  anWebsiteId: number // 公告针对站点ID
  anDomain: string // 公告针对域名
  anTargets: string[] // 公告针对端点（如 ['APP', 'WEB']）
  anStatus: 'y' | 'n' // 公告状态：'y' 启用，'n' 禁用
  createUserId: number // 创建人ID
  delayCloseSeconds: number // 延迟关闭秒数
  announcementUserType: 'team' | 'user' | 'web' | 'domain' // 检索类型字段
  announcementUserValue: string // 检索值
  maintainPlanUserValueResultMap: Record<string, string> // 查询后得到的 ID -> Name 映射表
  createUserName: string // 创建人名称
}

export interface IReqAnnouncementAddQueryParams {
  announcementTitle: string // Required - Announcement title
  announcementDesc?: string // Optional - Announcement content
  isSecretDesc?: string // Optional - Whether DESC is encrypted
  startTime?: string // Optional - Start time (yyyy-MM-dd HH:mm:ss)
  endTime?: string // Optional - End time (yyyy-MM-dd HH:mm:ss)
  announcementScope?: string // Optional - Announcement scope
  anTeamUserId?: number // Optional - Target team ID (default 0)
  anUserId?: number // Optional - Target user ID (default 0)
  anWebsiteId?: number // Optional - Target website ID (default 0)
  anDomain?: string // Optional - Target domain
  anTargets?: string[] // Optional - Target endpoints
  anStatus?: string // Optional - Status (y: enabled, n: disabled)
  createUserId?: number // Optional - Creator ID (default 0)
  delayCloseSeconds?: number // Optional - Delay close seconds (default 0)
  announcementUserType?: string // Optional - Type to retrieve (team/user/web/domain)
  announcementUserValue?: string // Optional - Value corresponding to the type
}

export interface IReqAnnouncementEditStatusQueryParams {
  announcementId: string
  anStatus: string
}

export interface IReqPlanEditStatusQueryParams {
  planId: string
  planStatus: string
}

export interface IReqMaintainAddQueryParams {
  planId?: string // Optional - Plan ID
  planStatus: string // Required - Plan status
  startTime?: string // Optional - Start time (yyyy-MM-dd HH:mm:ss)
  endTime?: string // Optional - End time (yyyy-MM-dd HH:mm:ss)
  planTitle?: string // Optional - Plan title
  planDesc?: string // Optional - Maintenance description
  maintainScope?: string // Optional - Maintenance scope
  mtTeamUserId?: number // Optional - Target team ID (default 0)
  mtUserId?: number // Optional - Target user ID (default 0)
  mtWebsiteId?: number // Optional - Target website ID (default 0)
  mtDomain?: string // Optional - Target domain
  mtTargets?: string[] // Optional - Target endpoints
  createTime?: string // Optional - Creation time (yyyy-MM-dd HH:mm:ss)
  createUserId?: number // Optional - Creator ID (default 0)
  maintainplanUserType?: string // Optional - Type to retrieve (team/user/web/domain)
  maintainplanUserValue?: string // Optional - Value corresponding to the type
}

export interface IReqListScopeValuesQueryParams {
  maintainplanUserType?: string
  maintainplanUserValue?: string
}

export interface IReqAnnouncementDeleteQueryParams {
  announcementId: string
}

export interface IReqAnnouncementEditQueryParams {
  announcementId: number // Required - Announcement ID (default 0)
  announcementTitle: string // Required - Announcement title
  announcementDesc?: string // Optional - Announcement content
  isSecretDesc?: string // Optional - Whether DESC is encrypted
  startTime?: string // Optional - Start time (yyyy-MM-dd HH:mm:ss)
  endTime?: string // Optional - End time (yyyy-MM-dd HH:mm:ss)
  announcementScope?: string // Optional - Announcement scope
  anTeamUserId?: number // Optional - Target team ID (default 0)
  anUserId?: number // Optional - Target user ID (default 0)
  anWebsiteId?: number // Optional - Target website ID (default 0)
  anDomain?: string // Optional - Target domain
  anTargets?: string[] // Optional - Target endpoints
  anStatus?: string // Optional - Status (y: enabled, n: disabled)
  createUserId?: number // Optional - Creator ID (default 0)
  delayCloseSeconds?: number // Optional - Delay close seconds (default 0)
  announcementUserType?: string // Optional - Type to retrieve (team=>an_team_user_id, user=>an_user_id, web=>an_website_id, domain=>an_domain)
  announcementUserValue?: string // Optional - Value corresponding to the type
}

export interface IReqMaintainEditQueryParams {
  planId: string // Required - Plan ID
  planStatus: string // Required - Plan status
  startTime?: string // Optional - Start time (yyyy-MM-dd HH:mm:ss)
  endTime?: string // Optional - End time (yyyy-MM-dd HH:mm:ss)
  planTitle?: string // Optional - Plan title
  planDesc?: string // Optional - Maintenance description
  maintainScope?: string // Optional - Maintenance scope
  mtTeamUserId?: number // Optional - Target team ID (default 0)
  mtUserId?: number // Optional - Target user ID (default 0)
  mtWebsiteId?: number // Optional - Target website ID (default 0)
  mtDomain?: string // Optional - Target domain
  mtTargets?: string[] // Optional - Target endpoints
  createTime?: string // Optional - Creation time (yyyy-MM-dd HH:mm:ss)
  createUserId?: number // Optional - Creator ID (default 0)
  maintainplanUserType?: string // Optional - Type to retrieve (team=>mt_team_user_id, user=>mt_user_id, web=>mt_website_id, domain=>mt_domain)
  maintainplanUserValue?: string // Optional - Value corresponding to the type
}

export interface IReqMaintainDeleteQueryParams {
  planId: string
}

export interface IReqListScopeValuesData {
  scopesId: string
  scopesName: string
}

export interface IReqMaintainListQueryParams {
  page: number // Required - Page number (default 0)
  size: number // Required - Items per page (default 0)
  sortName?: string // Optional - Field to sort by
  sortOrder?: 'ASC' | 'DESC' // Optional - Sort direction (ASC or DESC)
  planStatus?: string // Optional - Plan status
  startTime?: string // Optional - Start time
  endTime?: string // Optional - End time
  maintainScope?: string // Optional - Maintenance scope
}
