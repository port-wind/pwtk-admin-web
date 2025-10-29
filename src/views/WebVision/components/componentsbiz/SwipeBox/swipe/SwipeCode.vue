<template>
  <div class="mbox">
    <div class="swipe">
      <div class="indicator-buttons">
        <van-button
          v-for="(item, index) in data.swipeData"
          :key="index"
          @click="handleClick(index)"
          size="small"
          :class="{ active: activeIndex === index }"
        >
          {{ item.name }}
        </van-button>
      </div>
      <van-swipe ref="swipeRef" v-model:active="activeIndex" v-bind="data.otherAttrs" lazy-render>
        <van-swipe-item v-for="(item, index) in data.swipeData" :key="index">
          <div class="content" v-html="item.content"></div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Swipe as vanSwipe, SwipeItem as vanSwipeItem, Button as VanButton } from 'vant'
import type { SwipeModelThree } from '../Swipe-type'

const props = defineProps({
  data: {
    type: Object as () => SwipeModelThree, // 确保 data 是一个数组
    required: true
  }
})
const swipeRef = ref()
const activeIndex = ref(0) // 当前活动的索引

const handleClick = (index: number) => {
  //   console.log('index', index);
  activeIndex.value = index
  if (swipeRef.value) {
    swipeRef.value.swipeTo(index) // 调用 swipeTo 方法切换到指定索引
  }
}
</script>

<style scoped lang="less">
.swipe {
  padding: 2px;
  background-color: #fff;
}
.indicator-buttons {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 1px;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #ddd;
    cursor: pointer;

    &.active {
      background-color: red;
      color: #fff;
    }
  }
}

.content {
  text-align: center;
  font-size: 0.8rem;
  height: 20rem;
  max-height: 20rem;
}
</style>
