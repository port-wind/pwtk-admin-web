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

// 获取合数单双预测
const getSumOddEvenPrediction = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 智能检测二元分类预测（如单双、大小等）
  const prediction = issue.lotteryPredictions.find((pred: any) => {
    // 检查是否有规则选项
    if (!pred.rule || !pred.rule.options) return false

    // 获取规则选项的键
    const optionKeys = Object.keys(pred.rule.options)

    // 检查是否是二元分类（恰好两个选项）
    if (optionKeys.length !== 2) return false

    // 检查是否包含单双模式
    const isSingleDoublePattern = optionKeys.some((key) => key.includes('单') || key.includes('双'))

    // 检查是否包含大小模式
    const isBigSmallPattern = optionKeys.some((key) => key.includes('大') || key.includes('小'))

    // 检查是否包含其他二元对立模式
    const isBinaryPattern = optionKeys.length === 2 && optionKeys.every((key) => key.length <= 3) // 简短的分类名称

    return isSingleDoublePattern || isBigSmallPattern || isBinaryPattern
  })

  if (!prediction) return null

  return {
    name: prediction.name,
    predict: prediction.predict && prediction.predict.length > 0 ? prediction.predict[0] : '',
    isHit: prediction.isHit === 'y',
    hitDetail: prediction.hitDetail || ''
  }
}

// 获取开奖结果
const getLotteryResult = (issue: any) => {
  console.log('🔍 getLotteryResult - issue:', issue.postIssue, 'numInfo:', issue.numInfo)

  if (!issue.numInfo || issue.numInfo.length === 0) return '?'

  // 处理新的数据结构 - numInfo 是对象数组
  if (Array.isArray(issue.numInfo)) {
    // 找到特码（通常是最后一个或者index为7的）
    const specialNum = issue.numInfo.find((num: any) => num.index === 7) || issue.numInfo[issue.numInfo.length - 1]
    if (specialNum) {
      return `${specialNum.shengxiao}${specialNum.num.toString().padStart(2, '0')}`
    }
  }

  // 处理旧的数据结构 - numInfo 是字符串
  if (typeof issue.numInfo === 'string' && issue.numInfo.includes(',')) {
    const numArray = issue.numInfo.split(',')
    if (numArray.length >= 8) {
      const specialNumber = numArray[7] // 特码在第8位
      return specialNumber
    }
  }

  return '?'
}

// 判断是否命中
const isHit = (issue: any) => {
  const prediction = getSumOddEvenPrediction(issue)
  console.log('🎯 isHit - issue:', issue.postIssue, 'prediction:', prediction)
  return prediction && prediction.isHit
}

// 添加调试函数
const debugIssueList = computed(() => {
  console.log('📋 processedIssueList:', processedIssueList.value)
  console.log('📋 processedIssueList length:', processedIssueList.value?.length)
  return processedIssueList.value
})
</script>

<template>
  <div class="issue-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in debugIssueList" :key="issue.postId" class="issue-item">
      <!-- 合数单双显示格式：期数期:合数单双《预测》开:结果 准 -->
      <div class="sum-odd-even-item">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">合数单双</span>
        <span :class="['prediction', { 'prediction-hit': isHit(issue) }]" v-if="getSumOddEvenPrediction(issue)">
          《{{ getSumOddEvenPrediction(issue)?.predict }}》
        </span>
        <span class="result">开:{{ getLotteryResult(issue) }}</span>
        <span class="hit-mark">准</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.issue-list {
  padding: 0;
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

.sum-odd-even-item {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  justify-content: center;
  text-align: center;
  padding: 4px 0;
}

.period {
  color: #333;
  font-weight: 500;
}

.title {
  color: #333;
  font-weight: 500;
}

.prediction {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;

  &.prediction-hit {
    background-color: #ffeb3b !important;
    color: #333 !important;
    border-radius: 2px !important;
    padding: 0 2px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
  }
}

.result {
  color: #333;
  font-weight: 500;
}

.hit-mark {
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .sum-odd-even-item {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
</style>
