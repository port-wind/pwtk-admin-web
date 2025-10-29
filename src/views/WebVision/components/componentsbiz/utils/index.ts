// 获取完整URL的方法
export const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}
export const PUBLIC_CDN_URL = 'https://stt.pwtk.cc/'

export const PUBLIC_CDN_URL_2 = 'https://tk2cdn.ai4funs.com/'