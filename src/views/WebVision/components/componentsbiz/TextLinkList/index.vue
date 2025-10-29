<script setup lang="ts" name="TextLinkList">
import { computed } from 'vue'
import type { IDatas, ILinkItem } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 启用的链接项目
const enabledItems = computed(() => {
  return props.datas.configParamJson.links?.filter((item) => item.enabled) || []
})

// 处理项目点击
const handleItemClick = (item: ILinkItem) => {
  if (!item.link) return
  if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
    window.open(item.link, '_blank')
  } else {
    window.location.href = item.link
  }
}

const handleMouseEnter = (event: Event) => {
  const target = event.target as HTMLElement
  if (props.datas.configParamJson.listStyleJSON.itemHoverColor) {
    target.style.backgroundColor = props.datas.configParamJson.listStyleJSON.itemHoverColor
  }
}

const handleMouseLeave = (event: Event) => {
  const target = event.target as HTMLElement
  target.style.backgroundColor = props.datas.configParamJson.listStyleJSON.itemBackgroundColor
}

// style 样式
const containerStyle = computed(() => {
  return {
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.padding || 0}px`
  }
})

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right, ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
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
</script>

<template>
  <div class="TextLinkList">
    <div class="TextLinkList-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>

      <!-- 链接列表区域 -->
      <div
        class="text-link-list__content"
        :style="{
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`
        }"
      >
        <div
          class="text-link-list__items"
          :style="{
            gap: `${datas.configParamJson.listStyleJSON.itemSpacing}px`,
            gridTemplateColumns: `repeat(${datas.configParamJson.listStyleJSON.itemsPerRow}, 1fr)`
          }"
        >
          <div
            v-for="item in enabledItems"
            :key="item.id"
            class="text-link-list__item"
            :style="{
              backgroundColor: datas.configParamJson.listStyleJSON.itemBackgroundColor,
              color: datas.configParamJson.listStyleJSON.itemTextColor,
              padding: `${datas.configParamJson.listStyleJSON.itemPadding}px`,
              borderRadius: `${datas.configParamJson.listStyleJSON.itemBorderRadius}px`,
              border: `${datas.configParamJson.listStyleJSON.itemBorderWidth}px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`
            }"
            @click="handleItemClick(item)"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <span class="link-text">{{ item.text }}</span>
            <span class="link-tag" v-if="item.tag">{{ item.tag }}</span>
            <span class="link-stag" v-if="item.stag">{{ item.stag }}</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.TextLinkList {
  position: relative;
}

.TextLinkList-content {
  // border: 1px solid #e1e5e9;
}

.title-header {
  padding: 8px;
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

.text-link-list {
  &__content {
    background: #fff;
    min-height: 20px;
  }

  &__items {
    display: grid;
    width: 100%;
  }

  &__item {
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }

    .link-tag {
      background-color: rgb(255, 210, 150);
      color: #000;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .link-stag {
      background-color: #0b7882;
      color: #fff;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .link-text {
      color: #333;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .text-link-list {
    &__items {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    &__item {
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .text-link-list {
    &__items {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
}
</style>
