<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        @keyup.enter="fetchData({ page: 1 })"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
      >
        <el-form-item label="" prop="postContent">
          <el-input v-model.trim="queryForm.postContent" placeholder="评论内容" style="width: 130px" />
        </el-form-item>
        <el-form-item label="" prop="postId">
          <el-input v-model.trim="queryForm.postId" placeholder="帖子ID" style="width: 140px" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <GameTypeList
            :show-total="true"
            placeholder="彩种"
            v-model="queryForm.postGametypeRef as unknown as string"
            allGame
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="" prop="postYear">
          <el-select v-model="queryForm.postYear" placeholder="年份" style="width: 100px">
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="postIssue">
          <el-input v-model.trim="queryForm.postIssue" placeholder="期数" style="width: 140px" />
        </el-form-item>
        <el-form-item label="" prop="userId">
          <SelectUserIdAndNickname
            v-model="queryForm.postUserId as unknown as string"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="发布用户｜帐号"
            style="width: 165px"
          />
        </el-form-item>
        <el-form-item label="" prop="flag">
          <SelectTagList v-model="queryForm.tagId!" placeholder="用户标签" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="postStatus">
          <el-select v-model="queryForm.postStatus" placeholder="状态" style="width: 90px">
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="forumId">
          <el-input v-model.trim="queryForm.forumId" placeholder="论坛ID" style="width: 140px" />
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="tableRef" :numVisibleItems="6"></ExpandableSection>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
          <template v-if="showMultiOptions">
            <span class="ml-12px" style="margin-left: 10px">批量:</span>
            <el-button class="ml-12px" type="success" plain @click="handleBatch('y')">开启</el-button>
            <el-button type="danger" plain @click="handleBatch('n')">关闭</el-button>
          </template>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :multi-select="true"
        :multi-select-logic="multiSelectLogic"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #title="{ scope }">
          <div v-if="scope.row.title" style="display: flex">
            <span class="post-content g-text-nowrap-ellipsis">
              {{ scope.row.title }}
            </span>
            <!-- <copy :content="scope.row.title" /> -->
          </div>
        </template>
        <template #forumName="{ scope }">
          <el-link
            :title="scope.row.forumName"
            class="like-a text-ellipsis"
            @click="handleForumEdit(scope.row.forumId)"
          >
            {{ scope.row.forumName }}
          </el-link>
        </template>
        <template #nickname="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row.postUserId)">
            {{ truncateText(scope.row.loginId) }} | {{ scope.row.nickname }}
          </p>
        </template>
        <template #postContent="{ scope }">
          <SimplePopover v-model="scope.row.postContent"></SimplePopover>
        </template>
        <template #postStatus="{ scope }">
          <el-switch
            class="switch-custom"
            v-model="scope.row.postStatus"
            :loading="isLoading"
            active-value="y"
            inactive-value="n"
            :inactive-text="scope.row.postStatus === 'y' ? '启用' : '关闭'"
            @change="(val) => onchange(scope.row, val)"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
        <template #postTime="{ scope }">
          {{ unitFormatDate(scope.row.postTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
  </section>

  <!-- 报纸名称 -->
  <modalForumSeries @refreshPage="fetchData" />
  <!-- 发布用户 -->
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { Search, Refresh } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { options } from '@/views/Bbs/bbsCommentsList/data'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import modalForumSeries from '@/components/modalCommon/forumSeriesModal/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import count from '@/utils/tableHeight'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat'
import type {
  IReqBbsCommentListPostIssueData,
  IReqBbsCommentListPostIssueQueryParams,
  IReqBbsCommentStatusPostIssueQueryParams
} from '@/api/user/type'
import { useModalsStore } from '@/stores/modalStore'
import { reqBbsCommentListPostIssue, reqBbsCommentStatusPostIssue } from '@/api/user'
import ExpandableSection from '@/components/expandIcon/index.vue'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'
import { onchangeForMultiSelect } from '../bbsPostContentManagement/data'

const modalsStore = useModalsStore()
const isExpanded = ref(false)
const tableRef = ref()
const queryRef = ref()
const tableData = ref<IReqBbsCommentListPostIssueData[]>([])

const total = ref<number>(0)

const initFormQuery = (): IReqBbsCommentListPostIssueQueryParams => {
  return {
    page: 1,
    size: 15,
    sortName: 'create_time',
    sortOrder: 'DESC',
    postGametypeRef: 0,
    tagId: '',
    postUserId: '',
    postId: '',
    postYear: '',
    postIssue: '',
    startTime: '',
    endTime: '',
    postContent: ''
  }
}

const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'postId',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  }
})
const showMultiOptions = computed(() => {
  return multiSelectLogic.isAllSelected.value || multiSelectLogic.isIndeterminate.value
})
const queryForm = reactive<IReqBbsCommentListPostIssueQueryParams>(initFormQuery())

