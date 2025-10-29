export interface IGameTypePlatformBodyParameter {
  page: number /** 页码 */
  size: number /** 每页显示条数 */
  sortName?: string /** 排序字段名称 */
  sortOrder?: 'ASC' | 'DESC' /** 排序顺序 */
  gameTypeShortName?: string /** 彩种简称 (长度最长32位) */
  gameTypeName?: string /** 彩种名称 (长度最长64位) */
  status?: string /** 彩种状态 (0禁用，1开启) */
}

export interface IGameTypePlatformListData {
  gameType: number // 彩种 (长度最长32位)
  gameTypeShortName: string // 彩种简称 (长度最长32位)
  gameTypeName: string // 彩种名称 (长度最长64位)
  gameTypeLongName: string // 彩种全称 (长度最长128位)
  areaCode: string // 所属地区代码 (长度最长5位)
  classifier: string // 分类 (长度最长64位)
  gameTypeCode: string // 游戏类型代码
  status: string // 状态：0禁用，1开启
  sortNum: number // 排序
  createTime: string // 创建时间
}
