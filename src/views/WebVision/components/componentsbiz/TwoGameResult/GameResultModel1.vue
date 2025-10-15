<script setup lang="ts">
import { ref, computed } from 'vue'
import LotteryBallDisplayNoAdd1 from './LotteryBallDisplayNoAdd1.vue'
import { changeGameType } from '../store/index'
import type { IDatas } from './type'
import type { IGameType } from '../store/gameStore'
import { gameStore } from '../store/index'
import { useStore } from '@nanostores/vue'

interface IProps {
  datas: IDatas
  tabsData: Record<string, any>[]
}

const props = defineProps<IProps>()
console.log('🚀 ~ props1111111:', props.tabsData)

const newTabsData = computed(() => {
  return props.tabsData.filter((item) => item.gameType === '5' || item.gameType === '1')
})

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const gameTypeList = computed<IGameType[]>(() => {
  return gameStoreData.value.gameTypeList
    .filter((item) => item.gameType === '5' || item.gameType === '1')
    .map((item) => {
      if (item.gameType === '5') {
        return {
          ...item,
          gameTypeLongName: '新澳门⑥彩资料'
        }
      } else if (item.gameType === '1') {
        return {
          ...item,
          gameTypeLongName: '香港⑥彩资料'
        }
      }
    }) as IGameType[]
})

const gameTypes = computed(() => {
  return gameTypeList.value.map((item) => item.gameType)
})

const tabIndex = ref(0) // 默认是新澳门彩 ，

const handleUpdate = () => {
  window.location.reload()
}

function selectGameType(currentGame: IGameType, index) {
  tabIndex.value = index
  changeGameType(currentGame)
}

watch(
  () => gameStoreData.value.gameType,
  (newVal) => {
    const index = gameTypeList.value.findIndex((item) => item.gameType === newVal)
    if (index !== -1) {
      tabIndex.value = index
    }
  }
)
</script>

<template>
  <div class="lottery-result">
    <!-- 标签切换 -->
    <div class="tab-header">
      <div
        v-for="(tab, index) in gameTypeList"
        :key="index"
        :class="['tab-item', { active: currentGame?.gameType === tab?.gameType }]"
        @click="selectGameType(tab, index)"
      >
        {{ tab.gameTypeLongName }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div class="lottery-content" v-if="newTabsData[tabIndex]">
        <div class="header">
          <div class="title">
            {{ newTabsData[tabIndex].gameTypeShortName }}
            <span class="issue">{{ newTabsData[tabIndex]?.currentIssue }}</span>
            期
          </div>
          <div class="action-buttons">
            <button class="btn btn-outline">搅珠记录</button>
            <button class="btn btn-primary" @click="handleUpdate">刷新</button>
            <button class="btn btn-live">直播</button>
          </div>
        </div>
        <div class="lottery-display">
          <div class="lottery-numbers">
            <LotteryBallDisplayNoAdd1 :noFiveElements="true" :currentResult="newTabsData[tabIndex]?.currentResult" />
          </div>
        </div>
        <div class="footer">
          <span class="next-draw">
            下期(
            <span style="color: red">{{ newTabsData[tabIndex]?.nextIssue }}</span>
            )开奖: {{ newTabsData[tabIndex]?.nextDrawTime }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.lottery-result {
  background: #f7f7f7;
  border-radius: 4px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  background: #f5f5f5;

  .tab-item {
    font-family: 'Microsoft YaHei', Helvetica, sans-serif;
    flex: 1;
    text-align: center;
    padding: 4px;
    font-size: 18px;
    font-weight: bold;
    color: black;
    cursor: pointer;

    &.active {
      // color: #;
      background: #fff;
    }
  }
}

.content-area {
  padding: 0;

  .lottery-content {
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0;

      .title {
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        color: #333;

        .issue {
          font-size: 16px;
          color: red;
        }
      }

      .action-buttons {
        display: flex;
        gap: 8px;

        .btn {
          height: 24px;
          padding: 0 8px;
          border-radius: 2px;
          font-size: 12px;
          border: none;
          cursor: pointer;

          &.btn-outline {
            border: 1px solid #ddd;
            background: #fff;
            color: #666;
          }

          &.btn-primary {
            background: #ff4d4f;
            color: #fff;
          }

          &.btn-live {
            background: #52c41a;
            color: #fff;
          }
        }
      }
    }

    .lottery-display {
      background: #fbfafb;
      border-bottom: 1px solid #e5e5e5;
      border-top: 1px solid #e5e5e5;
      .lottery-numbers {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;

        .lottery-ball {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 28px;

          .number {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-weight: bold;
            font-size: 15px;
          }

          .zodiac {
            margin-top: 1px;
            font-size: 12px;
            color: #333;
          }

          &.ball-red .number {
            background: #f5222d;
          }

          &.ball-green .number {
            background: #52c41a;
          }

          &.ball-blue .number {
            background: #1890ff;
          }
        }

        .separator {
          color: #999;
          font-size: 18px;
          padding: 0 2px;
          font-weight: normal;
        }
      }
    }

    .footer {
      text-align: center;
      .next-draw {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
