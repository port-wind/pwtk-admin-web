<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import dayjs from 'dayjs'
import LotteryBallDisplayNoAdd5 from './LotteryBallDisplayNoAdd5.vue'
import { changeGameType, getGameTypeList } from '../store/index'
import { Image as VanImage } from 'vant'
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

// const GameData = ref([]);

const tabsData = computed(() => {
  const baseData = props.tabsData

  if (!props.datas.configParamJson.showArray?.length) {
    return baseData
  }

  return baseData.filter((item: any) =>
    props.datas.configParamJson.showArray?.some(gameType => gameType === item.gameType)
  )
})

const nowTime = ref(dayjs().format('HH:mm:ss'))

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
const handleUpdate = () => {
  getGameTypeList()
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
        <div class="tab-content-top-p" v-if="props.datas.configParamJson.isIssue">
          <p>
            {{ tabsData[tabIndex].gameTypeShortName }}
            <br />
            <span class="issue-number">{{ truncateString(tabsData[tabIndex].currentIssue) }}</span>
            期
          </p>
          <van-button type="danger" size="mini" @click="handleUpdate">刷新</van-button>
        </div>
        <LotteryBallDisplayNoAdd5 :currentResult="tabsData[tabIndex].currentResult" />
      </div>
      <div v-if="props.datas.configParamJson.isHistory" class="tab-content-bottom">
        <!-- <p v-if="props.datas.configParamJson.isNextIssue">{{ tabsData[tabIndex].nextIssue }}</p> -->
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
a {
  color: var(--theme-color);
}
.tabs {
  margin: 0.1rem 0;

  // background-color: #eee;

  display: flex;
  flex-direction: column;
}
.tab-headers {
  display: flex;
  cursor: pointer;
  justify-content: space-evenly;
  overflow: hidden;
  // background-color: var(--theme-color);
  border-top-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
}
.tab-header {
  padding: 3px 0;
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  /* border-bottom: 2px solid transparent; */

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
  padding: 0.5rem 0.2rem;
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

    // img {
    //   height: 1.5rem;
    // }
    .tab-content-top-p {
      flex: 1;
      font-size: 0.8rem;
      text-align: center;
    }
    p > span {
      // color: var(--theme-color);
    }
  }
  .tab-content-middle {
    flex: 6;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tab-content-middle-left {
      display: flex;
      column-gap: 5px;
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
    p {
      // color: var(--theme-color);
    }
  }
}

.issue-number {
  color: red;
}

.history-record {
  color: red;
}
</style>
