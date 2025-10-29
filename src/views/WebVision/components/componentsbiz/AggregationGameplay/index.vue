<script setup lang="ts" name="AggregationGameplay">
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

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

// const subTitleStyle = computed(() => {
//   return {
//     color: styleHeader.value?.subTitleColor || '#333333'
//   }
// })

const contentStyle = computed(() => {
  return {
    color: styleMain.value?.textColor || '#333333',
    fontSize: `${styleMain.value?.fontSize || 14}px`,
    fontWeight: styleMain.value?.fontWeight || 400,
    textAlign: styleMain.value?.textAlign || 'center'
  }
})
const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`,
      ...contentStyle.value
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2',
    ...contentStyle.value
  }
})
</script>

<template>
  <div class="AggregationGameplay">
    <div class="AggregationGameplay-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle" style="display: flex; align-items: center">
        <span class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</span>
      </div>
      <!-- 内容区域 -->
      <MultiAggregation :datas="datas" />
      <!-- <div class="content-area" :style="contentStyle"></div> -->
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.AggregationGameplay {
  position: relative;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;

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
