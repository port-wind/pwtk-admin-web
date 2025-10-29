<template>
  <div class="hot-recommendations" :style="containerStyle">
    <!-- 推荐项目网格 -->
    <div class="recommendations-grid" :style="gridContainerStyle">
      <div
        v-for="(item, index) in enabledLinks"
        :key="item.id || index"
        class="recommendation-item"
        :style="getItemStyle(item)"
        @click="handleItemClick(item)"
        @mouseenter="handleItemHover(item, true)"
        @mouseleave="handleItemHover(item, false)"
      >
        <span class="item-text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { IDatas, ILinkItem } from './type'

interface Props {
  datas: IDatas
  pageModel?: 'websiteMode' | 'templateMode' | 'componentMode'
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

// 悬停状态管理
const hoveredItem = ref<string | null>(null)

// 计算启用的链接项
const enabledLinks = computed(() => {
  return props.datas.configParamJson.links?.filter((link) => link.enabled) || []
})

// 容器样式
const containerStyle = computed(() => {
  const { styleMain, listStyleJSON } = props.datas.configParamJson
  return {
    padding: `${listStyleJSON.containerPadding}px`,
    backgroundColor: styleMain.backgroundColor,
    borderRadius: `${styleMain.borderRadius}px`,
    textAlign: styleMain.textAlign,
    fontSize: `${styleMain.fontSize}px`,
    fontWeight: styleMain.fontWeight,
    color: styleMain.textColor
  }
})

// 网格容器样式
const gridContainerStyle = computed(() => {
  const { listStyleJSON } = props.datas.configParamJson
  return {
    display: 'grid' as const,
    gridTemplateColumns: `repeat(${listStyleJSON.itemsPerRow}, 1fr)`,
    gap: `${listStyleJSON.itemSpacing}px`,
    backgroundColor: 'transparent'
  }
})

// 获取单个项目样式
const getItemStyle = (item: ILinkItem) => {
  const { listStyleJSON } = props.datas.configParamJson
  const isHovered = hoveredItem.value === item.id

  return {
    padding: `${listStyleJSON.itemPadding}px`,
    borderRadius: `${listStyleJSON.itemBorderRadius}px`,
    backgroundColor: isHovered
      ? listStyleJSON.itemHoverColor
      : item.backgroundColor || listStyleJSON.itemBackgroundColor,
    color: item.textColor || listStyleJSON.itemTextColor,
    border: `${listStyleJSON.itemBorderWidth}px solid ${listStyleJSON.itemBorderColor}`,
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
    fontSize: '14px',
    fontWeight: '500',
    minHeight: '40px',
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    userSelect: 'none' as const
  }
}

// 处理项目点击
const handleItemClick = (item: ILinkItem) => {
  if (item.link && props.pageModel === 'websiteMode') {
    window.open(item.link, '_blank')
  }
}

// 处理项目悬停
const handleItemHover = (item: ILinkItem, isEnter: boolean) => {
  hoveredItem.value = isEnter ? item.id : null
}
</script>

<style lang="scss" scoped>
.hot-recommendations {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .recommendations-grid {
    .recommendation-item {
      .item-text {
        word-break: break-word;
        line-height: 1.4;
        display: block;
        width: 100%;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hot-recommendations {
    .recommendations-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 8px !important;
    }

    .recommendation-item {
      font-size: 12px !important;
      padding: 8px !important;
      min-height: 36px !important;
    }
  }
}

@media (max-width: 480px) {
  .hot-recommendations {
    .recommendations-grid {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
}
</style>
