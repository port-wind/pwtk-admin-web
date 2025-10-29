// useParticipationLogic.ts
import { ref, computed, type Reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getLotteryRules } from '@/api/bss/postContentManagement'
import showErrorMessage from '@/utils/showErrorMessage'
import type {
  IPlayRule,
  ICreateBbsPostQueryParams,
  IUpdateBbsPostQueryParams
} from '@/api/bss/postContentManagement/types'

export interface BallOption {
  value: string
  selected: boolean
}

export type PlayRuleExtended = IPlayRule & {
  show: boolean
  presetOptions: BallOption[]
}

export interface LotteryRule {
  code: string
  name: string
  subCode: string
  subName: string
  optionList: string[]
  optionCount: number
}
export interface LotteryPredictionDetail {
  playTypeCode: string
  name: string
  subName?: string
  predict: string[]
  hitDetail: string
  isHit: 'y' | 'n' | 'i'
}
export interface LotteryPredictionBeforeHit {
  playTypeCode: string
  name: string
  predict: string[]
}
interface LotteryPredictionResult {
  gameType: string
  name: string
  playTypeCode: string
  predict: string[]
}
export function useLotteryParticipationLogic(state: Reactive<ICreateBbsPostQueryParams | IUpdateBbsPostQueryParams>) {
  const isLoading = ref(false)
  const postPredictionRules = ref<LotteryRule[]>([])
  const resultPredictions = ref<LotteryPredictionResult[]>([])
  const invalidInfo = computed(() => {
    return resultPredictions.value.filter((item) => {
      const rule = postPredictionRules.value.find((r) => r.subCode === item.playTypeCode)
      return rule?.optionCount !== item.predict.length
    })
  })
  // Computed properties
  const predictionModeList = computed(() =>
    postPredictionRules.value.map((item) => ({
      label: item.name,
      value: item.subCode
    }))
  )
  const selectedPlayTypeCodes = ref<string[]>([])
  // 从playRules中筛选出playMode对应的规则
  const selectedPredictionRules = computed(() => {
    console.log('selectedPlayTypeCodes.value', selectedPlayTypeCodes.value)
    return selectedPlayTypeCodes.value
      .map((subCode) => postPredictionRules.value.find((rule) => rule.subCode === subCode) as LotteryRule)
      .filter((item) => !!item)
  })
  const predictionInvalid = computed(() => {
    const noPrediction = !resultPredictions.value || resultPredictions.value.length === 0
    console.log('noPrediction', noPrediction)

    const invalid = invalidInfo.value.length > 0
    console.log('invalid', invalid)
    return noPrediction || isLoading.value || invalid
  })

  // 加载预测信息
  async function setPredictionInfoFrom(details?: LotteryPredictionBeforeHit[]): Promise<void> {
    if (!details || !details.length) {
      return
    }
    const filteredDetails = details.filter((item) =>
      postPredictionRules.value.find((r) => r.subCode === item.playTypeCode)
    )
    selectedPlayTypeCodes.value = filteredDetails.map((item) => item.playTypeCode)
    resultPredictions.value = filteredDetails.map((item) => ({
      gameType: state.postGametypeRef!,
      name: item.name,
      playTypeCode: item.playTypeCode,
      predict: item.predict
    }))
  }

  async function loadPredictionRules(): Promise<void> {
    try {
      isLoading.value = true
      const res = await getLotteryRules({ gameType: state.postGametypeRef!, forumId: state.forumId! })

      if (!res.success) {
        showErrorMessage(res)
        return
      }

      const rules = ((res.data as LotteryRule[]) ?? []).map((item) => {
        return {
          ...item
        }
      })

      postPredictionRules.value = rules
    } catch (error) {
      ElMessage.error('获取玩法规则失败')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  // Helper function to reset options
  function resetSinglePredictions(rule: LotteryRule, newResult?: string[]): void {
    console.log('resetSinglePredictions', rule, newResult)
    resultPredictions.value = resultPredictions.value.map((item) => {
      if (item.playTypeCode === rule.subCode) {
        return {
          ...item,
          predict: newResult ?? []
        }
      }
      return item
    })
  }
  // Helper function to clear a rule
  function clearAllPredictions(): void {
    selectedPlayTypeCodes.value = []
    resultPredictions.value = []
  }
  function selectPlayTypeCode(subCode: string): void {
    selectedPlayTypeCodes.value.push(subCode)
    const rule = postPredictionRules.value.find((item) => item.subCode === subCode)
    if (rule) {
      resultPredictions.value.push({
        gameType: state.postGametypeRef!,
        name: rule.name,
        playTypeCode: subCode,
        predict: []
      })
    } else {
      console.error('玩法规则不存在', subCode, postPredictionRules.value)
    }
  }

  const getReviewSelectedListBy = (rule: LotteryRule, result: LotteryPredictionResult[]): string[] => {
    console.log('getReviewSelectedListBy', rule, result)
    const resultList = result.find((item) => item.playTypeCode === rule.subCode)?.predict.map((b) => b) ?? []
    console.log('resultList', resultList)
    return resultList
  }
  function deleteSinglePrediction(rule: LotteryRule): void {
    selectedPlayTypeCodes.value = selectedPlayTypeCodes.value.filter((item) => item !== rule.subCode)
    resultPredictions.value = resultPredictions.value.filter((item) => item.playTypeCode !== rule.subCode)
  }
  const disableSelectedCode = (subCode: string): boolean => {
    return selectedPlayTypeCodes.value.includes(subCode)
  }
  async function initialize(): Promise<void> {
    try {
      isLoading.value = true
      await loadPredictionRules()
    } catch (error) {
      ElMessage.error('获取玩法规则失败')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    predictionModeList,
    postPredictionRules,
    resultPredictions,
    selectedPlayTypeCodes,
    invalidInfo,
    selectedPredictionRules,
    predictionInvalid,
    disableSelectedCode,
    selectPlayTypeCode,
    loadPredictionRules,
    setPredictionInfoFrom,
    resetSinglePredictions,
    clearAllPredictions,
    initialize,
    getReviewSelectedListBy,
    deleteSinglePrediction
  }
}
