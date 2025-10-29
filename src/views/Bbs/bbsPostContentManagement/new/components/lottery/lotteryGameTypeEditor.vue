<template>
  <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden" v-if="waitingHit">
    <el-form
      v-bind="$attrs"
      :model="state"
      label-width="auto"
      ref="formRef"
      v-loading="isLoading"
      style="flex: 1; overflow: hidden auto"
    >
      <div :gutter="20" class="frame-wrapper-flex">
        <el-form-item label="玩法类型:" prop="predictionMode" style="margin-bottom: 5px">
          <div class="prediction-mode-wrapper">
            <el-select v-model="predictionMode" placeholder="请选择玩法类型" style="width: 50%">
              <el-option
                v-for="(item, index) in predictionModeList"
                :label="item.label"
                :value="item.value"
                :key="index"
                :disabled="disableSelectedCode(item.value)"
              />
            </el-select>
            <el-button
              type="primary"
              color="#09C160"
              style="color: white"
              :disabled="predictionMode === ''"
              @click="() => {
                selectPlayTypeCode(predictionMode!)
                predictionMode = ''
              }"
            >
              添加玩法
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="参考规则:" style="margin-bottom: 0"></el-form-item>
        <div style="flex: 1; display: flex; flex-direction: column; overflow: auto">
          <el-form-item label=" ">
            <ReviewLotteryBall
              v-for="(rule, index) in selectedPredictionRules"
              :key="index"
              :options="rule.optionList"
              :result="getReviewSelectedListBy(rule, resultPredictions)"
              :title="rule.name"
              :max="rule.optionCount"
              :min="rule.optionCount"
              :editable="true"
              @update:result="resetSinglePredictions(rule, $event as string[])"
              @delete="deleteSinglePrediction(rule)"
            ></ReviewLotteryBall>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="submit-wrapper">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" color="#FE646F" style="color: white" :disabled="predictionInvalid" @click="gameOn()">
        参赛
      </el-button>
    </div>
  </div>
  <LotteryStaticGamePage
    v-if="!waitingHit"
    @cancel="cancel"
    :postPrediction="postPredictionForStatic!"
    style="flex: 1"
  />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, reactive } from 'vue'
// import { CirclePlus } from '@element-plus/icons-vue'
import type { IUpdateBbsPostQueryParams } from '@/api/bss/postContentManagement/types'
import type { PostPrediction } from '@/views/Bbs/bbsPostContentManagement/new/components/staticGamePage.vue'
import { useLotteryParticipationLogic } from './useLotteryParticipationLogic'

const props = defineProps<{
  queryForm: IUpdateBbsPostQueryParams
}>()
const predictionMode = ref('')
const postPredictionForStatic = computed(
  () =>
    ({
      ...props.queryForm.postPrediction!,
      predictionDTOList: props.queryForm.lotteryPredictions ?? [],
      name: props.queryForm.postPrediction?.name!,
      openFlag: props.queryForm.openFlag!,
      gameTypeName: props.queryForm.postPrediction?.gameTypeName!,
      postYear: props.queryForm.postYear!,
      postIssue: props.queryForm.postIssue!
    } as PostPrediction)
)
const waitingHit = computed(() => postPredictionForStatic.value.openFlag === 'n')
const state = reactive({
  postGametypeRef: props.queryForm.postGametypeRef,
  forumId: props.queryForm.forumId
})
watch(
  () => [props.queryForm.postGametypeRef, props.queryForm.predictions],
  () => {
    state.postGametypeRef = props.queryForm.postGametypeRef
  },
  { deep: true }
)
const emit = defineEmits(['cancel', 'gameOn'])

// Use the composable to manage game logic
const {
  isLoading,
  predictionModeList,
  selectedPredictionRules,
  resultPredictions,
  predictionInvalid,
  disableSelectedCode,
  selectPlayTypeCode,
  resetSinglePredictions,
  initialize,
  setPredictionInfoFrom,
  getReviewSelectedListBy,
  deleteSinglePrediction
} = useLotteryParticipationLogic(state)

const cancel = () => {
  emit('cancel')
}
const gameOn = () => {
  if (predictionInvalid.value) {
    ElMessage.error('请检查预测信息')
    return
  }
  emit('gameOn', {
    predictions: resultPredictions.value
  })
}
// Initialize component on mount
onMounted(async () => {
  // 初始化字典
  await initialize()
  // 加载用户参赛的预测信息
  setPredictionInfoFrom(props.queryForm.lotteryPredictions)
})
</script>

<style scoped lang="less">
.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 10px 0;
}
.frame-wrapper-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 10%;
  overflow: hidden;
}
.prediction-mode-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}
/* Any additional styles specific to this component */
</style>
