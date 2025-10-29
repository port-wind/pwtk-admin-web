/**
 * 论坛帖子相关类型定义
 */

/**
 * 开奖号码信息
 */
export interface INumInfo {
  /** 五行属性 */
  fiveElements: string
  /** 生肖属性 */
  shengxiao: string
  /** 大小 (s:小, b:大) */
  size: string
  /** 颜色 (R:红, B:蓝, G:绿) */
  color: string
  /** 号码 */
  num: number
  /** 索引 */
  index: number
  /** 单双 (o:单, e:双) */
  oddEven: string
}

/**
 * 玩法规则选项
 */
export interface IPlayRule {
  /** 玩法名称 */
  name: string
  /** 玩法代码 */
  code: string
  /** 可选择项 */
  options: Record<string, string[]>
  /** 竞猜号码类型 (t:特码, p:平码, q:全码) */
  guessNumType: string
  /** 竞猜命中类型 (y:一码/一肖, n:杀一肖/杀特码/杀尾) */
  guessHitType: string
  /** 选项类型 (n:号码, s:生肖, w:五行) */
  optionType: string
}

/**
 * 竞猜预测信息
 */
export interface ILotteryPrediction {
  /** 预测ID */
  predictId: number
  /** 玩法代码 */
  code: string
  /** 玩法类型代码 */
  playTypeCode: string
  /** 玩法名称 */
  name: string
  /** 二级玩法名称 */
  subName: string
  /** 竞猜明细 */
  predict: string[]
  /** 中奖明细(1:中, 0:未中) */
  hitDetail: string
  /** 是否中奖(i:未开奖, y:中, n:未中) */
  isHit: string
  /** 竞猜标题 */
  predictTitle: string
  /** 玩法规则 */
  rule: IPlayRule
}

/**
 * 论坛帖子信息
 */
export interface IForumPost {
  /** 帖子ID */
  postId: string
  /** 用户ID */
  postUserId: string
  /** 发布年份 */
  postYear: string
  /** 发布期数 */
  postIssue: string
  /** 帖子标题 */
  title: string
  /** 帖子或评论内容 */
  postContent: string
  /** 论坛ID */
  forumId: string
  /** 竞猜推荐论坛竞猜信息 */
  lotteryPredictions: ILotteryPrediction[]
  /** 开奖信息 */
  numInfo: INumInfo[]
  /** 开奖结果描述（可选） */
  result?: string

  /** 帖子链接 */
  url: string
}