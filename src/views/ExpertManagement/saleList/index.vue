<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1, size: 15 })"
        ref="formRef"
      >
        <el-form-item prop="id" class="predictId">
          <UniRemoteInput
            v-model="queryForm.id"
            :search-obj="{}"
            valueKey="predictId"
            labelKey="id"
            searchKey="id"
            placeholder="卖料ID"
            event-focus="focus"
            :fetchOptions="getSaleList"
            :formatLabel="(item) => item.predictId"
          />
        </el-form-item>
        <el-form-item prop="year">
          <el-select v-model="queryForm.year" placeholder="年份" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="issue">
          <el-input v-model.trim="queryForm.issue" placeholder="期数" />
        </el-form-item>
        <el-form-item prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="playTypeCode">
          <el-select v-model="queryForm.playTypeCode" placeholder="投票类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in playTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="loginId">
          <AutoChoseLoginId v-model="queryForm.searchId" />
        </el-form-item>
        <el-form-item prop="nickname">
          <UserDeleteAutocomplete
            placeholder="用户昵称"
            @keyup.enter="fetchData()"
            name="nickname"
            v-model:remoteId="queryForm.nickname"
            style=""
          ></UserDeleteAutocomplete>
        </el-form-item>
        <el-form-item prop="gameType">
          <el-select v-model="queryForm.isHit" placeholder="开奖结果" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in hitList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="flag">
          <SelectTagList v-model="queryForm.tagId!" placeholder="用户标签" style="width: 100px" />
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="handleReset()" plain>重置</el-button>
          <el-button
            v-if="isShowCheckboxTable"
            type="success"
            :icon="Connection"
            @click="() => handleSpecialClick('newsPaperIssue')"
            plain
          >
            同步
          </el-button>
          <el-button type="success" :icon="Plus" @click="openXSDialog()">新增</el-button>
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
        :isLoading="isLoading"
        :pagination="true"
        isEditRow
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
        :multi-select="true"
        :multi-select-logic="multiSelectLogic"
      >
        <template #issue="{ scope }">
          {{ scope.row.issue }}
        </template>

        <template #user="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.loginId) }}
            {{ scope.row.nickname && scope.row.loginId ? ' | ' : '' }}
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>

        <template #predictTitle="{ scope }">
          <p>
            {{ truncateText(scope.row?.predictTitle, 8) }}
          </p>
        </template>
        <template #predictId="{ scope }">
          <p>
            {{ truncateText(scope.row?.predictId, 8) }}

            <el-icon>
              <DocumentCopy color="#7ecb5b" @click="() => openXSDialog({ predictId: scope.row.predictId })" />
            </el-icon>
            <Copy :content="scope.row?.predictId" />
          </p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
        </template>
        <template #playTypeCode="{ scope }">
          <p>{{ scope.row?.playTypeName?.toString() }}</p>
        </template>
        <template #pointView="{ scope }">
          <p>
            {{ scope.row?.predictScore }}
            {{ scope.row?.saleCount?.toString() ? `| ${scope.row.saleCount}` : '' }}
          </p>
        </template>
        <template #predict="{ scope }">
          <PopoverList :content="scope.row.predict" :max-items="5"></PopoverList>
        </template>
        <template #isHit="{ scope }">
          <span
            :class="{
              'hit-success': scope.row.isHit === 'y',
              'hit-fail': scope.row.isHit === 'n',
              'hit-pending': scope.row.isHit === 'i'
            }"
          >
            {{ scope.row.isHit === 'y' ? '已中奖' : scope.row.isHit === 'n' ? '未中奖' : '未开奖' }}
          </span>
        </template>
        <template #status="{ scope }">
          {{ scope.row.reviewStatus === 'y' ? '启用' : '关闭' }}
          <status-toggle
            v-model="scope.row.reviewStatus"
            :active-value="'y'"
            :inactive-value="'n'"
            :field-name="'reviewStatus'"
            :item="scope.row"
            :update-api="updateSaleStatusByIds"
            :generateParams="generateParams"
            @refresh-needed="fetchData"
          />
        </template>
      </m-table>
    </section>
  </section>
  <XSDialog v-if="unMountXSDialog" ref="XSDialogRef" @onClose="onClose" />
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Refresh, Connection, Plus } from '@element-plus/icons-vue'
// import type { TableData } from '@/api/newsSiteMgr/articleList/types'
import type { TableOptions } from '@/components/mTable/types'
// import count from '@/utils/tableHeight'
import { fetchPlayType, fetchGameTypes } from '@/utils/table'
import { cleanObject, truncateText, YearTypes } from '@/utils/dataFormat'
import PopoverList from '@/views/ExpertManagement/components/popover-list/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { getSaleList, updateSaleStatusByIds } from '@/api/expert/sale-list/index'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import XSDialog from '@/views/ExpertManagement/saleList/XSdialog/index.vue'
import router from '@/router'
import type { IGetSaleListData, IGetSaleListQueryParams } from '@/api/expert/sale-list/type'
import ExpandableSection from '@/components/expandIcon/index.vue'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'

const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'predictId',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  }
})
const showMultiOptions = computed(() => {
  return multiSelectLogic.isAllSelected.value || multiSelectLogic.isIndeterminate.value
})
const queryRef = ref()

