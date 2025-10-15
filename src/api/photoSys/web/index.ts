import http from '@/utils/http/index'

// Query game type series list
export const list = (data: any) => {
  return http.post<any>('webgw/tk/website/list ', data)
}

// Create new game type series
export const create = (data: any) => {
  return http.post<any>('webgw/tk/website/create', data)
}

// Edit game type series
export const edit = (data: any) => {
  return http.post<any>('webgw/tk/website/edit', data)
}

// Delete game type series
export const del = (data: any) => {
  return http.post<any>('webgw/tk/website/delete', data)
}

// Check if the site name exists
export const existSiteName = (data: any) => {
  return http.post<any>('webgw/tk/website/existSiteName', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/gameTypeNewspaper/list', data)
}

export const existSiteId = (data: any) => {
  return http.post<any>('webgw/tk/website/existSiteId', data)
}

//模糊查询id信息
export const getListBlurSiteId = (data: any) => {
  return http.post<any>('webgw/tk/website/listBlurSiteId', data)
}

//模糊查询名称信息
export const getListBlurSiteName = (data: any) => {
  return http.post<any>('webgw/tk/website/listBlurSiteName', data)
}
