<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" @keyup.enter="fetchData(queryForm)">
        <el-form-item label="" prop="id">
          <el-input v-model="queryForm.id" placeholder="直播间ID" />
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model="queryForm.name" placeholder="直播间名称" />
        </el-form-item>
        <!-- <el-form-item label="" prop="nickname">
          <AutoChoseNickname v-model="queryForm.nickname" placeholder="创建人" />
        </el-form-item> -->
        <el-form-item class="el-select-extra" label="" prop="owner">
          <SelectNickname v-model="queryForm.owner" placeholder="创建人" select />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="queryForm.isClosed" placeholder="状态">
            <el-option label="在线" :value="false" />
            <el-option label="已解散" :value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect2>
        </el-form-item>

        <!-- <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection> -->
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :isLoading="isLoading"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #liveRoomId="{ scope }">
          {{ truncateText(scope.row.id) }}
          <copy :content="scope.row.id" />
        </template>
        <template #name="{ scope }">
          {{ truncateText(scope.row.name) }}
        </template>
        <template #creater="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createdAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #offlineTime="{ scope }">
          {{ scope.row.endTimeTimestamp ? unitFormatDate(scope.row.endTimeTimestamp, 'yyyy-MM-dd HH:mm:ss') : '' }}
        </template>
        <template #note="{ scope }">
          {{ truncateText(scope.row.description) }}
        </template>
        <template #operation="{ scope }">
          <el-link
            style="color: blue; margin-right: 20px"
            @click="viewUserManagement(scope.row)"
            v-if="!scope.row.isClosed"
          >
            成员管理
          </el-link>
          <el-link style="color: #00aaaa; margin-right: 20px" @click="viewMessageManagement(scope.row)">
            消息管理
          </el-link>
          <!-- <el-link style="color: red; margin-right: 20px" @click="confirmDelRoom(scope.row)">解散</el-link> -->
        </template>
        <template #operationForClosed="{ scope }">
          <el-link style="color: #00aaaa" @click="viewMessageManagement(scope.row)">消息管理</el-link>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 用户页面 -->
  <UserListComponent></UserListComponent>
  <!-- 创建房间 -->
  <CreateRoomDialog @refresh="fetchData" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import showErrorMessage from '@/utils/showErrorMessage'
// import ExpandableSection from '@/components/expandIcon/index.vue'
//import router from '@/router'
import { unitFormatDate } from '@/utils/dateFormat/index'
import type { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import CreateRoomDialog from '@/views/ChatroomSystem/chatroomList/components/createRoomDialog.vue'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import router from '@/router'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { enhanceWithUserInfo } from '@/api/chat'
import { truncateText } from '@/utils/dataFormat'
import { getLiveRoomList } from '@/api/live'

const modalsStore = useModalsStore()
const valueBus = useValueBus()
const manageSiteStore = useManageSiteStore()
const tableData = ref<any[]>([])
// const isExpanded = ref(false)
const queryRef = ref()
const options = computed(
  () =>
    [
      {
        label: '直播间ID',
        prop: 'id',
        slot: 'liveRoomId',
        minWidth: 200
      },
      {
        label: '直播间名称',
        prop: 'name',
        slot: 'name',
        minWidth: 180
      },
      {
        label: '直播间简介',
        prop: 'note',
        slot: 'note',
        minWidth: 150
      },
      {
        label: '创建人',
        prop: 'creater',
        slot: 'creater',
        minWidth: 120
      },
      {
        label: '在线人数',
        prop: 'currentViewers',
        align: 'right'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        slot: 'createTime',
        width: 180
      },
      {
        label: '结束时间',
        prop: 'offlineTime',
        slot: 'offlineTime',
        width: 180
      },
      {
        label: '操作',
        prop: 'operation',
        slot: 'operation',
        minWidth: 200
      }
    ] as TableOptions[]
)

const initQueryForm = () => {
  return {
    id: '',
    name: '',
    startTime: '',
    endTime: '',
    isClosed: false,
    owner: ''
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

const viewUserDetails = (rowData: any) => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData.owner
  })
  modalsStore.showModal('userInfoModal')
}
//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  const params = {
    ..._queryForm,
    roomName: _queryForm.name ?? undefined,
    page: currentPage.value,
    pageSize: pageSize.value
  }
  try {
    isLoading.value = true
    const response = await getLiveRoomList(params)
    if (response.code === 0) {
      const tempList =
        response!.data?.rooms.map((item: any) => {
          item.userId = Number.isNaN(Number(item.owner)) ? '' : item.owner
          return item
        }) || []
      const enhancedList = await enhanceWithUserInfo(tempList)
      tableData.value = (enhancedList?.map((item: any) => {
        return item
      }) || []) as any
      total.value = Number(response!.data!.total) || 0
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
const returnFetchData = () => {
  fetchData(queryForm)
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  returnFetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData(queryForm)
}
const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
}
const handleResetRefresh = () => {
  handleReset()
  fetchData()
}

const viewUserManagement = (data: any) => {
  console.log('成员管理', data)
  valueBus.resetValue('liveRoomUserModal')
  valueBus.setValue('liveRoomUserModal', { ...data, componentKey: Math.random() })
  router
    .push({
      path: '/liveRoomManagement/liveRoomUserManagement',
      query: { id: data.id }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}

const viewMessageManagement = (data: any) => {
  console.log('消息管理', data)
  valueBus.resetValue('liveRoomMessageModal')
  valueBus.setValue('liveRoomMessageModal', { id: data.id, componentKey: Math.random() })
  router
    .push({
      path: '/liveRoomManagement/liveRoomMessageManagement',
      query: { id: data.id }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}

onMounted(async () => {
  console.log(manageSiteStore)

  fetchData()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */

.blue-text {
  color: #409eff;
}
::v-deep(.el-select-extra) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}
</style>
