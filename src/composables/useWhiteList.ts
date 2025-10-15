// src/composables/useWhitelist.ts
import { ref } from 'vue'
import { getBatchUserInfo, getWhiteList } from '@/api/chat'

export interface WhitelistUser {
  userId: string
  nickname: string
  loginId: string
  value: string
  actualValue: string
  [key: string]: any
}

/**
 * Composable for fetching and managing whitelist data
 * This is extracted because whitelist management may be needed
 * across multiple components in the system
 */
export function useWhitelist() {
  const whitelistedUsers = ref<WhitelistUser[]>([])
  const isLoading = ref(false)
  console.log('Loading whitelist data...')

  /**
   * Load whitelist data by joining whitelist IDs with user data
   */
  const loadWhitelistData = async () => {
    isLoading.value = true
    console.log('Loading whitelist data...')

    try {
      // Get whitelist set IDs
      const whitelistRes = await getWhiteList()
      const whitelistIds = whitelistRes.data.map((item: any) => item.setId)
      const userRes = await getBatchUserInfo(whitelistIds)

      if (userRes.success) {
        // Filter users by whitelist IDs and format for selection
        whitelistedUsers.value = userRes.data
          .filter((user: any) => whitelistIds.includes(user.userId))
          .map((user: any) => {
            return {
              userId: user.userId,
              nickname: user.nickname,
              loginId: user.loginId,
              value: `${user.nickname} - ${user.loginId}`,
              actualValue: user.userId
            }
          })
      }
    } catch (error) {
      console.error('Failed to load whitelist data', error)
      whitelistedUsers.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    whitelistedUsers,
    isLoading,
    loadWhitelistData
  }
}
