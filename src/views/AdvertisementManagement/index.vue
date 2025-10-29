<template>
  <section class="main_container">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1 })"
        ref="formRef"
      >
        <el-form-item label="" prop="name">
          <el-input v-model="queryForm.name" placeholder="广告名称" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="广告状态" style="width: 120px">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
            style="width: 360px"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="addButton">新增</el-button>
          <el-button type="danger" :icon="Sort" @click="sortButton">排序</el-button>
          <template v-if="showMultiOptions">
            <span class="ml-12px" style="margin-left: 10px">批量:</span>
            <el-button class="ml-12px" type="success" plain @click="handleBatch('y')">开启</el-button>
            <el-button type="danger" plain @click="handleBatch('n')">关闭</el-button>
          </template>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableList"
        :isLoading="isLoading"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :pagination="true"
        stripe
        :multi-select="true"
        :multi-select-logic="multiSelectLogic"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #name="{ scope }">
          <p class="like-a overflow-hidden g-text-nowrap-ellipsis" type="primary" @click="handleEdit(scope.row)">
            {{ scope.row.name }}
          </p>
        </template>
        <template #desc="{ scope }">
          <SimplePopover v-model="scope.row.desc"></SimplePopover>
        </template>
        <template #logo="{ scope }">
          <el-image
            v-if="scope.row.logo"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.logo"
          ></el-image>
          <span v-else>暂无图片</span>
        </template>
        <template #gameType="{ scope }">
          <p>
            {{ truncateText(scope.row?.gameTypeList?.map((item) => getGameTypeName(item.toString())).join(','), 9) }}
          </p>
        </template>
        <template #url="{ scope }">
          <el-link v-if="scope.row.url" :href="scope.row.url" target="_blank" type="primary">
            {{ scope.row.url }}
          </el-link>
          <span v-else>-</span>
        </template>
        <template #status="{ scope }">
          {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          <status-toggle
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :field-name="'status'"
            :item="scope.row"
            :update-api="reqAdvertisementStatus"
            @refresh-needed="fetchData"
          />
        </template>
        <template #taskStatus="{ scope }">
          <el-tag v-if="scope.row.taskStatus === 1" type="warning">等待开始</el-tag>
          <el-tag v-else-if="scope.row.taskStatus === 2" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.taskStatus === 3" type="danger">已完成</el-tag>
          <el-tag v-else type="info">未知</el-tag>
        </template>
        <template #operation="{ scope }">
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </m-table>
    </section>

    <!-- 新增广告/编辑广告-->
    <AddAdvertisementDialog v-if="isForm" v-model:visible="isForm" :id="editId" @success="handleDialogSuccess" />

    <el-dialog v-model="sortedListVisible" class="tabs-dialog" draggable overflow destroy-on-close>
      <el-tabs class="article-tabs m_tabs">
        <el-tab-pane label="广告排序" class="article-content m_tabs_pane">
          <AdvertisementSortedList v-if="sortedListVisible" @cancel="sortedListVisible = false" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Sort } from '@element-plus/icons-vue'
import TimeSelect from '@/components/timeSelect2/index.vue'
import { options } from '@/views/AdvertisementManagement/data'
import showErrorMessage from '@/utils/showErrorMessage'
import AdvertisementSortedList from '@/views/AdvertisementManagement/components/AdvertisementSortedList.vue'
import AddAdvertisementDialog from '@/views/AdvertisementManagement/components/addAdvertisementDialog.vue'
import {
  reqAdvertisementList,
  reqAdvertisementStatus,
  reqAdvertisementDelete,
  reqAdvertisementStatusByIdList
} from '@/api/advertisement'
import type {
  IAdvertisementListQueryParams,
  IAdvertisementData,
  IAdvertisementDeleteData
} from '@/api/advertisement/types'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'
import { useBettingStore } from '@/stores/bettingStore'
import { truncateText } from '@/utils/dataFormat'

