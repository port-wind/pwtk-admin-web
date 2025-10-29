import { ref, computed } from 'vue'
import { getGameTypePlatformList } from '@/api/global'
import type { IGameType, IGameTypePlatformBodyParameter } from '@/api/global/types'
import showErrorMessage from '@/utils/showErrorMessage'

interface GameTypeItem extends IGameType {
  label: string
  value: string
  status: 'y' | 'n'
}

export const useGameTypes = () => {
  const gameTypeList = ref<GameTypeItem[]>([])
  const fetchGameTypes = async () => {
    try {
      const response = await getGameTypePlatformList({ page: 1, size: 999 })
      if (response.success) {
        gameTypeList.value =
          response.data?.list?.map((item) => ({
            ...item,
            label: item.gameTypeName,
            value: item.gameType,
            status: item.status || 'y' // default to 'y' if status is not provided
          })) || []
      } else {
        showErrorMessage(response)
      }
    } catch (error) {
      console.error('Error fetching game types:', error)
    }
  }

  const activeGameTypes = computed(() => gameTypeList.value?.filter((item) => item.status === 'y') ?? [])

  return {
    gameTypeList,
    activeGameTypes,
    fetchGameTypes
  }
}

export default useGameTypes
