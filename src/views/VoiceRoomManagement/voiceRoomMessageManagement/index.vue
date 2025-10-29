<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
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
        <template #nickname="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #msg="{ scope }">
          {{ truncateText(scope.row.msg) }}
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #operation="{ scope }">
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
        </template>
      </m-table>
    </section>
    <UserListComponent></UserListComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/locales'
const { t } = i18n.global as any
import { Search, Refresh } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { delRoomMsg, enhanceWithUserInfo, getRoomMsgList } from '@/api/chat'
import { deleteConfirm } from '@/utils/table'
import router from '@/router'
import { truncateText } from '@/utils/dataFormat'
const modalsStore = useModalsStore()
const valueBus = useValueBus()

const roomIdFromRoute = ref('')
const userIdFromRoute = ref('')
const nicknameFromRoute = ref('')

const roomId = computed(() => roomIdFromRoute.value || valueBus.voiceRoomUserModal?.id)
const userId = computed(() => userIdFromRoute.value || valueBus.voiceRoomUserModal?.userId)
const nickname = computed(() => nicknameFromRoute.value || valueBus.voiceRoomUserModal?.nickname)

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
  title: '',
  msgContent: '',
  userId: '',
  // state: 'L',
  startTime: null,
  endTime: null,
  sortName: 'create_time',
  sortOrder: 'DESC',
  nickname: ''
})
const queryForm = reactive(initQueryForm())

const options = ref<TableOptions[]>([
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
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation',
    width: 110
  }
])

//页面初始化获取数据
const fetchData = async (_queryForm: any = queryForm) => {
  let params = {
    page: currentPage.value,
    size: pageSize.value,
    ...queryForm,
    roomType: '0',
    roomId: roomId.value,
    startTime: queryForm.startTime ?? undefined,
    endTime: queryForm.endTime ?? undefined
  }
  isLoading.value = true
  try {
    const response = await getRoomMsgList(params)
    if (response.success) {
      const tempList = response!.data?.list
      const enhancedList = await enhanceWithUserInfo(tempList)
      tableData.value = enhancedList
      total.value = Number(response!.data!.total)
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

//状态修改
const stateChange = (row) => {}

const viewUserDetails = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}

onMounted(async () => {
  roomIdFromRoute.value = (router.currentRoute.value.query.id as string) ?? ''
  userIdFromRoute.value = (router.currentRoute.value.query.userId as string) ?? ''
  nicknameFromRoute.value = (router.currentRoute.value.query.nickname as string) ?? ''
  queryForm.roomId = roomId.value ?? ''
  queryForm.nickname = nickname.value ?? ''
  queryForm.userId = userId.value ?? ''
  await fetchData()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
::v-deep(.el-select-extra) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}
</style>
