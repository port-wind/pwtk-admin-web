import http from '@/utils/http/index'

export const directSubUsers = (data: any) => {
  return http.post<any>('webgw/user/directSubUsers', data)
}