//loading 按钮
const isLoading = ref(false)
//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IReqBbsCommentListPostIssueQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqBbsCommentListPostIssueQueryParams = {
      ...queryForm,
      ..._queryForm
    }

    if (queryForm.postGametypeRef === 0) {
      delete query.postGametypeRef
    }

    if (query.postId === '') {
      delete query.postId
    }

    if (query.postUserId === '') {
      delete query.postUserId
    }

    if (query.tagId === '') {
      delete query.tagId
    }

    if (query.forumId === '') {
      delete query.forumId
    }
    if (query.postYear === '') {
      delete query.postYear
    }
    if (query.postIssue === '') {
      delete query.postIssue
    }

    const response = await reqBbsCommentListPostIssue(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const handleSizeChange = (val: number) => {
  queryForm.size = val
  queryForm.page = 1
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

const handleForumEdit = (forumId: any) => {
  // forumId.value = scope.row.forumId
  modalsStore.showModal('forumSeriesModal')
  modalsStore.setModalData('forumSeriesModal', {
    // forumId: forumId.value
    forumId
  })
  // forumDialogVisible.value = true
}

// 用户详情
const handTabs = (userId: string) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId
  })
  modalsStore.showModal('userInfoModal')
}

// 更新状态
const onchange = async (row, val) => {
  console.log('🚀 ~ beforeChange ~ val:', row, val)
  try {
    if (row.postId) {
      isLoading.value = true
      const query: IReqBbsCommentStatusPostIssueQueryParams = {
        postId: row.postId,
        status: val
      }
      const response = await reqBbsCommentStatusPostIssue(query)
      if (response.success) {
        fetchData()
        ElMessage.success('操作成功')
      } else {
        showErrorMessage(response)
      }
    }
  } catch (error) {}
}

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initFormQuery())
  fetchData()
}
const handleBatch = async (openStatus: 'y' | 'n') => {
  console.log('handleBatchOpen')
  const { selectedKeys } = multiSelectLogic.getSelectedData(tableData.value)
  console.log('selectedKeys', selectedKeys)

  if (selectedKeys.length === 0) {
    ElMessage.warning(`请选择要${openStatus === 'y' ? '开启' : '关闭'}的评论`)
    return
  }

  try {
    isLoading.value = true

    // Use Promise.all for parallel execution with proper error handling
    await onchangeForMultiSelect(selectedKeys, openStatus)

    ElMessage.success(`成功${openStatus === 'y' ? '开启' : '关闭'} ${selectedKeys.length} 个评论`)
    await fetchData() // Refresh data after successful operation
    multiSelectLogic.clearSelection(tableData.value) // Clear selection after operation
  } catch (error) {
    console.error('Error batch open:', error)
    ElMessage.error(`批量${openStatus === 'y' ? '开启' : '关闭'}操作失败，请重试`)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}
.post-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  height: 24px;
}
.post-content p {
  // background-color: transparent;
  // width: 100%;
  // display: inline-block;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
  background-color: transparent;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.post-content span {
  background-color: transparent;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.switch-custom .el-switch__label.is-active {
  color: #303133;
}
</style>
