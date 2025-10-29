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
    console.log('🚀 ~ HavenEarthZodiac processedIssueList:', newList)
    if (newList.length > 0) {
      console.log('🚀 ~ HavenEarthZodiac sample issue:', newList[0])
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

// 获取天地生肖规则
const getHeavenEarthRules = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 智能查找包含二元对立概念的预测规则
  const heavenEarthPrediction = issue.lotteryPredictions.find((pred: any) => {
    if (!pred.rule || !pred.rule.options) return false

    const { options } = pred.rule
    const keys = Object.keys(options)

    // 检查是否包含天地、大小、单双等对立概念
    const hasOppositePattern =
      keys.length === 2 && keys.every((key) => Array.isArray(options[key]) && options[key].length > 0)

    return hasOppositePattern
  })

  if (!heavenEarthPrediction || !heavenEarthPrediction.rule || !heavenEarthPrediction.rule.options) return null

  return heavenEarthPrediction.rule.options
}

// 获取天地生肖预测
const getHeavenEarthPrediction = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return null

  // 智能查找对立概念预测
  const heavenEarthPred = issue.lotteryPredictions.find((pred: any) => {
    if (!pred.rule || !pred.rule.options) return false
    const keys = Object.keys(pred.rule.options)
    return keys.length === 2 && keys.every((key) => Array.isArray(pred.rule.options[key]))
  })

  // 查找动物预测
  const animalPred = issue.lotteryPredictions.find((pred: any) => {
    if (!pred.predict || pred.predict.length === 0) return false
    // 检查预测是否包含动物名称
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    return pred.predict.some((p: string) => animals.includes(p))
  })

  if (!heavenEarthPred || !animalPred) return null

  const { predict = [], isHit, hitDetail } = heavenEarthPred
  const { predict: animalPredict = [] } = animalPred

  return {
    type: predict[0] || '', // "天肖" or "地肖"
    animals: animalPredict, // ["猴", "牛"]
    isHit,
    hitDetail
  }
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
  if (!issue.numInfo || issue.numInfo.length === 0) return true

  if (issue.lotteryPredictions && issue.lotteryPredictions.length > 0) {
    const heavenEarthPred = issue.lotteryPredictions.find((pred: any) => pred.code === '8089' || pred.name === '天地')
    return heavenEarthPred && heavenEarthPred.isHit === 'i'
  }

  return false
}

// 判断预测是否命中
const isPredictionHit = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return false

  const heavenEarthPred = issue.lotteryPredictions.find((pred: any) => pred.code === '8089' || pred.name === '天地')

  return heavenEarthPred && heavenEarthPred.isHit === 'y'
}

// 检查动物是否命中
const isAnimalHit = (issue: any, animal: string) => {
  // 获取天地预测信息
  const prediction = getHeavenEarthPrediction(issue)
  if (!prediction || prediction.isHit !== 'y') return false

  // 获取规则选项
  const rules = getHeavenEarthRules(issue)
  if (!rules) return false

  // 获取预测的类型（天肖或地肖）
  const predictedType = prediction.type
  if (!predictedType || !rules[predictedType]) return false

  // 检查当前动物是否属于命中的类型
  const typeAnimals = rules[predictedType]
  return Array.isArray(typeAnimals) && typeAnimals.includes(animal)
}

// 检查预测类型是否命中
const isTypeHit = (issue: any) => {
  // 获取天地预测信息
  const prediction = getHeavenEarthPrediction(issue)
  if (!prediction) return false

  // 如果天地预测命中，则类型预测也命中
  return prediction.isHit === 'y'
}

// 获取规则显示的第一个期数的规则
const displayRules = computed(() => {
  if (processedIssueList.value.length === 0) return {}

  const firstIssue = processedIssueList.value[0]
  const rules = getHeavenEarthRules(firstIssue)

  return rules || {}
})

// 获取规则键值对
const ruleEntries = computed(() => {
  const rules = displayRules.value
  return Object.entries(rules)
    .filter(([, animals]) => Array.isArray(animals) && animals.length > 0)
    .map(([ruleType, animals]) => ({ ruleType, animals: animals as string[] }))
})

// 是否显示规则
const shouldShowRules = computed(() => {
  return ruleEntries.value.length >= 2
})
</script>

<template>
  <div class="heaven-earth-zodiac" v-if="datas.configParamJson.enable">
    <!-- 规则显示 -->
    <div v-if="shouldShowRules" class="rules-header">
      <div v-for="entry in ruleEntries" :key="entry.ruleType" class="rule-item">
        <span class="rule-label">{{ entry.ruleType }}:</span>
        <span class="rule-animals">{{ entry.animals.join('') }}</span>
      </div>
    </div>

    <!-- 期数列表 -->
    <div v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="issue-item">
      <template v-if="getHeavenEarthPrediction(issue)">
        <div class="heaven-earth-item">
          <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
          <span class="title">天地生肖</span>
          <span class="prediction">
            《
            <span :class="['type', { 'type-hit': isTypeHit(issue) }]">{{ getHeavenEarthPrediction(issue)!.type }}</span>
            +
            <template
              v-for="(animal, animalIndex) in getHeavenEarthPrediction(issue)!.animals"
              :key="`animal-${issueIndex}-${animalIndex}`"
            >
              <span :class="['animal', { 'animal-hit': isAnimalHit(issue, animal) }]">
                {{ animal }}
              </span>
            </template>
            》
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
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.heaven-earth-zodiac {
  width: 100%;
  background-color: #ffffff;
}

.rules-header {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e8eaed;
  text-align: center;

  .rule-item {
    margin: 4px 0;
    font-size: 14px;
    line-height: 1.5;

    .rule-label {
      color: #333;
      font-weight: 600;
      margin-right: 4px;
    }

    .rule-animals {
      color: #333;
      font-weight: 500;
    }
  }
}

.issue-item {
  padding: 8px 12px;
  border-bottom: 1px solid #e8eaed;
  background-color: #ffffff;

  &:last-child {
    border-bottom: none;
  }
}

.heaven-earth-item {
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

.prediction {
  color: #e74c3c;
  font-weight: 600;
  font-size: 15px;
  margin: 0 2px;
}

.type {
  color: #e74c3c;
  font-weight: 600;

  &.type-hit {
    background-color: #ffff00;
    color: #333;
    border-radius: 2px;
    padding: 1px 2px;
  }
}

.animal {
  color: #e74c3c;
  font-weight: 600;

  &.animal-hit {
    background-color: #ffff00;
    color: #333;
    border-radius: 2px;
    padding: 1px 2px;
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

  &.hit-result {
    color: #e74c3c !important;
  }
}

.accuracy {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

@media (max-width: 768px) {
  .rules-header {
    padding: 8px 12px;

    .rule-item {
      font-size: 12px;
      margin: 2px 0;
    }
  }

  .heaven-earth-item {
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

  .prediction {
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
  .rules-header {
    padding: 6px 8px;

    .rule-item {
      font-size: 11px;
    }
  }

  .heaven-earth-item {
    font-size: 11px;
    gap: 1px;
  }

  .period,
  .prediction,
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
