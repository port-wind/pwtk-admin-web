<template>
  <div class="webs-guide">
    <van-grid :border="false" :column-num="columns">
      <van-grid-item v-for="item in listData" :key="item.siteId" :url="item.siteUrl1">
        <div class="guide-item">
          <span class="guide-item-text">{{ item.siteName }}</span>
          <guide-item-icon :item="item" />
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script lang="ts" setup>
import type { IBizTkWebsiteListPageModel } from './type'
import { Grid as VanGrid, GridItem as VanGridItem } from 'vant'
import GuideItemIcon from '../GuideItemIcon.vue'

const props = withDefaults(
  defineProps<{
    listData: IBizTkWebsiteListPageModel[]
    columns?: number // 父组件传入的列数
  }>(),
  {
    columns: 3 // 默认值为3
  }
)
// console.log(props.columns)
// 注册 Vant 组件
</script>

<style lang="less" scoped>
.webs-guide {
  background-color: #fff;
  :deep(.van-grid-item__content) {
    padding: 1px;
  }
}

.guide-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0; /* 灰色背景 */
  max-height: 2rem; /* 最大高度为2rem */
  height: 100px; /* 固定高度 */
  border-radius: 0.2rem;
  text-align: center;
  width: 100%;
  color: inherit;
}
.guide-item-text {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
