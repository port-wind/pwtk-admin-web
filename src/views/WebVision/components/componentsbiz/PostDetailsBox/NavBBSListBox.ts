// export interface BBSContent {
//   id: string
//   bbsId?: string
//   title?: string
//   model: 's1' | 's2'
//   pageSize?: number
//   forumId?: string
//   mainBoardId?: string
//   align?: string
//   titleBg?: string
//   titleBgImg?: string
//   contentBg?: string
//   contentBgImg?: string
// }

export interface BBSList {
  id: string
  bbsId?: string
  title?: string
  model: 's1' | 's2'
  pageSize?: number
  forumId?: string
  mainBoardId?: string
  align?: string
  titleBg?: string
  titleBgImg?: string
  contentBg?: string
  contentBgImg?: string
}

export interface PostDetail {
  id: string
  model: 's1' | 's2' | 's3'
  content?: string
  postIdData?: PostIdObj[]
  pageCode?: string
  title?: string
  align?: string
  titleBg?: string
  titleBgImg?: string
}

type PostIdObj = {
  postId: string
  gameType: string
}
export interface PostData {
  postId: string
  bbsId: string
  forumId: string
  title: string
  postContent: string
  likeCount: string
  threadCount: string
  postYear: string
  postIssue: string
  shortIssue: string
  postGameRef: string
  postGameTypeRef: string
  gameTypeName: string
  gameTypeCode: string
  isHot: 'y' | 'n'
  isSelected: 'y' | 'n'
  isTop: 'y' | 'n'
  isRecommended: 'y' | 'n'
  isBloom: 'y' | 'n'
  vipLevel: number
  avatar: string
  nickName: string
  attachments: any[] // 可以根据实际结构调整类型
  isLike: 'y' | 'n'
  isDislike: 'y' | 'n'
  postUserId: string
  predictFlag: string
  postTime: number // 时间戳
  favoriteCount: string
  readCount: string
  isAnonymous: string
  hasAttachment: 'y' | 'n'
  userMakeSenseCount: number
  userMakeNoSenseCount: number
  isFollow: 'y' | 'n'
  isCollect: 'y' | 'n'
  isRead: 'y' | 'n'
}
