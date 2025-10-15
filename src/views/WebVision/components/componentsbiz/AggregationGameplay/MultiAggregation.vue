<script setup lang="ts">
import { useStore } from '@nanostores/vue'

import { defineProps, watch } from 'vue'
import type { IDatas } from './type'
import { gameStore } from '../store'
import { useIssueList } from '../hooks/issueList'
import { ChineseNumberMap, CircleNumberMap } from '../type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
// const forum = computed(() => props.datas.configParamJson.forumId)
// const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 创建响应式参数对象
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})
const bottomTitleStyle = computed(() => {
  return {
    color: props.datas.configParamJson.bottomTitleFontColor,
    fontSize: `${props.datas.configParamJson.bottomTitleFontSize}px`,
    fontWeight: props.datas.configParamJson.bottomTitleFontWeight,
    backgroundColor: props.datas.configParamJson.bottomTitleBackgroundColor
  }
}) 
const { processedIssueList } = useIssueList(issueParams)
const getUnit = (issue: any, predIndex: number) => {
  if (issue && issue.lotteryPredictions?.length > 0) {
    return issue.lotteryPredictions[predIndex].name.slice(1) || ''
  }
  return ''
}
const getNumber = (issue: any, predIndex: number) => {
  switch (getUnit(issue, predIndex)) {
    case '肖':
      return ChineseNumberMap[issue.processedPredictions[predIndex].numbers.length] || ''
    case '码':
      return CircleNumberMap[issue.processedPredictions[predIndex].numbers.length] || ''
    default:
      return ''
  }
}
watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId], [oldSize, oldForumId]) => {
    console.log('🚀 ~ 参数变化:', [newSize, newForumId], [oldSize, oldForumId])
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = gameType.value
  }
)

const numberStyle = computed(() => {
  return {
    fontSize: `${styleMain.value?.numberSize || 14}px`,
    margin: `0 ${styleMain.value?.numberSpacing || 0}px`
  }
})
</script>

<template>
  <div class="issue-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="issue-item">
      <!-- 期数和状态行 -->
      <!-- <div class="title-header-row">
        <div class="period-info">
          <span v-if="styleMain?.showPeriod" class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
          <span class="draw-title">精选24码</span>
          <span>{{ issue.title }}</span>
        </div>
        <div class="status-info">
          <span>开</span>
          <span v-if="styleMain?.showStatus" class="status">{{ issue.resultInfo.shengxiao || '?' }}</span>
          <span v-if="styleMain?.showResult" class="result">{{ getHitNumber(issue) || '00' }}</span>
          <span>准</span>
        </div>
      </div> -->

      <!-- 预测号码显示 -->
      <div
        v-for="(prediction, predIndex) in issue.processedPredictions"
        :key="`pred-${issueIndex}-${predIndex}`"
        class="prediction-block"
      >
        <div class="numbers-rows">
          <!-- 分两行显示号码，每行12个 -->
          <div class="number-row">
            <span>
              {{ issue.postIssue.split('').reverse().slice(0, 3).reverse().join('') }}期{{ getNumber(issue, predIndex)
              }}{{ getUnit(issue, predIndex) }}
            </span>
            <span
              v-for="(num, index) in prediction.numbers"
              :key="`${issue.postId}-${predIndex}-${index}`"
              :class="['number-item', { highlight: num.isHighlight }]"
              :style="numberStyle"
            >
              <span style="padding: 0 2px">{{ num.number }}</span>
            </span>
          </div>
        </div>
      </div>
      <!-- 底部标题 -->
      <div class="bottom-title">
        <div :style="bottomTitleStyle">{{ datas.configParamJson.bottomTitle }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-list {
  padding: 0;
}

.issue-item {
  padding: 10px;
  // padding: 16px;
  // border-bottom: 1px solid #e8eaed;
  border-bottom: 1px solid #eae5e5;
}

.prediction-block {
  margin-bottom: 3px;
  // padding: 12px;
  background-color: rgba(248, 249, 250, 0.5);
  border-radius: 8px;
  // border: 2px solid #ff4444;
  color: blue;
  &:last-child {
    margin-bottom: 0;
  }
}

.title-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.period-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .period {
    font-size: 16px;
    color: #333;
  }

  .draw-title {
    font-size: 16px;
    color: #333;
  }
}

.status-info {
  display: flex;
  align-items: center;
  font-size: 14px;

  .status {
    color: #e74c3c;
  }
  .result {
    color: #e74c3c;
  }
}

.numbers-rows {
  display: flex;
  flex-direction: column;
  // gap: 8px;
}

.number-row {
  display: flex;
  // gap: 4px;
}

.number-item {
  display: inline-block;
  font-weight: 500;
  font-size: 12px;
  // min-width: 24px;
  text-align: center;
  transition: all 0.2s ease;
  font-variant: tabular-nums;
  color: #f80d0d;
  &.highlight {
    background-color: #ffeb3b !important;
    color: #333 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 768px) {
  .title-header-row {
    // flex-direction: column;
    align-items: flex-start;
    // gap: 8px;
  }

  .status-info {
    align-self: flex-end;
  }

  .number-item {
    font-size: 12px;
    padding: 0px;
    min-width: 20px;
  }
}
.bottom-title {
  text-align: center;
  margin-top: 10px;
  width: 100%;
}
</style>