const bettingStore = useBettingStore()
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'id',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  }
})
const gameTypeList = computed(() => {
  return bettingStore.getAllGetGameType().map((item) => ({
    value: item.gameType,
    label: item.gameTypeName
  }))
})
const showMultiOptions = computed(() => {
  return multiSelectLogic.isAllSelected.value || multiSelectLogic.isIndeterminate.value
})
// eslint-disable-next-line no-undef
const { VITE_CDN_URL } = webConfigApi
const queryRef = ref()
const sortedListVisible = ref(false)
const initQueryForm = (): IAdvertisementListQueryParams => ({
  page: 1,
  size: 15,
  name: '',
  status: 'L',
  startTime: undefined,
  endTime: undefined,
  sortOrder: 'DESC',
  sortName: 'create_time',
  gameType: 'L'
})

//分页数据
const isForm = ref(false)
const isLoading = ref(false)
const total = ref(0)
const tableList = ref<IAdvertisementData[]>([])
const editData = ref<IAdvertisementData | null>(null)
const editId = computed(() => {
  return editData.value && editData.value.id ? editData.value.id.toString() : ''
})
const queryForm = reactive<IAdvertisementListQueryParams>(initQueryForm())
const pageSize = ref(15)
const currentPage = ref(1)
async function fetchData(vals?: Partial<IAdvertisementListQueryParams>) {
  isLoading.value = true
  try {
    const query: IAdvertisementListQueryParams = {
      ...queryForm,
      ...vals,
      size: pageSize.value,
      page: currentPage.value
    }
    if (query.gameType === 'L') {
      delete query.gameType
    }
    // Convert time to timestamp if provided
    if (query.startTime && typeof query.startTime === 'string') {
      query.startTime = new Date(query.startTime).getTime()
    }
    if (query.endTime && typeof query.endTime === 'string') {
      query.endTime = new Date(query.endTime).getTime()
    }

    // Remove empty values
    if (!query.name) {
      delete query.name
    }
    if (!query.status || query.status === 'L') {
      delete query.status
    }

    const res = await reqAdvertisementList(query)
    if (res.success) {
      tableList.value = res.data.list
      total.value = Number(res.data.total)
    } else {
      showErrorMessage(res)
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('获取广告列表失败')
  } finally {
    isLoading.value = false
  }
}
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})
const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

const addButton = () => {
  editData.value = null
  isForm.value = true
}

const sortButton = () => {
  sortedListVisible.value = true
}

const handleEdit = (row) => {
  try {
    isLoading.value = true
    editData.value = { ...row }
    isForm.value = true
  } catch (err) {
    console.error(err)
    ElMessage.error('编辑失败')
  } finally {
    isLoading.value = false
  }
}

const handleDelete = async (row: IAdvertisementData) => {
  return ElMessageBox.confirm('确定要删除这个广告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonClass: 'cancel',
    type: 'warning'
  }).then(async () => {
    const deleteData: IAdvertisementDeleteData = {
      id: row.id
    }
    isLoading.value = true
    try {
      const response: any = await reqAdvertisementDelete(deleteData)
      if (response.success) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        })
        fetchData()
      } else {
        showErrorMessage(response)
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('删除失败')
    } finally {
      isLoading.value = false
    }
  })
}

const handleDialogSuccess = () => {
  fetchData()
}

const handleSizeChange = (val) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchData(queryForm)
}

const handleBatch = async (openStatus: 'y' | 'n') => {
  console.log('handleBatchOpen')
  const { selectedKeys } = multiSelectLogic.getSelectedData(tableList.value)
  console.log('selectedKeys', selectedKeys)

  if (selectedKeys.length === 0) {
    ElMessage.warning(`请选择要${openStatus === 'y' ? '开启' : '关闭'}的评论`)
  }

  try {
    isLoading.value = true

    // Use Promise.all for parallel execution with proper error handling
    await reqAdvertisementStatusByIdList({ advertisementIdList: selectedKeys, status: openStatus })

    ElMessage.success(`成功${openStatus === 'y' ? '开启' : '关闭'} ${selectedKeys.length} 个广告`)
    await fetchData() // Refresh data after successful operation
    multiSelectLogic.clearSelection(tableList.value) // Clear selection after operation
  } catch (error) {
    console.error('Error batch open:', error)
    ElMessage.error(`批量${openStatus === 'y' ? '开启' : '关闭'}操作失败，请重试`)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  await bettingStore.getGameType()
  fetchData()
})
</script>

<style scoped lang="less">
:deep(.el-input__wrapper) {
  width: 120px;
}
:deep(.el-date-editor) {
  .el-range-input {
    min-width: 150px;
  }
}
</style>
