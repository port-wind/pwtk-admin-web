<template>
  <div class="custom-box">
    <div class="custom-box-container">
      <div class="mbox">
        <BoxTitle :data="datas.configParamJson"></BoxTitle>
        <div class="custom-box-content">
          <img v-if="datas.configParamJson.img" :src="getFullUrl(datas.configParamJson.img, PUBLIC_CDN_URL)" />
          <div v-if="datas.configParamJson.content" v-html="datas.configParamJson.content"></div>
          <p v-if="datas.configParamJson.text">{{ datas.configParamJson.text }}</p>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="CustomBox">
import BoxTitle from './BoxTitle.vue'
import { PUBLIC_CDN_URL } from '../utils'

const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}
interface Props {
  configParamJson: {
    title: string
    content?: string
    img?: string
    text?: string
    align?: string
    titleBg?: string
  }
}

const props = defineProps({
  datas: {
    type: Object as () => Props,
    required: true
  }
})
</script>

<style scoped lang="less">
:deep(.custom-box-container) {
  --theme-color: #f39800;
}

.custom-box {
  position: relative;
}
.custom-box-container {
  min-height: 50px;
}
.custom-box-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
