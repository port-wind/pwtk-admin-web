import http from '@/utils/http/index'
import { liveOptions } from './apiConfig'

export const getVideoTaskList = (data: any): Promise<any> => {
  return http.get('api/task/list', data, liveOptions)
}

export const createLiveTask = (data: any): Promise<any> => {
  return http.post('api/task/create', data, liveOptions)
}

export const updateLiveTask = (data: any): Promise<any> => {
  return http.post('api/task/update', data, liveOptions)
}

export const getLiveTaskDetail = (data: any): Promise<any> => {
  return http.get('api/task/get', data, liveOptions)
}

export const cancelLiveTask = (data: any): Promise<any> => {
  return http.post('api/task/cancel', data, liveOptions)
}

// Video upload API functions
export const initVideoUpload = (data: any): Promise<any> => {
  return http.post('webgw/video/api/upload/initialize', data, liveOptions)
}

export const uploadVideoChunk = (
  sessionId: string,
  partNumber: number,
  chunk: Blob,
  signal?: AbortSignal
): Promise<any> => {
  return http.post(`webgw/video/api/upload/part/${sessionId}/${partNumber}`, chunk, {
    ...liveOptions,
    contenttype: 'application/octet-stream',
    signal
  })
}

export const completeVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/finalize', { sessionId }, liveOptions)
}

export const cancelVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/cancel', { sessionId }, liveOptions)
}

export const getVideoTagList = (data?: { isActive: boolean }): Promise<any> => {
  return http.get('webgw/video/api/tags', data, liveOptions)
}

/**
 * Get formatted video tag list for select components
 * @returns {Promise<Array<{value: string, label: string}>>} Formatted tag list
 */
export const getFormattedVideoTagList = async (): Promise<Array<{ value: string; label: string }>> => {
  try {
    const res = await getVideoTagList()
    if (res.success && res?.data) {
      return res.data.map((item: any) => ({
        value: item.id,
        label: item.name
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching video tag list:', error)
    return []
  }
}

export const createVideo = (data: any): Promise<any> => {
  return http.post('webgw/video/api/videos', data, liveOptions)
}

export const getVideoDetails = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/videos/${data.id}`, null, liveOptions)
}

export const togglePublishVideo = (data: any): Promise<any> => {
  return http.post(`webgw/video/api/videos/${data.id}/toggle-publish`, null, liveOptions)
}

export const getVideoListRule = (): Promise<any> => {
  return http.get(`webgw/video/listRule`)
}

export const getVideoUploadRule = (data: any): Promise<any> => {
  return http.post(`webgw/video/uploadRule`, data)
}

export const batchAuditVideo = (data: any): Promise<any> => {
  return http.post(`webgw/video/api/videos/batch-audit`, data, liveOptions)
}

export const updateVideoAuditStatus = (data: any): Promise<any> => {
  return http.put(`webgw/video/api/videos/${data.id}`, data, liveOptions)
}

export const getVideoBrowseList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/views`, data, liveOptions)
}

export const getVideoLikeList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/likes`, data, liveOptions)
}

export const getVideoCommentList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/comments`, data, liveOptions)
}

export const getVideoShareList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/shares`, data, liveOptions)
}

export const getTagList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/tags/admin`, data, liveOptions)
}

// Tag Management API functions

/**
 * Get tag details by ID
 * @param {Object} data - Request data containing tag ID
 * @param {number} data.id - Tag ID
 * @returns {Promise<any>} Tag details
 */
export const getTagDetails = (data: { id: number }): Promise<any> => {
  return http.get(`webgw/video/api/tags/${data.id}`, null, liveOptions)
}

/**
 * Create a new tag
 * @param {Object} data - Tag data
 * @param {string} data.name - Tag name
 * @param {boolean} data.isActive - Tag active status
 * @returns {Promise<any>} Created tag data
 */
export const createTag = (data: { name: string; isActive: boolean }): Promise<any> => {
  return http.post('webgw/video/api/tags/admin', data, liveOptions)
}

/**
 * Update an existing tag
 * @param {Object} data - Tag update data
 * @param {number} data.id - Tag ID
 * @param {string} data.name - Tag name
 * @param {boolean} data.isActive - Tag active status
 * @param {number} data.sortOrder - Tag sort order
 * @returns {Promise<any>} Updated tag data
 */
export const updateTag = (data: { id: number; name: string; isActive: boolean; sortOrder?: number }): Promise<any> => {
  const { id, ...updateData } = data
  return http.put(`webgw/video/api/tags/admin/${id}`, updateData, liveOptions)
}
