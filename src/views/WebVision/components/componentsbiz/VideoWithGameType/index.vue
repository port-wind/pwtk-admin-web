<template>
  <div class="VideoWithGameType" v-if="showComponent">
    <div class="video-with-gametype-content" :style="containerStyle" v-if="datas.configParamJson.enable">
      <!-- 标题区域 -->
      <!-- <div v-if="datas.configParamJson.title" class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }} - {{ currentGameName }}</h2>
        <span v-if="datas.configParamJson.subtitle" class="sub-title" :style="subTitleStyle">
          {{ datas.configParamJson.subtitle }}
        </span>
      </div> -->

      <!-- 视频播放区域 -->
      <div class="video-player-container" :style="videoContainerStyle">
        <!-- 有视频URL时显示视频播放器 -->
        <video
          v-if="showVideo"
          ref="videoPlayer"
          :src="currentVideoUrl"
          controls
          :style="videoStyle"
          class="video-player"
          @error="handleVideoError"
          @loadeddata="handleVideoLoaded"
        >
          您的浏览器不支持视频播放
        </video>

        <!-- 无视频URL时显示占位符 -->
        <div v-else class="video-placeholder" :style="videoStyle">
          <div class="placeholder-content" :style="contentStyle">
            <span>暂无视频</span>
          </div>
        </div>

        <!-- 当前视频标题 -->
        <!-- <div v-if="currentVideoTitle" class="current-video-title" :style="contentStyle">
          {{ currentVideoTitle }}
        </div> -->
      </div>

      <!-- 视频缩略图列表 -->
      <div class="video-thumbnails-container" :style="thumbnailContainerStyle">
        <div v-if="enabledVideos.length > 0" class="video-thumbnails">
          <div
            v-for="video in enabledVideos"
            :key="video.id"
            class="thumbnail-item"
            :class="{ active: video.id === currentVideoId }"
            :style="thumbnailItemStyle"
            @click="selectVideo(video)"
          >
            <img
              :src="video.imageUrl"
              :alt="video.title"
              class="thumbnail-image"
              :style="thumbnailImageStyle"
              @error="handleImageError"
            />
            <div class="thumbnail-title" :style="thumbnailTitleStyle">{{ video.title }}</div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state" :style="contentStyle">
          <span>暂无视频</span>
        </div>
      </div>
    </div>

    <!-- 必需的删除按钮插槽 -->
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="VideoWithGameType">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from '@nanostores/vue'
import { gameStore } from '../store/index'
import type { IDatas, IVideoItem } from './type'
import xam from './xam.jpg'
import { useMultiGameType } from '../composables/useMultiGameType'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// Local reactive state for selectedGameTypes
const localSelectedGameTypes = ref<any[]>([])

// Initialize localSelectedGameTypes from props
watch(
  () => props.datas.configParamJson.selectedGameTypes,
  (newVal) => {
    if (newVal) {
      localSelectedGameTypes.value = [...newVal]
    }
  },
  { immediate: true }
)

// gameType Store 集成
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const { showComponent } = useMultiGameType(props.datas)
// 组件状态
const videoPlayer = ref<HTMLVideoElement>()
const currentVideoId = ref<string>('')
const currentVideoUrl = ref<string>('')
const showVideo = computed(() => !!currentVideoUrl.value && currentVideoUrl.value !== '')
const currentVideoTitle = ref<string>('')
const windowWidth = ref(window.innerWidth)
// 样式计算属性
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 启用的视频列表 - 从当前激活的游戏类型获取视频数据
const enabledVideos = computed(() => {
  // 获取当前激活的游戏类型数据
  const activeGameType = localSelectedGameTypes.value.find((item: any) => item.active)
  // 如果没有激活的游戏类型或没有视频数据，返回空数组
  if (!activeGameType?.customData?.videos) {
    return []
  }

  // 返回启用的视频，按order排序
  return activeGameType.customData.videos.filter((video: any) => video.enabled)
})

