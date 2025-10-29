import http from '@/utils/http/index'
import { liveApiOptions } from './liveApiConfig'

export const getLiveRoomList = (data: any): Promise<any> => {
  return http.get('webgw/video/api/room/admin/list', data, liveApiOptions)
}

export const getLiveRoomMessageList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/room/admin/${data.roomId}/messages`, data, liveApiOptions)
}

export const getAllLiveRoomMessageList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/room/admin/messages`, data, liveApiOptions)
}

export const getLiveRoomMemberList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/room/admin/${data.roomId}/members`, data, liveApiOptions)
}

// Video upload API functions
export const initVideoUpload = (data: any): Promise<any> => {
  return http.post('webgw/video/api/upload/initialize', data, liveApiOptions)
}

export const uploadVideoChunk = (
  sessionId: string,
  partNumber: number,
  chunk: Blob,
  signal?: AbortSignal
): Promise<any> => {
  return http.post(`webgw/video/api/upload/part/${sessionId}/${partNumber}`, chunk, {
    ...liveApiOptions,
    contenttype: 'application/octet-stream',
    signal
  })
}

export const completeVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/finalize', { sessionId }, liveApiOptions)
}

export const cancelVideoUpload = (sessionId: string): Promise<any> => {
  return http.post('webgw/video/api/upload/cancel', { sessionId }, liveApiOptions)
}

export const batchAuditVideo = (data: any): Promise<any> => {
  return http.post(`webgw/video/api/videos/batch-audit`, data, liveApiOptions)
}

export const updateVideoAuditStatus = (data: any): Promise<any> => {
  return http.put(`webgw/video/api/videos/${data.id}`, data, liveApiOptions)
}

export const getVideoShareList = (data: any): Promise<any> => {
  return http.get(`webgw/video/api/actions/${data.id}/shares`, data, liveApiOptions)
}
