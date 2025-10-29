// src/composables/useRoomNames.ts
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { randomRoomName } from '@/api/chat'

/**
 * Composable for generating room names
 * This is extracted because room name generation is likely
 * needed in multiple places throughout the application
 */
export function useRoomNames() {
  const isGenerating = ref<boolean>(false)

  /**
   * Generate a random room name
   * @param type Room type (default: 'VOICE')
   * @returns Generated room name
   */
  const generateRoomName = async (type = 'VOICE'): Promise<string> => {
    isGenerating.value = true

    try {
      const res = await randomRoomName({ type })
      if (res.success && res.data) {
        return res.data
      }
      ElMessage.error(res.message || '获取房间名称失败')
      return ''
    } catch (error) {
      ElMessage.error('获取房间名称失败')
      return ''
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    generateRoomName
  }
}
