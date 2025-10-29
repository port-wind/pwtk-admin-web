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
// const forum = computed(() => props.datas.configParamJson.forumId)
// const styleHeader = computed(() => props.datas.configParamJson.styleHeader)

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

// 获取平特二肖的中奖数量
const getPingTe2XiaoHitCount = (issue: any) => {
  if (!issue.processedPredictions || issue.processedPredictions.length === 0) return 0

  // 计算前两个预测动物中有多少个高亮（中奖）
  const prediction = issue.processedPredictions[0]
  if (!prediction || !prediction.numbers || prediction.numbers.length < 2) return 0

  const hitCount = prediction.numbers.slice(0, 2).filter((num: { isHighlight: any }) => num.isHighlight).length
  return hitCount
}

// 获取预测的两个动物
const getPredictedAnimals = (issue: any) => {
  if (!issue.processedPredictions || issue.processedPredictions.length === 0) return []

  const prediction = issue.processedPredictions[0]
  if (!prediction || !prediction.numbers || prediction.numbers.length < 2) return []

  return prediction.numbers.slice(0, 2)
}
</script>

<template>
  <div class="issue-list" v-if="datas.configParamJson.enable">
    <div v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="issue-item">
      <!-- 平特二肖显示格式：期数期:平特二肖《动物1》《动物2》中:X肖 -->
      <div class="pingte-item">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">平特二肖</span>
        <template
          v-for="(animal, animalIndex) in getPredictedAnimals(issue)"
          :key="`animal-${issueIndex}-${animalIndex}`"
        >
          <span :class="['animal', { 'animal-highlight': animal.isHighlight }]">《{{ animal.number }}》</span>
        </template>
        <span class="hit-result">中:{{ getPingTe2XiaoHitCount(issue) }}肖</span>
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

.pingte-item {
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

.animal {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;

  &.animal-highlight {
    background-color: #ffeb3b;
    color: #333;
    border-radius: 2px;
    padding: 0 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.hit-result {
  color: #333;
  font-weight: 500;
}

@media (max-width: 768px) {
  .pingte-item {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
</style>
