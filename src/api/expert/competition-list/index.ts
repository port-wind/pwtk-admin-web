import http from '@/utils/http/index'

export const listPlayTypeCodeForCompetition = (data: any): Promise<any> => {
  return http.post('webgw/predict/type/listPlayTypeCode', data)
}
