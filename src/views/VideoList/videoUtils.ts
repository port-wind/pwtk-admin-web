import { ElMessage } from 'element-plus'
import { togglePublishVideo } from '@/api/video'
import { useModalsStore } from '@/stores/modalStore'
import { ANONYMOUS_USER_ID, enhanceWithUserInfo } from '@/api/chat'

const modalsStore = useModalsStore()

export async function toggleVideo(rowData: any) {
  try {
    const res = await togglePublishVideo({
      id: rowData.id
    })
    if (res.success) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      return true
    }
    ElMessage({
      message: `${res.message || '操作失败'}`,
      type: 'error'
    })
    return false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
export const viewUserDetails = (rowData: any, key: string = 'userId') => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData[key]
  })
  modalsStore.showModal('userInfoModal')
}

export const enhanceVideoWithUserInfo = async (videoData) => {
  try {
    const dataArray = Array.isArray(videoData) ? videoData : [videoData]
    console.log('dataArray', dataArray)
    const enhancedList = await enhanceWithUserInfo(dataArray.filter((item) => item.userId))
    console.log('enhancedList', enhancedList)
    if (!Array.isArray(enhancedList) || enhancedList.length === 0) {
      console.error('Failed to get user information')
      return videoData // Return original data if enhancement fails
    }

    const enhancedData = enhancedList
      .map((item) => {
        const { userInfo, updatedByName } = item
        return {
          ...item,
          nickname: userInfo?.nickname,
          loginId: userInfo?.loginId,
          updatedByName
        }
      })
      .map((item) => {
        const isAnonymous = item?.actorId?.toString().includes(ANONYMOUS_USER_ID)
        return {
          ...item,
          isAnonymous,
          nickname: isAnonymous ? '匿名用户' : item.nickname
        }
      })

    // Return in the same format as the input
    return Array.isArray(videoData) ? enhancedData : enhancedData[0]
  } catch (error) {
    console.error('Error enhancing video with user info:', error)
    return videoData // Return original data on error
  }
}

/**
 * Safely converts a value to a number
 * @param value - The value to convert (string, number, undefined, null)
 * @param defaultValue - The default value to return if conversion fails (default: 0)
 * @returns A valid number or the default value
 */
export const safeNumberConversion = (value: any, defaultValue: number = 0): number => {
  // Handle undefined, null, or empty string
  if (value === undefined || value === null || value === '') {
    return defaultValue
  }

  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // Handle NaN
  if (Number.isNaN(numValue)) {
    return defaultValue
  }

  return numValue
}
export const formatViewCount = (count: any): string => {
  const numValue = safeNumberConversion(count)

  if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return numValue.toString()
}

export const sanitizedActorId = (id) => {
  // Check if id exists and is a string
  if (!id || typeof id !== 'string') {
    return id
  }
  console.log('id', id)
  // Remove 'anonymous_' prefix if present
  return id.replace(/^anonymous_/, '')
}
