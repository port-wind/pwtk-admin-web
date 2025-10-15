import axios from 'axios'
import type { ResponseType, AxiosResponse, AxiosInstance, AxiosError, AxiosProgressEvent } from 'axios'
import router from '@/router'
import { ElMessage, ElMessageBox, ElLoading, ElNotification } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import Cookies from 'js-cookie'
import i18n from '@/locales'
import { ref } from 'vue'
const { t } = i18n.global

enum Msgs {
  '操作成功' = 200,
  '无权操作' = 401,
  '禁止访问' = 403,
  '系统内部错误' = 500
}
const Msg = (num: number) => {
  switch (num) {
    case 200:
      return t('input.caozuochengong')
    case 401:
      return t('input.wuquancaozuo')
    case 403:
      return t('input.jinzhifangwen')
    case 500:
      return t('input.xitongneibucuowu')
    default:
      return t('input.qingqiushibai')
  }
}
declare module 'axios' {
  interface IAxios {
    success: boolean
    errorCode: string | number
    data: any
    errMessage: string
  }
  // interface AxiosInstance{
  //   (config:AxiosRequestConfig):Promise<any>
  // }
  export interface AxiosResponse<T = any> extends IAxios {}
}
// 避免多个接口401弹出多个弹框
let isRefreshing = false
// 全局遮罩
let loadingInstance: LoadingInstance

const {
  VITE_NODE_ENV,
  VITE_PROXY_DOMAIN,
  VITE_CHAT_DOMAIN,
  VITE_TASK_DOMAIN,
  VITE_VIDEO_DOMAIN,
  VITE_TASK_LIVE_DOMAIN,
  VITE_AUDIO_CONVERT_TOOL_DOMAIN
} = import.meta.env
const apiPath =
  VITE_NODE_ENV === 'development' && window.location.hostname === 'localhost' ? VITE_PROXY_DOMAIN : webConfigApi.apiPath
// 创建http实例

// obj:{
// baseurl:string 自定义基础路径
// contenttype:string  参数格式
// responseType:请求数据的格式
// }

