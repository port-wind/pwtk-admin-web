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

// 🔍 智能检测一句解特码三种预测类型
const getOneSentenceSpecialCodePredictions = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 检测三种预测类型：波波、大小数、特肖
  const wavePrediction = issue.lotteryPredictions.find((pred: any) => pred.code === '8008' && pred.name === '波波')
  const sizePrediction = issue.lotteryPredictions.find((pred: any) => pred.code === '8003' && pred.name === '大小数')
  const zodiacPrediction = issue.lotteryPredictions.find((pred: any) => pred.code === '8002' && pred.name === '特肖')

  if (!wavePrediction || !sizePrediction || !zodiacPrediction) return null

  return {
    wave: {
      predict: wavePrediction.predict || [],
      hitDetail: wavePrediction.hitDetail || '',
      isHit: wavePrediction.isHit
    },
    size: {
      predict: sizePrediction.predict || [],
      hitDetail: sizePrediction.hitDetail || '',
      isHit: sizePrediction.isHit
    },
    zodiac: {
      predict: zodiacPrediction.predict || [],
      hitDetail: zodiacPrediction.hitDetail || '',
      isHit: zodiacPrediction.isHit
    }
  }
}

// 🎯 获取特码开奖结果
const getSpecialCodeResult = (issue: any) => {
  if (!issue.numInfo || issue.numInfo.length === 0) return '00'

  // 处理数组格式的开奖结果 - 取特码（第7位或最后一位）
  if (Array.isArray(issue.numInfo)) {
    const specialNum = issue.numInfo.find((num: any) => num.index === 7) || issue.numInfo[issue.numInfo.length - 1]
    if (specialNum) {
      return specialNum.num.toString().padStart(2, '0')
    }
  }

  // 处理字符串格式
  if (typeof issue.numInfo === 'string' && issue.numInfo.trim()) {
    return issue.numInfo.padStart(2, '0')
  }

  return '00'
}

// 🎯 位置基础命中检测
const isElementHit = (elementType: 'wave' | 'size' | 'zodiac', elementIndex: number, issue: any) => {
  const predictions = getOneSentenceSpecialCodePredictions(issue)
  if (!predictions) return false

  const prediction = predictions[elementType]
  const { hitDetail } = prediction

  // 使用 hitDetail 进行精确的位置命中检测
  if (hitDetail && hitDetail.length > elementIndex) {
    return hitDetail[elementIndex] === '1'
  }

  return false
}

// 🎨 构建一句解特码显示内容
const buildOneSentenceContent = (issue: any) => {
  const predictions = getOneSentenceSpecialCodePredictions(issue)
  if (!predictions) return { wave: [], size: [], zodiac: [] }

  const { wave, size, zodiac } = predictions

  // 构建波波部分
  const waveElements = wave.predict.map((waveItem: string, index: number) => ({
    text: waveItem,
    isHit: isElementHit('wave', index, issue)
  }))

  // 构建大小数部分
  const sizeElements = size.predict.map((sizeItem: string, index: number) => ({
    text: sizeItem,
    isHit: isElementHit('size', index, issue)
  }))

  // 构建特肖部分
  const zodiacElements = zodiac.predict.map((zodiacItem: string, index: number) => ({
    text: zodiacItem,
    isHit: isElementHit('zodiac', index, issue)
  }))

  return {
    wave: waveElements,
    size: sizeElements,
    zodiac: zodiacElements
  }
}

// 添加调试函数
const debugIssueList = computed(() => {
  console.log('📋 OneSentenceDecipher processedIssueList:', processedIssueList.value)
  console.log('📋 OneSentenceDecipher processedIssueList length:', processedIssueList.value?.length)

  // 调试每个issue的预测数据
  processedIssueList.value?.forEach((issue, index) => {
    const predictions = getOneSentenceSpecialCodePredictions(issue)
    const content = buildOneSentenceContent(issue)
    const specialCode = getSpecialCodeResult(issue)

    console.log(`📊 Issue ${index + 1}:`, {
      issue: issue.postIssue,
      predictions,
      content,
      specialCode
    })
  })

  return processedIssueList.value
})
</script>

<template>
  <div class="issue-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in debugIssueList" :key="issue.postId" class="issue-item">
      <!-- 一句解特码显示格式：期数期{波波预测+大小数预测看+特肖预测中本期}开:特码 -->
      <div class="one-sentence-item" v-if="getOneSentenceSpecialCodePredictions(issue)">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期</span>
        <span class="content-wrapper">
          {
          <!-- 波波预测部分 -->
          <template
            v-for="(waveItem, waveIndex) in buildOneSentenceContent(issue).wave"
            :key="`wave-${issueIndex}-${waveIndex}`"
          >
            <span :class="['element', { 'element-hit': waveItem.isHit }]">{{ waveItem.text }}</span>
          </template>
          <!-- 大小数预测部分 -->
          <template
            v-for="(sizeItem, sizeIndex) in buildOneSentenceContent(issue).size"
            :key="`size-${issueIndex}-${sizeIndex}`"
          >
            <span class="text">看</span>
            <span :class="['element', { 'element-hit': sizeItem.isHit }]">{{ sizeItem.text }}</span>
          </template>
          <span class="text">-</span>
          <!-- 特肖预测部分 -->
          <template
            v-for="(zodiacItem, zodiacIndex) in buildOneSentenceContent(issue).zodiac"
            :key="`zodiac-${issueIndex}-${zodiacIndex}`"
          >
            <span :class="['element', { 'element-hit': zodiacItem.isHit }]">{{ zodiacItem.text }}</span>
          </template>
          <span class="text">中本期</span>
          }
        </span>
        <span class="result">开:{{ getSpecialCodeResult(issue) }}</span>
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

.one-sentence-item {
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

.content-wrapper {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;
}

.element {
  color: #e74c3c;
  font-weight: 500;

  &.element-hit {
    background-color: #ffeb3b !important;
    color: #333 !important;
    border-radius: 2px !important;
    padding: 0 2px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
  }
}

.text {
  color: #e74c3c;
  font-weight: 500;
}

.result {
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .one-sentence-item {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
</style>
