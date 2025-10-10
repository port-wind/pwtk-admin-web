<template>
  <div v-show="!chooseLastFlag" v-loading="isLoading" style="display: flex; flex-direction: column; height: 100%">
    <el-form ref="ruleFormRef" :model="queryForm" :rules="rules" class="dialog-form">
      <el-row>
        <!-- 左边部分 -->
        <el-col :span="8" :offset="0">
          <el-form-item label="模拟用户:" prop="postUserId">
            <div class="field-wrapper">
              <SelectUserIdAndNickname
                v-model="queryForm.postUserId!"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
              />
              <el-link
                :type="queryForm.postUserId ? 'primary' : 'default'"
                class="btn-text"
                :disabled="!queryForm.postUserId"
                @click="toLoadLastPost"
              >
                上一期内容
              </el-link>
            </div>
          </el-form-item>
          <el-form-item label="彩种:" prop="gameType">
            <GameTypeList v-model="queryForm.gameType as unknown as string" withDefault />
          </el-form-item>
          <el-form-item label="卖料标题:" prop="predictTitle">
            <div class="field-wrapper">
              <el-input v-model="queryForm.predictTitle" placeholder="请输入标题"></el-input>
              <el-link
                :type="queryForm.postUserId ? 'primary' : 'default'"
                class="btn-text"
                :disabled="!queryForm.postUserId"
                @click="toLoadLastTitle"
              >
                上一期标题
              </el-link>
            </div>
          </el-form-item>
          <el-form-item label="查看积分:" prop="predictScore">
            <el-input-number v-model="queryForm.predictScore" :min="0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
        <!-- 右边部分 -->
        <el-col :span="10">
          <el-form-item label="游戏类型:" prop="playTypeCode">
            <el-select v-model="queryForm.playTypeCode" @change="onChangePlayTypeCode" placeholder="请投票类型">
              <el-option
                v-for="item in bettingStore.gameSubListTypeCode"
                :key="item.playTypeCode"
                :label="item.predictionTypeName"
                :value="item.playTypeCode"
              />
            </el-select>
            <!-- <GamePlayTypeCode :biz="BizFlag.Insight" placeholder="玩法类型" v-model="queryForm.playTypeCode" clearable /> -->
          </el-form-item>
          <el-form-item label="玩法种类:" prop="subPlayTypeCode">
            <el-select
              v-model="queryForm.subPlayTypeCode"
              @change="onChangeSubPlayTypeCode"
              placeholder="请投票类型"
              :disabled="!queryForm.playTypeCode"
            >
              <el-option
                v-for="item in subPlayTypeCodeList"
                :key="item.playTypeCode"
                :label="item.predictionTypeName"
                :value="item.playTypeCode"
              />
            </el-select>
            <!-- <GamePlayTypeCode :biz="BizFlag.Insight" placeholder="玩法类型" v-model="queryForm.playTypeCode" clearable /> -->
          </el-form-item>
          <el-form-item label="参考规则:">
            <el-text>{{ referContent }}</el-text>
          </el-form-item>
          <!-- prop="predict" -->
          <el-form-item v-if="zodiacData" label=" " class="game_result_wrapper" label-width="0">
            <GameBox v-if="zodiacData" @onSelect="onSelect" v-model="zodiacData"></GameBox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button-row">
      <el-button :loading="isLoading" @click="onClose">关闭</el-button>
      <el-button type="primary" :loading="isLoading" @click="onSubmit(ruleFormRef)">提交</el-button>
    </div>
  </div>
  <div v-if="chooseLastFlag" style="display: flex; flex-direction: column; height: 100%">
    <ChooseLastSale :lastList="lastList" @select="handleLoadLastPost" style="flex: 1; overflow: auto" />
    <div class="button-row">
      <el-button @click="chooseLastFlag = false">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useBettingStore } from '@/stores/bettingStore'
import { BizFlag } from '@/api/betting/types'
import showErrorMessage from '@/utils/showErrorMessage'
import GameBox from './gameBox.vue'
import { createPredictR } from '@/api/user'
import type { ICreatePredictRQueryParams } from '@/api/user/type'
import { getIpData } from '@/api'
import type { IListPlayTypeData } from '@/api/expert/sale-list/type'
import { lastIssuePrediction, predictSaleDetail } from '@/api/expert/sale-list'

