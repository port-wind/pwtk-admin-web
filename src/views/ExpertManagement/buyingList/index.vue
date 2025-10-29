<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm">
        <el-form-item label="" prop="id">
          <UniRemoteInput
            v-model="queryForm.id"
            :search-obj="{ page: 1, pageSize: 100 }"
            valueKey="id"
            labelKey="id"
            searchKey="id"
            placeholder="买料ID"
            event-focus="focus"
            :fetchOptions="getBuyingList"
            :formatLabel="(item) => item.id"
          />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <UserDeleteAutocomplete
            placeholder="用户昵称"
            @keyup.enter="fetchData()"
            name="nickname"
            v-model:remoteId="queryForm.nickname"
            style=""
          ></UserDeleteAutocomplete>
        </el-form-item>

        <el-form-item label="" prop="saleNickname">
          <UserDeleteAutocomplete
            placeholder="专家昵称"
            @keyup.enter="fetchData()"
            name="nickname"
            v-model:remoteId="queryForm.saleNickname"
            style=""
          ></UserDeleteAutocomplete>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect2>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
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

          <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            @click="() => handleSpecialClick('newsPaperIssue')"
          >
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #user="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row, 'userId')" type="primary">
            {{ truncateText(scope.row.loginId) }}
            {{ scope.row.nickname && scope.row.loginId ? ' | ' : '' }}
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #saleUser="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row, 'predictionUser')" type="primary">
            {{ truncateText(scope.row.saleLoginId) }}
            {{ scope.row.saleNickname && scope.row.saleLoginId ? ' | ' : '' }}
            {{ truncateText(scope.row.saleNickname) }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.issueDTO?.gameType?.toString()) }}</p>
        </template>
        <template #predict="{ scope }">
          <div>
            <ul class="predict_list">
              <li v-for="(item, index) in scope.row.predict" :class="'non_style'" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
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
      </m-table>
    </section>
  </section>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import { truncateText } from '@/utils/dataFormat'
import { fetchGameTypes } from '@/utils/table'
import { useModalsStore } from '@/stores/modalStore'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { getBuyingList } from '@/api/expert/buying-list'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import router from '@/router'

const modalsStore = useModalsStore()
const { VITE_DEPLOY_CONFIG } = import.meta.env
// Refs
const gameTypeList = ref()
const hitList = ref([
  { value: 'y', label: '已中奖' },
  { value: 'n', label: '未中奖' },
  { value: 'i', label: '未开奖' }
])
const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const isLoading = ref(false)

const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})

const dialogMode = ref<'edit' | 'add'>()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

const issueDialogVisible = ref(false)
const issueEditDialogVisible = ref(false)

// Constants

const initQueryFormValue = () => ({
  year: '',
  issue: '',
  remoteValue: '',
  nickname: '',
  id: '',
  buyUserId: '',
  saleUserId: '',
  startTime: '',
  endTime: '',
  saleNickname: ''
})

const queryForm = reactive(initQueryFormValue())
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'id',
    label: '买料ID',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'user',
    label: '账户名称 | 账户昵称',
    slot: 'user',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'point',
    label: '支付积分',
    align: 'right',
    columAttr: { width: 80 }
  },
  {
    prop: 'saleUser',
    label: '专家帐号 | 昵称',
    slot: 'saleUser',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'payStatusName',
    label: '购买状态',
    columAttr: { width: 80 }
  },
  {
    prop: 'guaranteed',
    label: '担保支付',
    columAttr: { width: 80 }
  },
  {
    prop: 'beforeBalance',
    label: '变动前余额',
    align: 'right',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'afterBalance',
    label: '当前余额',
    align: 'right',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'createTime',
    label: '购买时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { minWidth: 150 }
  }
]

// Methods
const fetchData = async (val?: GetRequest) => {
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    ...queryForm
  }
  isLoading.value = true
  try {
    const response = await getBuyingList(params)
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item,
            guaranteed: item.guaranteed === 'y' ? '是' : '否'
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

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handTabs = (row, keyName) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row[keyName]
  })
  modalsStore.showModal('userInfoModal')
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  if (router.currentRoute.value.query.id) {
    console.log('router.currentRoute.value', router.currentRoute.value)
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
.predict_list {
  padding-left: 0;
  display: flex;
  list-style: none;
  column-gap: 10px;
  li {
    min-width: 26px;
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    background-color: rgb(99, 161, 3);
    color: white;
    border-radius: 100%;
  }
}
::v-deep(.el-select) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}
</style>
