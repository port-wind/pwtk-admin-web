<script setup lang="ts" name="Issue24">
import { useStore } from '@nanostores/vue'

import { computed, defineProps } from 'vue'
import type { IDatas } from './type'
import Result24 from './result24.vue'
import Result2 from './result2.vue'
import Result1 from './result1.vue'
import PingTe2Xiao from './components/PingTe2Xiao.vue'
import OverKill from './components/OverKill.vue'
import MiddlesNumberRange from './components/MiddlesNumberRange.vue'
import HavenEarthZodiac from './components/HavenEarthZodiac.vue'
import SumOddEven from './components/SumOddEven.vue'
import InvincibleEightTail from './components/InvincibleEightTail.vue'
import DuplexFlatCode from './components/DuplexFlatCode.vue'
import OneSentenceDecipher from './components/OneSentenceDecipher.vue'

import { EModel } from './type'
import { gameStore } from '../store'
import { getGameName } from '../store/gameStore'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)
const gameStoreData = useStore(gameStore)
// style 样式
const containerStyle = computed(() => {
  return {
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.padding || 0}px`
  }
})

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333'
  }
})
</script>

<template>
  <div class="Issue24">
    <div class="Issue24-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">
          {{ datas.configParamJson.titlePrefix }}{{ getGameName(gameStoreData.gameType)
          }}{{ datas.configParamJson.title }}
        </h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>
      <!-- 开奖信息列表 24码风格 -->
      <Result24 :datas="datas" v-if="datas.configParamJson.model === EModel['24码']" />
      <!-- 胆大胆小 2码风格 -->
      <Result2 :datas="datas" v-if="datas.configParamJson.model === EModel['胆大胆小']" />
      <!-- 色波 -->
      <Result1 :datas="datas" v-if="datas.configParamJson.model === EModel['色波']" />
      <!-- 平特二肖 -->
      <PingTe2Xiao :datas="datas" v-if="datas.configParamJson.model === EModel['平特二肖']" />
      <!-- 绝杀区 -->
      <OverKill :datas="datas" v-if="datas.configParamJson.model === EModel['绝杀区']" />
      <!-- 中间号码范围 -->
      <MiddlesNumberRange :datas="datas" v-if="datas.configParamJson.model === EModel['中特码段']" />
      <!-- 天地生肖 -->
      <HavenEarthZodiac :datas="datas" v-if="datas.configParamJson.model === EModel['天地生肖']" />
      <!-- 合数单双 -->
      <SumOddEven :datas="datas" v-if="datas.configParamJson.model === EModel['合数单双']" />
      <!-- 无敌八尾 -->
      <InvincibleEightTail :datas="datas" v-if="datas.configParamJson.model === EModel['无敌八尾']" />
      <!-- 复式平码 -->
      <DuplexFlatCode :datas="datas" v-if="datas.configParamJson.model === EModel['复式平码']" />
      <!-- 一句解特码 -->
      <OneSentenceDecipher :datas="datas" v-if="datas.configParamJson.model === EModel['一句解特码']" />
      <!-- 横扫黑庄 -->
      <SweepBlackBank :datas="datas" v-if="datas.configParamJson.model === EModel['横扫黑庄']" />
      <!-- 六肖六码 -->
      <SixZodiacSixCode :datas="datas" v-if="datas.configParamJson.model === EModel['六肖六码']" />
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.Issue24 {
  position: relative;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .main-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  .sub-title {
    font-size: 14px;
    opacity: 0.9;
  }
}
</style>
