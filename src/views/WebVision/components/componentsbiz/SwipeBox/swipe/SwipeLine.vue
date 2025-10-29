<template>
  <div class="mbox">
    <van-swipe class="my-swipe" v-bind="data.otherAttrs">
      <van-swipe-item v-for="(group, groupIndex) in groupedImages" :key="groupIndex">
        <div class="swipe-item" v-for="(item, index) in group" :key="index">
          <div class="swipe-item-image" v-if="item">
            <a :href="item.link">
              <van-image :src="getFullUrl(item.image, PUBLIC_CDN_URL_2)" :alt="item.alt ?? 'image'" />
            </a>
          </div>
          <div v-else>
            <!-- 默认显示内容 -->
            <van-image :src="EmptyImage.src" alt="黄金位置等您入驻" />
            <!-- <p class="swipe-item-default">超级黄金位置等您入驻</p> -->
          </div>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Swipe as vanSwipe, SwipeItem as vanSwipeItem, Image as vanImage } from 'vant'
import type { SwipeModelTwo } from '../Swipe-type'
import EmptyImage from '@/assets/images/hjwz.gif'
import { PUBLIC_CDN_URL_2 } from '../../utils'
// 使用 defineProps 接收父组件传入的 componentData
const props = defineProps<{
  data: SwipeModelTwo
}>()

const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}

const groupedImages = computed(() => {
  // 创建一个新的数组，长度为 total，初始值为 null
  const totalArray = Array(props.data.total).fill(null)

  // 将 imageData 中有 index 的项放入 totalArray 的对应位置
  props.data.swipeData.forEach((item) => {
    if (item.index !== undefined && item.index - 1 < props.data.total) {
      totalArray[item.index - 1] = item
    }
  })
  // console.log(totalArray);
  // 分组
  const result = []
  const groupSize = props.data.groupSize || 4
  for (let i = 0; i < totalArray.length; i += groupSize) {
    result.push(totalArray.slice(i, i + groupSize))
  }
  // console.log(result);
  return result
})
</script>

<style scoped lang="less">
.swipe-item {
  // height: 3rem;
  // line-height: 3rem;
  margin: 2px 0;

  .swipe-item-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swipe-item-default {
    text-align: center;
    color: #ccc;
    font-size: 1.2rem;
    background-color: #fff;
    border-radius: 0.5rem;
    letter-spacing: 0.6rem;
  }
}
</style>
