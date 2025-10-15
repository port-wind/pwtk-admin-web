<template>
  <div class="HomePopNoticeBox">
    <div class="home-pop-notice-box-container" :class="{ show: route.path === '/webVisionBuilderWebsite' }">
      <van-popup v-if="datas.configParamJson.content" v-model:show="showCenter" closeable round class="home-pop">
        <template #default>
          <h4 class="title">{{ datas.configParamJson.title }}</h4>
          <div class="content" v-html="datas.configParamJson.content"></div>
          <div class="close-pop">
            <span class="close-pop-time">{{ countdown }}&nbsp;</span>
            秒后关闭
          </div>
        </template>
      </van-popup>
      <!-- <section v-if="data?.model === 's1"></section>
  </section> -->
      <section v-else-if="datas.configParamJson.model === 's2'">
        <p>正在开发中</p>
      </section>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="HomePopNoticeBox">
import { onMounted, ref } from 'vue'
import { Popup as VanPopup } from 'vant'
const route = useRoute()

interface HomePopNoticeProps {
  model: string
  title: string
  content: string
  time: number
  configParamJson: {
    model: string
    title: string
    content: string
    time: number
  }
}
// 接收父组件传入的富文本内容
const props = defineProps<{ datas: HomePopNoticeProps }>()
// console.log(props.data);
// const props = defineProps<{
//   content: string;
// }>();

const showCenter = ref(true)

const countdown = ref(props.datas.configParamJson.time ?? 5) // 倒计时初始值

onMounted(() => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      showCenter.value = false
      clearInterval(interval)
    }
  }, 1000)
})
</script>

<style scoped lang="less">
.HomePopNoticeBox {
  position: relative;
}
.home-pop-notice-box-container {
  // min-height: 50px;
  &.show {
    min-height: 50px;
  }
}

/* 添加一些样式以便更好地展示 */
.home-pop {
  height: 40%;
  width: 80%;
  max-width: 600px;
  padding: 0.5rem;
  overflow: hidden;
  .title {
    font-size: 1rem;
    text-align: center;
    color: #333; // 设置字体颜色
    margin-bottom: 0.5rem; // 增加下边距
    border-bottom: 2px solid #eee; // 添加下边框
    padding-bottom: 0.5rem; // 增加下边距
  }
  .content {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    overflow-y: scroll;
    height: 100%;
  }
}
.close-pop {
  position: fixed;
  top: 1%;
  right: 1%;
  font-size: 0.6rem;
  .close-pop-time {
    color: red;
  }
}
</style>
