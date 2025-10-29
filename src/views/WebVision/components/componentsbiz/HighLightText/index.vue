<!-- HighLightText 组件 -->
<template>
  <div class="highlight-text-container">
    <div v-html="datas.configParamJson.text"></div>
    <slot name="deles"></slot>
  </div>
</template>

<script setup lang="ts">
import type { IDatas } from './type'

interface Props {
  datas: IDatas
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.highlight-text-container {
  position: relative;
}

.highlight-text {
  display: block;
  word-break: break-word;

  // 动画效果
  &--flash {
    animation: flash 2s infinite;
  }

  &--pulse {
    animation: pulse 2s infinite;
  }
}

@keyframes flash {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
