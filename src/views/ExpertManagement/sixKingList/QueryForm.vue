<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'

interface IProps {
  currentTabs: string
}
const props = defineProps<IProps>()
const emits = defineEmits(['onSubmit', 'onReset'])

const ruleFormRef = ref()
const isLoading = ref(false)
const rules = reactive({
  // gameType: [{ required: true, message: '请选择彩种', trigger: 'blur' }],
  // startIssue: [{ required: true, message: '请添加开始期数', trigger: 'blur' }],
  // endIssue: [{ required: true, message: '请添加结束期数', trigger: 'blur' }],
  // playTypeCode: [{ required: true, message: '请选择一个游戏类型', trigger: 'blur' }]
})

const config = {
  sixking: ['gameType', 'userId', 'nickname', 'playTypeCode', 'startIssue', 'endIssue'],
  winning: ['gameType', 'loginOrUserId', 'nickname', 'playTypeCode', 'sortName'],
  history: ['gameType', 'userId', 'nickname', 'issue'],
  expert: ['gameType', 'issue', 'playTypeCode']
}

const isShow = (key) => {
  if (props.currentTabs) {
    const flag = config[props.currentTabs].includes(key)
    return flag
  }
}

const sortOrderList = ref([
  { label: '最近连胜', value: 'recent_continue_win_count' },
  { label: '按时间', value: 'update_time' },
  { label: '查看数', value: 'predict_read_number' }
])

const sixKingListPage = useSixKingListPageStore()

const onChange = (val) => {
  sixKingListPage.changeGameType(val)
  // sixKingListPage.queryForm.startIssue = ''
  // sixKingListPage.queryForm.endIssue = ''
  // sixKingListPage.queryForm.issue = ''
}

const template1 = computed(() => sixKingListPage.currentGameTypeCode?.playTypeCode)
const template2 = ref('')

const inital = ref({
  startIssue: '',
  endIssue: '',
  issue: '',
  gameType: '',
  nickname: '',
  page: 1,
  playTypeCode: '',
  size: 15,
  sortName: 'recent_continue_win_count', // OR 'recent_continue_win_count'
  sortOrder: 'DESC',
  userId: '',
  isAll: true,
  loginOrUserId: ''
})
const handleReset = () => {
  if (sixKingListPage.currentTabs === 'winning_streak_rank') {
    inital.value.sortName = 'recent_continue_win_count'
  }
  sixKingListPage.handleReset(inital.value)
  sixKingListPage.initSixKingListPage(() => {
    emits('onReset', inital.value)
  })
}

const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      emits('onSubmit')
    } else {
      throw new Error('表单验证失败')
    }
  })
}

// 初始化值
watch(
  () => [
    sixKingListPage.queryForm.gameType,
    sixKingListPage.queryForm.playTypeCode,
    sixKingListPage.queryForm.endIssue,
    sixKingListPage.queryForm.startIssue,
    sixKingListPage.queryForm.issue
  ],
  (newVal) => {
    if (newVal[0] && !inital.value.gameType) {
      inital.value.gameType = newVal[0]
    }
    if (newVal[1] && !inital.value.playTypeCode) {
      inital.value.playTypeCode = newVal[1]
    }
    if (newVal[2] && !inital.value.endIssue) {
      inital.value.endIssue = newVal[2]
    }
    if (newVal[3] && !inital.value.startIssue) {
      inital.value.startIssue = newVal[3]
    }
    if (newVal[4] && !inital.value.issue) {
      inital.value.issue = newVal[4]
    }
  },
  { immediate: true }
)
</script>

<template>
  <el-form
    class="custom-el-form"
    :inline="true"
    :model="sixKingListPage.queryForm"
    label-width="70px"
    ref="ruleFormRef"
    :rules="rules"
    @keyup.enter="confirm(ruleFormRef)"
    v-loading="isLoading"
  >
    <el-form-item label="" prop="gameType" v-if="isShow('gameType')">
      <el-select
        v-model="sixKingListPage.queryForm.gameType"
        @change="onChange"
        placeholder="彩种"
        style="width: 170px"
      >
        <el-option
          v-for="item in sixKingListPage.labelOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="loginOrUserId" v-if="isShow('loginOrUserId')">
      <AutoChoseLoginId v-model="sixKingListPage.queryForm.loginOrUserId" style="width: 170px" />
    </el-form-item>
    <el-form-item label="" prop="userId" v-if="isShow('userId')">
      <AutoChoseLoginId v-model="sixKingListPage.queryForm.userId" style="width: 170px" />
    </el-form-item>
    <el-form-item label="" prop="nickname" v-if="isShow('nickname')">
      <AutoChoseNickname v-model="sixKingListPage.queryForm.nickname" placeholder="用户昵称" style="width: 120px" />
    </el-form-item>
    <el-form-item label="" prop="playTypeCode" v-if="isShow('playTypeCode')">
      <input v-model="sixKingListPage.queryForm.playTypeCode" hidden />
      <!--  -->
      <el-select
        placeholder="游戏类型"
        v-model="sixKingListPage.temp1PlayTypeCode"
        @change="
          (value) => {
            sixKingListPage.temp1PlayTypeCode = value
            sixKingListPage.changePlayTypeCode(1, value)
          }
        "
        clearable
        style="width: 170px"
      >
        <el-option
          v-for="item in sixKingListPage.gameListTypeCode"
          :key="item.playTypeCode"
          :label="item.predictionTypeName"
          :value="item.playTypeCode"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item label="" prop="playTypeCode" v-if="isShow('playTypeCode') && props.currentTabs !== 'expert'">
      <el-select
        placeholder="玩法种类"
        v-model="sixKingListPage.temp2PlayTypeCode"
        clearable
        style="width: 100px"
        :disabled="sixKingListPage.temp1PlayTypeCode && sixKingListPage.playTypeCodeList?.length === 0"
        @change="
          (value) => {
            sixKingListPage.temp2PlayTypeCode = value
            sixKingListPage.changePlayTypeCode(2, value)
          }
        "
      >
        <el-option
          v-for="item in sixKingListPage.playTypeCodeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item> -->
    <el-form-item label="" prop="startIssue" v-if="isShow('startIssue')">
      <el-select v-model="sixKingListPage.queryForm.startIssue" placeholder="开始期数" style="width: 144px">
        <el-option
          v-for="item in sixKingListPage.issueList[sixKingListPage.queryForm.gameType]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="endIssue" v-if="isShow('endIssue')">
      <el-select v-model="sixKingListPage.queryForm.endIssue" placeholder="结束期数" style="width: 144px">
        <el-option
          v-for="item in sixKingListPage.issueList[sixKingListPage.queryForm.gameType]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="issue" v-if="isShow('issue')">
      <el-select v-model="sixKingListPage.queryForm.issue" placeholder="请选择结束期数" style="width: 144px">
        <el-option
          v-for="item in sixKingListPage.issueList[sixKingListPage.queryForm.gameType]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="sortName" v-if="isShow('sortName')">
      <el-select placeholder="排序" v-model="sixKingListPage.queryForm.sortName" style="width: 140px">
        <el-option v-for="item in sortOrderList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="
          (evt) => {
            confirm(ruleFormRef)
          }
        "
      >
        <el-icon style="margin: 0 5px 0 0">
          <Search />
        </el-icon>
        查询
      </el-button>
      <el-button type="primary" @click="handleReset" plain>
        <el-icon style="margin: 0 5px 0 0">
          <Refresh />
        </el-icon>
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less" scoped></style>
