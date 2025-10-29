<template>
  <!-- 匿名投票 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="postId" style="width: 200px">
          <el-input @keyup.enter="fetchData()" v-model="queryForm.postId" maxlength="64" placeholder="帖子ID" />
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
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import { reqHttpBBsForumList } from '@/api/bss/postContentManagement/index'
import { reqListUserVoteIssue, reqBbsForumListPostIssue } from '@/api/user/index'
import { dataSemantics } from '@/utils/dataSemantics'
import {
  IReqCommentsListData,
  IReqCommentsListQueryParams,
  IReqHttpBBsForumListData,
  IReqHttpBBsForumListQueryParams
} from '@/api/bss/postContentManagement/types'

import { reqCommentsList } from '@/api/bss/postContentManagement/index'
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
const initQueryForm = (): IReqHttpBBsForumListQueryParams => ({
  page: 1,
  size: 5,
  userId: '',
  postId: '',
  // postUserId: props.accountInfo!.cid,
  // postYear: '',
  // postIssue: null,
  // voteType: null,
  sortOrder: 'DESC',
  sortName: 'post_time'
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
    label: '帖子ID',
    slot: 'id'
  },
  {
    prop: 'title',
    label: '论坛名称'
  },
  {
    prop: 'postIssue',
    label: '期数',
    slot: 'issue'
  },
  {
    prop: 'postYear',
    label: '年份'
  },
  {
    prop: 'postContent',
    label: '评论内容',
    slot: 'issue'
  },
  {
    prop: 'attachments',
    label: '评论附件'
  }
]
const isLoading = ref(false)
const tableData = ref<IReqCommentsListData[]>([])
const queryRef = ref()
const total = ref<number>(0)
// const pageObj = ref(initPageObj())
const queryForm = reactive<IReqCommentsListQueryParams>(initQueryForm())
const addForm: any = ref(initForm())
const yearArray = ref(generateYearArray(2020, 2030))
const issueList = ref<string[]>()

//搜索
async function fetchData() {
  // console.log(queryForm.value)
  // isLoading.value = true
  queryForm.userId = props.accountInfo!.userId
  // queryForm.postId = props.accountInfo!.postId
  try {
    const query: IReqCommentsListQueryParams = {
      ...queryForm
    }
    let res = await reqCommentsList(query)
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

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  // fetchData()
}
const handleSizeChange = (val) => {
  queryForm.size = val
  // fetchData({ ...queryForm.value, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

//获取帖子全部用户期数列表
const getAllDeviceIssueList = async () => {
  let res = await reqBbsForumListPostIssue({})
  if (res.success) {
    issueList.value = res.data
  } else {
    showErrorMessage(res)
  }
}

onMounted(async () => {
  await getAllDeviceIssueList()
  await fetchData()
})

watch(
  () => [queryForm.size, queryForm.page],
  (newValue, oldValue) => {
    fetchData()
  }
)
</script>