// 容器样式
const containerStyle = computed(() => ({
  backgroundColor: styleMain.value.backgroundColor,
  borderRadius: `${styleMain.value.borderRadius}px`,
  padding: `${styleMain.value.containerPadding}px`,
  margin: `${styleMain.value.margin}px auto`,
  boxShadow: styleMain.value.boxShadow,
  height: `${props.datas.configParamJson.heights}vh`,
  minHeight: `${props.datas.configParamJson.minHeight}px`
}))

const contentStyle = computed(() => ({
  fontSize: `${styleMain.value.fontSize}px`,
  fontWeight: styleMain.value.fontWeight,
  textAlign: styleMain.value.textAlign,
  lineHeight: styleMain.value.lineHeight
}))

const videoContainerStyle = computed(() => ({
  height: `${props.datas.configParamJson.videoHeightPercent}%`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000000',
  borderRadius: `${styleMain.value.borderRadius}px`,
  overflow: 'hidden'
}))

const videoStyle = computed(() => ({
  width: '100%',
  height: '100%',
  borderRadius: `${styleMain.value.borderRadius}px`,
  objectFit: 'contain' as 'contain'
}))

const thumbnailContainerStyle = computed(() => {
  const remainingHeight = 100 - props.datas.configParamJson.videoHeightPercent
  const minHeight = Math.max(remainingHeight, 15) // Ensure minimum 15% height

  return {
    height: `${minHeight}%`,
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    padding: remainingHeight > 25 ? '8px 0' : '4px 0',
    overflow: 'hidden'
  }
})

