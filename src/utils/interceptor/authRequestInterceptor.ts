import getLSItem from '../getLocalStorageItem'
import constants from '@/constants'
import type { Interceptor } from '@/types'

const authRequestInterceptor: Interceptor.RequestInterceptor = async (config) => {
  const token = getLSItem(constants.localStorageKeys.ACCESS_TOKEN)
  config.headers['token'] = token
  return config
}

export default authRequestInterceptor
