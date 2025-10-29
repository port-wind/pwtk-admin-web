<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import LotteryBallDisplayNoAdd4 from './LotteryBallDisplayNoAdd4.vue'
import { changeGameType } from '../store/index'
import { Image as VanImage } from 'vant'
import { getFullUrl, PUBLIC_CDN_URL } from '../utils'
import type { GameIconKeys, IDatas } from './type'
import type { IGameType } from '../store/gameStore'
import { gameStore } from '../store/index'
import { useStore } from '@nanostores/vue'
import { GAME_ICONS, truncateString, convertDataFormat, display } from './data'

interface IProps {
  datas: IDatas
  tabsData: Record<string, any>
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)

const img = computed(() => {
  const imgUrl = props.datas.configParamJson.imageUrl
  return display ? imgUrl.src : imgUrl
})

// const tabsData = ref<GAME_DATA_ALL[]>(GAME_DATA_ALL);
const tabsData = computed(() => {
  const baseData = props.tabsData

  if (!props.datas.configParamJson.showArray?.length) {
    return baseData
  }

  return baseData.filter((item: any) =>
    props.datas.configParamJson.showArray?.some(gameType => gameType === item.gameType)
  )
})

const nowTime = ref(dayjs().format(' HH:mm:ss'))

const tabIndex = ref(0)

function selectGameType(currentGame: IGameType, index) {
  tabIndex.value = index
  changeGameType(currentGame)
}

function getGameOpenTime(tab: IGameType) {
  const baseData = props.tabsData
  const dd = baseData.find((item: any) =>
    props.datas.configParamJson.showArray?.some(gameType => gameType === item.gameType)
  )
  if (dd?.currentOpenTime) {
    return dayjs(dd.currentOpenTime).format('MM月DD日')
  } else {
    return ''
  }
}

onMounted(() => {
  const interval = setInterval(() => {
    nowTime.value = dayjs().format('HH:mm:ss')
  }, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

watch(
  () => gameStoreData.value.gameType,
  newVal => {
    const index = gameTypeList.value.findIndex(item => item.gameType === newVal)
    if (index !== -1) {
      tabIndex.value = index
    }
  }
)
</script>
<template>
  <div class="tabs">
    <div class="tab-headers" v-if="!props.datas.configParamJson.noTab">
      <div
        v-for="(tab, index) in gameTypeList"
        :key="index"
        :class="['tab-header', { active: currentGame?.gameType === tab.gameType }]"
        @click="selectGameType(tab, index)"
      >
        <h4>
          <van-image
            width="24"
            v-if="props.datas.configParamJson.isIcon"
            :src="GAME_ICONS[tab.gameType as GameIconKeys]"
          />
          {{ props.datas.configParamJson.isLongName ? tab.gameTypeLongName : tab.gameTypeShortName }}
        </h4>
        <p v-if="props.datas.configParamJson.isOpenTime">
          {{ getGameOpenTime(tab) }}
        </p>
      </div>
    </div>
    <div class="tab-content" v-if="tabsData[tabIndex]">
      <div class="tab-content-top">
        <div>
          <p>
            {{ tabsData[tabIndex].gameTypeLongName }}
            第
            <span class="issue-number">{{ truncateString(tabsData[tabIndex].currentIssue) }}</span>
            期
          </p>
        </div>
        <div>
          <h3>{{ nowTime }}</h3>
        </div>
        <div>
          <a href="https://macao-jc.com/">
            <img :src="getFullUrl(img, PUBLIC_CDN_URL)" />
          </a>
        </div>
      </div>
      <LotteryBallDisplayNoAdd4 :currentResult="tabsData[tabIndex].currentResult" />
      <div class="tab-content-bottom">
        <p v-if="props.datas.configParamJson.isNextIssue">
          第
          <span class="issue-number">{{ tabsData[tabIndex].nextShortIssue }}</span>
          期:
          {{ convertDataFormat(tabsData[tabIndex].nextOpenTime) }}
        </p>
        <a class="history-record" v-if="props.datas.configParamJson.isHistory" href="/lottery">历史记录</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  margin: 0.1rem 0;
  background-color: #eee;
  display: flex;
  flex-direction: column;
}
.tab-headers {
  display: flex;
  cursor: pointer;
  justify-content: space-evenly;
}
.tab-header {
  padding: 3px 0;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  /* border-bottom: 2px solid transparent; */
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  background-color: #fff;
  flex: 1;
  h4 {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
  p {
    font-size: 0.75rem;
    line-height: normal;
  }
}
.active {
  /* border-bottom: 2px solid #000; */
  color: #fff;
  background: var(--theme-color);
  h4 {
    color: #fff;
  }
}

.tab-content {
  padding: 0.3rem;
  background-image: none;
  border: 0.02rem solid var(--theme-color);
  background-color: #fff;
  box-shadow: 0.04rem 0.04rem 0.1rem #eee;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  .tab-content-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    div > h5 {
      font-size: 1.2rem;
    }

    div > a > img {
      height: 1.5rem;
    }
  }
  .tab-content-middle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tab-content-middle-left {
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
    .tab-content-middle-center {
      display: flex;
      font-size: 1.3rem;
    }
    .tab-content-middle-right {
      display: flex;
    }
  }
  .tab-content-bottom {
    margin-top: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    // p {
    //   color: var(--theme-color);
    // }
  }
}

.issue-number {
  color: red;
}

.history-record {
  color: red;
}
</style>