const thumbnailItemStyle = computed(() => {
  const remainingHeight = 100 - props.datas.configParamJson.videoHeightPercent
  const componentHeight = props.datas.configParamJson.heights

  // Calculate responsive thumbnail width based on available space
  let thumbnailWidth = 120

  if (remainingHeight < 25) {
    // Small space - compact thumbnails
    thumbnailWidth = 80
  } else if (remainingHeight < 35) {
    // Medium space - standard thumbnails
    thumbnailWidth = 100
  } else {
    // Large space - full size thumbnails
    thumbnailWidth = 120
  }

  // Adjust for overall component height
  if (componentHeight < 40) {
    thumbnailWidth *= 0.8
  }

  // Mobile adjustments
  if (windowWidth.value <= 768) {
    thumbnailWidth *= 0.7
  }

  return {
    width: `${Math.round(thumbnailWidth)}px`,
    height: '100%', // Fill the full height of thumbnails container
    minWidth: `${Math.round(thumbnailWidth)}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column' as 'column'
  }
})

const thumbnailImageStyle = computed(() => {
  return {
    flex: 1, // Take all available space above the fixed title
    width: '100%',
    objectFit: 'cover' as 'cover',
    minHeight: '30px' // Ensure minimum image height
  }
})

const thumbnailTitleStyle = computed(() => {
  const remainingHeight = 100 - props.datas.configParamJson.videoHeightPercent

  let fontSize = '12px'
  let fixedHeight = '24px'

  if (remainingHeight < 25) {
    fontSize = '10px'
    fixedHeight = '20px'
  } else if (remainingHeight < 35) {
    fontSize = '11px'
    fixedHeight = '22px'
  }

  // Mobile adjustments
  if (windowWidth.value <= 768) {
    fontSize = `${parseInt(fontSize, 10) * 0.9}px`
    fixedHeight = `${parseInt(fixedHeight, 10) * 0.9}px`
  }

  return {
    height: fixedHeight, // Fixed height for title
    fontSize,
    padding: '0 4px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: styleMain.value.textColor,
    textAlign: 'center' as 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as 'nowrap',
    lineHeight: fixedHeight, // Center text vertically
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0 // Don't shrink
  }
})

// 选择视频
const selectVideo = (video: IVideoItem) => {
  currentVideoId.value = video.id
  currentVideoTitle.value = video.title
  console.log('selectVideo', video.videoUrl)
  // 如果没有视频URL，清空所有视频相关状态
  if (!video.videoUrl) {
    currentVideoUrl.value = ''
    if (videoPlayer.value) {
      videoPlayer.value.pause()
      videoPlayer.value.removeAttribute('src')
      videoPlayer.value.load()
    }
  } else {
    // 有视频URL时设置URL并重新加载视频
    currentVideoUrl.value = video.videoUrl
    if (videoPlayer.value) {
      videoPlayer.value.load()
    }
  }
}

// 初始化默认视频
const initializeDefaultVideo = () => {
  if (enabledVideos.value.length > 0) {
    const firstVideo = enabledVideos.value[0]
    selectVideo(firstVideo)
  } else {
    currentVideoId.value = ''
    currentVideoUrl.value = ''
    currentVideoTitle.value = ''
  }
}

// 视频错误处理
const handleVideoError = (event: Event) => {
  console.error('视频加载错误:', event)
}

// 视频加载完成
const handleVideoLoaded = () => {
  console.log('视频加载完成')
}

// 图片错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // @ts-ignore
  img.src = xam.src ?? xam
}
const handleActiveGameType = (g: string) => {
  const newSelectedGameTypes = localSelectedGameTypes.value.map((item: any) => {
    return {
      ...item,
      active: item.gameType === g
    }
  })
  localSelectedGameTypes.value = newSelectedGameTypes
  console.log('list updated', newSelectedGameTypes)
}
// 监听游戏类型变化
watch(
  gameType,
  (newGameType) => {
    if (newGameType) {
      console.log(`🎮 Game Type Changed: ${newGameType}`)
      // 重新初始化默认视频
      handleActiveGameType(newGameType)
      initializeDefaultVideo()
    }
  },
  { immediate: true }
)

// Window resize handler
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  // 组件挂载时初始化默认视频
  initializeDefaultVideo()

  // Add window resize listener for responsive thumbnails
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // Clean up resize listener
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.VideoWithGameType {
  position: relative;

  .video-with-gametype-content {
    // 动态样式通过 computed 属性控制
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .title-header {
    padding: 12px 16px;
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .main-title {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }

    .sub-title {
      font-size: 14px;
      opacity: 0.9;
    }
  }

  .video-player-container {
    // Dynamic styles applied via computed property

    .video-player {
      display: block;
      background-color: #000;
    }

    .video-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f5f5f5;
      border: 2px dashed #ccc;

      .placeholder-content {
        text-align: center;
        color: #999;
        font-size: 14px;
      }
    }

    .current-video-title {
      margin-top: 8px;
      text-align: center;
      font-weight: 500;
    }
  }

  .video-thumbnails-container {
    // Dynamic styles applied via computed property

    .video-thumbnails {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: #ccc transparent;
      height: 100%;
      align-items: center;

      &::-webkit-scrollbar {
        height: 4px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 2px;

        &:hover {
          background: #999;
        }
      }

      .thumbnail-item {
        // Dynamic sizing applied via computed styles
        cursor: pointer;
        border-radius: 6px;
        overflow: hidden;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
          border-color: #4a90e2;
          box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
          transform: translateY(-2px);
        }

        &.active {
          border-color: #4a90e2;
          box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
          transform: translateY(-1px);
        }

        .thumbnail-image {
          // Dynamic sizing applied via computed styles
          display: block;
          border-radius: 4px 4px 0 0;
        }

        .thumbnail-title {
          // Dynamic styling applied via computed styles
          border-radius: 0 0 4px 4px;
        }
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #999;
      font-size: 14px;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .title-header {
      padding: 8px 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .video-thumbnails {
      gap: 4px !important;
      padding: 4px 0 !important;

      // Mobile thumbnails are further reduced via computed styles
      .thumbnail-item {
        border-radius: 4px;

        .thumbnail-image {
          border-radius: 3px 3px 0 0;
        }

        .thumbnail-title {
          border-radius: 0 0 3px 3px;
        }
      }
    }

    .empty-state {
      padding: 20px 10px !important;
      font-size: 12px !important;
    }
  }
}
</style>
