import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'

export interface ListParams {
  page: number
  size: number
  year: string | null
  issue: string | null
}

export interface HistoryItem {
  issue: number
  year: number
  color: string
  openTime: string
  result: string
  teNum: number
  num1: number
  num2: number
  num3: number
  num4: number
  num5: number
  num6: number
  recordTime: string
  fiveElements: string
  oddEven: string
  totalOddEven: string
  size: string
  totalSize: string
  tePrefix: number
  teSuffix: number
  animalFlag: string
  totalNum: number
  totalNumSize: string
  totalNumOddEven: string
  animalCount: number
  suffixCount: number
  status: string
  numInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
}

export interface ResultType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: HistoryItem[]
  }
}

export interface HistoryItem {
  issue: number
  year: number
  color: string
  openTime: string
  result: string
  teNum: number
  num1: number
  num2: number
  num3: number
  num4: number
  num5: number
  num6: number
  recordTime: string
  fiveElements: string
  oddEven: string
  totalOddEven: string
  size: string
  totalSize: string
  tePrefix: number
  teSuffix: number
  animalFlag: string
  totalNum: number
  totalNumSize: string
  totalNumOddEven: string
  animalCount: number
  suffixCount: number
  status: string
  numInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
}

export interface ReviewItem {
  issue: number
  year: number
  gameType: number
  firstCheckNum1: number | ''
  firstCheckNum2: number | ''
  firstCheckNum3: number | ''
  firstCheckNum4: number | ''
  firstCheckNum5: number | ''
  firstCheckNum6: number | ''
  firstCheckNumTe: number | ''
  firstCheckTime: string
  firstCheckLastUpdateTime: string
  firstCheckUpdateCount: number
  firstCheckIsApi: 'y' | 'n'
  firstCheckOpid: string
  firstCheckOper: string
  firstCheckMemo: string
  doubleCheckNum1: number | ''
  doubleCheckNum2: number | ''
  doubleCheckNum3: number | ''
  doubleCheckNum4: number | ''
  doubleCheckNum5: number | ''
  doubleCheckNum6: number | ''
  doubleCheckNumTe: number | ''
  doubleCheckTime: string
  doubleCheckLastUpdateTime: string
  doubleCheckUpdateCount: number
  doubleCheckIsApi: 'y' | 'n'
  doubleCheckOpid: string
  doubleCheckOper: string
  doubleCheckMemo: string
  compareResult: 'y' | 'n'
  isAutoConfirm: 'y' | 'n' | 's'
  firstCheckNumsInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
  doubleCheckNumsInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
  firstCheckGameDataFrom: string
  existFirstCheck: string
  existDoubleCheck: string
  doubleCheckGameDataFrom: string
}

export interface ResultType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: HistoryItem[]
  }
}

export interface ReviewResultType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: ReviewItem[]
  }
}

export interface CheckParams {
  issue: number
  year: number
  doubleCheckNum1: number
  doubleCheckNum2: number
  doubleCheckNum3: number
  doubleCheckNum4: number
  doubleCheckNum5: number
  doubleCheckNum6: number
  doubleCheckNumTe: number
  doubleCheckMemo: string
}

export interface InsertOrUpdateFirstCheckParams {
  issue: number | null
  year: number | null
  firstCheckNum1: number | null
  firstCheckNum2: number | null
  firstCheckNum3: number | null
  firstCheckNum4: number | null
  firstCheckNum5: number | null
  firstCheckNum6: number | null
  firstCheckNumTe: number | null
  firstCheckMemo: string
}

export interface InsertOrUpdateDoubleCheckParams {
  issue: number | null
  year: number | null
  doubleCheckNum1: number | null
  doubleCheckNum2: number | null
  doubleCheckNum3: number | null
  doubleCheckNum4: number | null
  doubleCheckNum5: number | null
  doubleCheckNum6: number | null
  doubleCheckNumTe: number | null
  doubleCheckMemo: string
}

