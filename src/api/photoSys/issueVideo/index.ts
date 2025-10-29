import http from '@/utils/http/index'
import type { IResponse, IBaseResponse } from '@/api/type'
import type {
  IIssueVideo,
  IIssueVideoListParams,
  IIssueVideoListResponse,
  IIssueVideoDetailParams,
  IIssueVideoExistParams,
  IIssueVideoCreateParams,
  IUploadResponse
} from './type'

// Get issue video list
export const getIssueVideoList = (data: IIssueVideoListParams): Promise<IResponse<IIssueVideoListResponse>> => {
  console.log(data)

  // return new Promise((resolve) => {
  //   resolve({
  //     success: true,
  //     errCode: 'string',
  //     errMessage: 'string',
  //     data: {
  //       total: 0,
  //       list: [
  //         {
  //           id: 1,
  //           videoTitle: '开奖视频标题',
  //           year: 2025,
  //           gameType: 1,
  //           issue: 2025013,
  //           videoPath: 'devmedia/video/lottery/video/25/07/28/xxxx.mp4',
  //           videoSize: '100MB',
  //           uploadVideoTime: 1754544268000,
  //           updateVideoTime: 1754544268000,
  //           videoPicture: 'devmedia/video/picture/xxx.jpg'
  //         }
  //       ]
  //     }
  //   })
  // })
  return http.post('webgw/issueVideo/list', data)
}

// Get issue video detail
export const getIssueVideoDetail = (data: { id: string }): Promise<IBaseResponse<IIssueVideo>> => {
  return http.post('webgw/issueVideo/detail', data)
}

// Check if issue video exists
export const checkIssueVideoExist = (data: {
  gameType: string
  year: string
  issue: string
}): Promise<IBaseResponse<boolean>> => {
  return http.post('webgw/issueVideo/exist', data)
}

// Create or update issue video
export const createIssueVideo = (data: IIssueVideoCreateParams): Promise<IBaseResponse<any>> => {
  const { id } = data
  if (id) {
    return http.post('webgw/issueVideo/update', data)
  }
  return http.post('webgw/issueVideo/insert', data)
}

// Upload file (video or image)
export const uploadUrlToGetPath = (data: {
  videoUrl: string
  uploadType: string
}): Promise<IBaseResponse<IUploadResponse>> => {
  // Using the specific upload endpoint mentioned in the API doc
  return http.post('webgw/issueVideo/upload', data)
}
