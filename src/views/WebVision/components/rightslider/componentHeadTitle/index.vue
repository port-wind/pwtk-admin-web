<script setup lang="ts" name="componentHeadTitle">
import type { ISetStyle } from '@/views/WebVision/components/componentsbiz/componentProperties'

interface IProps {
  datas: ISetStyle<any>
}
const props = defineProps<IProps>()
</script>

<template>
  <div class="component-type">
    <el-divider content-position="left">组件样式配置: {{ datas.componentType }}</el-divider>
  </div>
</template>

<style lang="scss" scoped>
.component-type {
  h2 {
    width: 100%;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  .component-type-name {
    font-size: 12px;
  }
}
</style>
