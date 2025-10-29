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
  ([newSize, newForumId]) => {
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = gameType.value
  }
)

// 🔍 智能检测复式平码预测
const getDuplexFlatCodePrediction = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 检测复式平码预测：code为8163且name为平码
  const prediction = issue.lotteryPredictions.find((pred: any) => {
    return pred.code === '8163' && pred.name === '平码' && Array.isArray(pred.predict) && pred.predict.length > 0
  })

  if (!prediction) return null

  return {
    name: prediction.name,
    predict: prediction.predict,
    isHit: prediction.isHit,
    hitDetail: prediction.hitDetail || '',
    numbers: prediction.predict || []
  }
}

// 🎯 获取开奖结果显示
const getLotteryResult = (issue: any) => {
  if (!issue.numInfo || issue.numInfo.length === 0) return '?'

  // 处理数组格式的开奖结果
  if (Array.isArray(issue.numInfo)) {
    const numbers = issue.numInfo.map((num: any) => num.num.toString().padStart(2, '0'))
    return numbers.join('-')
  }

  // 处理字符串格式
  if (typeof issue.numInfo === 'string' && issue.numInfo.trim()) {
    return issue.numInfo
  }

  return '?'
}

// 🎯 位置基础命中检测
const isNumberHit = (numberIndex: number, issue: any) => {
  const prediction = getDuplexFlatCodePrediction(issue)
  if (!prediction) return false

  // 使用 hitDetail 进行精确的位置命中检测
  const { hitDetail, numbers } = prediction
  if (hitDetail && hitDetail.length > numberIndex) {
    return hitDetail[numberIndex] === '1'
  }

  // 如果没有 hitDetail，则检查预测号码是否在开奖结果中
  if (Array.isArray(issue.numInfo)) {
    const predictedNumber = numbers[numberIndex]
    const lotteryNumbers = issue.numInfo.map((num: any) => num.num.toString().padStart(2, '0'))
    return lotteryNumbers.includes(predictedNumber)
  }

  return false
}

// 🎨 获取带有命中状态的号码数组
const getNumbersWithHitStatus = (issue: any) => {
  const prediction = getDuplexFlatCodePrediction(issue)
  if (!prediction || !prediction.numbers) return []

  return prediction.numbers.map((number: string, index: number) => ({
    number,
    isHit: isNumberHit(index, issue)
  }))
}

// 🎯 计算命中个数
const getHitCount = (issue: any) => {
  const prediction = getDuplexFlatCodePrediction(issue)
  if (!prediction) return 0

  // 使用 hitDetail 计算命中个数
  const { hitDetail, numbers } = prediction
  if (hitDetail) {
    return hitDetail.split('').filter((hit: string) => hit === '1').length
  }

  // 如果没有 hitDetail，则通过对比预测号码和开奖结果计算
  if (Array.isArray(issue.numInfo) && numbers) {
    const lotteryNumbers = issue.numInfo.map((num: any) => num.num.toString().padStart(2, '0'))
    return numbers.filter((predictedNum: string) => lotteryNumbers.includes(predictedNum)).length
  }

  return 0
}

// 添加调试函数
const debugIssueList = computed(() => {
  console.log('📋 DuplexFlatCode processedIssueList:', processedIssueList.value)
  console.log('📋 DuplexFlatCode processedIssueList length:', processedIssueList.value?.length)

  // 调试每个issue的预测数据
  processedIssueList.value?.forEach((issue, index) => {
    const prediction = getDuplexFlatCodePrediction(issue)
    const numbersWithHit = getNumbersWithHitStatus(issue)
    const lotteryResult = getLotteryResult(issue)
    const hitCount = getHitCount(issue)

    console.log(`📊 Issue ${index + 1}:`, {
      issue: issue.postIssue,
      prediction,
      numbersWithHit,
      lotteryResult,
      hitCount
    })
  })

  return processedIssueList.value
})
</script>

<template>
  <div class="issue-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in debugIssueList" :key="issue.postId" class="issue-item">
      <!-- 复式平码显示格式：期数期《数字序列》中:命中个数个 -->
      <div class="duplex-flat-code-item">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期</span>
        <span class="prediction-wrapper" v-if="getDuplexFlatCodePrediction(issue)">
          《
          <template v-for="(numObj, numIndex) in getNumbersWithHitStatus(issue)" :key="`num-${issueIndex}-${numIndex}`">
            <span :class="['number', { 'number-hit': numObj.isHit }]">{{ numObj.number }}</span>
            <span v-if="numIndex < getNumbersWithHitStatus(issue).length - 1" class="separator">-</span>
          </template>
          》
        </span>
        <span class="hit-result">中:{{ getHitCount(issue) }}个</span>
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

.duplex-flat-code-item {
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

.prediction-wrapper {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;
}

.number {
  color: #e74c3c;
  font-weight: 500;

  &.number-hit {
    background-color: #ffeb3b !important;
    color: #333 !important;
    border-radius: 2px !important;
    padding: 0 2px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
  }
}

.separator {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;
}

.hit-result {
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .duplex-flat-code-item {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
</style>
