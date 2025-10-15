import http from '@/utils/http/index'
import type {
  IAdvertisementListQueryParams,
  IAdvertisementListResponse,
  IAdvertisementCreateData,
  IAdvertisementEditData,
  IAdvertisementDeleteData,
  IAdvertisementStatusData,
  IAdvertisementApiResponse,
  IAdvertisementSortListResponse,
  IAdvertisementDetailResponse,
  IAdvertisementStatusByIdListData
} from './types'

// Get advertisement list
export const reqAdvertisementList = (data: IAdvertisementListQueryParams): Promise<IAdvertisementListResponse> => {
  return http.post('/webgw/advertisement/list', data)
}

// Create advertisement
export const reqAdvertisementCreate = (data: IAdvertisementCreateData): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/create', data)
}

// Edit advertisement
export const reqAdvertisementEdit = (data: IAdvertisementEditData): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/edit', data)
}

// Delete advertisement
export const reqAdvertisementDelete = (data: IAdvertisementDeleteData): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/delete', data)
}

// Update advertisement status
export const reqAdvertisementStatus = (data: IAdvertisementStatusData): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/editStatus', data)
}

// Update advertisement status by id list
export const reqAdvertisementStatusByIdList = (
  data: IAdvertisementStatusByIdListData
): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/batch-editStatus', data)
}

// Get advertisement sort list (for sorting functionality)
export const reqAdvertisementSortList = (): Promise<IAdvertisementSortListResponse> => {
  return http.get(`/webgw/advertisement/list-with-sort`)
}

// Save advertisement sort order (send array of IDs directly)
export const reqAdvertisementSaveSort = (gMap: string[]): Promise<IAdvertisementApiResponse> => {
  return http.post('/webgw/advertisement/set-sort', gMap)
}

// Get advertisement by id
export const reqAdvertisementById = (id: string): Promise<IAdvertisementDetailResponse> => {
  return http.get(`/webgw/advertisement/${id}`)
}