interface AxiosInstanceOptions {
  baseurl?: string
  contenttype?: string
  responseType?: ResponseType
  timeout?: number
  isAdd?: boolean
  headers?: {
    [key: string]: any
  }
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: AbortSignal
}
const random = ref<string | undefined>()
const instance = (obj?: AxiosInstanceOptions): AxiosInstance => {
  const https = axios.create({
    baseURL: obj?.baseurl ?? apiPath,
    timeout: obj?.timeout ?? 15000,
    responseType: obj?.responseType ?? 'json',
    headers: {
      'Content-Type': obj?.contenttype ?? 'application/json;charset=UTF-8',
      device: 'Web',
      language: localStorage.getItem('language') === 'en' ? 'EN' : 'CN',
      slk: random.value,
      add: obj?.isAdd ?? null,
      ...obj?.headers
    },
    onUploadProgress: obj?.onUploadProgress,
    signal: obj?.signal
  })
  // 添加请求拦截器
  https.interceptors.request.use(
    (config) => {
      if (config.headers.add) {
        // console.log('loading', config.headers.add)
        loadingInstance = ElLoading.service({ fullscreen: true, text: 'Loading...' })
      }
      config.headers = config.headers || {}
      const token = Cookies.get('token')
      const cid = Cookies.get('cid') || config?.params?.data?.cid

      if (token) {
        config.headers['cid'] = cid
        if (config.headers['X-Api-Key']) {
          config.headers['authorization'] = `Bearer ${token}`
          delete config.headers['x-manage-site-id']
          delete config.headers['clienttype']
        } else {
          config.headers['Token'] = token
        }
      }
      return config
    },
    (error) => {
      if (loadingInstance) loadingInstance.close()
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  https.interceptors.response.use(
    (res: AxiosResponse) => {
      if (loadingInstance) loadingInstance.close()
      if (obj && obj.responseType == 'blob') {
        return res
      } else if (obj) {
        if (res.data.errCode === '10006') {
          if (!isRefreshing) {
            isRefreshing = true
            Cookies.remove('token')
            Cookies.remove('cid')
            Cookies.remove('state')
            localStorage.removeItem('imgUrl')
            router.push('/login')
            isRefreshing = false
            // ElNotification({
            //   type: 'warning',
            //   message: '当前用户已过期，请重新登入'
            // })
            // ElMessageBox({
            //   message: '当前用户已过期，请重新登入',
            //   title: t('input.prompt')
            // })
          }
        }
        if (res.data) {
          return res.data
        } else {
          return res
        }
      } else {
        const obj = res.data
        if (obj.errCode === '10006') {
          if (!isRefreshing) {
            isRefreshing = true

            Cookies.remove('token')
            Cookies.remove('cid')
            Cookies.remove('state')
            localStorage.removeItem('imgUrl')
            router.push('/login')
            // ElNotification({
            //   type: 'warning',
            //   message: '当前用户已过期，请重新登入'
            // })
            // ElMessageBox({
            //   message: '当前用户已过期，请重新登入',
            //   title: t('input.prompt')
            // })
            isRefreshing = false
          }
        }
        return res.data
      }
    },
    (err: AxiosError) => {
      if (loadingInstance) loadingInstance.close()
      const { response } = err
      if (err.code == 'ECONNABORTED') {
        ElMessage.error(t('input.wanglufanwanghsaohou'))
      }
      if (!response) return Promise.reject(err)
      const errCodes = [401, 403]
      const code = response.status
      if (errCodes.includes(code)) {
        if (!isRefreshing) {
          isRefreshing = true
          ElMessageBox({
            message: Msg(code),
            title: t('input.prompt')
          })
            .then(() => {
              router.push('/login')
            })
            .catch(() => {
              router.push('/login')
            })
            .finally(() => {
              isRefreshing = false
              Cookies.remove('token')
              Cookies.remove('cid')
              Cookies.remove('state')
              localStorage.removeItem('imgUrl')
            })
        }
        // removeUserInfo()

        return Promise.reject(err)
      }
      ElMessage(Msg(code) || t('input.qingqiushibai'))
      return Promise.reject(err)
    }
  )

  return https
}

const http = {
  get: <T>(url: string, data?: any, obj?: AxiosInstanceOptions): Promise<T> => {
    return obj
      ? instance(obj).get(url, { params: data ? data : '' })
      : instance().get(url, { params: data ? { data: data } : '' })
  },
  post: <T>(url: string, data: any, obj?: any): Promise<T> => {
    // Check if obj contains an onUploadProgress handler and pass it to the instance config
    const hasProgressHandler = obj && !!obj.signal

    // Create axios config with progress handler if provided
    const axiosConfig = hasProgressHandler
      ? {
          ...obj,
          onUploadProgress: obj.onUploadProgress,
          signal: obj.signal,
          timeout: obj.timeout
        }
      : obj

    return hasProgressHandler
      ? instance(axiosConfig).post(url, data, obj)
      : obj
      ? instance(obj).post(url, data)
      : instance().post(url, data)
  },
  put: <T>(url: string, data: any, obj?: AxiosInstanceOptions): Promise<T> => {
    return obj ? instance(obj).put(url, data) : instance().put(url, data)
  },
  delete: <T>(url: string, data: any): Promise<T> => {
    return instance().delete(url, { data: data })
  },
  patch: <T>(url: string, data: any): Promise<T> => {
    return instance().patch(url, { data: data })
  }
}
export const basePath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_PROXY_DOMAIN
    : webConfigApi.apiPath
export const chatApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_CHAT_DOMAIN
    : webConfigApi.VITE_CHAT_DOMAIN
export const taskApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_TASK_DOMAIN
    : webConfigApi.VITE_TASK_DOMAIN
export const videoApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_VIDEO_DOMAIN
    : webConfigApi.apiPath
export const liveApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_VIDEO_DOMAIN
    : webConfigApi.apiPath
export const taskLiveApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_TASK_LIVE_DOMAIN
    : webConfigApi.VITE_TASK_LIVE_DOMAIN
export const audioConvertToolUrl =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_AUDIO_CONVERT_TOOL_DOMAIN
    : webConfigApi.VITE_AUDIO_CONVERT_TOOL_DOMAIN
export default http
