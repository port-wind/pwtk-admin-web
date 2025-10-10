<template>
  <div class="MyTestComponent">
    <div class="myTestComponent-container" :style="containerStyle">
      <div class="myTestComponent-content" :style="contentStyle">
        {{ datas.configParamJson.text }}
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="MyTestComponent">
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
    padding: `${props.datas.configParamJson.padding || 16}px`,
    borderRadius: `${props.datas.configParamJson.borderRadius || 0}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: props.datas.configParamJson.textAlign || 'center'
  }
})

// 内容样式
const contentStyle = computed(() => {
  return {
    color: props.datas.configParamJson.textColor || '#333333',
    fontSize: `${props.datas.configParamJson.fontSize || 14}px`,
    fontWeight: props.datas.configParamJson.fontWeight || 400,
    textAlign: props.datas.configParamJson.textAlign || 'center',
    width: '100%',
    lineHeight: '1.5'
  }
})
</script>

<style lang="scss" scoped>
.MyTestComponent {
  position: relative;
  
  .myTestComponent-container {
    position: relative;
    transition: all 0.3s ease;
    
    .myTestComponent-content {
      word-wrap: break-word;
      white-space: pre-wrap;
    }
  }
}
</style>