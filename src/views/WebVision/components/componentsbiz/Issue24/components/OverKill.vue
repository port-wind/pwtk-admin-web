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
    console.log('🚀 ~ OverKill processedIssueList:', newList)
    if (newList.length > 0) {
      console.log('🚀 ~ OverKill sample issue:', newList[0])
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

// 获取杀肖数据
const getKillAnimal = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return '-'

  // 查找杀特肖预测 (code: "8153")
  const killAnimalPrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8153' || pred.name === '杀特肖'
  )
  if (!killAnimalPrediction || !killAnimalPrediction.predict || killAnimalPrediction.predict.length === 0) return '-'

  return killAnimalPrediction.predict[0]
}

// 获取杀波数据
const getKillWave = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return '-'

  // 查找绝杀半波预测 (code: "8161")
  const killWavePrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8161' || pred.name === '绝杀半波'
  )
  if (!killWavePrediction || !killWavePrediction.predict || killWavePrediction.predict.length === 0) return '-'

  return killWavePrediction.predict[0]
}

// 获取杀行数据
const getKillRow = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return '-'

  // 查找杀行预测 (code: "8162")
  const killRowPrediction = issue.lotteryPredictions.find((pred: any) => pred.code === '8162' || pred.name === '杀行')
  if (!killRowPrediction || !killRowPrediction.predict || killRowPrediction.predict.length === 0) return '-'

  return killRowPrediction.predict[0]
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

  // 如果有预测且isHit为"i"（incomplete），则是当前期
  if (issue.lotteryPredictions && issue.lotteryPredictions.length > 0) {
    const hasIncomplete = issue.lotteryPredictions.some((pred: any) => pred.isHit === 'i')
    return hasIncomplete
  }

  return false
}
</script>

<template>
  <div class="overkill-table" v-if="datas.configParamJson.enable">
    <div class="table-container">
      <table class="lottery-table">
        <thead>
          <tr>
            <th>期数</th>
            <th>杀肖</th>
            <th>杀波</th>
            <th>杀行</th>
            <th>开奖</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="table-row">
            <td class="period-cell">{{ extractIssueNumber(issue.postIssue) }}期</td>
            <td class="kill-animal-cell">{{ getKillAnimal(issue) }}</td>
            <td class="kill-wave-cell">{{ getKillWave(issue) }}</td>
            <td class="kill-row-cell">{{ getKillRow(issue) }}</td>
            <td class="lottery-result-cell" :class="{ 'current-period': isCurrentPeriod(issue) }">
              {{ getLotteryResult(issue) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overkill-table {
  width: 100%;
  background-color: #ffffff;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.lottery-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #68a690;

  th,
  td {
    padding: 8px 12px;
    text-align: center;
    border: 1px solid #68a690;
    font-weight: 500;
  }

  thead {
    background-color: #68a690;

    th {
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
    }
  }

  tbody {
    tr {
      background-color: #ffffff;

      &:nth-child(even) {
        background-color: #f8f9fa;
      }

      &:hover {
        background-color: #e8f4f0;
      }
    }

    td {
      color: #333333;
      font-size: 13px;
    }
  }
}

.period-cell {
  font-weight: 600;
  color: #2c3e50;
}

.kill-animal-cell {
  color: #e74c3c;
  font-weight: 600;
}

.kill-wave-cell {
  color: #3498db;
  font-weight: 500;
}

.kill-row-cell {
  color: #f39c12;
  font-weight: 500;
}

.lottery-result-cell {
  color: #27ae60;
  font-weight: 600;

  &.current-period {
    color: #95a5a6;
    font-style: italic;
  }
}

@media (max-width: 768px) {
  .lottery-table {
    font-size: 12px;

    th,
    td {
      padding: 6px 8px;
      font-size: 12px;
    }

    thead th {
      font-size: 12px;
    }
  }

  .period-cell,
  .kill-animal-cell,
  .lottery-result-cell {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .lottery-table {
    font-size: 11px;

    th,
    td {
      padding: 4px 6px;
      font-size: 11px;
    }
  }
}
</style>
