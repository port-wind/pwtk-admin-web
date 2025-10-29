<template>
  <div class="bbs-third">
    <h3
      class="webs-guide-title"
      v-if="data && data.title"
      :style="`text-align: ${data.align || 'left'}; background: ${getBackgroundStyle(data)};background-size: cover;`"
    >
      {{ data.title }}
    </h3>
    <div class="bbs-content" v-html="bbs_content.postContent"></div>
  </div>
</template>

<script setup lang="ts">
import type { PostData } from '../NavBBSListBox'
import { PUBLIC_CDN_URL_2 } from '../../utils'
const props = defineProps({
  bbs_content: {
    type: Object as () => Partial<PostData>,
    required: true
  },
  data: {
    type: Object as () => any,
    required: true
  }
})

function getBackgroundStyle(data: any): string {
  if (data.titleBgImg) {
    const isAbsoluteUrl = data.titleBgImg.startsWith('http') || data.titleBgImg.startsWith('https')
    return `url(${isAbsoluteUrl ? data.titleBgImg : `${PUBLIC_CDN_URL_2}${data.titleBgImg}`})` // 使用背景图片
  }
  return data.titleBg || 'var(--theme-color)' // 否则使用背景颜色
}

// console.log('推荐', props.data);
</script>

<style scoped lang="less">
.webs-guide-title {
  line-height: 40px;
  padding-bottom: 3px;
  color: #fff;
  padding: 0 1rem;
  font-weight: bold;
  font-size: 26px;
  text-shadow: 1px 4px 1px #3d3930;
  border-bottom: solid 1px #000;
  background: linear-gradient(var(--gradient-direction, 0deg), var(--second-color), var(--theme-color));
}
</style>
