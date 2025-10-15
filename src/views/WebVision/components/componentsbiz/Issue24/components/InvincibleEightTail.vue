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

// 智能检测尾数预测（无敌八尾）
const getTailPrediction = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 智能检测尾数预测模式
  const prediction = issue.lotteryPredictions.find((pred: any) => {
    if (!pred.predict || pred.predict.length === 0) return false

    // 检测是否为尾数预测：
    // 1. 预测是数组
    // 2. 包含多个单数字（0-9）
    // 3. 有对应的尾数规则
    const isArrayPrediction = Array.isArray(pred.predict)
    const isAllSingleDigits = pred.predict.every((p: string) => /^\d$/.test(p))
    const hasOptions = pred.rule && pred.rule.options
    const hasTailRules = hasOptions && Object.keys(pred.rule.options).every((key: string) => /^\d$/.test(key))

    return isArrayPrediction && isAllSingleDigits && hasOptions && hasTailRules
  })

  if (!prediction) return null

  return {
    name: prediction.name,
    predict: prediction.predict, // 保持为数组
    isHit: prediction.isHit === 'y',
    hitDetail: prediction.hitDetail || '',
    numbers: prediction.predict || []
  }
}

// 获取开奖结果中的所有数字
const getLotteryNumbers = (issue: any) => {
  if (!issue.numInfo || issue.numInfo.length === 0) return []

  // 处理新的数据结构 - numInfo 是对象数组
  if (Array.isArray(issue.numInfo)) {
    return issue.numInfo.map((num: any) => num.num.toString())
  }

  // 处理旧的数据结构 - numInfo 是字符串
  if (typeof issue.numInfo === 'string' && issue.numInfo.includes(',')) {
    return issue.numInfo.split(',').map((num: string) => num.trim())
  }

  return []
}

// 获取开奖结果显示
const getLotteryResult = (issue: any) => {
  if (!issue.numInfo || issue.numInfo.length === 0) return '? 00'

  // 处理新的数据结构 - numInfo 是对象数组
  if (Array.isArray(issue.numInfo)) {
    const specialNum = issue.numInfo.find((num: any) => num.index === 7) || issue.numInfo[issue.numInfo.length - 1]
    if (specialNum) {
      return `${specialNum.shengxiao}${specialNum.num.toString().padStart(2, '0')}`
    }
  }

  // 处理旧的数据结构 - numInfo 是字符串
  if (typeof issue.numInfo === 'string' && issue.numInfo.includes(',')) {
    const numArray = issue.numInfo.split(',')
    if (numArray.length >= 8) {
      return numArray[7] // 特码在第8位
    }
  }

  return '? 00'
}

// 判断单个尾数是否命中（基于位置）
const isTailHit = (tailIndex: number, issue: any) => {
  const prediction = getTailPrediction(issue)
  if (!prediction) return false

  // 使用hitDetail字段判断：如 "10000000" 表示第1个预测命中
  const hitDetail = prediction.hitDetail || ''
  if (hitDetail.length > tailIndex) {
    return hitDetail[tailIndex] === '1'
  }

  // 如果没有hitDetail，则检查尾数是否在开奖结果中
  const predictedTail = prediction.numbers[tailIndex]
  const lotteryNumbers = getLotteryNumbers(issue)

  return lotteryNumbers.some((num: string) => num.endsWith(predictedTail))
}

// 获取带有命中状态的尾数数组
const getTailsWithHitStatus = (issue: any) => {
  const prediction = getTailPrediction(issue)
  if (!prediction || !prediction.numbers) return []

  return prediction.numbers.map((tail: string, index: number) => ({
    number: tail,
    isHit: isTailHit(index, issue)
  }))
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
      <!-- 无敌八尾显示格式：期数期:无敌八尾《数字序列》开:结果 准 -->
      <div class="invincible-eight-tail-item">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">无敌八尾</span>
        <span class="prediction-wrapper" v-if="getTailPrediction(issue)">
          《
          <template v-for="(numObj, numIndex) in getTailsWithHitStatus(issue)" :key="`num-${issueIndex}-${numIndex}`">
            <span :class="['number', { 'number-hit': numObj.isHit }]">{{ numObj.number }}</span>
            <span v-if="numIndex < getTailsWithHitStatus(issue).length - 1" class="separator">-</span>
          </template>
          》
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

.invincible-eight-tail-item {
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

.result {
  color: #333;
  font-weight: 500;
}

.hit-mark {
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .invincible-eight-tail-item {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
</style>
