<template>
  <h2>{{ datas.componentType }}</h2>
</template>

<script lang="ts" setup>
const props = defineProps({
  datas: { type: Object, required: true },
  pageModel: { type: String }
})
</script>

<style scoped lang="less">
h2 {
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #f2f4f6;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}
</style>
