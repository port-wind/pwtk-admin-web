<script setup lang="ts" name="LotteryResult">
import { ref, computed } from 'vue'
import { Tab, Tabs } from 'vant'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = withDefaults(defineProps<IProps>(), {})

const activeTab = ref(props.datas.configParamJson.defaultTabId)

const currentLottery = computed(() => {
  return props.datas.configParamJson.lotteries.find((l) => l.id === activeTab.value)
})

const handleRefresh = () => {
  console.log('Refreshing data...')
  // TODO: Implement data fetching logic
}
</script>

<template>
  <div class="LotteryResult">
    <div class="LotteryResult-content">
      <div class="lottery-result">
        <Tabs v-model:active="activeTab" type="card">
          <Tab
            v-for="lottery in datas.configParamJson.lotteries"
            :key="lottery.id"
            :title="lottery.name"
            :name="lottery.id"
          >
            <div class="lottery-content" v-if="currentLottery">
              <div class="lottery-info">
                <div class="info-name">{{ currentLottery.displayName }}</div>
                <div class="info-issue">{{ currentLottery.issue }}</div>
                <button class="info-refresh" @click="handleRefresh">刷新</button>
              </div>
              <div class="lottery-numbers">
                <div class="number-item" v-for="(num, index) in currentLottery.numbers" :key="index">
                  <div class="number-ball" :class="`ball-${num.color}`">{{ num.value }}</div>
                  <div class="number-text">{{ num.zodiac }}/{{ num.element }}</div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        <slot name="deles" />
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.LotteryResult {
  position: relative;
}

.LotteryResult-content {
}
.lottery-result {
  background: #fff;
  padding: 10px;
  font-family: 'Microsoft YaHei', sans-serif;
  position: relative;

  :deep(.van-tabs__nav--card) {
    margin: 0;
    border: 1px solid #e4e4e4;
  }
  :deep(.van-tab) {
    border-right: 1px solid #e4e4e4;
    color: #333;
    &.van-tab--active {
      background-color: #007c4c;
      color: #fff;
    }
  }

  .lottery-content {
    display: flex;
    align-items: center;
    padding: 15px 10px;
    border: 1px solid #e4e4e4;
    border-top: none;
  }

  .lottery-info {
    text-align: center;
    margin-right: 20px;
    .info-name {
      font-size: 16px;
    }
    .info-issue {
      font-size: 18px;
      font-weight: bold;
      margin: 5px 0;
    }
    .info-refresh {
      background-color: #e53935;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .lottery-numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .number-item {
    text-align: center;
  }

  .number-ball {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;

    &.ball-green {
      background-color: #dfffe2;
      border: 2px solid #4caf50;
    }
    &.ball-blue {
      background-color: #e3f2fd;
      border: 2px solid #2196f3;
    }
    &.ball-red {
      background-color: #ffebee;
      border: 2px solid #f44336;
    }
  }

  .number-text {
    font-size: 12px;
    color: #666;
  }
}
</style>
