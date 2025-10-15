import constants from '@/constants'
import setLSItem from './setLocalStorageItem'

interface ResData {
  success: boolean
  data: {
    accessToken: string
    accessTokenExpireTime: number
    firstLogin: boolean
    refreshToken: string
    refreshTokenExpireTime: number
    userId: string
    userInfo: {
      loginId: string
      nickName: string
      userLevel: number
      avatar: string
      vipLevel: number
    }
  }
}

function saveAuthTokens(response: { data: ResData }) {
  // ! Token
  setLSItem(constants.localStorageKeys.ACCESS_TOKEN, response.data.data.accessToken)
  // ! Token 过期时间
  setLSItem(constants.localStorageKeys.ACCESS_TOKEN_EXPIRE_TIME, response.data.data.accessTokenExpireTime)
  // ! 是否第一次登录
  setLSItem(constants.localStorageKeys.FIRST_LOGIN, response.data.data.firstLogin)
  // ! 刷新 Token
  setLSItem(constants.localStorageKeys.REFRESH_TOKEN, response.data.data.refreshToken)
  // ! 刷新 Token 过期时间
  setLSItem(constants.localStorageKeys.REFRESH_TOKEN_EXPIRE_TIME, response.data.data.refreshTokenExpireTime)
  // ! 用户 ID
  setLSItem(constants.localStorageKeys.USER_ID, response.data.data.userId)
  // ! 用户昵称
  setLSItem(constants.localStorageKeys.NICKNAME, response.data.data.userInfo.nickName)
  // ! 用户等级
  setLSItem(constants.localStorageKeys.USER_LEVEL, response.data.data.userInfo.userLevel)
  // ! 用户头像
  setLSItem(constants.localStorageKeys.AVATAR, response.data.data.userInfo.avatar)
  // ! VIP 等级
  setLSItem(constants.localStorageKeys.VIP_LEVEL, response.data.data.userInfo.vipLevel)
}

export default saveAuthTokens
