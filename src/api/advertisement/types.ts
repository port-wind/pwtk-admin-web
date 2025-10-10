// Advertisement API types
export interface IAdvertisementListQueryParams {
  page: number
  size: number
  sortName?: string
  sortOrder?: 'ASC' | 'DESC'
  name?: string
  startTime?: number // timestamp
  endTime?: number // timestamp
  status?: string
  gameType?: string
}

export interface IAdvertisementData {
  id: number
  logo: string
  name: string
  createTime: string // "yyyy-MM-dd HH:mm:ss"
  startTime: string // "yyyy-MM-dd HH:mm:ss"
  endTime: string // "yyyy-MM-dd HH:mm:ss"
  url: string
  status: string
  sort: number
  desc: string
  isDelete: string
  taskStatus: number
  gameType: string
  gameTypeList: string[]
}

export interface IAdvertisementListResponse {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: IAdvertisementData[]
  }
}

// For create advertisement
export interface IAdvertisementCreateData {
  logo: string
  name: string
  startTime: number // timestamp
  endTime: number // timestamp
  url: string
  status: string
  desc: string
  gameTypeList: string[]
}

// For edit advertisement
export interface IAdvertisementEditData {
  id: number
  logo: string
  name: string
  startTime: number // timestamp
  endTime: number // timestamp
  url: string
  status: string
  desc: string
}

// For delete advertisement
export interface IAdvertisementDeleteData {
  id: number
}

// For status change
export interface IAdvertisementStatusData {
  id: number
  status: string
}

export interface IAdvertisementStatusByIdListData {
  advertisementIdList: string[]
  status: string
}

// Standard API response
export interface IAdvertisementApiResponse {
  success: boolean
  errCode: string
  errMessage: string
}

// Sort list response
export interface IAdvertisementSortListResponse {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    advertisementList: IAdvertisementData[]
    completeList: IAdvertisementData[]
  }
}

export interface IAdvertisementDetailResponse {
  success: boolean
  errCode: string
  errMessage: string
  data: IAdvertisementData
}
