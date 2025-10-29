<script setup lang="ts" name="HotRecommendations">
import { computed, defineProps } from 'vue'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// style 样式
const containerStyle = computed(() => {
  return {
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.padding || 0}px`,
    backgroundColor: styleMain.value?.backgroundColor || '#ffffff'
  }
})

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

</script>

<template>
  <div class="HotRecommendations">
    <div class="HotRecommendations-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle" style="display: flex; align-items: center">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
      </div>
      <!-- 内容区域 -->
      <NormalRec :datas="datas" />
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.HotRecommendations {
  position: relative;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;

  .main-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  .sub-title {
    font-size: 14px;
    opacity: 0.9;
  }
}

.content-area {
  padding: 16px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
