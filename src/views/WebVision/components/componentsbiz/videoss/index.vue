<template>
  <div class="videoss">
    <!-- 默认视频 -->
    <section class="default" v-if="!datas.configParamJson.src">
      <van-icon name="tv-o" size="150px" />
    </section>

    <!-- 选择视频后 -->
    <section v-else style="position: relative">
      <video
        :src="datas.configParamJson.src"
        controls
        :autoplay="datas.configParamJson.autoplay"
        :poster="datas.configParamJson.coverUrl"
      ></video>
    </section>

    <!-- 删除组件 -->
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts">
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
</script>

<style scoped lang="less">
.videoss {
  position: relative;

  /* 默认视频 */
  .default {
    width: 100%;
    height: 210px;
    background: #979797;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 播放图标 */
  .bof {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    opacity: 0.5;
    color: #999;
  }
  video {
    width: 100%;
  }
}
</style>
