<script setup lang="ts">
//   import { ref } from 'vue'
// import IconText from './IconText.vue';
const FiveElements = {
  j: '金',
  m: '木',
  s: '水',
  h: '火',
  t: '土'
}
type BackgroundType = '#07c160' | '#349cfc' | '#fc3434'
const ColorCode: { [key: string]: BackgroundType } = {
  R: '#fc3434',
  G: '#07c160',
  B: '#349cfc'
}

/**
 * 将数字转换为两位数的字符串，如果小于10则在前面补0
 * @param {number} num - 要转换的数字
 * @returns {string} - 转换后的字符串
 */
const padZero = (num: number): string => {
  return num < 10 ? `${num}` : `${num}`
}

const props = defineProps<{
  currentResult: any
  //金木水火土是否显示
  noFiveElements?: boolean
  sortType?: 'asc' | 'desc'
}>()

// console.log('props', props)
</script>

<template>
  <div class="tab-content-middle">
    <div
      class="tab-content-middle-item"
      v-for="(item, i) in currentResult.sort((a: any, b: any) => {
        if (props.sortType === 'asc') {
          return a.num - b.num;
        } else if (props.sortType === 'desc') {
          return b.num - a.num;
        }
        return 0;
      })"
      :key="i"
      :style="{ backgroundColor: ColorCode[item.color] }"
    >
      <h4>{{ padZero(item.num) }}</h4>
      <p>
        {{
          noFiveElements
            ? item.shengxiao
            : item.shengxiao + '/' + FiveElements[item.fiveElements as keyof typeof FiveElements]
        }}
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-content-middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
  .tab-content-middle-item {
    flex: 1; // 每个元素占据容器的1/7
    // max-width: calc(100% / 7); // 确保每个元素的最大宽度为容器的1/7
    text-align: center;
    border-radius: 0.25rem;
    padding: 0.2rem 0.3rem;
    h4 {
      color: #fff;
      font-weight: bold;
      font-size: 1.6rem;
    }
    p {
      background-color: #fff;
      text-align: center;
      font-size: 0.8rem;
      border-radius: 0.2rem;
    }
  }
}
</style>
