import getCid from './getCid'
import getDomain from './getDomain'
import getLSItem from './getLocalStorageItem'
import setLSItem from './setLocalStorageItem'
import isLoggedIn from './isLoggedIn'
// import encodeBase64 from './encodeBase64';
// import encodeSha1 from './encodeSha1';
import jumpToLogin from './jumpToLogin'
import saveAuthTokens from './saveAuthTokens'
import interceptor from './interceptor'
import clearAuth from './clearAuth'
// import copyText from './copyText';
import jumpTo from './jumpTo'
import parsingQueryParameters from './parsingQueryParameters'
import { LoginStatus } from './isLoggedIn'
import displayTime from './dateFormate'
import getIpData from './getIpData'
import getSession from './getSessionStorageItem'
import setSession from './setSessionStorageItem'
import numberFormat from './numberFormat'
import formatNumberWithCommas from './formatNumberWithCommas'
// import getImageUrl from './getImageUrl.ts';
import getServiceUrl from './getServiceUrl'
import getDownloadAppUrl from './getDownloadAppUrl'
import getNickName from './getNickName'
// import chain from './chain.ts';
import jumpToUser from './jumpToUser'
import formateJSON from './JSONFormate'

export default {
  getCid,
  getDomain,
  getLSItem,
  setLSItem,
  getSession,
  setSession,
  isLoggedIn,
  // encodeBase64,
  // encodeSha1,
  jumpToLogin,
  saveAuthTokens,
  clearAuth,
  // copyText,
  parsingQueryParameters,
  jumpTo,
  getIpData,
  interceptor,
  LoginStatus,
  displayTime,
  numberFormat,
  formatNumberWithCommas,
  // getImageUrl,
  getServiceUrl,
  getDownloadAppUrl,
  getNickName,
  // chain,
  jumpToUser,
  formateJSON
}
