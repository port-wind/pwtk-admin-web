<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import type { ICreateBbsPostQueryParams, IUpdateBbsPostQueryParams } from '@/api/bss/postContentManagement/types'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { getIssueListByParams } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
import { useBettingStore } from '@/stores/bettingStore'

export interface ExposeBBSPostForm {
  validateForm: () => Promise<{ valid: boolean; fields: any }>
  resetForm: () => void
}
const props = defineProps<{
  queryForm: ICreateBbsPostQueryParams | IUpdateBbsPostQueryParams
  initialForm: ICreateBbsPostQueryParams | IUpdateBbsPostQueryParams
  showLastContent: boolean
  mode?: 'edit' | 'add'
}>()
const state = reactive<ICreateBbsPostQueryParams | IUpdateBbsPostQueryParams>(props.queryForm)
const routes = useRoute()
const isBBSManagement = computed(() => routes.path.includes('bbsPostContentList'))
// 竞猜推荐论坛
const isBBSForLottery = computed(
  () => routes.path.includes('/bbsPostContentList/lottery') || state.forumId === 'lottery'
)
const mode = computed(() => props.mode || 'add')
const rules = reactive<FormRules<ICreateBbsPostQueryParams>>({
  userId: [{ required: true, message: '发布用户ID不能为空', trigger: 'change' }],
  forumId: [{ required: true, message: '论坛ID不能为空', trigger: 'change' }],
  postGametypeRef: [{ required: true, message: '彩种不能为空', trigger: 'change' }],
  postYear: [{ required: true, message: '发布年份不能为空', trigger: 'change' }],
  postIssue: [{ required: true, message: '发布期数不能为空', trigger: 'change' }]
})
const emit = defineEmits(['autoSetContent', 'reloadGame', 'update:queryForm'])
const bettingStore = useBettingStore()
const gameType = computed(() => state.postGametypeRef)
const year = computed(() => state.postYear)
const formRef = ref<FormInstance>()
const gameTypeList = computed(
  () => bettingStore.gameType.map((item) => ({ value: item.gameType, label: item.gameTypeName })) || []
)
const loadIssueOptions = async (gType: string, _year: string) => {
  let GameIssueList = []
  if (!gType || !_year) {
    GameIssueList = []
    return
  }
  try {
    const response = await getIssueListByParams({ gameType: gType, year: _year })

    if (!response?.success) {
      GameIssueList = []
      showErrorMessage(response)
      return
    }

    GameIssueList =
      response?.data?.map((item: string) => ({
        value: item,
        label: item
      })) || []
  } catch (error) {
    console.error('Failed to fetch issue options:', error)
    GameIssueList = []
  }
  return GameIssueList
}
async function loadIssueValue(params: { gameType: string; year: string }, withValue = true) {
  const gameIssueList = (await loadIssueOptions(params.gameType, params.year)) as Array<{
    value: string
    label: string
  }>
  if (!gameIssueList?.length) return
  if (!withValue) return
  state.postIssue = gameIssueList[0]?.value || ''
}
watch(
  () => ({ gameType: gameType.value, year: year.value }),
  async (newParams) => {
    await loadIssueValue({ gameType: newParams.gameType!, year: newParams.year! }, false)
  },
  { immediate: true }
)
watch(
  () => state,
  (newParams) => {
    emit('update:queryForm', { ...newParams })
  }
)
defineExpose({
  async validateForm() {
    if (!formRef.value) return { valid: false, fields: null }
    let result = { valid: false, fields: null }
    await formRef.value.validate((valid, _) => {
      result = { valid, fields: null }
    })
    return result
  },
  resetForm() {
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }
} as ExposeBBSPostForm)
const handleAutoSetContent = (type: 'image' | 'title' | 'content') => {
  emit('autoSetContent', type)
}
const forumIdChange = (val: string) => {
  emit('reloadGame', state.postGametypeRef!, val)
}

const gameTypeChange = async (val: any) => {
  console.log(val)
  state.postIssue = ''
  await loadIssueValue({ gameType: val?.gameType, year: state.postYear! })
  emit('reloadGame', val?.gameType, state.forumId!)
}
const yearChange = async (val: any) => {
  state.postIssue = ''
  await loadIssueValue({ gameType: state.postGametypeRef!, year: val })
}
onMounted(async () => {
  Object.assign(state, { ...props.queryForm })
  await loadIssueValue({ gameType: state.postGametypeRef!, year: state.postYear! })
  await bettingStore.getGameType()
})
</script>