export interface PushReviewParams {
  issue: number
  year: number
  gameType: number
  confirmResult: boolean
}

export interface ResType {
  success: boolean
  errCode: string
  errMessage: string
}

export interface PushDataParams {
  issue: number | null
  year: number
  gameType: number
}

export interface OpenDateItem {
  issue: number | null
  gameType: number
  openDate: string
}

export interface OpenDateResType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    openDateList: OpenDateItem[]
  }
}

export interface EditOpenDateParams {
  year: number
  month: number
  gameType: number
  openDateList: OpenDateItem[]
}

// 澳6开奖历史表
export const getAHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/aSix/list', { ...data, sortOrder: 'DESC' })
}

// 港6开奖历史表
export const getHKHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/hkSix/list', { ...data, sortOrder: 'DESC' })
}

// 新6开奖历史表
export const getSGHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/sgSix/list', { ...data, sortOrder: 'DESC' })
}

// 台6开奖历史表
export const getTWHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/twSix/list', { ...data, sortOrder: 'DESC' })
}

// 新澳6开奖历史表
export const getXAHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/xaSix/list', { ...data, sortOrder: 'DESC' })
}

// 快乐8开奖历史表
export const getKL8History = (data: ListParams) => {
  return http.post<ResultType>('webgw/kl8/list', { ...data, sortOrder: 'DESC' })
}

export type TGameId = 'aSix' | 'hkSix' | 'sgSix' | 'twSix' | 'xaSix' | 'kl8'

export type TGameTypeNumber = 'a6' | 'hk6' | 'sg6' | 'tw6' | 'xa6' | 'kl8'

export interface IGetGameHistoryQueryParams {
  page: number
  size: number
  year: number
  sortOrder: 'DESC' | 'ASC'
  // issue: number  不需要传这个参数了
}
interface NumInfo {
  fiveElements: string // 五行
  oddEven: string // 单双
  size: string // 大小
  color: string // 颜色
  num: number // 号码
  index: number // 索引
  shengxiao: string // 生肖
}
export interface IGetGameHistoryData {
  animalCount: number // 动物数量
  animalFlag: string // 动物标志
  color: string // 颜色
  fiveElements: string // 五行
  issue: string // 期号
  num1: number // 第1个号码
  num2: number // 第2个号码
  num3: number // 第3个号码
  num4: number // 第4个号码
  num5: number // 第5个号码
  num6: number // 第6个号码
  numInfo: NumInfo[] // 号码详细信息
  oddEven: string // 单双
  openTime: number // 开奖时间戳
  recordTime: number // 记录时间戳
  result: string // 开奖结果字符串
  size: string // 大小
  suffixCount: number // 后缀计数
  teNum: number // 特码
  tePrefix: number // 特码前缀
  teSuffix: number // 特码后缀
  totalNum: number // 总和
  totalNumOddEven: string // 总和单双
  totalNumSize: string // 总和大小
  totalOddEven: string // 总单双
  totalSize: string // 总大小
  year: number // 年份
}
// 新澳6开奖历史表
export const getGameHistory = (
  gameId: TGameId,
  data: IGetGameHistoryQueryParams
): Promise<IResponse<IGetGameHistoryData>> => {
  return http.post(`webgw/${gameId}/list`, data)
}

// 查询开奖日期列表(yyyy-MM-dd)
export const getOpenDateList = (year: number, month: number, gameType: number) => {
  return http.post<OpenDateResType>('/webgw/game/open/date/list', { year, month, gameType })
}

// 增删改开奖日期接口，传list列表(yyyy-MM-dd),哪一年哪一月的数据
export const editOpenDate = (data: EditOpenDateParams) => {
  return http.post<ResType>('/webgw/game/open/date/edit', data)
}

export const getYearOptionsByGameType = (gameType: string): Promise<IBaseResponse<any>> => {
  return http.post(`/webgw/tk/gameTypePlatform/yearList`, { gameType })
}
