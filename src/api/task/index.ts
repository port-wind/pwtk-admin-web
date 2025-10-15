import type { AxiosProgressEvent } from 'axios'
import http from '@/utils/http/index'

import { options } from './apiConfig'

export const reqAudioUpload = (
  data: any,
  contenttype: string,
  onUploadProgress?: (_: AxiosProgressEvent) => void
): Promise<any> => {
  return http.post('/api/audio/upload', data, { ...options, onUploadProgress, contenttype })
}

export const createVoiceRoomTask = (data: any): Promise<any> => {
  return http.post('/api/voiceroom/create', data, options)
}

export const getVoiceRoomTaskList = (data: any): Promise<any> => {
  return http.get('/api/voiceroom/list', data, options)
}

export const getVoiceRoomTaskDetail = (data: any): Promise<any> => {
  return http.get('/api/voiceroom/get', data, options)
}

export const updateVoiceRoomTask = (data: any): Promise<any> => {
  return http.put('/api/voiceroom/update', data, options)
}

export const cancelVoiceRoomTask = (data: any): Promise<any> => {
  return http.post('/api/voiceroom/cancel', data, options)
}

export const checkAudioIsExists = (data: { fileHash: string; fileSize: number }): Promise<any> => {
  return http.post('/api/audio/check', data, options)
}

export const initAudioUpload = (data: any): Promise<any> => {
  return http.post('/api/audio/init', data, options)
}

export const uploadAudioChunk = (
  data: any,
  contenttype: string,
  signal?: AbortSignal,
  timeout?: number
): Promise<any> => {
  return http.post('/api/audio/upload-chunk', data, { ...options, signal, contenttype, timeout })
}

export const completeAudioUpload = (data: any): Promise<any> => {
  return http.post('/api/audio/complete', data, options)
}
