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
          <el-input v-model.trim="queryForm.postContent" placeholder="评论内容" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份" style="width: 100px">
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="issue">
          <el-input v-model.trim="queryForm.issue" placeholder="期数" style="width: 100px" />
        </el-form-item>
        <el-form-item label="" prop="issueName">
          <el-input v-model.trim="queryForm.issueName" placeholder="图纸名称" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="userId">
          <SelectUserIdAndNickname
            v-model="queryForm.userId as unknown as string"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="发布用户｜帐号"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="" prop="newspaperName">
          <el-input v-model.trim="queryForm.newspaperName" placeholder="报纸名称" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <GameTypeList
            :show-total="true"
            placeholder="彩种"
            v-model="queryForm.gameType as unknown as string"
            allGame
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="" prop="postType">
          <el-select v-model="queryForm.postType" placeholder="论坛类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="期刊" value="p" />
            <el-option label="图解" value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="flag">
          <SelectTagList v-model="queryForm.tagId as unknown as string" placeholder="用户标签" style="width: 100px" />
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startDate"
            v-model:endDate="queryForm.endDate"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="tableRef" :numVisibleItems="7"></ExpandableSection>

        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1 })" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
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
        :isLoading="isLoading"
        :multi-select="true"
        :multi-select-logic="multiSelectLogic"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #issueName="{ scope }">
          <div v-if="scope.row.issueName" class="tag-name">
            <span class="g-text-nowrap-ellipsis">
              {{ scope.row.issueName }}
            </span>
            <!-- <span>
              <copy v-if="scope.row.issueName" :content="scope.row.issueName" class="copy-icon" />
            </span> -->
            <span>
              <el-tag
                class="tag-custom"
                size="small"
                effect="dark"
                style="background-color: #eb2212"
                type="danger"
                v-if="scope.row.postType === 'p'"
              >
                刊
              </el-tag>
              <el-tag
                class="tag-custom"
                size="small"
                effect="dark"
                type="warning"
                v-else-if="scope.row.postType === 'c'"
              >
                解
              </el-tag>
            </span>
            <!-- <copy :content="scope.row.issueName" /> -->
          </div>
        </template>
        <template #newspaperName="{ scope }">
          <el-link
            :title="scope.row.newspaperName"
            class="like-a text-ellipsis"
            @click="handleNewsPaperClickDetail(scope.row.newspaperCode)"
          >
            {{ truncateText(scope.row.newspaperName, 5) }}
          </el-link>
        </template>
        <template #seriesName="{ scope }">
          <el-link
            :title="scope.row.seriesName"
            class="like-a g-text-nowrap-ellipsis"
            @click="handleSeriesClickDetail(scope.row)"
          >
            {{ truncateText(scope.row.seriesName, 5) }}
          </el-link>
        </template>
        <template #nickname="{ scope }">
          <!-- <el-link
            :title="scope.row.nickname"
            @click="handTabs(scope.row.postUserId)"
            class="like-a g-text-nowrap-ellipsis"
          >
            {{ truncateText(scope.row.nickname, 5) }}
          </el-link> -->
          <p class="like-a overflow-hidden" @click="handTabs(scope.row.postUserId)">
            {{ truncateText(scope.row.loginId) }} | {{ scope.row.nickname }}
          </p>
        </template>
        <!-- <template #postType="{ scope }">
          <span v-if="scope.row.postType === 'p'">期刊</span>
          <span v-else="scope.row.postType === 'c'">图解</span>
        </template> -->
        <template #postContent="{ scope }">
          <div v-if="scope.row.postContent">
            <SimplePopover v-model="scope.row.postContent"></SimplePopover>
          </div>
        </template>
        <template #status="{ scope }">
          <el-switch
            v-model="scope.row.status"
            :loading="isLoading"
            class="switch-custom"
            active-value="y"
            inactive-value="n"
            :inactive-text="scope.row.status === 'y' ? '启用' : '关闭'"
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
  <NewsSeriesModal :isOperateShow="false" v-if="modalsStore.newsSeriesModal.isVisible" />
  <!-- 系列名称 -->
  <photoSeriesModal :isOperateShow="false" @alreadySubmit="handleSeriesSave" />
  <!-- 发布用户 -->
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { options } from '@/views/PhotosSys/commentsList/data'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import count from '@/utils/tableHeight'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat'
import {
  getPaperCommentDetailByPostId,
  updateGraphicSolution,
  updateStatusByIdList,
  type IUpdateGraphicSolutionQueryParams
} from '@/api/photoSys/issues'
import type { IGetCommentDetailByPostIdData, IGetCommentDetailByPostIdQueryParams } from '@/api/photoSys/issues/type'
import { useModalsStore } from '@/stores/modalStore'
import ExpandableSection from '@/components/expandIcon/index.vue'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'

const modalsStore = useModalsStore()
const isExpanded = ref(false)
const tableRef = ref()
const queryRef = ref()

const tableData = ref<IGetCommentDetailByPostIdData[]>([])

const total = ref<number>(0)

const initFormQuery = (): IGetCommentDetailByPostIdQueryParams => {
  return {
    page: 1,
    size: 15,
    sortName: 'create_time',
    sortOrder: 'DESC',
    tagId: '',
    postType: 'p',
    userId: '',
    gameType: '2032',
    startDate: '',
    endDate: '',
    postContent: ''
  }
}

const queryForm = reactive<IGetCommentDetailByPostIdQueryParams>(initFormQuery())
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
//loading 按钮
const isLoading = ref(false)
//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IGetCommentDetailByPostIdQueryParams>) => {
  isLoading.value = true
  try {
    const query: IGetCommentDetailByPostIdQueryParams = {
      ...queryForm,
      ..._queryForm
    }
    console.log('🚀 ~ fetchData ~ query:', query)

    if (queryForm.gameType === 0) {
      delete query.gameType
    }
    if (queryForm.postType === 'L') {
      delete query.postType
    }

    const response = await getPaperCommentDetailByPostId(query)
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

// 报纸名称 详情
const handleNewsPaperClickDetail = (newspaperCode) => {
  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    newspaperCode,
    formMode: 'view'
  })
}

//系列名称 详情
const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', { id: row.seriesCode })
}

const handleSeriesSave = (_: boolean) => {
  // if (isNeedResetPage) {
  //   queryForm.page = 1
  //   tableState.pageSize = 15
  // }
  fetchData()
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
      const query: IUpdateGraphicSolutionQueryParams = {
        postId: row.postId,
        status: val
      }
      const response = await updateGraphicSolution(query)
      if (response.success) {
        fetchData()
        ElMessage.success('操作成功')
      } else {
        showErrorMessage(response)
      }
    }
  } catch (error) {}
}
const onchangeForMultiSelect = async (idList: string[], val: 'y' | 'n') => {
  try {
    if (idList.length > 0) {
      isLoading.value = true
      const query: any = {
        postIdList: idList,
        status: val
      }
      const response = await updateStatusByIdList(query)
      if (response.success) {
      } else {
        throw new Error('操作失败')
      }
    }
  } catch (error) {
    throw new Error('操作失败')
  }
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
    // const updatePromises = selectedKeys.map((item) => onchangeForMultiSelect(item, openStatus))

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
  width: 100%;
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
.tag-name {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.tag-custom {
  padding-left: 4px;
  padding-right: 4px;
}
</style>
