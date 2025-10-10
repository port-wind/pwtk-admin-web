export enum EUploadFrom {
  // BBS paths
  /**
   * BBS图标路径，例如：bbs/icon/{id}.*，比如：bbs/icon/q.png
   */
  BBS_ICON = 'bbs/icon',

  /**
   * BBS主板图标路径，例如：bbs/mainboard/icon/{id}.*，比如：bbs/mainboard/icon/test08230823.png
   */
  BBS_MAINBOARD_ICON = 'bbs/mainboard/icon',

  ADVERTISE = 'bbs/advertise/icon',
  /**
   * 论坛图标路径，例如：bbs/forum/icon/{id}.png，比如：bbs/forum/icon/jklag.png
   */
  BBS_FORUM_ICON = 'bbs/forum/icon',

  /**
   * 论坛帖子附件保留路径，例如：bbs/forum/attachment/{id}.*，比如：bbs/forum/attachment/1277671132245262338.png
   */
  BBS_ATTACHMENT = 'bbs/forum/attachment',

  // User paths
  /**
   * 用户头像保留路径，例如：user/profile/header/{userId}.*，用户头像：user/profile/header/123134124124.png
   */
  USER_HEADER = 'user/profile/header',

  // Newspaper paths
  /**
   * 期刊图纸保留路径，例如：newspaper/issue/{期号}/{期刊id}.*，比如上传期刊图纸：newspaper/issue/202204/23213132.png
   */
  NEWSPAPER_ISSUE = 'newspaper/issue',

  // Gallery paths
  /**
   * 图库-网站大全-网站主板图标保留路径，例如：tk/website/icon/{网站id}.*，比如图库网站大全主板图标：tk/website/icon/test082605.png
   */
  GALLERY_WEBSITE_ICON = 'tk/website/icon',

  /**
   * 图库-担保平台-网站图标路径，例如：tk/guarantee/icon/{网站id}.png，比如：担保网站图标：tk/guarantee/icon/test08230823.png
   */
  GALLERY_GUARANTEE_ICON = 'tk/guarantee/icon',

  // Website management paths
  /**
   * 网站管理-站点-站点图标路径，例如：wm/website/icon/{站点id}.*，比如站点icon：wm/website/icon/122883838383883.ico
   *
   * uploadHistory/add  uploadFrom:  "{dev}/wm/website/icon/{122883838383883.ico}"
   */
  SITE_ICON = 'wm/website/icon',

  /**
   * 网站管理-站点管理-站点logo路径，例如：wm/website/logo/{站点id}.*，比如：wm/website/logo/12313213123.png
   *
   * uploadHistory/add  uploadFrom:  "{dev}/wm/website/logo/{12313213123.png}"
   */
  SITE_LOGO = 'wm/website/logo',

  /**
   * 网站管理-域名管理-域名图标路径，例如：wm/domain/icon/{域名id}.*，比如域名icon：wm/domain/icon/1231232131.ico
   */
  DOMAIN_ICON = 'wm/domain/icon',

  /**
   * 网站管理-域名管理-域名logo路径，例如：wm/domain/logo/{域名id}.*，比如域名logo：wm/domain/logo/1231213123213.png
   */
  DOMAIN_LOGO = 'wm/domain/logo',

  /**
   * 网站管理-模版管理-模版icon路径，例如：wm/template/icon/{模版id}.*，比如模版icon：wm/template/icon/1213123213.ico
   */
  TEMPLATE_ICON = 'wm/template/icon',

  /**
   * 网站管理-模版管理-模版logo路径，例如：wm/template/logo/{模版id}.*，比如：wm/template/logo/3424324.png
   */
  TEMPLATE_LOGO = 'wm/template/logo',

  /**
   * 彩票管理-视频图示路径，例如：lottery/videoPicture/{视频id}.*，比如视频图示：lottery/videoPicture/123123213.png
   */
  GAME_PICTURE = 'game/picture',

  // Chat paths
  /**
   * 聊天室消息图片路径，例如：chat/message/img
   */
  CHAT_IMG = 'chat/message/img',

  /**
   * 聊天室背景图片路径，例如：chat/bg/img
   */
  CHAT_BG = 'chat/bg/img',

  // Activity Center
  /**
   * 超管用户活动中心路径，例如：user/activityCenter
   */
  ACTIVITY_CENTER = 'user/activityCenter',

  /**
   * 域名上传 html 文件用的
   */
  DOMAIN_HTML_FILE = 'wm/domain/webmaster',
  /**
   * 网站上传 html 文件用的
   */
  SITE_HTML_FILE = 'wm/website/webmaster',

  /**
   * 公告logo
   */
  ANNOUNCEMENT_LOGO = 'wm/announcement/logo'
}

export interface IMimeTypeMapping {
  [mimeType: string]: {
    uploadType: string
    fileType: string
  }
}

interface UploadData {
  fileType: string
  uploadFrom: string
  storageStyle: number
}

export interface IUploadResult {
  uploadData: UploadData
  fileType: string
}

export const defaultMimeTypeMappings: IMimeTypeMapping = {
  'image/jpeg': { uploadType: 'img', fileType: 'p' },
  'image/png': { uploadType: 'img', fileType: 'p' },
  'image/gif': { uploadType: 'img', fileType: 'p' },
  'image/svg+xml': { uploadType: 'img', fileType: 'p' },
  'text/plain': { uploadType: 'ico', fileType: 'f' },
  'application/pdf': { uploadType: 'ico', fileType: 'f' },
  'application/msword': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.ms-excel': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.android.package-archive': { uploadType: 'file', fileType: 'a' },
  'application/octet-stream': { uploadType: 'file', fileType: 'e' },
  'video/mp4': { uploadType: 'video', fileType: 'v' },
  'video/webm': { uploadType: 'video', fileType: 'v' },
  'video/ogg': { uploadType: 'video', fileType: 'v' },
  'audio/mpeg': { uploadType: 'video', fileType: 's' },
  'audio/wav': { uploadType: 'video', fileType: 's' },
  'audio/ogg': { uploadType: 'video', fileType: 's' }
}
