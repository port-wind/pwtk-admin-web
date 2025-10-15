import { computed, onMounted, watch } from 'vue'
import { useStore } from '@nanostores/vue'
import { gameStore } from '../store/index'

/**
 * 🎮 GameType Fields Composable
 * 处理动态彩种字段的生成、初始化和管理
 */
export function useGameTypeFields(datas: any) {
  // 🎯 Store 集成
  const gameStoreData = useStore(gameStore)
  const gameType = computed(() => gameStoreData.value.gameType)
  const gList = computed(() => gameStoreData.value.gameTypeList)
  const getItem = () => {
    return { imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg', url: '', show: true }
  }
  // 🎮 动态生成基于彩种的配置字段
  const generateGameTypeFields = () => {
    const fields: Record<string, any> = {}

    if (gList.value && gList.value.length > 0) {
      gList.value.forEach((gameItem) => {
        if (gameItem.gameType) {
          const existing = datas.configParamJson[gameItem.gameType]
          fields[gameItem.gameType] = {
            gameTypeName: gameItem.gameTypeName,
            gameTypeCode: gameItem.gameTypeCode,
            gameTypeLongName: gameItem.gameTypeLongName,
            gameTypeShortName: gameItem.gameTypeShortName,
            enabled: existing?.enabled ?? true,
            customData: existing?.customData ?? getItem()
          }
        }
      })
    }

    // 🔍 Debug: 显示生成的动态字段
    console.log('🎮 Generated GameType Fields:', fields)
    console.log('🎮 GameType Keys:', Object.keys(fields))

    return fields
  }

  // 🚀 初始化彩种字段的函数
  const initializeGameTypeFields = () => {
    const gameTypeFields = generateGameTypeFields()
    console.log("🚀 ~ initializeGameTypeFields ~ gameTypeFields:", gameTypeFields)

    
    
    // Object.assign(datas.configParamJson, gameTypeFields)
    // 🔄 合并基础配置和动态彩种字段

    console.log('🎮 Updated ConfigParamJson:', datas.configParamJson)
  }

  // 🔧 创建彩种自定义数据字段的通用函数
  const createGameTypeCustomDataField = (
    fieldName: keyof (typeof datas.configParamJson)[string]['customData'],
    defaultValue: any = ''
  ) => {
    return computed({
      get: () => {
        const currentGameType = gameType.value
        if (!currentGameType || !datas.configParamJson[currentGameType]) {
          return defaultValue
        }
        console.log(datas.configParamJson[currentGameType].customData)

        return datas.configParamJson[currentGameType].customData?.[fieldName] ?? defaultValue
      },
      set: (value: string) => {
        const currentGameType = gameType.value
        if (currentGameType && datas.configParamJson[currentGameType]) {
          if (!datas.configParamJson[currentGameType].customData) {
            datas.configParamJson[currentGameType].customData = getItem()
          }
          datas.configParamJson[currentGameType].customData[fieldName] = value
        }
      }
    })
  }

  // 🔄 当前彩种图片URL的双向绑定
  const currentGameTypeImageUrl = createGameTypeCustomDataField('imageUrl', 'https://img.yzcdn.cn/vant/cat.jpeg')

  // 🔗 当前彩种跳转URL的双向绑定
  const currentGameTypeUrl = createGameTypeCustomDataField('url', '')

  const showOrNotByGameType = createGameTypeCustomDataField('show', true)

  // 🚀 在组件挂载时初始化彩种字段
  onMounted(() => {
    initializeGameTypeFields()
  })

  // 🔄 立即初始化默认字段以避免模板渲染错误
  initializeGameTypeFields()

  // 🔄 监听彩种列表变化，动态更新配置
  watch(
    gList,
    (newGameList) => {
      if (newGameList && newGameList.length > 0) {
        initializeGameTypeFields()
        console.log('🎮 GameType List Updated from watcher')
      }
    },
    { deep: true }
  )

  // 🎯 返回需要的响应式数据和方法
  return {
    gameType,
    gList,
    currentGameTypeImageUrl,
    turnToUrl: currentGameTypeUrl,
    show: showOrNotByGameType,
    generateGameTypeFields,
    initializeGameTypeFields
  }
}
