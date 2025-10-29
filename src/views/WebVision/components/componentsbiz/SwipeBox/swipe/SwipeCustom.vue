<script setup lang="ts">
import { reactive, watch, defineProps } from 'vue'
import { Swipe as vanSwipe, SwipeItem as vanSwipeItem, Image as vanImage } from 'vant'
// import { PUBLIC_CDN_URL } from '@/consts'
import { PUBLIC_CDN_URL_2 } from '../../utils'
import type { SwipeModelOne } from '../Swipe-type'
// const PUBLIC_CDN_URL = 'https://tk2cdn.ai4funs.com/'
// https://tk2cdn.ai4funs.com/devmedia/img/webVision/img/25/06/10/fc5d84b569bb40dcade1e284ef2c5daa.png

// 使用 defineProps 接收父组件传入的 componentData
const props = defineProps({
  data: {
    type: Object as () => SwipeModelOne,
    required: true
  }
})

const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}
</script>

<template>
  <van-swipe class="my-swipe" v-bind="data.otherAttrs">
    <van-swipe-item v-for="(item, index) in data.swipeData" :key="index">
      <a :href="item.link">
        <van-image :src="getFullUrl(item.image, PUBLIC_CDN_URL_2)" :alt="item.alt ?? 'image'" />
      </a>
    </van-swipe-item>
  </van-swipe>
</template>

<style scoped></style>
