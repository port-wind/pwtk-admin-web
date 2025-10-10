<template>
  <div class="auxiliarysegmentation">
    <section
      class="auxiliarysegmentation__container"
      :style="{
        height: `${datas.configParamJson.blankHeight}px`,
        padding: datas.configParamJson.paddType === 0 ? '0' : '0 10px',
        borderRadius: `${datas.configParamJson.borderRadius}px`,
        backgroundColor: datas.configParamJson.backgroundColor
      }"
    >
      <div
        v-show="datas.configParamJson.segmentationtype === 1"
        class="auxiliarysegmentation__line"
        :style="lineStyle"
      />
    </section>

    <!-- 删除组件插槽 -->
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="auxiliarysegmentation">
import { computed } from 'vue'
import type { IDatas } from './type'

// Props 定义
const props = defineProps<{
  datas: IDatas
}>()

// 分割线样式计算
const lineStyle = computed(() => ({
  height: '1px',
  width: '100%',
  borderTopWidth: '1px',
  borderTopStyle: props.datas.configParamJson.bordertp,
  borderTopColor: props.datas.configParamJson.auxliarColor
}))
</script>

<style scoped lang="scss">
.auxiliarysegmentation {
  position: relative;

  &__container {
    display: flex;
    align-items: center;
  }

  &__line {
    width: 100%;
    height: 1px;
  }
}
</style>