<template>
  <el-form v-bind="$attrs" :model="queryForm" label-width="auto" :rules="rules" ref="formRef">
    <el-row style="flex-direction: column">
      <el-col :span="mode === 'add' ? 24 : 24">
        <el-row v-if="mode === 'add'" style="flex-direction: column; width: 75%">
          <el-form-item label="论坛ID:" prop="forumId">
            <SelectForumID
              :disabled="isBBSManagement"
              v-model="queryForm.forumId!"
              @onSelect="val => forumIdChange(val!)"
            />
          </el-form-item>
          <el-form-item label="发布用户ID:" prop="userId">
            <SelectUserIdAndNickname
              v-model="state.userId!"
              id="userId"
              :group="['nickname', 'loginId']"
              placeholder="用户昵称｜帐号"
            />
          </el-form-item>
          <el-form-item v-if="!isBBSForLottery" label="帖子标题:" prop="title" style="position: relative">
            <el-input v-model="state.title" type="info" maxlength="18" />
            <!-- <el-link
              type="primary"
              :disabled="!state.userId"
              :class="{ 'prev-period-btn': true, disable: !state.userId }"
              @click="handleAutoSetContent"
              v-if="props.showLastContent"
            >
              上一期内容
            </el-link> -->
            <el-dropdown v-if="props.showLastContent" :class="{ 'prev-period-btn': true }">
              <el-button class="ml-12px" type="success" :icon="UploadFilled" plain>加载</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="() => handleAutoSetContent('image')">加载上一期图片</el-dropdown-item>
                  <el-dropdown-item @click="() => handleAutoSetContent('title')">加载上一期标题</el-dropdown-item>
                  <el-dropdown-item @click="() => handleAutoSetContent('content')">加载上一期内容</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>

          <el-form-item label="彩种:" prop="postGametypeRef">
            <GameTypeList
              v-model="queryForm.postGametypeRef!"
              withDefault
              @defaultLoaded="
                () => {
                  Object.assign(props.initialForm, { postGametypeRef: queryForm.postGametypeRef })
                }
              "
              @onSelect="val => gameTypeChange(val!)"
            />
            <el-dropdown v-if="isBBSForLottery && props.showLastContent" :class="{ 'prev-period-btn': true }">
              <el-button class="ml-12px" type="success" :icon="UploadFilled" plain>加载</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>加载上一期图片</el-dropdown-item>
                  <el-dropdown-item disabled>加载上一期标题</el-dropdown-item>
                  <el-dropdown-item @click="() => handleAutoSetContent('content')">加载上一期内容</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="发布年份:" prop="postYear">
            <el-select v-model="queryForm.postYear!" placeholder="" @change="yearChange">
              <el-option v-for="(item, index) in YearTypes" :label="item.label" :value="item.value" :key="index" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布期数:" prop="postIssue">
            <SelectIssueByYear v-model="state.postIssue" :year="state.postYear" :gameType="state.postGametypeRef!" />
          </el-form-item>
          <el-form-item label="游戏标记:" prop="postGameRef">
            <el-input v-model="state.postGameRef" type="info" />
          </el-form-item>
        </el-row>
        <el-row v-if="mode === 'edit'" style="flex-direction: column; width: 75%">
          <el-form-item label="帖子 | ID:">
            {{ truncateText(state.title!) }} | {{ truncateText(state.postId!, 20) }}
            <copy v-if="state.postId" :content="state.postId" />
          </el-form-item>
          <el-form-item label="论坛 | ID:">
            {{ truncateText(state.forumName!) }} | {{ truncateText(state.forumId!, 20) }}
            <copy v-if="state.forumId" :content="state.forumId" />
          </el-form-item>
          <el-form-item label="发布用户ID:" prop="userId">
            <SelectUserIdAndNickname
              v-model="state.userId!"
              id="userId"
              :group="['nickname', 'loginId']"
              placeholder="用户昵称｜帐号"
            />
          </el-form-item>
          <el-form-item label="彩种:" prop="postGametypeRef">
            {{ gameTypeList.find((item) => item.value === state.postGametypeRef)?.label || '' }}
          </el-form-item>
          <el-form-item label="游戏标记:" prop="postGameRef">
            <el-input v-model="state.postGameRef" type="info" />
          </el-form-item>
          <el-form-item label="发布年份 | 期数:">
            <div style="display: flex; align-items: center; flex-grow: 1">
              {{ truncateText(state.postYear ?? '') }} | {{ truncateText(state.postIssue ?? '') }}
            </div>
          </el-form-item>
          <el-form-item label="阅读｜回复数量:">
            {{ truncateText(state.readCount?.toString() ?? '0') }} |
            {{ truncateText(state.threadCount?.toString() ?? '0') }}
          </el-form-item>
          <el-form-item label="点赞｜收藏数量:">
            {{ truncateText(state.likeCount?.toString() ?? '0') }} |
            {{ truncateText(state.favoriteCount?.toString() ?? '0') }}
          </el-form-item>
          <el-form-item label="发布时间:" prop="postTime">
            <span>{{ unitFormatDate(state.postTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
          </el-form-item>
        </el-row>
        <el-row style="flex-direction: row">
          <el-col :span="14">
            <el-form-item label="帖子状态:" prop="postStatus">
              <span v-if="state.postStatus === 'i'">审核中</span>
              <el-radio-group v-model="state.postStatus" v-else>
                <el-radio :value="'y'">开启</el-radio>
                <el-radio :value="'n'">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="投票:" prop="isVote">
              <el-radio-group v-model="state.isVote">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="匿名回复:" prop="enableAnonymous">
              <el-radio-group v-model="state.enableAnonymous">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="可见标记:" prop="viewFlag">
              <el-radio-group v-model="state.viewFlag">
                <el-radio :value="'a'">所有可见</el-radio>
                <el-radio :value="'u'">用户可见</el-radio>
                <el-radio :value="'r'">关注可见</el-radio>
                <el-radio :value="'f'">好友可见</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="置顶:" prop="isTop">
              <el-radio-group v-model="state.isTop">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="精选:" prop="isSelected">
              <el-radio-group v-model="state.isSelected">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="热门:" prop="isHot">
              <el-radio-group v-model="state.isHot">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="爆款:" prop="isBloom">
              <el-radio-group v-model="state.isBloom">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="推荐:" prop="isRecommended">
              <el-radio-group v-model="state.isRecommended">
                <el-radio :value="'y'">是</el-radio>
                <el-radio :value="'n'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="less">
.prev-period-btn {
  color: #4646f2;
  position: absolute;
  right: -7rem;
  top: 0;
}

.prev-period-btn.disable {
  color: grey;
}
</style>
