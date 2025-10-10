<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="loginId">
          <AutoChoseLoginId v-model="queryForm.loginOrUserId" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname placeholder="用户昵称" v-model="queryForm.nickname" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.status" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option key="y" label="启用" value="1" />
            <el-option key="n" label="禁用" value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="申请开始时间"
            end-placeholder="申请结束时间"
            v-model:startDate="queryForm.applyStartTime"
            v-model:endDate="queryForm.applyEndTime"
          ></TimeSelect>
        </el-form-item>

        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="操作开始时间"
            end-placeholder="操作结束时间"
            v-model:startDate="queryForm.updateStartTime"
            v-model:endDate="queryForm.updateEndTime"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="tableRef" :numVisibleItems="4"></ExpandableSection>
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
          <el-button type="primary" @click="openRulesDialog">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            修改规则配置
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
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.loginId) }}
            {{ scope.row.nickname && scope.row.loginId ? ' | ' : '' }}
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status == '1' ? '启用' : '禁用' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="
              () =>
                statusChanged(scope.row, updateStatus, fetchData, 'status', {
                  activeValue: '1',
                  inactiveValue: '0'
                })
            "
          ></el-switch>
        </template>
        <template #operation="{ scope }">
          <el-link class="like-a" style="margin-right: 10px" @click="toSaleList(scope.row)">卖料管理</el-link>
          <el-link class="like-a" style="margin-right: 10px; color: #67c23a" @click="toPointsList(scope.row)">
            打赏记录
          </el-link>
          <el-link class="like-a" style="color: red" @click="toSixKingList(scope.row)">六合王查询</el-link>
        </template>
      </m-table>
    </section>
  </section>
  <el-dialog
    v-model="rulesDialogVisible"
    class="tabs-dialog"
    draggable
    overflow
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane label="专家规则配置" name="expertRuleConfig" class="article-content m_tabs_pane">
        <ExpertRulesConfig @close="rulesDialogVisible = false"></ExpertRulesConfig>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import type { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import { statusChanged } from '@/utils/table'
import { truncateText } from '@/utils/dataFormat'
import { useModalsStore } from '@/stores/modalStore'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { updateStatus, getExpertList } from '@/api/expert/expert-list'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import ExpandableSection from '@/components/expandIcon/index.vue'
import router from '@/router'

const modalsStore = useModalsStore()
const { VITE_DEPLOY_CONFIG } = import.meta.env
const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const isLoading = ref(false)
const isExpanded = ref(false)
const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})

const rulesDialogVisible = ref(false)

const openRulesDialog = () => {
  rulesDialogVisible.value = true
}
// Constants
const activeTab = ref('expertRuleConfig')

const initQueryFormValue = () => ({
  remoteValue: '',
  nickname: '',
  status: '',
  applyStartTime: '',
  applyEndTime: '',
  updateStartTime: '',
  updateEndTime: '',
  loginOrUserId: ''
})

const queryForm = reactive(initQueryFormValue())

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'user',
    label: '账户名称 | 账户昵称',
    slot: 'user',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'createTime',
    label: '申请时间',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    dateName: 'createTime',
    columAttr: { minWidth: 120 }
  },
  {
    prop: 'status',
    label: '权限状态',
    slot: 'status',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'handler',
    label: '操作人',
    columAttr: { minWidth: 120 }
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    dateName: 'updateTime',

    columAttr: { minWidth: 120 }
  },
  {
    prop: 'operation',
    label: '操作',
    slot: 'operation',
    columAttr: { minWidth: 180 }
  }
]

// Methods
const fetchData = async (_?: GetRequest) => {
  const params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    ...queryForm
  }
  if (queryForm.status === 'L') {
    params.status = undefined
  }
  isLoading.value = true
  try {
    const response = await getExpertList(params)
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item,
            issueDTO: item.issueDTO ?? {}
          }
        }) || []
      tableData.value =
        (list &&
          list?.map((item: any) => ({
            ...item,
            issue: item.issue?.toString() || '',
            id: item.issueId,
            commentFlag: item.issueDTO?.commentFlag,
            annotateContent: item.issueDTO?.annotateContent
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
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
const toSaleList = (row: any) => {
  router.push({ path: '/expertManagement/saleList', query: { userId: row.userId } }).catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
    }
  })
}

const toPointsList = (row: any) => {
  router
    .push({
      path: '/expertManagement/pointsList',
      query: { userId: row.userId }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}
const toSixKingList = (row: any) => {
  router
    .push({
      path: '/expertManagement/sixKingList',
      query: { userId: row.userId, nickname: row.nickname }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
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
// Lifecycle hooks
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less"></style>
