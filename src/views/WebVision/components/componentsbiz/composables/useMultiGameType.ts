import { useStore } from '@nanostores/vue'
import { computed, ref, watch, isRef, toValue } from 'vue'
import { gameStore, setGameType } from '../store'

/**
 * 🎮 GameType Fields Composable
 * 处理动态彩种字段的生成、初始化和管理
 */
export function useMultiGameType(datas: any) {
  const activeTab = ref<string>('')
  const gameStoreData = useStore(gameStore)
  const gameType = computed(() => gameStoreData.value.gameType)

  // Handle both ref and non-ref inputs to maintain reactivity
  const datasValue = computed(() => (isRef(datas) ? datas.value : toValue(datas)))
  const comSelectedGameTypes = computed(() => datasValue.value.configParamJson.selectedGameTypes)

  const showComponent = computed(() => {
    const localActiveGameType = datasValue.value.configParamJson.selectedGameTypes.find((item: any) => item.active)
    return !!localActiveGameType && localActiveGameType.gameType === gameType.value
  })
  const setSelectedGameTypes = (gameTypes: any) => {
    datasValue.value.configParamJson.selectedGameTypes = gameTypes
  }
  const handleActiveGameType = (g: string) => {
    const newSelectedGameTypes = comSelectedGameTypes.value.map((item: any) => {
      return {
        ...item,
        active: item.gameType === g
      }
    })
    setSelectedGameTypes(newSelectedGameTypes)
    console.log('list updated', newSelectedGameTypes)
  }
  const handleTabClick = (g: any) => {
    handleActiveGameType(g)
    setGameType(activeTab.value)
  }

  // 当activeTab为空且有selectedGameTypes时，设置第一个为活跃状态
  watch(
    comSelectedGameTypes,
    (newGameTypes) => {
      if (newGameTypes.length > 0 && !activeTab.value) {
        activeTab.value = newGameTypes[0].gameType
        handleTabClick(activeTab.value)
      }
      // 如果当前activeTab不在新的游戏类型列表中，设置为第一个
      if (newGameTypes.length > 0 && !newGameTypes.find((gt) => gt.gameType === activeTab.value)) {
        activeTab.value = newGameTypes[0].gameType
        handleTabClick(activeTab.value)
      }
    },
    { immediate: true }
  )
  watch(gameType, (newGameType) => {
    console.log('gameType changed', newGameType)
    handleActiveGameType(newGameType)
  })
  return {
    activeTab,
    selectedGameTypes: comSelectedGameTypes,
    showComponent,
    setSelectedGameTypes,
    handleActiveGameType,
    handleTabClick
  }
}