const modalsStore = useModalsStore()
const isExpanded = ref(false)
const { VITE_DEPLOY_CONFIG } = import.meta.env
// Refs
const gameTypeList = ref()
const playTypeList = ref()
const XSDialogRef = ref()
const unMountXSDialog = ref(false)

const openXSDialog = (params?: { predictId?: string }) => {
  unMountXSDialog.value = true
  nextTick(() => {
    XSDialogRef.value!.openDailog(params)
  })
}

const hitList = ref([
  { value: 'y', label: '已中奖' },
  { value: 'n', label: '未中奖' },
  { value: 'i', label: '未开奖' }
])
// const tableRef = ref()
const tableData = ref<IGetSaleListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)

const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})

// const dialogMode = ref<'edit' | 'add'>()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

// const issueDialogVisible = ref(false)
// const issueEditDialogVisible = ref(false)

// Constants

const initQueryFormValue = (): IGetSaleListQueryParams => ({
  page: 1,
  size: 15,
  id: undefined,
  year: undefined,
  issue: undefined,
  gameType: 'L',
  playTypeCode: undefined,
  searchId: '',
  nickname: '',
  isHit: undefined,
  startTime: undefined,
  endTime: undefined,
  tagId: undefined
})

const queryForm = reactive<IGetSaleListQueryParams>(initQueryFormValue())

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'user',
    label: '账户名称 | 账户昵称',
    slot: 'user',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'predictId',
    label: '卖料ID',
    slot: 'predictId',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'year',
    label: '年份',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'issue',
    label: '期数',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'predictTitle',
    label: '卖料标题',
    slot: 'predictTitle',
    columAttr: { minWidth: 160 }
  },

  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'playTypeCode',
    label: '投票类型',
    slot: 'playTypeCode',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'predict',
    label: '推荐内容',
    slot: 'predict',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'pointView',
    label: '积分|查看数',
    slot: 'pointView',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    columAttr: { minWidth: 100 }
  },

  {
    prop: 'createTime',
    label: '参与时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: 170 }
  },
  {
    prop: 'isHit',
    label: '结果',
    slot: 'isHit'
  }
]

// Methods
const fetchData = async (val?: Partial<IGetSaleListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IGetSaleListQueryParams = cleanObject({
      ...queryForm,
      ...val
    })

    if (val) {
      Object.assign(queryForm, val)
    }
    if (query.gameType === 'L') {
      query.gameType = ''
    }
    if (query.year && query.year.toString() === 'L') {
      delete query.year
    }
    if (query.playTypeCode && query.playTypeCode.toString() === 'L') {
      delete query.playTypeCode
    }
    if (query.isHit && query.isHit.toString() === 'L') {
      delete query.isHit
    }
    const response = await getSaleList(query)
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item
          }
        }) || []
      tableData.value =
        (list &&
          list?.map((item: any) => ({
            ...item
          }))) ||
        []
      total.value = Number(response?.data?.total) || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const onClose = () => {
  unMountXSDialog.value = false
  fetchData()
}
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  fetchData()
}
const handleSizeChange = (val: number) => {
  queryForm.size = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

const handTabs = (row) => {
  // return
  // router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    // ...modalsStore.userInfoModal.modalData,
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}
const generateParams = (params: any) => {
  console.log('params', params)

  return {
    reviewStatus: params.reviewStatus,
    predictIds: [params.predictId]
  }
}
const handleBatch = async (openStatus: 'y' | 'n') => {
  console.log('handleBatchOpen')
  const { selectedKeys } = multiSelectLogic.getSelectedData(tableData.value)
  console.log('selectedKeys', selectedKeys)

  if (selectedKeys.length === 0) {
    ElMessage.warning(`请选择要${openStatus === 'y' ? '开启' : '关闭'}的卖料`)
  }

  try {
    isLoading.value = true

    // Use Promise.all for parallel execution with proper error handling
    await updateSaleStatusByIds({ predictIds: selectedKeys, reviewStatus: openStatus })

    ElMessage.success(`成功${openStatus === 'y' ? '开启' : '关闭'} ${selectedKeys.length} 个卖料`)
    await fetchData() // Refresh data after successful operation
    multiSelectLogic.clearSelection(tableData.value) // Clear selection after operation
  } catch (error) {
    console.error('Error batch open:', error)
    ElMessage.error(`批量${openStatus === 'y' ? '开启' : '关闭'}操作失败，请重试`)
  } finally {
    isLoading.value = false
  }
}
// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  playTypeList.value = await fetchPlayType(isLoading)
  if (router.currentRoute.value.query.userId) {
    console.log('router.currentRoute.value', router.currentRoute.value)
    queryForm.searchId = router.currentRoute.value.query.userId as string
  }
  if (router.currentRoute.value.query.id) {
    queryForm.id = router.currentRoute.value.query.id as string
  }
  await fetchData()
})
</script>

<style scoped lang="less">
.hit-success {
  color: #67c23a;
}
.hit-fail {
  color: #f56c6c;
}
.hit-pending {
  color: #e6a23c;
}
::v-deep(.predictId) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}

.predict_relevent {
  overflow: auto;
  &::-webkit-scrollbar {
    height: 6px;
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