const props = defineProps({
  predictId: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['onClose'])
const bettingStore = useBettingStore()
const isLoading = ref(false)
const chooseLastFlag = ref(false)
const lastList = ref<any[]>([])
const isOnlyTitle = ref(false)
// 表单引用
const ruleFormRef = ref<FormInstance>()
const initQueryForm = (): ICreatePredictRQueryParams => ({
  bizFlag: 'r',
  bizId: undefined,
  postUserId: undefined,
  gameType: undefined,
  playTypeCode: '',
  predictScore: 0,
  playTypeCheckNumberCode: undefined,
  predictTitle: '',
  predict: [],
  fromIp: '', // fromIp: await utils.getIpData(),
  subPlayTypeCode: ''
})
const queryForm = reactive<ICreatePredictRQueryParams>(initQueryForm())
const subPlayTypeCodeList = computed(() => {
  const subGameList = bettingStore.gameSubListTypeCode.filter((item) => item.playTypeCode === queryForm.playTypeCode)
  if (subGameList.length === 0) {
    return []
  }
  // subGameInfo must be one because playTypeCode is unique and playTypeCode is from the gameSubListTypeCode
  const subGameInfo = subGameList[0]
  if (subGameInfo?.children && subGameInfo.children.length > 0) {
    return subGameInfo.children.map((item) => ({
      playTypeCode: item.playTypeCode,
      predictionTypeName: item.predictionTypeName,
      maxCount: item.maxCount,
      minCount: item.minCount
    }))
  }
  return [subGameInfo]
})
const minCount = computed(() => {
  return subPlayTypeCodeList.value.find((item) => item.playTypeCode === queryForm.subPlayTypeCode)?.minCount || 0
})
const maxCount = computed(() => {
  return subPlayTypeCodeList.value.find((item) => item.playTypeCode === queryForm.subPlayTypeCode)?.maxCount || 0
})
const referContent = computed(() => {
  if (maxCount.value === 0) {
    return ''
  }
  if (minCount.value === maxCount.value) {
    return `请选择「${minCount.value}」个`
  }
  if (maxCount.value === 1) {
    return `请选择「1」个`
  }
  return `请最少选择「${minCount.value}」个 \n 最多选择「${maxCount.value}」个`
})
// 表单规则
const rules: FormRules = {
  postUserId: [{ required: true, message: '请选择一个用户', trigger: 'blur' }],
  predictTitle: [{ required: true, message: '请输入卖料标题', trigger: 'blur' }],
  playTypeCode: [{ required: true, message: '请选择游戏类型', trigger: 'blur' }],
  subPlayTypeCode: [{ required: true, message: '请选择玩法种类', trigger: 'blur' }],
  predict: [{ required: true, message: '最少选择「 1 」个', trigger: 'blur' }]
}

const onSelect = (value) => {
  // console.log('🚀 ~ onSelect ~ value:', value)
  queryForm.predict = value.map((item) => item.value)
}
const zodiacData = ref<IListPlayTypeData>()

const changeGameList = (playTypeCode: string) => {
  const res = bettingStore.gameSubListTypeCode.find((item) => item.playTypeCode === playTypeCode)
  if (res) {
    zodiacData.value = {
      ...res,
      minCount: minCount.value,
      maxCount: maxCount.value,
      optionList: (res.optionList as unknown as string[]).map((option: string) => ({
        value: option,
        label: option,
        active: false
      }))
    }
    // referContent.value = setReferContent(res)
  }
}
const loadLastPredict = (predict: string[]) => {
  zodiacData.value!.optionList = zodiacData.value!.optionList.map((item) => ({
    ...item,
    active: predict.includes(item.value)
  }))
}
const loadLastPost = async (lastData: any) => {
  const code = lastData.playTypeCode
  queryForm.postUserId = lastData.userId
  queryForm.gameType = lastData.gameType
  queryForm.predictTitle = lastData.predictTitle
  queryForm.playTypeCode = code
  queryForm.subPlayTypeCode = lastData.playTypeSubCode
  queryForm.predictScore = lastData.predictScore
  changeGameList(queryForm.playTypeCode)
  if (lastData.predict.length > 0) {
    queryForm.predict = lastData.predict
    loadLastPredict(lastData.predict as unknown as string[])
  }
  ElMessage({
    type: 'success',
    message: '已加载上一期数据'
  })
}
const loadTitle = (lastData: any) => {
  console.log('🚀 ~ loadTitle ~ lastData.predictTitle:', lastData.predictTitle)

  if (lastData.predictTitle) {
    queryForm.predictTitle = lastData.predictTitle
    ElMessage({
      message: '已加载上一期标题',
      type: 'success'
    })
  } else {
    ElMessage({
      message: '上一期标题内容为空',
      type: 'warning'
    })
  }
}
const handleLoadLastPost = (lastData: any) => {
  if (isOnlyTitle.value) {
    loadTitle(lastData)
  } else {
    loadLastPost(lastData)
  }
  chooseLastFlag.value = false
}

const autoSetContent = async () => {
  if (!queryForm.gameType) {
    ElMessage({
      message: '请先指定彩种',
      type: 'warning'
    })
    return
  }
  const query: any = {
    userId: queryForm.postUserId! as unknown as number,
    gameType: queryForm.gameType,
    page: 1,
    size: 100
  }
  try {
    // const res = (await lastIssuePrediction(query)) as any
    const res = (await lastIssuePrediction(query)) as any

    if (res.success) {
      lastList.value = (res.data.list as IListPlayTypeData[]) || []
    } else {
      ElMessage({
        message: '获取上一期内容失败',
        type: 'error'
      })
      return
    }
    if (lastList.value.length === 0) {
      ElMessage({
        message: '没有找到上一期内容',
        type: 'warning'
      })
      return
    }
    if (lastList.value.length === 1) {
      const lastPost = lastList.value[0]
      if (isOnlyTitle.value) {
        loadTitle(lastPost)
      } else {
        loadLastPost(lastPost)
      }
    } else {
      ElMessage({
        message: '找到多个上一期内容,请手动选择',
        type: 'warning'
      })
      chooseLastFlag.value = true
    }
  } catch (error) {
    console.error('Error loading previous content:', error)
    ElMessage({
      message: '加载上一期内容失败',
      type: 'error'
    })
  } finally {
  }
}
const toLoadLastPost = () => {
  isOnlyTitle.value = false
  autoSetContent()
}
const toLoadLastTitle = () => {
  isOnlyTitle.value = true
  autoSetContent()
}
const onChangeSubPlayTypeCode = () => {
  queryForm.predict = []
  const zData = zodiacData.value!
  zData.minCount = minCount.value
  zData.maxCount = maxCount.value
  zodiacData.value = { ...zData }
}
const onChangePlayTypeCode = (playTypeCode: string) => {
  queryForm.predict = []
  changeGameList(playTypeCode)

  nextTick(() => {
    if (subPlayTypeCodeList.value.length > 0) {
      queryForm.subPlayTypeCode = subPlayTypeCodeList.value[0].playTypeCode
    } else {
      queryForm.subPlayTypeCode = playTypeCode
    }
    onChangeSubPlayTypeCode()
  })
}

const onClose = () => {
  emits('onClose')
}
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  try {
    isLoading.value = true
    await formEl.validate(async (valid) => {
      if (queryForm.predict.length < zodiacData.value?.minCount!) {
        ElMessage({
          type: 'error',
          message: `最少选择「${zodiacData.value?.minCount}」个`
        })
        isLoading.value = false
        return
      }

      if (valid) {
        const ipInfo = await getIpData()
        console.log('🚀 ~ formRef.value?.validate ~ result:', ipInfo)
        const query: ICreatePredictRQueryParams = {
          ...queryForm,
          fromIp: ipInfo,
          playTypeCode: queryForm.subPlayTypeCode || queryForm.playTypeCode
        }
        const res = await createPredictR(query)
        if (res.success) {
          ElMessage({
            message: '创建好了',
            type: 'success'
          })
        } else {
          showErrorMessage(res)
        }

        onClose()
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

// watch(
//   () => queryForm.playTypeCode,
//   (newVal, oldVal) => {
//     // changeGameList(newVal)
//   }
// )

onMounted(async () => {
  console.log('mounted saleInfo')
  if (bettingStore.gameListTypeCode.length === 0) {
    await bettingStore.getListPlayTypeCode(BizFlag.Insight)
    await bettingStore.getlistPlayType()
  }
  if (props.predictId) {
    isLoading.value = true
    try {
      const res = await predictSaleDetail({ predictId: props.predictId })
      if (res?.success) {
        queryForm.postUserId = res.data.userId
        queryForm.gameType = res.data.gameType
        queryForm.predictTitle = res.data.predictTitle
        queryForm.playTypeCode = res.data.playTypeCode
        // onChangePlayTypeCode(queryForm.playTypeCode)
        queryForm.predict = []
        changeGameList(queryForm.playTypeCode)

        nextTick(() => {
          queryForm.subPlayTypeCode = res.data.playTypeSubCode
          onChangeSubPlayTypeCode()
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
    return
  }

  if (bettingStore.gameListTypeCode.length > 0) {
    queryForm.playTypeCode = bettingStore.gameListTypeCode[0].playTypeCode
    onChangePlayTypeCode(queryForm.playTypeCode)
  } else {
    console.error('没有找到游戏类型')
  }
})

// postUserId   predictTitle   playTypeCode   predict
// 验证表单
watch(
  () => [queryForm.postUserId, queryForm.predictTitle, queryForm.playTypeCode, queryForm.predict],
  (newVal, oldVal) => {
    if (oldVal) {
      if (newVal[0] !== oldVal[0]) {
        ruleFormRef.value?.validateField('postUserId')
      }
      if (newVal[1] !== oldVal[1]) {
        ruleFormRef.value?.validateField('predictTitle')
      }
      if (newVal[2] !== oldVal[2]) {
        ruleFormRef.value?.validateField('playTypeCode')
      }
      if (newVal[3] !== oldVal[3]) {
        ruleFormRef.value?.validateField('predict')
      }
    }
  }
)
</script>

<style lang="less" scoped>
.game_result_wrapper {
  border: 1px solid grey;
  padding: 10px;
  border: 1px solid grey;
  margin-left: 125px;
  padding: 0;

  .el-form-item__label {
    column-rule-color: red;
    margin: 0;
    padding: 0;
  }
}
.game_list {
  padding-left: 0;
  padding-top: 10px;
  padding-bottom: 10px;
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

.field-wrapper {
  display: flex;
  flex: 1;
  column-gap: 10px;
}
.btn-text {
  white-space: nowrap;
}
</style>
