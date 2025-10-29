export interface IGameTypeSeriesListParameter {
  /**
   * 页码
   */
  page: number

  /**
   * 每页显示条数
   */
  size: number

  /**
   * 排序字段名称
   */
  sortName?: string

  /**
   * 排序顺序
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * 图纸系列(长度最长32位)
   */
  seriesCode?: string

  /**
   * 彩种(长度最长32位)
   */
  gameType?: string

  /**
   * 系列名称(长度最长128位)
   */
  seriesName?: string

  /**
   * 是否有黑白图纸; y,有; n,没有; (长度最长1位)
   */
  hasBlackWhite?: 'y' | 'n'

  /**
   * 是否有彩色图纸; y,有; n,没有; (长度最长1位)
   */
  hasColorful?: 'y' | 'n'

  /**
   * 创建时间(长度最长30位)
   */
  createTime?: string // yyyy-MM-dd HH:mm:ss

  /**
   * 系列描述(长度最长255位)
   */
  seriesDesc?: string

  /**
   * 备注(长度最长64位)
   */
  memo?: string

  /**
   * 是否推荐; y,是; n,否; (长度最长1位)
   */
  isRecommended?: 'y' | 'n'

  /**
   * 是否热门; y,是; n,否; (长度最长1位)
   */
  isHot?: 'y' | 'n'

  /**
   * 是否置顶; y,是; n,否; (长度最长1位)
   */
  isTop?: 'y' | 'n'

  /**
   * 是否精选; y,是; n,否; (长度最长1位)
   */
  isSelected?: 'y' | 'n'

  /**
   * 是否爆款; y,是; n,否; (长度最长1位)
   */
  isBloom?: 'y' | 'n'
}

export interface IGameTypeSeriesDetails {
  /**
   * 图纸系列(长度最长32位)
   */
  seriesCode: string

  /**
   * 彩种(长度最长32位)
   */
  gameType: string

  /**
   * 系列名称(长度最长128位)
   */
  seriesName: string

  /**
   * 黑白图纸数量 0,没有；>0表示有的数量(长度最长11位)
   */
  blackWhiteCount: string

  /**
   * 彩色图纸数量 0,没有；>0表示有的数量;(长度最长11位)
   */
  colorfulCount: string

  /**
   * 创建时间(长度最长30位)
   */
  createTime: string // yyyy-MM-dd HH:mm:ss

  /**
   * 系列描述(长度最长255位)
   */
  seriesDesc: string

  /**
   * 备注(长度最长64位)
   */
  memo: string

  /**
   * 是否推荐; y,是; n,否; (长度最长1位)
   */
  isRecommended: 'y' | 'n'

  /**
   * 是否热门; y,是; n,否; (长度最长1位)
   */
  isHot: 'y' | 'n'

  /**
   * 是否置顶; y,是; n,否; (长度最长1位)
   */
  isTop: 'y' | 'n'

  /**
   * 是否精选; y,是; n,否; (长度最长1位)
   */
  isSelected: 'y' | 'n'

  /**
   * 是否爆款; y,是; n,否; (长度最长1位)
   */
  isBloom?: 'y' | 'n' // 复制字段
}
