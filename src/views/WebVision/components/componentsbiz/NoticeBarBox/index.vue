<template>
  <div class="NoticeBarBox">
    <div class="notice-bar-container">
      <div class="mbox notice-bar">
        <van-notice-bar
          :text="datas.configParamJson.noticeText"
          left-icon="volume-o"
          :background="datas.configParamJson.backColor || 'var(--theme-color)'"
          :color="datas.configParamJson.textColor"
        />
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="NoticeBar">
import { NoticeBar as vanNoticeBar } from 'vant'
// import { reactive, watch, toRefs } from 'vue';

// 使用 defineProps 接收父组件传入的 componentData
const props = defineProps({
  datas: {
    type: Object,
    required: true
  }
})
// console.log("props", JSON.parse(props.data));

// 定义响应式对象，设置默认初始值
// noticeText: '请填写内容，如果过长，将会在手机上滚动显示', //内容
//     backColor: 'rgb(255, 248, 233)', //背景颜色
//     textColor: 'rgba(100, 101, 102)' //文字颜色
// 监听 componentData 的变化，并更新 noticeBarConfig

// const noticeBarConfig = reactive({
//   noticeText: '请填写内容，如果过长，将会在手机上滚动显示', //内容
//   backColor: 'rgb(255, 248, 233)', //背景颜色
//   textColor: 'rgba(100, 101, 102)', //文字颜色
// });

// watch(
//   () => props.data,
//   newData => {
//     if (newData) {
//       Object.assign(noticeBarConfig, JSON.parse(newData));
//     }
//   },
//   { immediate: true } // 立即执行一次以初始化
// );
</script>
<style scoped>
.NoticeBarBox {
  position: relative;
}

.notice-bar-container {
}

.notice-bar {
  padding: 0;
}
</style>
