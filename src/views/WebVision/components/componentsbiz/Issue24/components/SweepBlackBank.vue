<script setup lang="ts" name="SweepBlackBank">
import { defineProps, watch, computed, reactive, onMounted } from 'vue'
import { useStore } from '@nanostores/vue'
import type { IDatas } from '../type'
import { useIssueList } from '../../hooks/issueList'
import { gameStore } from '../../store'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 🎮 CRITICAL: gameType Store Integration
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.gameTypeLongName || '未知游戏')

// 🔄 Dynamic Parameters Based on Game Type
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size) || 10,
  forumId: String(props.datas.configParamJson.forumId) || '10'
})

const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)

// 🎯 Monitor Game Type Changes
watch(
  gameType,
  (newGameType) => {
    if (newGameType) {
      issueParams.gameType = newGameType
      console.log(`🎮 Game Type Changed: ${newGameType}`)
    }
  },
  { immediate: true }
)

// 📊 Monitor Configuration Changes
watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId, newGameType]) => {
    issueParams.size = Number(newSize) || 10
    issueParams.forumId = String(newForumId) || '10'
    issueParams.gameType = String(newGameType)
  }
)

// 🔍 Zodiac animals mapping
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

// 🔍 STEP 1: Intelligent Pattern Detection for Animal Predictions
const detectAnimalPrediction = (pred: any) => {
  if (!pred.predict?.length) return null

  // Check if prediction is an array of zodiac animals
  if (Array.isArray(pred.predict)) {
    const animals = pred.predict.filter((p: string) => zodiacAnimals.includes(p))
    if (animals.length > 0) {
      return {
        animals,
        originalText: pred.predict.join(''),
        isValid: true
      }
    }
  }

  // Check if single prediction contains multiple zodiac animals
  const prediction = pred.predict[0]
  if (typeof prediction === 'string') {
    const animals = zodiacAnimals.filter((animal) => prediction.includes(animal))
    if (animals.length > 0) {
      return {
        animals,
        originalText: prediction,
        isValid: true
      }
    }
  }

  return null
}

// 🔍 STEP 2: Get Prediction Data
const getPredictionData = (issue: any) => {
  if (!issue.lotteryPredictions?.length) return null

  // Find animal prediction
  const prediction = issue.lotteryPredictions.find((pred) => {
    const animalData = detectAnimalPrediction(pred)
    return animalData?.isValid
  })

  if (!prediction) return null

  const animalData = detectAnimalPrediction(prediction)

  return {
    prediction,
    animalData
  }
}

// 🔍 STEP 3: Get Lottery Result
const getLotteryResult = (issue: any) => {
  if (!issue.numInfo) return '?'

  try {
    // Handle array format
    if (Array.isArray(issue.numInfo)) {
      const specialNum = issue.numInfo.find((num) => num.index === 7) || issue.numInfo[issue.numInfo.length - 1]
      if (specialNum) {
        return `${specialNum.shengxiao}${specialNum.num.toString().padStart(2, '0')}`
      }
    }

    // Handle string format
    if (typeof issue.numInfo === 'string') {
      const numArray = issue.numInfo.split(',').map((n) => n.trim())
      const lastNum = numArray[numArray.length - 1]
      // Try to extract zodiac and number from string
      const zodiacMatch = lastNum.match(/([鼠牛虎兔龙蛇马羊猴鸡狗猪])(\d+)/)
      if (zodiacMatch) {
        return `${zodiacMatch[1]}${zodiacMatch[2].padStart(2, '0')}`
      }
      return lastNum
    }

    // Handle object format
    if (typeof issue.numInfo === 'object') {
      const { shengxiao, zodiac, num, number } = issue.numInfo
      const finalZodiac = shengxiao || zodiac
      const finalNumber = num || number
      if (finalZodiac && finalNumber) {
        return `${finalZodiac}${finalNumber.toString().padStart(2, '0')}`
      }
    }
  } catch (error) {
    console.error('Error processing lottery result:', error)
  }

  return '?'
}

// 🔍 STEP 4: Hit Detection
const isHit = (issue: any) => {
  const predictionData = getPredictionData(issue)
  if (!predictionData?.animalData?.animals?.length) return false

  const lotteryResult = getLotteryResult(issue)
  const resultZodiac = zodiacAnimals.find((animal) => lotteryResult.includes(animal))

  if (!resultZodiac) return false

  // Check if the result zodiac is in the predicted animals
  return predictionData.animalData.animals.includes(resultZodiac)
}

// 🔍 STEP 5: Get Animals with Hit Status
const getAnimalsWithHitStatus = (issue: any) => {
  const predictionData = getPredictionData(issue)
  if (!predictionData?.animalData?.animals?.length) {
    // Fallback: try to show any prediction data available
    if (issue.lotteryPredictions?.length > 0) {
      const firstPred = issue.lotteryPredictions[0]
      if (firstPred.predict?.length > 0) {
        return firstPred.predict.map((animal: string) => ({
          animal,
          isHit: false // No hit detection for fallback
        }))
      }
    }
    return []
  }

  const { animals } = predictionData.animalData
  const lotteryResult = getLotteryResult(issue)
  const resultZodiac = zodiacAnimals.find((animal) => lotteryResult.includes(animal))

  return animals.map((animal: string) => ({
    animal,
    isHit: resultZodiac === animal
  }))
}

// 🎨 Get style for highlighting individual animals
const getAnimalHighlightClass = (animal: any) => {
  return animal.isHit ? 'hit-highlight' : ''
}
</script>

<template>
  <div class="sweep-black-bank" v-if="datas.configParamJson.enable">
    <!-- Issue list -->
    <div class="issue-list">
      <div v-for="(issue, issueIndex) in processedIssueList" :key="issue.postId" class="issue-item">
        <div class="issue-display">
          <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
          <span class="prediction-content">
            【
            <template
              v-for="(animal, animalIndex) in getAnimalsWithHitStatus(issue)"
              :key="`animal-${issueIndex}-${animalIndex}`"
            >
              <span :class="['animal', getAnimalHighlightClass(animal)]">{{ animal.animal }}</span>
            </template>
            】
          </span>
          <span class="result">开:{{ getLotteryResult(issue) }}</span>
          <span class="status" v-if="isHit(issue)">准</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!processedIssueList?.length" class="empty-state">
      <span>暂无{{ currentGameName }}数据</span>
    </div>
  </div>

  <!-- Required slot for delete button -->
  <slot name="deles" />
</template>

<style lang="scss" scoped>
.sweep-black-bank {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.issue-list {
  background-color: #f8f9fa;

  .issue-item {
    padding: 8px 16px;
    border-bottom: 1px solid #e9ecef;
    background-color: white;

    &:last-child {
      border-bottom: none;
    }

    .issue-display {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      line-height: 1.5;
      color: #333;

      .period {
        color: #333;
        font-weight: 500;
      }

      .prediction-content {
        color: #1976d2;
        font-weight: 600;
        margin: 0 2px;

        .animal {
          color: inherit;

          &.hit-highlight {
            background-color: #ffeb3b !important;
            color: #333 !important;
            border-radius: 3px !important;
            padding: 1px 2px !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
          }
        }
      }

      .result {
        color: #333;
        font-weight: 500;
        margin-left: auto;
      }

      .status {
        color: #4caf50;
        font-weight: bold;
        margin-left: 4px;
      }
    }
  }
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
  background-color: #f8f9fa;
}

// Responsive design
@media (max-width: 768px) {
  .issue-list .issue-item {
    padding: 6px 12px;

    .issue-display {
      font-size: 12px;
      gap: 2px;
    }
  }
}
</style>
