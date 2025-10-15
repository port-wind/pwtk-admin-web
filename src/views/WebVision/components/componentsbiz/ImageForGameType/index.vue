<script setup lang="ts" name="ImageForGameType">
import { computed, ref, watch, onMounted, reactive } from 'vue'
import { useStore } from '@nanostores/vue'
import { getFullUrl, PUBLIC_CDN_URL } from '../utils'
import { gameStore } from '../store/index'
import type { IDatas } from './type'
import type { IGameType } from '../store/gameStore'
import { useGameTypeFields } from '../composables/useGameTypeFields'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const datas = computed(() => props.datas)
const { currentGameTypeImageUrl, turnToUrl, show } = useGameTypeFields(datas.value)
// watch(show, (newVal) => {
//   console.log(newVal)
// })
// 🎮 gameType Store 集成 - 动态组件必需
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.gameTypeLongName || '未知游戏')
// const show = computed(() => datas.value.configParamJson[gameType.value]?.customData?.show)
const styleMain = computed(() => {
  return {
    backgroundColor: datas.value.configParamJson.styleMain.backgroundColor,
    textAlign: datas.value.configParamJson.styleMain.textAlign
  }
})
const styleTitle = computed(() => {
  return {
    color: datas.value.configParamJson.styleMain.textColor,
    fontSize: `${datas.value.configParamJson.styleMain.fontSize}px`,
    fontWeight: datas.value.configParamJson.styleMain.fontWeight
  }
})
// 🔄 响应式参数对象，与配置同步
const componentParams = reactive({
  gameType: props.datas.configParamJson.gameType || gameType.value,
  size: props.datas.configParamJson.size || 10,
  forumId: props.datas.configParamJson.forumId || '10'
})

// 组件状态
const loading = ref(false)
const gameData = ref<any[]>([])
const error = ref(null)
const styleJSON = computed(() => datas.value.configParamJson.imageStyleJSON)

const imageStyle = computed(() => {
  return {
    height: styleJSON.value?.enableHeight ? `${styleJSON.value.height}px` : 'auto',
    borderRadius: styleJSON.value?.borderRadius ? `${styleJSON.value.borderRadius}px` : '0px'
  }
})
// 🎮 游戏相关数据获取
const fetchGameData = async (gType: string | number) => {
  if (!gType) return

  loading.value = true
  error.value = null

  try {
    // TODO: 根据具体需求实现数据获取逻辑
    console.log(`🎮 获取游戏数据: ${gType}`)

    // 模拟API调用
    // const response = await fetchSpecificGameData(gameType)
    // gameData.value = response.data || []

    // 临时数据
    gameData.value = [
      { id: 1, title: `${currentGameName.value}数据1`, content: '示例内容' },
      { id: 2, title: `${currentGameName.value}数据2`, content: '示例内容' }
    ]
  } catch (err) {
    error.value = err as any
    console.error('获取游戏数据失败:', err)
  } finally {
    loading.value = false
  }
}
const handleLink = () => {
  console.log('turnToUrl', turnToUrl.value)
  if (turnToUrl.value) {
    window.open(turnToUrl.value, '_blank')
  }
}
// 🎯 监听游戏类型变化 - 全局store变化
watch(
  gameType,
  (newGameType) => {
    if (newGameType) {
      componentParams.gameType = newGameType
      console.log(`🎮 全局游戏类型变化: ${newGameType}`)
      fetchGameData(newGameType)
    }
  },
  { immediate: true }
)

// 📊 监听组件配置变化
watch(
  () => [props.datas.configParamJson.gameType, props.datas.configParamJson.size, props.datas.configParamJson.forumId],
  ([newGameType, newSize, newForumId]) => {
    if (newGameType) componentParams.gameType = String(newGameType)
    if (newSize) componentParams.size = Number(newSize)
    if (newForumId) componentParams.forumId = String(newForumId)

    // 当配置的gameType变化时，重新获取数据
    if (newGameType && newGameType !== componentParams.gameType) {
      fetchGameData(newGameType)
    }
  },
  { deep: true }
)

// 🎮 游戏切换监听
watch(currentGame, (newGame: IGameType | null) => {
  if (newGame) {
    fetchGameData(newGame.gameType || gameType.value)
  }
})

onMounted(() => {
  if (gameType.value) {
    fetchGameData(gameType.value)
  }
})
</script>

<template>
  <div class="ImageCard" v-if="show">
    <div class="ImageCard-content">
      <div class="ImageCard-container">
        <div :style="imageStyle" @click="handleLink">
          <img
            :src="getFullUrl(currentGameTypeImageUrl, PUBLIC_CDN_URL)"
            :alt="props.datas.configParamJson.title"
            class="card-image"
            draggable="false"
          />
        </div>
        <div class="card-content" v-if="props.datas.configParamJson.enable" :style="styleMain">
          <h3 class="card-title" :style="styleTitle">{{ props.datas.configParamJson.title }}</h3>
          <p class="card-description">{{ props.datas.configParamJson.description }}</p>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.ImageCard {
  position: relative;
}

.ImageCard-content {
}

.ImageCard-container {
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.card-image {
  max-width: 100%;
  height: auto;
  border: 0;
  vertical-align: middle;
  border-radius: 0px;
}

.card-content {
  padding: 15px;
  flex-grow: 1;
}

.card-title {
  margin: 0 0 8px;
}

.card-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
