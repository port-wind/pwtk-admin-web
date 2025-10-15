<template>
  <el-form
    :label-position="labelPosition"
    label-width="auto"
    ref="formRef"
    :model="formData"
    :rule="rules"
    class="dialog-form"
    v-loading="isBettingDetailLoading"
  >
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="9" :offset="2">
        <el-form-item label=" ">
          <el-text style="color: red">*生效时间为次日的00:00:00</el-text>
        </el-form-item>
        <el-form-item label="玩法类型:" prop="playTypeCode" label-width="80px">
          <el-select v-model="formData.playTypeCode" placeholder="请投票类型" style="max-width: 140px">
            <el-option
              v-for="item in bettingStore.gameListTypeCode"
              :key="item.playTypeCode"
              :label="item.predictionTypeName"
              :value="item.playTypeCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="玩法规则:" prop="rule" v-if="game_detail">
          <el-text v-if="game_detail">{{ game_detail.other.game_rule }}</el-text>
        </el-form-item>
        <el-form-item label="" prop="rule_explain">
          <div class="rule_explain" v-html="ruleExplain"></div>
        </el-form-item>
      </el-col>

      <!-- 右列 -->
      <el-col :span="11" :offset="1">
        <el-form-item label="玩法状态:" prop="status">
          <el-radio-group :disabled="!formData.playTypeCode" v-model="formData.status" style="margin-right: 10px">
            <el-radio value="y">启用</el-radio>
            <el-radio value="n">关闭</el-radio>
          </el-radio-group>
          <el-text>{{ `(当前为${formData.status === 'y' ? '启用' : '关闭'}状态)` }}</el-text>
        </el-form-item>
        <el-form-item label="赔率设置" prop="betting_odds" class="betting_odds">
          <el-input v-model="formData.betting_odds" style="max-width: 130px; margin-right: 10px" />
          <el-text>(当前设定为5)</el-text>
        </el-form-item>
        <el-form-item label="参考内容:" prop="refer" v-if="game_detail">
          <el-text v-if="game_detail">{{ game_detail.other.rules }}</el-text>
        </el-form-item>

        <el-form-item
          v-if="zodiacList.length && game_detail"
          class="game_result_wrapper"
          prop="game_result"
          label-width="auto"
        >
          <div class="game_result_group">
            <div>{{ game_detail.other.selection }} :</div>
            <GameView :zodiac-list="zodiacList"></GameView>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="button-row">
    <el-button type="primary" :loading="isLoading" @click="onSubmit">提交</el-button>
  </div>
</template>
<script setup lang="ts">
import { reactive, watch, ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { FormInstance, FormProps, FormRules } from 'element-plus'
import { getGameDetailByPlayTypeCode, IGetGameDetailByPlayTypeCode, predictTypeEditStatus } from '@/api/betting'
import { IGameTypePlayDetailsData, IPredictTypeEditStatusBodyParameter } from '@/api/betting/types'
import showErrorMessage from '@/utils/showErrorMessage'
import GameView from '@/views/Betting/bettingList/components/gameView.vue'
const bettingStore = useBettingStore()
const isLoading = ref(false)
const isBettingDetailLoading = ref(false)
// 表单引用
const formRef = ref<FormInstance>()
const formData = reactive<IPredictTypeEditStatusBodyParameter>({
  playTypeCode: '',
  bizFlag: 't',
  status: 'n'
})
const labelPosition = ref<FormProps['labelPosition']>('left')
const zodiacList = ref<string[]>([])
const game_name = ref<string>('')
const game_rule = ref<string>('')
const rule = ref<string>('')
const ruleExplain = ref<string>('')
const game_rule_detail_name = ref<string>('「 」的玩法：') //「{{game_name}}」的玩法：
const refer_content = ref<string>('最少选择「 」个, 最多选择「 」个')

// 表单规则
const rules: FormRules = {
  playTypeCode: [{ required: true, message: '请选择一个玩法' }],
  status: [{ required: true, message: '请选择一个玩法状态' }]
}

const onSubmit = async () => {
  isLoading.value = true
  try {
    formRef.value?.validate(async (valid) => {
      if (valid) {
        const res = await predictTypeEditStatus(formData)
        if (res.success) {
          ElMessage({
            message: '更新好了',
            type: 'success'
          })
        } else {
          showErrorMessage(res)
        }
      } else {
        console.error('表单验证失败!')
      }
      isLoading.value = false
    })
  } catch (error) {
    console.error(error)
    isLoading.value = false
  } finally {
    isLoading.value = false
  }
}

watch(
  () => formData.playTypeCode,
  async () => {
    await getGameDetail()
  }
)

const getGameDetail = async () => {
  try {
    isBettingDetailLoading.value = true
    const data: IGetGameDetailByPlayTypeCode = {
      bizFlag: 't',
      playTypeCode: formData.playTypeCode
    }
    const res = await getGameDetailByPlayTypeCode(data)
    if (res.data) {
      zodiacList.value = res.data.optionList
      game_name.value = res.data.predictionTypeName
      ruleExplain.value = res.data.ruleExplain
      rule.value = res.data.rule
      game_rule_detail_name.value = `「${res.data.predictionTypeName}」的玩法:`
      refer_content.value = setRefer_content(res.data) // `'最少选择「 ${}」个,最多选择「${}」个'`
      game_rule.value = res.data.rule
      formData.status = res.data.status
    }
  } catch (error) {
    console.error(error)
  } finally {
    isBettingDetailLoading.value = false
  }
}

const game_detail = computed(() => {
  return bettingStore.gameListTypeCode.find((item) => item.playTypeCode === formData.playTypeCode)
})

const setRefer_content = (data: IGameTypePlayDetailsData) => {
  return `最少选择「${data.minCount}」个,最多选择「${data.maxCount}」个`
}

onMounted(() => {
  if (bettingStore.gameListTypeCode.length === 0) {
    bettingStore.getListPlayTypeCode()
  }
})

watch(
  () => game_detail.value,
  (newVal) => {},
  { deep: true }
)
</script>

<style lang="less" scoped>
.game_result_wrapper {
  padding: 10px;
  border: 1px solid grey;
}
.game_result_group {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
.game_list {
  padding-left: 0;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 20px;
  > li {
    background-color: green;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    display: inline-block;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    color: white;
  }
}
.container {
  display: flex;
  justify-content: space-between;
}
.left-column,
.right-column {
  width: 48%;
}
.details {
  margin-top: 20px;
}
.zodiac-options {
  display: flex;
  flex-direction: column;
}

.m-level-table-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.m-level-table-inside {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.rule_explain {
}
</style>
