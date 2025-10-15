<script setup lang="ts" name="ImageGridList">
import { computed, onMounted } from 'vue'
import type { IDatas } from './type'
import { getLatestIssue, getLatestIssues } from '../api'
import { useStore } from '@nanostores/vue'
import { gameStore } from '../store/index'
import { PUBLIC_CDN_URL } from '../utils'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const GridStyleJSON = computed(() => props.datas.configParamJson.gridStyleJSON)
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)

// 获取完整URL的方法
const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  } else {
    return {
      backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
    }
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333'
  }
})

// 容器样式
const containerStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${GridStyleJSON.value.columnsPerRow}, 1fr)`,
    gap: `${GridStyleJSON.value.itemSpacing}px`,
    backgroundColor: GridStyleJSON.value.backgroundColor,
    padding: `${GridStyleJSON.value.contentItemPadding}px`
  }
})

// 单个图片项样式
const getItemStyle = (item: any) => {
  return {
    padding: `${GridStyleJSON.value.itemPadding}px`,
    borderRadius: `${GridStyleJSON.value.borderRadius}px`,
    backgroundColor: '#fff',
    border: `${GridStyleJSON.value.borderWidth}px solid ${GridStyleJSON.value.borderColor}`,
    cursor: 'pointer',
    transition: GridStyleJSON.value.hoverEffect ? 'all 0.3s ease' : 'none',
    overflow: 'hidden'
  }
}

// 图片样式
const imageStyle = computed(() => {
  return {
    width: '100%',
    height: `${GridStyleJSON.value.imageHeight}px`,
    objectFit: 'cover' as const,
    borderRadius: `${Math.max(0, GridStyleJSON.value.borderRadius - 2)}px`
  }
})

// 标题样式
const gridTitleStyle = computed(() => {
  return {
    fontSize: `${GridStyleJSON.value.titleFontSize}px`,
    color: GridStyleJSON.value.titleColor,
    textAlign: 'center' as const,
    marginTop: '0px',
    fontWeight: 500,
    lineHeight: 1.4
  }
})

// 处理图片项点击
const handleItemClick = (item: any) => {
  if (item.link) {
    // 如果是外部链接
    if (item.link.startsWith('http')) {
      window.open(item.link, '_blank')
    } else {
      // 内部路由跳转
      window.location.href = item.link
    }
  }
}

// 悬停效果
const handleMouseEnter = (event: Event) => {
  if (!GridStyleJSON.value.hoverEffect) return
  const target = event.target as HTMLElement
  target.style.transform = 'translateY(-2px)'
  target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
}

const handleMouseLeave = (event: Event) => {
  if (!GridStyleJSON.value.hoverEffect) return
  const target = event.target as HTMLElement
  target.style.transform = 'translateY(0)'
  target.style.boxShadow = 'none'
}
</script>

<template>
  <div class="ImageGridList">
    <div class="ImageGridList-content">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>

      <!-- 图片网格 -->
      <div class="image-grid" :style="containerStyle">
        <div
          v-for="item in props.datas.configParamJson[gameType]?.gridItems"
          :key="item.id"
          class="grid-item"
          :style="getItemStyle(item)"
          @click="handleItemClick(item)"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <!-- 图片 -->
          <img
            v-if="item.imageUrl"
            :src="getFullUrl(item.imageUrl, PUBLIC_CDN_URL)"
            :alt="item.title"
            :style="imageStyle"
            class="grid-image"
            draggable="false"
          />
          <!-- 标题 -->
          <div v-if="GridStyleJSON.showTitle && item.title" class="grid-item-title" :style="gridTitleStyle">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.ImageGridList {
  position: relative;
  width: 100%;

  --theme-color: #5e9525;
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

.ImageGridList-content {
  width: 100%;
  overflow: hidden;
  border-radius: 5px;
}

.header-section {
  border-radius: 10px;
  // padding: 5px;
  // text-align: center;

  .grid-title {
    // margin: 0 0 8px;
    padding: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    background-color: var(--theme-color);
  }

  .grid-description {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}

.image-grid {
  min-height: 100px;
}

.grid-item {
  user-select: none;

  &:hover {
    transition: all 0.3s ease;
  }

  &:active {
    transform: scale(0.98);
  }
}

.grid-image {
  display: block;
  border: none;
}

.grid-item-title {
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

// 响应式设计
@media (max-width: 768px) {
  .image-grid {
    // padding: 12px;
  }

  .header-section {
    padding: 10px;

    .grid-title {
      font-size: 16px;
    }

    .grid-description {
      font-size: 13px;
    }
  }
}
</style>
