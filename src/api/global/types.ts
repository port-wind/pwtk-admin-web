export interface IGameTypePlatformBodyParameter {
  page: number /** 页码 */
  size: number /** 每页显示条数 */
  sortName?: string /** 排序字段名称 */
  sortOrder?: 'ASC' | 'DESC' /** 排序顺序 */
  gameTypeShortName?: string /** 彩种简称 (长度最长32位) */
  gameTypeName?: string /** 彩种名称 (长度最长64位) */
  status?: string /** 彩种状态 (0禁用，1开启) */
}

export interface IGameType {
  gameType: string /**    * 游戏类型ID    */
  gameTypeShortName: string /**    * 游戏类型简称    */
  gameTypeName: string /**    * 游戏类型名称    */
  gameTypeLongName: string /**    * 游戏类型全名    */
  areaCode: string /**    * 区域代码    */
  classifier: string /**    * 分类    */
  gameTypeCode: string /**    * 游戏类型代码    */
  status?: 'y' | 'n'
  createTime?: number
}

export interface IPointEvent {
  /** 触发积分事件的业务类型编码（10位字符串） */
  bizCode: string // string, required, length: 10
  /** 触发积分事件的业务名称 */
  bizName: string // string, required
  /** 业务名称文字描述 */
  bizDesc: string // string, required
}

export interface IStarBizType {
  bizCode: string
  bizName: string
  // '积分兑换'
  bizDesc: string
}
