<script setup lang="ts">
import { defineProps, watch, computed, reactive } from 'vue'
import { useStore } from '@nanostores/vue'

import type { IDatas } from '../type'
import { useIssueList } from '../../hooks/issueList'
import { gameStore } from '../../store'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

// 创建响应式参数对象
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})

const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)

// 添加调试输出
watch(
  () => processedIssueList.value,
  (newList) => {
    console.log('🚀 ~ MiddlesNumberRange processedIssueList:', newList)
    if (newList.length > 0) {
      console.log('🚀 ~ MiddlesNumberRange sample issue:', newList[0])
    }
  },
  { immediate: true }
)

watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId], [oldSize, oldForumId]) => {
    console.log('🚀 ~ 参数变化:', [newSize, newForumId])
    console.log('🚀 ~ 参数变化:', [oldSize, oldForumId])
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = gameType.value
  }
)

// 获取数字段预测
const getNumberRange = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return '-'

  // 智能查找数字段预测：优先查找包含数字段格式的预测
  const numberRangePrediction =
    issue.lotteryPredictions.find((pred: any) => {
      if (!pred.predict || pred.predict.length === 0) return false

      // 检查预测是否包含数字段格式 (如: "17-41", "19-43")
      const prediction = pred.predict[0]
      return typeof prediction === 'string' && /^\d{1,2}-\d{1,2}$/.test(prediction)
    }) || issue.lotteryPredictions[0] // 如果没找到，使用第一个预测

  if (!numberRangePrediction || !numberRangePrediction.predict || numberRangePrediction.predict.length === 0) return '-'

  return numberRangePrediction.predict[0]
}

// 获取开奖结果
const getLotteryResult = (issue: any) => {
  if (!issue.numInfo || issue.numInfo.length === 0) return '? 00'

  // 查找特码 (index: 7 或最后一个)
  const specialNumber = issue.numInfo.find((info: any) => info.index === 7) || issue.numInfo[issue.numInfo.length - 1]
  if (!specialNumber) return '? 00'

  const { shengxiao = '', num = '00' } = specialNumber

  return `${shengxiao}${num}`
}

// 判断是否为当前期（未开奖）
const isCurrentPeriod = (issue: any) => {
  // 如果没有numInfo或numInfo为空，则是当前期
  if (!issue.numInfo || issue.numInfo.length === 0) return true

  // 检查对应的数字段预测是否完成
  if (issue.lotteryPredictions && issue.lotteryPredictions.length > 0) {
    const numberRangePrediction =
      issue.lotteryPredictions.find((pred: any) => {
        if (!pred.predict || pred.predict.length === 0) return false

        // 检查预测是否包含数字段格式 (如: "17-41", "19-43")
        const prediction = pred.predict[0]
        return typeof prediction === 'string' && /^\d{1,2}-\d{1,2}$/.test(prediction)
      }) || issue.lotteryPredictions[0]

    // 如果找到了数字段预测，检查它是否未完成
    const isCurrent = numberRangePrediction && numberRangePrediction.isHit === 'i'

    // 添加调试日志
    console.log('🚀 ~ isCurrentPeriod ~ issue:', issue.postIssue, {
      prediction: numberRangePrediction,
      isHit: numberRangePrediction?.isHit,
      isCurrent
    })

    return isCurrent
  }

  return false
}

// 判断预测是否命中
const isPredictionHit = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return false

  // 使用相同的逻辑查找数字段预测
  const numberRangePrediction =
    issue.lotteryPredictions.find((pred: any) => {
      if (!pred.predict || pred.predict.length === 0) return false

      // 检查预测是否包含数字段格式 (如: "17-41", "19-43")
      const prediction = pred.predict[0]
      return typeof prediction === 'string' && /^\d{1,2}-\d{1,2}$/.test(prediction)
    }) || issue.lotteryPredictions[0] // 如果没找到，使用第一个预测

  const isHit = numberRangePrediction && numberRangePrediction.isHit === 'y'

  // 添加调试日志
  console.log('🚀 ~ isPredictionHit ~ issue:', issue.postIssue, {
    prediction: numberRangePrediction,
    isHit: numberRangePrediction?.isHit,
    hitDetail: numberRangePrediction?.hitDetail,
    result: isHit
  })

  return isHit
}
</script>

<template>
  <div class="number-range-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="issue-item">
      <div class="number-range-item">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">中特码段</span>
        <span
          class="range"
          :class="{
            'hit-result': isPredictionHit(issue)
          }"
        >
          《{{ getNumberRange(issue) }}》
        </span>
        <span class="draw-label">开:</span>
        <span
          class="lottery-result"
          :class="{
            'current-period': isCurrentPeriod(issue) && !isPredictionHit(issue),
            'hit-result': isPredictionHit(issue)
          }"
        >
          {{ getLotteryResult(issue) }}
        </span>
        <span class="accuracy">准</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.number-range-list {
  width: 100%;
  background-color: #ffffff;
}

.issue-item {
  padding: 8px 12px;
  border-bottom: 1px solid #e8eaed;
  background-color: #ffffff;

  &:last-child {
    border-bottom: none;
  }
}

.number-range-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  justify-content: center;
  text-align: center;
  padding: 6px 0;
  flex-wrap: wrap;
}

.period {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}

.title {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.range {
  color: #e74c3c;
  font-weight: 600;
  font-size: 15px;
  margin: 0 2px;
  &.hit-result {
    background-color: #ffff00 !important;
  }
}

.draw-label {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.lottery-result {
  color: #3498db;
  font-weight: 600;
  font-size: 15px;
  margin: 0 2px;

  &.current-period {
    color: #3498db !important;
  }
}

.accuracy {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 768px) {
  .number-range-item {
    font-size: 12px;
    gap: 2px;
    padding: 4px 0;
  }

  .period {
    font-size: 13px;
  }

  .title {
    font-size: 12px;
  }

  .range {
    font-size: 13px;
  }

  .draw-label {
    font-size: 12px;
  }

  .lottery-result {
    font-size: 13px;
  }

  .accuracy {
    font-size: 12px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}

@media (max-width: 480px) {
  .number-range-item {
    font-size: 11px;
    gap: 1px;
  }

  .period,
  .range,
  .lottery-result {
    font-size: 12px;
  }

  .title,
  .draw-label,
  .accuracy {
    font-size: 11px;
  }
}
</style>
