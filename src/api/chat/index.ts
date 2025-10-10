import http from '@/utils/http/index'

import showErrorMessage from '@/utils/showErrorMessage'
import { options } from './apiConfig'

export const ANONYMOUS_USER_ID = 'anonymous'
//用户支付订单列表
/**
 * Filter out empty values (null, undefined, or empty string) from an object
 * @param data - The object to filter
 * @returns A new object with non-empty values
 */
const filterEmptyValues = <T extends Record<string, any>>(data: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null && value !== undefined && value !== '')
  ) as Partial<T>
}

export const reqChatRoomList = (data: any): Promise<any> => {
  const filteredData = filterEmptyValues(data)
  return http.post('/admin/room/list', filteredData, options)
}

// 关闭销毁房间
export const delRoom = (data: any): Promise<any> => {
  return http.get('/admin/room/del', { roomId: data.id }, options)
}

// 批量创建聊天室
export const createRoom = (data: any): Promise<any> => {
  return http.post('/admin/room/create', data, options)
}

// 查询房间信息
export const getRoomInfo = (data: any): Promise<any> => {
  return http.post('/admin/room/info', data, options)
}
// 踢用户出房间
export const kickRoom = (data: any): Promise<any> => {
  return http.get('/admin/room/kick', data, options)
}

// 房间在线用户
export const getRoomOnlineUser = (data: any): Promise<any> => {
  const filteredData = filterEmptyValues(data)
  return http.post('/admin/room/online/user/list', filteredData, options)
}

// 获取白名单用户
export const getWhiteList = (): Promise<any> => {
  return http.post('/admin/whitelist/list', undefined, options)
}
// 添加白名单用户
export const addWhiteList = (data: any): Promise<any> => {
  return http.post('/admin/whitelist/add', data, options)
}
// 删除白名单用户
export const delWhiteList = (data: any): Promise<any> => {
  return http.post('/admin/whitelist/delete', data, options)
}
// 更新白名单用户
export const updateWhiteList = (data: any): Promise<any> => {
  return http.post('/admin/whitelist/update', data, options)
}
// 随机获取聊天室名称
export const randomRoomName = (data: any): Promise<any> => {
  return http.get('/admin/room/randomRoomName', data, options)
}
// 编辑房间
export const updateRoom = (data: any): Promise<any> => {
  return http.post('/admin/room/update', { roomId: data.id, onlineState: data.status }, options)
}
// 获取房间消息记录
export const getRoomMsgList = (data: any): Promise<any> => {
  const filteredData = filterEmptyValues(data)
  const headers = {
    // 'Content-Type': 'application/x-www-form-urlencoded'
  }
  return http.post('/admin/room/msgList', filteredData, {
    ...options,
    headers: {
      ...options.headers,
      ...headers
    }
  })
}
// 删除房间消息
export const delRoomMsg = (data: any): Promise<any> => {
  return http.post('/admin/room/delMsg', { msgId: data.msgId }, options)
}
// 历史房间列表
export const getHistoryRoomList = (data: any): Promise<any> => {
  const filteredData = filterEmptyValues(data)
  return http.post('/admin/room/history/list', filteredData, options)
}
// 批量创建聊天室
export const batchCreateRoom = (data: any): Promise<any> => {
  return http.post('/admin/room/create', data, options)
}
// 房间置顶/取消置顶
export const onTopRoom = (data: any): Promise<any> => {
  return http.get('/admin/room/onTop', data, options)
}
// 批量用户信息 无options
export const getBatchUserInfo = (data: any): Promise<any> => {
  return http.post('/webgw/user/batchList', data)
}

interface UserInfo {
  userId: string | number
  [key: string]: any
}

export const enhanceWithUserInfo = async <T extends UserInfo>(items: T[] = []): Promise<T[]> => {
  if (!items?.length) return items

  try {
    // Extract all userIds
    const userIds = items
      .map((item) => item.userId)
      .filter((i) => !!i)
      .filter((i) => i.toString().includes(ANONYMOUS_USER_ID) === false)
    // Get user information for all userIds
    const response = await getBatchUserInfo(userIds)

    if (response.success) {
      // Create a map for quick lookup
      const userInfoMap = new Map(response.data.map((userInfo: any) => [userInfo.userId, userInfo]))

      // Enhance each item with user information
      return items.map((item) => {
        const userInfo = userInfoMap.get(item.userId) as any
        return {
          ...item,
          nickname: userInfo?.nickname || item.nickname,
          userInfo: userInfo || null,
          guest: !userInfo,
          guestName: `${item?.nickname}-${item.userId}`
        }
      })
    }
    showErrorMessage(response)
    // Return original items with null userInfo in case of error
    return items.map((item) => ({ ...item, userInfo: null }))
  } catch (error) {
    console.error('Error fetching user information:', error)
    // Return original items with null userInfo in case of error
    return items.map((item) => ({ ...item, userInfo: null }))
  }
}

export const getUserInfoMapByUserIds = async (userIds: string[] = []) => {
  if (!userIds?.length) return {}

  try {
    // Extract all userIds
    const filteredUserIds = userIds.filter((i) => !!i).filter((i) => i.toString().includes(ANONYMOUS_USER_ID) === false)
    // Get user information for all userIds
    const response = await getBatchUserInfo(filteredUserIds)

    if (response.success) {
      // Create a map for quick lookup
      const userInfoMap = new Map(response.data.map((userInfo: any) => [userInfo.userId, userInfo]))

      // Enhance each item with user information
      return userInfoMap
    }
    showErrorMessage(response)
    // Return original items with null userInfo in case of error
  } catch (error) {
    console.error('Error fetching user information:', error)
    // Return original items with null userInfo in case of error
    return null
  }
}
