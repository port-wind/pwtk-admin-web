<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname v-model="queryForm.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="加入开始时间"
            end-placeholder="加入结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="state">
          <el-select v-model="queryForm.state" placeholder="全部状态">
            <el-option label="全部" value="L" />
            <el-option label="在线" value="1" />
            <el-option label="已上麦" value="2" />
            <el-option label="闭麦中" value="3" />
          </el-select>
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
      >
        <template #nickname="{ scope }">
          <p v-if="scope.row.guest">
            {{ truncateText(scope.row.nickname, 25) }}
          </p>
          <p v-else class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #joinEndTime="{ scope }">
          {{ unitFormatDate(scope.row.joinEndTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #state="{ scope }">
          <el-dropdown trigger="click" size="small" @command="stateChange">
            <span class="el-dropdown-link">
              <el-tag v-if="scope.row.speak == '0'" class="mx-1" type="primary">在线</el-tag>
              <el-tag v-else-if="scope.row.openSpeak == '2'" class="mx-1" type="success">已上麦</el-tag>
              <el-tag v-else-if="scope.row.openSpeak == '1' || scope.row.openSpeak == '0'" class="mx-1" type="warning">
                闭麦中
              </el-tag>
              <el-tag v-else class="mx-1" type="danger" effect="dark">已退出</el-tag>
            </span>
          </el-dropdown>
        </template>
        <template #operation="{ scope }">
          <el-link style="color: #f56c6c; margin-right: 20px" @click="kickUser(scope.row)" v-if="!scope.row.owner">
            踢出语音房
          </el-link>
          <el-link v-if="!scope.row.guest" style="color: #00aaaa" @click="viewMessageManagement(scope.row)">
            消息管理
          </el-link>
        </template>
      </m-table>
    </section>
  </div>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/locales'
const { t } = i18n.global as any
import { ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import { TableOptions } from '@/components/mTable/types'
import router from '@/router'
import { enhanceWithUserInfo, getRoomOnlineUser, kickRoom } from '@/api/chat'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { truncateText } from '@/utils/dataFormat'
const modalsStore = useModalsStore()
const valueBus = useValueBus()
const roomIdFromRoute = ref('')
const roomId = computed(() => roomIdFromRoute.value || valueBus.voiceRoomUserModal?.id)
const componentKey = computed(() => valueBus.voiceRoomUserModal?.componentKey)
const tableRef = ref()
const queryRef = ref()
const tableData = ref<any>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
//新增弹窗
const addDialogVisible = ref(false)
//loading 按钮
const isLoading = ref(false)
const initQueryForm = () => ({
  roomId: roomId.value,
  nickname: '',
  state: 'L',
  startTime: null,
  endTime: null,
  sortName: 'create_time',
  sortOrder: 'DESC'
})
const queryForm = reactive(initQueryForm())

const options = ref<TableOptions[]>([
  {
    label: '用户昵称',
    prop: 'nickname',
    slot: 'nickname'
  },
  {
    label: '加入时间',
    prop: 'createTime',
    slot: 'createTime'
  },
  {
    label: '当前状态',
    prop: 'state',
    slot: 'state'
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation'
  }
])

//页面初始化获取数据
const fetchData = async (_queryForm: any = queryForm) => {
  let params = {
    page: currentPage.value,
    size: pageSize.value,
    type: 'VOICE',
    roomId: roomId.value,
    ..._queryForm
  }
  if (params.state === '1') {
    params.speak = '0'
    delete params.openSpeak
  } else if (params.state === '2') {
    params.speak = '1'
    params.openSpeak = '2'
  } else if (params.state === '3') {
    params.speak = '1'
    params.openSpeak = '0'
  } else {
    delete params.speak
    delete params.openSpeak
  }
  delete params.state
  isLoading.value = true

  try {
    const response = await getRoomOnlineUser(params)
    if (response.success) {
      const tempList = response!.data?.list
      const enhancedList = await enhanceWithUserInfo(tempList)
      console.log(enhancedList)
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
  currentPage.value = 1
  pageSize.value = 15
  Object.assign(queryForm, initQueryForm())

  fetchData()
}
const viewUserDetails = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
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
const stateChange = () => {}

//踢出聊天室
const kickUser = (row: any) => {
  console.log('踢出聊天室', row)
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  }).then(() => {
    kickRoomFunc(row)
  })
}
const kickRoomFunc = async (row: any) => {
  try {
    const params = {
      roomId: roomId.value,
      userId: row.userId
    }
    const response = await kickRoom(params)
    if (response.success) {
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const viewMessageManagement = (data: any) => {
  data.roomId = roomId.value
  console.log('消息管理', data)
  valueBus.resetValue('voiceRoomUserModal')
  valueBus.setValue('voiceRoomUserModal', { ...data, componentKey: Math.random() })
  router
    .push({
      path: '/voiceRoomManagement/voiceRoomMessageManagement',
      query: { id: data.roomId, userId: data.userId, nickname: data.nickname }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}

onMounted(async () => {
  roomIdFromRoute.value = (router.currentRoute.value.query.id as string) ?? ''
  queryForm.roomId = roomId.value ?? ''
  await fetchData()
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
