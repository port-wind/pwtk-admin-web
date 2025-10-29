<template>
  <div v-if="data && data.title" class="webs-guide-title">
    <h3 :style="`text-align: ${data.align || 'left'}; background: ${data.titleBg || 'var(--theme-color)'}`">
      {{ data.title }}
    </h3>
  </div>
</template>
<script setup lang="ts">
interface Props {
  title?: string
  align?: string
  titleBg?: string
}
const props = defineProps({
  data: {
    type: Object as () => Props,
    required: true
  }
})
console.log(props.data)
</script>

<style scoped lang="less">
.webs-guide-title {
  // background-color: #fff;
  h3 {
    line-height: 40px;
    padding-bottom: 3px;
    color: #fff;
    padding: 0 1rem;
    font-weight: bold;
    font-size: 26px;
    text-shadow: 1px 4px 1px #3d3930;
    border-bottom: solid 1px #000;
    // border-top-left-radius: 0.75rem;
    // border-top-right-radius: 0.75rem;
    background: linear-gradient(var(--gradient-direction, 0deg), var(--second-color), var(--theme-color));
  }
}
</style>
