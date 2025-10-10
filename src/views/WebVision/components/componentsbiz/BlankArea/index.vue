<template>
  <div class="BlankArea">
    <div class="blank-area-container" :style="containerStyle">
      <div class="blank-area-content" :style="contentStyle">
        {{ datas.configParamJson.text }}
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="BlankArea">
import { computed } from 'vue'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
// 容器样式
const containerStyle = computed(() => {
  return {
    backgroundColor: props.datas.configParamJson.backgroundColor || '#f5f5f5',
    minHeight: `${props.datas.configParamJson.minHeight || 100}px`,
    padding: `${props.datas.configParamJson.padding || 20}px`,
    borderRadius: `${props.datas.configParamJson.borderRadius || 4}px`,
    position: 'relative' as const,
    width: '100%',
    boxSizing: 'border-box' as const
  }
})

// 内容文字样式
const contentStyle = computed(() => {
  return {
    color: props.datas.configParamJson.textColor || '#333333',
    textAlign: props.datas.configParamJson.textAlign || 'center',
    fontSize: `${props.datas.configParamJson.fontSize || 14}px`,
    fontWeight: props.datas.configParamJson.fontWeight || 400,
    lineHeight: '1.5',
    wordWrap: 'break-word' as const,
    minHeight: '20px'
  }
})
</script>

<style lang="scss" scoped>
.BlankArea {
  position: relative;
  width: 100%;
}

.blank-area-container {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
}

.blank-area-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: inherit;
}
</style>
