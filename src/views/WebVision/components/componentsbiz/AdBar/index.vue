<template>
  <div class="AdBar-container">
    <div class="ad-bar-container">
      <!-- 头部标题 -->
      <div
        class="mbox"
        data-component-name="广告大全"
        data-component-title
        v-if="datas.configParamJson.adData && datas.configParamJson.adData.length > 0"
      >
        <div class="ad-bar" v-for="(item, index) in datas.configParamJson.adData" :key="index">
          <a v-if="item" class="ad-bar-link" :href="item.link || '#'" target="_blank">
            <img :src="item.img" :alt="item.name || '广告图片'" class="ad-bar-image" />
          </a>
        </div>
      </div>
    </div>
    <slot name="deles"></slot>
  </div>
</template>

<script setup lang="ts" name="AdBar">
// const display = import.meta.env.PUBLIC_DISPLAY

import type { IDatas } from './type'
interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
</script>

<style scoped lang="less">
.AdBar-container {
  position: relative;
}

.ad-bar-container {
  width: 100%;
}

.ad-bar {
  margin: 2px 0;

  .ad-bar-link {
    display: block;
    text-decoration: none;
  }

  .ad-bar-image {
    width: 100%;
    display: block;
  }
}

._component-title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 10px;
}
</style>
