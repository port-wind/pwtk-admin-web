<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <el-form-item label="" prop="roomId">
          <el-input v-model="queryForm.roomId" placeholder="直播间ID" />
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model="queryForm.name" placeholder="直播间名称" />
        </el-form-item>
        <el-form-item class="el-select-extra" label="" prop="userId">
          <SelectNickname v-model="queryForm.userId" placeholder="用户昵称" select />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="发表开始时间"
            end-placeholder="发表结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
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
        </el-form-item>
      </el-form>
    </div>

    <!-- Data Table -->
    <section class="main_flex_table">
      <m-table
        class="m_table_image"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #roomId="{ scope }">
          {{ scope.row.roomId }}
          <copy :content="scope.row.roomId" />
        </template>
        <template #nickname="{ scope }">
          <p
            v-if="!scope.row.userId.includes(ANONYMOUS_USER_ID)"
            class="like-a overflow-hidden"
            @click="viewUserDetails(scope.row)"
          >
            {{ truncateText(scope.row.nickname) }}
          </p>
          <p v-else class="overflow-hidden">
            匿名用户
            <copy :content="sanitizedActorId(scope.row.userId)" />
          </p>
        </template>
        <template #roomName="{ scope }">
          {{ truncateText(scope.row.roomName) }}
        </template>
        <template #msg="{ scope }">
          {{ truncateText(scope.row.content) }}
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createdAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <!-- <template #operation="{ scope }">
          <el-tag
            class="mx-1"
            type="danger"
            style="cursor: pointer"
            @click="
              deleteConfirm(() => {
                return delRoomMsg(scope.row)
              }, fetchData)
            "
          >
            删除
          </el-tag>
        </template> -->
      </m-table>
    </section>
    <UserListComponent></UserListComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import type { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { ANONYMOUS_USER_ID, enhanceWithUserInfo } from '@/api/chat'
import { truncateText } from '@/utils/dataFormat'
import { getAllLiveRoomMessageList } from '@/api/live'
import { sanitizedActorId } from '@/views/VideoList/videoUtils'

const modalsStore = useModalsStore()
const valueBus = useValueBus()
console.log('valueBus', valueBus)
const tableRef = ref()
const queryRef = ref()
const tableData = ref<any>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)
const initQueryForm = () => ({
  roomId: '',
  name: '',
  userId: '',
  startTime: null,
  endTime: null,
  sortName: 'create_time',
  sortOrder: 'DESC'
})
const queryForm = reactive(initQueryForm())

const options = ref<TableOptions[]>([
  {
    label: '直播间ID',
    prop: 'roomId',
    slot: 'roomId'
  },
  {
    label: '直播间名称',
    prop: 'roomName',
    slot: 'roomName'
  },
  {
    label: '用户昵称',
    prop: 'nickname',
    slot: 'nickname'
  },
  {
    label: '消息内容',
    prop: 'msg',
    slot: 'msg'
  },
  {
    label: '发表时间',
    prop: 'createTime',
    slot: 'createTime',
    width: 180
  }
  // {
  //   label: '操作',
  //   prop: 'operation',
  //   slot: 'operation',
  //   width: 110
  // }
])

//页面初始化获取数据
const fetchData = async (_queryForm: any = queryForm) => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    ...queryForm,
    roomName: queryForm.name ?? undefined,
    startTime: queryForm.startTime ?? undefined,
    endTime: queryForm.endTime ?? undefined
  }
  isLoading.value = true
  try {
    const response = await getAllLiveRoomMessageList(params)
    if (response.code === 0) {
      const tempList = response!.data?.messages
      const enhancedList = await enhanceWithUserInfo(tempList)
      tableData.value = enhancedList
      total.value = Number(response!.data!.pagination.total)
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

//重置按钮
const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const viewUserDetails = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}

onMounted(fetchData)
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
::v-deep(.el-select-extra) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}
</style>
