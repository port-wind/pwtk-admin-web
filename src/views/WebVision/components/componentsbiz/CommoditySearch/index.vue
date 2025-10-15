<template>
  <div class="CommoditySearch">
    <div class="commoditysearch-content" :style="containerStyle" v-if="datas.configParamJson.enable">
      <!-- 标题区域 -->
      <div v-if="datas.configParamJson.title" class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span v-if="datas.configParamJson.subtitle" class="sub-title" :style="subTitleStyle">
          {{ datas.configParamJson.subtitle }}
        </span>
      </div>

      <!-- 搜索框 -->
      <div class="search-container">
        <div class="search-box" :style="searchBoxStyle" @click="handleSearchClick">
          <div class="search-left">
            <van-icon
              v-if="searchStyle.showIcon"
              name="search"
              size="16"
              :style="{ color: searchStyle.iconColor || datas.configParamJson.textColor }"
            />
            <span
              class="search-placeholder"
              :style="{
                color: searchStyle.placeholderColor || datas.configParamJson.textColor
              }"
            >
              {{ searchStyle.placeholder || '搜索商品' }}
            </span>
          </div>

          <!-- 扫一扫按钮 -->
          <div
            v-if="searchStyle.showScanButton || datas.configParamJson.sweep"
            class="scan-button"
            :style="{ color: searchStyle.scanButtonColor || datas.configParamJson.textColor }"
            @click.stop="handleScanClick"
          >
            <span>{{ searchStyle.scanButtonText || '扫一扫' }}</span>
          </div>
        </div>

        <!-- 热词显示 -->
        <div v-if="enabledHotwords.length > 0" class="hotwords-container">
          <span class="hotwords-label">热门搜索:</span>
          <div class="hotwords-list">
            <span v-for="hotword in enabledHotwords" :key="hotword.id" class="hotword-item" @click="handleSearchClick">
              {{ hotword.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="CommoditySearch">
import { computed } from 'vue'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)
const searchStyle = computed(() => props.datas.configParamJson.searchStyle)

// 容器样式
const containerStyle = computed(() => {
  return {
    backgroundColor: styleMain.value?.backgroundColor || '#f8f9fa',
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.containerPadding || 12}px`,
    margin: `${styleMain.value?.margin || 5}px auto`,
    boxShadow: styleMain.value?.boxShadow || 'none'
  }
})

// 标题头部样式
const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right, ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  } else {
    return {
      backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
    }
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#ffffff'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#ffffff'
  }
})

// 搜索框样式
const searchBoxStyle = computed(() => {
  return {
    height: `${props.datas.configParamJson.heights || 40}px`,
    justifyContent: props.datas.configParamJson.textPosition === 0 ? 'flex-start' : 'center',
    background: searchStyle.value.inputBackground || props.datas.configParamJson.borderColor,
    borderRadius: `${props.datas.configParamJson.borderRadius || 8}px`,
    border: `${searchStyle.value.inputBorderWidth || 1}px solid ${searchStyle.value.inputBorderColor || '#e0e0e0'}`,
    padding: `0 ${searchStyle.value.inputPadding || 12}px`
  }
})

// 处理搜索框点击
const handleSearchClick = () => {
  // 可以在这里添加搜索逻辑
  console.log('搜索点击')
}

// 处理扫一扫点击
const handleScanClick = () => {
  // 可以在这里添加扫一扫逻辑
  console.log('扫一扫点击')
}

// 启用的热词
const enabledHotwords = computed(() => {
  return props.datas.configParamJson.hotwords?.filter((word) => word.enabled).sort((a, b) => a.order - b.order) || []
})
</script>

<style lang="scss" scoped>
.CommoditySearch {
  position: relative;
}

.commoditysearch-content {
  // 使用计算样式
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px;
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

.search-container {
  .search-box {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-left {
      display: flex;
      align-items: center;
      flex: 1;

      .search-placeholder {
        margin-left: 8px;
        font-size: 14px;
      }
    }

    .scan-button {
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .hotwords-container {
    margin-top: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .hotwords-label {
      font-size: 12px;
      color: #666;
      white-space: nowrap;
    }

    .hotwords-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hotword-item {
      font-size: 12px;
      color: #999;
      background-color: #f5f5f5;
      padding: 4px 8px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e0e0e0;
        color: #333;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .search-box {
    height: 36px !important;
    padding: 0 12px !important;
  }

  .hotwords-container {
    margin-top: 8px;
  }
}
</style>
