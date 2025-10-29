<template>
  <!-- 匿名投票 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="postId" style="width: 200px">
          <el-input @keyup.enter="fetchData()" v-model="queryForm.postId" maxlength="64" placeholder="报纸ID" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <GameTypeList v-model="queryForm.gameType" />
        </el-form-item>
        <el-form-item label="" prop="postIssue">
          <el-select v-model="queryForm.postIssue" placeholder="期数" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in issueList" :key="key" :value="value" :label="'第' + value + '期'" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.postYear" placeholder="年份" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in yearArray" :key="key" :value="value" :label="value" />
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <!-- :tableHeight="count(queryRef).toString()" -->
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSizes="[5, 15, 30, 50, 100]"
      >
        <template #id="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.postId }}
            </span>
            <copy v-if="scope.row.postId != ''" :content="scope.row.postId"></copy>
          </p>
        </template>
        <template #issue="{ scope }">
          <p>第{{ scope.row.postIssue }}期</p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameNameByGameTypeCode(scope.row.postGametypeRef) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import { useBettingStore } from '@/stores/bettingStore'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import {
  IReqNewspaperIssuePostListData,
  IReqNewspaperIssuePostListQueryParams,
  reqNewspaperIssuePostList
} from '@/api/user/index'
import { reqListUserVoteIssue, reqListPostIssue } from '@/api/user/index'
import { dataSemantics } from '@/utils/dataSemantics'
import GameTypeList from '@/components/gameTypeList/index.vue'
import { IGameType } from '@/api/global/types'
const props = defineProps({
  accountInfo: {
    type: Object
  },
  reqType: {
    type: String,
    default: null,
    request: true
  }
})
function generateYearArray(start, end) {
  let years: number[] = []
  for (let i = start; i <= end; i++) {
    years.push(i)
  }
  return years
}
const initQueryForm = (): IReqNewspaperIssuePostListQueryParams => ({
  page: 1,
  size: 5,
  postUserId: props.accountInfo!.cid,
  sortName: 'post_time',
  sortOrder: 'DESC',
  postGametypeRef: '3995',
  postYear: '2025'
  // postId: '',
  // postYear: null,
  // postIssue: null,
  // userId: ''
})

const initForm = () => ({
  componentName: '',
  componentType: '',
  sketchCodeList: [],
  memo: ''
})

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'postId',
    label: '报纸ID',
    slot: 'id'
  },
  {
    prop: 'newspaperName',
    label: '报纸名称'
  },
  {
    prop: 'postIssue',
    label: '期数',
    slot: 'issue'
  },
  {
    prop: 'postGametypeRef',
    label: '彩种',
    slot: 'gameType'
  },
  {
    prop: 'postYear',
    label: '年份'
  },
  {
    prop: 'postContent',
    label: '评论内容'
  },
  {
    prop: 'attachments',
    label: '评论附件'
  }
]
const isLoading = ref(false)
const tableData = ref<IReqNewspaperIssuePostListData[]>([])
const queryRef = ref()
const total = ref<number>(0)
// const pageObj = ref(initPageObj())
const queryForm = reactive<IReqNewspaperIssuePostListQueryParams>(initQueryForm())
const addForm: any = ref(initForm())
const yearArray = ref(generateYearArray(2020, 2030))
const issueList = ref<string[]>()
const bettingStore = useBettingStore()

//搜索
async function fetchData() {
  isLoading.value = true
  // console.log(queryForm)
  // queryForm.userId = props.accountInfo!.userId
  queryForm.postUserId = props.accountInfo!.userId
  try {
    const query: IReqNewspaperIssuePostListQueryParams = {
      ...queryForm
    }
    let res = await reqNewspaperIssuePostList(query)
    tableData.value = res.data.list
    total.value = res.data.total
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const onSelect = (val: IGameType | undefined) => {
  if (!val) {
    //@ts-ignore
    queryForm.postGametypeRef = 'L'
    return
  }
  queryForm.postGametypeRef = +val.gameType
}

const getGameNameByGameTypeCode = (gameTypeCode) => {
  const res = bettingStore.gameType.find((item) => {
    return +item.gameType === gameTypeCode
  })
  return res?.gameTypeName
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}
const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

//获取图库全部用户期数列表
const getAllDeviceIssueList = async () => {
  let res = await reqListPostIssue({})
  if (res.success) {
    issueList.value = res.data
    console.log('issueList.value', res.data)
  } else {
    showErrorMessage(res)
  }
}

onMounted(() => {
  getAllDeviceIssueList()
  fetchData()
})
watch(
  () => [queryForm.page, queryForm.size],
  (newValue, oldValue) => {
    fetchData()
  }
)
</script>
