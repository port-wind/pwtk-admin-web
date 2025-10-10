// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = '网站标题'
export const SITE_DESCRIPTION = '网站描述'

export const PUBLIC_BIZ_URL = 'https://biz-client.pwtk.cc/biz-client/biz'
export const PUBLIC_CF_PROXY_URL = 'https://pwtk-proxy-workers.andy009-zlin.workers.dev'
export const PUBLIC_KV_URL = 'https://ocs.ai4funs.com/pwtk'
export const PUBLIC_CND_URL = 'https://stt.pwtk.cc/'
export const PUBLIC_UPLOAD_URL = 'https://upload.pwtk.cc'

export const PUBLIC_MANAGE_SITE_ID = 'pw01tk01' // dev: pw01tk01, prod: pw02tk01
export const PUBLIC_WEBSITE_ID = '1288094504737308740' //fan.dev.com fan.dev.com ——>  绑定的站点（ 1288094504737308740   用户ID  mr_testerbanana   id 1282621466789019682  域名页面   组件id 1339591069762849810
export const PUBLIC_CLIENT_TYPE = 'C_H5'
export const PUBLIC_GRAY_RELEASE = 'false'
export const PUBLIC_BUSINESS_TYPE = '49TK'
export const PUBLIC_UPLOAD_ENV = 'dev'
export const PUBLIC_TEST_DOMAIN = 'tk49.pwtk.cc'
export const PUBLIC_DEFAULT_TITLE = '默认标题'
export const PUBLIC_DEFAULT_ICON = '/favicon.svg'

// deprecated: 网站的网址应该通过浏览器获取, 择日删除此配置
export const PUBLIC_WEBSITE_DOMAIN = 'tk49.pwtk.cc'

/**
 * Permission constants enum
 * 权限常量枚举
 *
 * Format: {MODULE}_{ACTION}
 * Usage: Permissions.USER_TRANSFER_SCORE instead of 'user:transferScore'
 */
export enum Permissions {
  // User Management - 用户管理
  USER_TRANSFER_SCORE = 'user:transferScore'
}
