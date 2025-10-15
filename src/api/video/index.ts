import http from '@/utils/http/index'
import { videoApiOptions } from './videoApiConfig'

export const getVideoList = (data: any): Promise<any> => {
  return http.get('webgw/video/api/videos', data, videoApiOptions)
}

// Video upload API functions
export const initVideoUpload = (data: any): Promise<any> => {
  return http.post('webgw/video/api/upload/initialize', data, videoApiOptions)
}

export const uploadVideoChunk = (
  sessionId: string,
  partNumber: number,
  chunk: Blob,
  signal?: AbortSignal
): Promise<any> => {
  return http.post(`webgw/video/api/upload/part/${sessionId}/${partNumber}`, chunk, {
    ...videoApiOptions,
    contenttype: 'application/octet-stream',
    signal
  })
}

export const completeVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/finalize', { sessionId }, videoApiOptions)
}

export const cancelVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/cancel', { sessionId }, videoApiOptions)
}

export const getVideoTagList = (data?: { isActive: boolean }): Promise<any> => {
  return http.get('webgw/video/api/tags', data, videoApiOptions)
}

/**
 * Get formatted video tag list for select components
 * @returns {Promise<Array<{value: string, label: string}>>} Formatted tag list
 */
export const getFormattedVideoTagList = async (): Promise<Array<{ value: string; label: string }>> => {
  try {
    const res = await getVideoTagList()
    if (res.success && res?.data) {
      return res.data
        .filter((item: any) => item.isActive)
        .map((item: any) => ({
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
  return http.post('webgw/video/api/videos', data, videoApiOptions)
}

export const getVideoDetails = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/videos/${data.id}`, null, videoApiOptions)
}

export const togglePublishVideo = (data: any): Promise<any> => {
  return http.post(`webgw/video/api/videos/${data.id}/toggle-publish`, null, videoApiOptions)
}

export const getVideoListRule = (): Promise<any> => {
  return http.get(`webgw/video/listRule`)
}

export const getVideoUploadRule = (data: any): Promise<any> => {
  return http.post(`webgw/video/uploadRule`, data)
}

export const batchAuditVideo = (data: any): Promise<any> => {
  return http.post(`webgw/video/api/videos/batch-audit`, data, videoApiOptions)
}

export const updateVideoAuditStatus = (data: any): Promise<any> => {
  return http.put(`webgw/video/api/videos/${data.id}`, data, videoApiOptions)
}

export const getVideoBrowseList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/views`, data, videoApiOptions)
}

export const getVideoLikeList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/likes`, data, videoApiOptions)
}

export const getVideoFavoriteList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/favorites`, data, videoApiOptions)
}

export const getVideoCommentList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/comments`, data, videoApiOptions)
}

export const getVideoShareList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/shares`, data, videoApiOptions)
}

export const getTagList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/tags/admin`, data, videoApiOptions)
}

// Tag Management API functions

/**
 * Get tag details by ID
 * @param {Object} data - Request data containing tag ID
 * @param {number} data.id - Tag ID
 * @returns {Promise<any>} Tag details
 */
export const getTagDetails = (data: { id: number }): Promise<any> => {
  return http.get(`webgw/video/api/tags/${data.id}`, null, videoApiOptions)
}

/**
 * Create a new tag
 * @param {Object} data - Tag data
 * @param {string} data.name - Tag name
 * @param {boolean} data.isActive - Tag active status
 * @returns {Promise<any>} Created tag data
 */
export const createTag = (data: { name: string; isActive: boolean }): Promise<any> => {
  return http.post('webgw/video/api/tags/admin', data, videoApiOptions)
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
  return http.put(`webgw/video/api/tags/admin/${id}`, updateData, videoApiOptions)
}
