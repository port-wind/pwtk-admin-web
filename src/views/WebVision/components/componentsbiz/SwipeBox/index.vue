<template>
  <div class="SwipeBox">
    <div class="swipe-box-container">
      <div class="swipe">
        <!-- Model 1 的渲染内容 -->
        <SwipeCustom v-if="datas.configParamJson.model === 's1'" :data="datas.configParamJson" />
        <!-- Model 2 的渲染内容 -->
        <SwipeLine v-else-if="datas.configParamJson.model === 's2'" :data="datas.configParamJson" />
        <!-- Model 3 的渲染内容 -->
        <SwipeCode v-else :data="datas.configParamJson" />
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>
<script setup lang="ts" name="Swipe">
import { defineProps } from 'vue'
import SwipeCustom from './swipe/SwipeCustom.vue'
import SwipeLine from './swipe/SwipeLine.vue'
import SwipeCode from './swipe/SwipeCode.vue'

const props = defineProps({
  datas: {
    type: Object as () => any,
    required: true
  }
})
</script>

<style scoped lang="less">
.SwipeBox {
  position: relative;
}

.swipe-box-container {
  position: relative;
}
</style>
