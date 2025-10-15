<template>
  <div class="bbs-fourth">
    <h3
      class="webs-guide-title"
      v-if="data && data.title"
      :style="`text-align: ${data.align || 'left'}; background: ${getBackgroundStyle(data)};background-size: cover;`"
    >
      {{ data.title ?? bbs_content.title }}
    </h3>
    <img :src="PUBLIC_CDN_URL_2 + bbs_content.attachments?.[0]?.url" fit="cover" />
  </div>
</template>

<script setup lang="ts">
import type { PostData, PostDetail } from '../NavBBSListBox'
import { PUBLIC_CDN_URL_2 } from '../../utils'

//只展示一张图片
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

// console.log('推荐', props.bbs_content)

function getBackgroundStyle(data: PostDetail): string {
  if (data.titleBgImg) {
    const isAbsoluteUrl = data.titleBgImg.startsWith('http') || data.titleBgImg.startsWith('https')
    return `url(${isAbsoluteUrl ? data.titleBgImg : `${PUBLIC_CDN_URL_2}${data.titleBgImg}`})` // 使用背景图片
  }
  return data.titleBg || 'var(--theme-color)' // 否则使用背景颜色
}

// const itemUrl = ref(props.bbs_content.attachments?.[0].url || '')

// console.log('推荐', props.bbs_content)
// const showPreview = (startPosition: number) => {
//   showImagePreview({
//     images: props.data.attachments?.map(item => PUBLIC_CDN_URL + item.url) || [],
//     startPosition,
//     closeable: true,
//     overlayClass: 'custom-overlay',
//   });
// };
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
.bbs-fourth {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  :deep(.van-grid) {
    .van-grid-item__content--center {
      padding: 2rem;
    }
  }
}
.custom-overlay {
  background-color: rgba(0, 0, 0, 0.5) !important; /* 调整透明度 */
}
</style>
