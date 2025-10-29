import interceptorChain from './interceptorChain'

const instance = interceptorChain().clientIdRequest().authRequest().instance

interface PostInterface {
  page: number
  size: number
  sortName?: string
  gameType?: number | string
  voteType?: string
  year?: number
  forumId?: string
  postId?: string
  postUserId?: string
  authorId?: string
  bbsId?: string
  title?: string
  postContent?: string
}
/**
 * 帖子列表 全部帖子
 */
export function getBBSForumPost(data: PostInterface) {
  return instance.post('/bbsForumPost/list', data)
}
/**
 * 高手论坛 图解小组
 */
export function getBBSDiagram(data: any) {
  // console.log(data)
  // if (!siteName) siteName = ''
  // focusGameType = Array.isArray(focusGameType) ? focusGameType : [focusGameType]
  return instance.post('/tk/newspaperIssuePost/graphicSolutionGroup', data)
}

/**
 * 高手论坛 全部帖子
 */
export function getDetailPost(data: any) {
  // console.log(data)
  // if (!siteName) siteName = ''
  // focusGameType = Array.isArray(focusGameType) ? focusGameType : [focusGameType]
  return instance.post('/bbsForumPost/detail', data)
}

/**
 * 高手论坛 一级评论
 */
export function getCommentPostList(data: any) {
  // console.log(data)
  // if (!siteName) siteName = ''
  // focusGameType = Array.isArray(focusGameType) ? focusGameType : [focusGameType]
  return instance.post('/bbsForumPost/getPrimaryComment ', data)
}

/**
 * 高手论坛 查看其他用户信息
 *
 */
export function getOtherUserInfo(user_id: string) {
  // console.log(data)
  // if (!siteName) siteName = ''
  // focusGameType = Array.isArray(focusGameType) ? focusGameType : [focusGameType]
  return instance.get('/user/profile/' + user_id)
}

/**
 * 帖子 已读接口 已读加1
 *
 */
export function postReadCount(postId: string) {
  return instance.post('/bbsForumPost/read ', { postId })
}

/**
 * 获取帖子一级评论
 */
export function getPrimaryComment(postId: string, page: number, size: number) {
  return instance.post('/bbsForumPost/getPrimaryComment', { postId, page, size })
}

/**
 * 获取帖子二级评论
 */
export function getReplyComment(postId: string, page: number, size: number) {
  return instance.post('/bbsForumPost/getReplyComment', { postId, page, size })
}
