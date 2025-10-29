<template>
  <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden">
    <el-form
      v-bind="$attrs"
      label-width="auto"
      ref="formRef"
      v-loading="isLoading"
      style="flex: 1; overflow: hidden auto"
    >
      <div :gutter="20" class="frame-wrapper-flex">
        <el-form-item label="中奖信息:" prop="predictionMode">
          <div class="game-header">
            <span></span>
            <span v-if="openFlag" class="lottery-result">
              <span class="result-label">开奖结果:</span>
              <template v-for="(ball, index) in numInfo" :key="index">
                <span v-if="index === 6" class="separator">+</span>
                <lotto-ball :number="ball.num" :color="ball.color" :zodiacSigns="ball.shengxiao" />
              </template>
            </span>
          </div>
        </el-form-item>
        <div style="flex: 1; display: flex; flex-direction: column; overflow: auto">
          <el-form-item label=" ">
            <LotteryBall
              v-for="(rule, index) in formattedPredictions"
              :key="index"
              :ball-list="rule.predict"
              :title="formatTitle(rule.name, rule.subName)"
              :max="rule.max"
              :min="rule.min"
              :view-mode="true"
              :is-hit="rule.isHit"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="submit-wrapper">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getHittedHistory } from '@/api/bss/postContentManagement'

// Type definitions
interface PredictionDTO {
  name: string
  predict: string[]
  isHit: 'i' | 'y' | 'n'
  hitDetail: string
  subName?: string
}

interface FormattedPrediction {
  name: string
  max: number
  min: number
  isHit: 'i' | 'y' | 'n'
  subName?: string
  predict: Array<{ value: string; selected: boolean }>
}

export interface PostPrediction {
  name: string
  isHit: string
  openFlag: 'y' | 'n'
  gameTypeName: string
  postYear: string
  postIssue: string
  predictionDTOList: PredictionDTO[]
}

// Props
const props = defineProps<{
  postPrediction: PostPrediction
}>()
const emit = defineEmits(['cancel'])
// State
const isLoading = ref(false)
const numInfo = ref<any[]>([])

// Computed properties
const openFlag = computed(() => props.postPrediction?.openFlag === 'y')

const formattedPredictions = computed<FormattedPrediction[]>(() => {
  if (!props.postPrediction?.predictionDTOList) {
    return []
  }

  return props.postPrediction.predictionDTOList.map((dto: PredictionDTO) => {
    const hitDetail: boolean[] = dto.hitDetail.split('').map((num) => num === '1')

    return {
      name: dto.name,
      max: 0, // Default values since they're not used in view mode
      min: 0,
      isHit: dto.isHit,
      subName: dto.subName,
      predict: dto.predict.map((str, index) => ({
        value: str,
        selected: hitDetail[index]
      }))
    }
  })
})
const cancel = () => {
  emit('cancel')
}

// Helper functions
function formatTitle(name: string, subName?: string): string {
  if (!name && !subName) return ''
  if (name === subName) return name || subName || ''
  if (name && subName) return `${subName} （${name}）`
  return name || subName || ''
}

// Methods
async function loadHistory(): Promise<void> {
  try {
    isLoading.value = true
    const res = await getHittedHistory({
      gameTypeName: props.postPrediction.gameTypeName,
      year: props.postPrediction.postYear,
      issue: props.postPrediction.postIssue
    })

    if (res.success && res?.data?.list?.length) {
      numInfo.value = res.data.list[0].numInfo
    } else {
      ElMessage.error('获取开奖结果失败')
    }
  } catch (error) {
    ElMessage.error('获取开奖结果失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
// Lifecycle hooks
onMounted(async () => {
  console.log('openFlag.value:', JSON.stringify(openFlag.value))
  if (openFlag.value) {
    await loadHistory()
  }
})
</script>

<style scoped lang="less">
.game-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .lottery-result {
    display: flex;
    align-items: center;

    .result-label {
      font-size: 13px;
      margin-right: 5px;
    }

    .separator {
      margin: 2px;
      margin-right: 4px;
    }
  }
}
.frame-wrapper-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 10%;
  overflow: hidden;
  justify-content: center;
}
.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 10px 0;
}
</style>
