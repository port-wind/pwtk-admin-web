<template>
  <div class="custom-bar-ad-box">
    <div class="custom-bar-ad-box-container">
      <div class="mbox">
        <BoxTitle :data="datas.configParamJson" />
        <div v-if="datas.configParamJson.model === 's1'" class="color-bar">
          <template v-for="(item, index) in datas.configParamJson.itemData" :key="index">
            <div class="color-bar-ad" :style="{ backgroundColor: getRandomColor() }">
              <a :href="item.link">
                <h3>{{ item.text }}</h3>
              </a>
            </div>
          </template>
        </div>
        <div v-else-if="datas.configParamJson.model === 's2'">
          <template v-for="(item, index) in datas.configParamJson.itemData" :key="index">
            <div v-html="item.content"></div>
          </template>
        </div>
        <van-grid v-else class="button-bar" :column-num="2" :border="false" :gutter="10">
          <van-grid-item v-for="(item, index) in datas.configParamJson.itemData" :key="index">
            <a :href="item.link" class="button-bar-ad">
              <h3 :style="{ color: getRandomColor() }">{{ item.text }}</h3>
            </a>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="CustomBarAdBox">
import BoxTitle from './CustomBarAdBoxTitle.vue'
import { Grid as VanGrid, GridItem as VanGridItem } from 'vant'
import type { IDatas } from './type'

const props = defineProps<{
  datas: IDatas
}>()

// 生成随机颜色的函数
function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
</script>

<style scoped lang="scss">
.custom-bar-ad-box {
  position: relative;

  :deep(.custom-bar-ad-box-container) {
    --theme-color: #f39800;
  }

  .custom-bar-ad-box-container {
    min-height: 20px;
  }
}

.color-bar-ad {
  height: 2.5rem;
  line-height: 2.5rem;
  h3 {
    color: #fff;
    font-size: 1.2rem;
    line-height: 2.5rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.button-bar {
  background-color: #fff;
  padding: 0.6rem 0;
  :deep(.van-grid-item__content) {
    padding: 0rem;
  }
  .button-bar-ad {
    height: 35px;
    line-height: 35px;
    border: solid 1px #67a4f5;
    border-radius: 20px;
    background: #eee;
    background: linear-gradient(var(--gradient-direction, 0deg), var(--second-color), var(--theme-color));
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: block;
    font-weight: bold;
    text-decoration: none;
    width: 100%;
    text-align: center;
    cursor: pointer;

    h3 {
      display: inline;
      padding: 0.5rem 1rem;
      text-align: center;
      font-size: 1.2rem;

      // overflow: hidden;
      // text-overflow: ellipsis;
    }
  }
}
</style>
