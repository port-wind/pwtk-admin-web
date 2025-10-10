import http from '@/utils/http/index'
import { v4 as uuidv4 } from 'uuid'
import type { AddRequest, AddResponse, FileUploadRequest, FileUploadResponse, GetRequest, GetResponse } from './types'
import { generateUniqueIds } from '@/api'

enum api {
  //单个文件上传
  UploadSingle = '/upload/single',
  GetAll = '/webgw/uploadHistory/list',
  AddOne = '/webgw/uploadHistory/add'
}

/**
 * Upload a single file to the server
 * @param {FileUploadRequest} data - The file upload request data
 * @param {Object} options - Upload options
 * @param {boolean} [options.notWithGenId] - Whether to skip generating unique ID, if true, the uploadTarget will be the original uploadTarget
 * @returns {Promise<FileUploadResponse>} The upload response
 */
export const uploadSingle = async (
  data: FileUploadRequest,
  options: { notWithGenId?: boolean } & Record<string, any>
) => {
  try {
    if (!options.notWithGenId) {
      await updateUploadTargetWithUniqueId(data)
    }
    return http.post<FileUploadResponse>(api.UploadSingle, data, options)
  } catch (error) {
    console.error('Error uploading single file:', error)
    throw error
  }
}

async function updateUploadTargetWithUniqueId(data: FileUploadRequest): Promise<void> {
  try {
    const uniqueId = await getUniqueIdFromBackend()
    data.uploadTarget = replaceFilename(data.uploadTarget, uniqueId)
  } catch (error) {
    console.warn('Failed to generate unique IDs from backend, falling back to UUID:', error)
    data.uploadTarget = replaceFilename(data.uploadTarget, uuidv4())
  }
}

async function getUniqueIdFromBackend(): Promise<string> {
  const res = await generateUniqueIds()
  if (!res.success || !res.data.length) {
    throw new Error('Failed to generate unique IDs from backend')
  }
  return res.data[0]
}

// Add this helper function
function replaceFilename(originalPath: string, newId: string): string {
  const extension = originalPath.split('.').pop() // Get the file extension
  return `${newId}.${extension}`
}

export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}

export const addHttp = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}
