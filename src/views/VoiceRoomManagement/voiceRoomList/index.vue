<template>
  <div class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        label-width="auto"
        class="custom-el-form no-rule"
        :model="queryForm"
        @keyup.enter="fetchData(queryForm)"
      >
        <el-form-item label="" prop="id">
          <el-input v-model="queryForm.id" placeholder="语音房ID" :style="{ width: '147px' }" />
        </el-form-item>
        <el-form-item label="" prop="title">
          <el-input v-model="queryForm.title" placeholder="语音房名称" :style="{ width: '147px' }" />
        </el-form-item>
        <el-form-item v-if="queryForm.state == '1'" label="" prop="nickname">
          <SelectUserIdAndNickname
            v-model="queryForm.userId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="创建人"
            :style="{ width: '147px' }"
          />
        </el-form-item>
        <el-form-item v-if="queryForm.state == '0'" class="el-select-extra" label="" prop="userId">
          <SelectNickname v-model="queryForm.userId" placeholder="创建人" select :style="{ width: '147px' }" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select
            v-model="queryForm.state"
            placeholder="状态"
            @change="
              () => {
                queryForm.nickname = ''
              }
            "
            :style="{ width: '147px' }"
          >
            <el-option label="在线" value="1" />
            <el-option label="已解散" value="0" />
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
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="热门开始时间"
            end-placeholder="热门结束时间"
            v-model:startDate="queryForm.heatStartTime"
            v-model:endDate="queryForm.heatEndTime"
          ></TimeSelect2>
        </el-form-item>

        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="createRoom">
            <el-icon>
              <Plus />
            </el-icon>
            创建语音房
          </el-button>
          <el-button type="primary" @click="openRulesDialog">
            <el-icon>
              <Setting />
            </el-icon>
            规则配置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #voiceRoomId="{ scope }">
          {{ scope.row.id }}
        </template>
        <template #creater="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #heatStartTime="{ scope }">
          {{ unitFormatDate(scope.row.heatStartTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #heatEndTime="{ scope }">
          {{ unitFormatDate(scope.row.heatEndTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #offlineTime="{ scope }">
          {{ unitFormatDate(scope.row.offlineTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #note="{ scope }">
          {{ truncateText(scope.row.note) }}
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status == '1' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-if="scope.row.status == '1'"
            v-model="scope.row.status"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="
              () =>
                statusChanged(scope.row, delRoom, () => fetchData(), 'status', {
                  activeValue: '1',
                  inactiveValue: '0'
                })
            "
          ></el-switch>
        </template>
        <template #operation="{ scope }">
          <el-link style="color: blue; margin-right: 20px" @click="viewUserManagement(scope.row)">成员管理</el-link>
          <el-link style="color: #00aaaa; margin-right: 20px" @click="viewMessageManagement(scope.row)">
            消息管理
          </el-link>
          <el-link style="color: red; margin-right: 20px" @click="confirmDelRoom(scope.row)">解散</el-link>
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
  <!-- 规则配置 -->
  <RulesConfigDialog />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import i18n from '@/locales'
const { t } = i18n.global as any
import showErrorMessage from '@/utils/showErrorMessage'
import ExpandableSection from '@/components/expandIcon/index.vue'
//import router from '@/router'
import { unitFormatDate } from '@/utils/dateFormat/index'
import type { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import CreateRoomDialog from '@/views/ChatroomSystem/chatroomList/components/createRoomDialog.vue'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import router from '@/router'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import SelectUserId from '@/components/selectUserId/index.vue'
import { statusChanged } from '@/utils/table'
import { delRoom, enhanceWithUserInfo, getHistoryRoomList, reqChatRoomList } from '@/api/chat'
import { truncateText } from '@/utils/dataFormat'
const modalsStore = useModalsStore()
const valueBus = useValueBus()
const manageSiteStore = useManageSiteStore()
const tableData = ref<any[]>([])
const isExpanded = ref(false)
const queryRef = ref()
const status = ref('1')
const options = computed(
  () =>
    [
      {
        label: '语音房ID',
        prop: 'id',
        slot: 'voiceRoomId',
        minWidth: 180
      },
      {
        label: '语音房名称',
        prop: 'title',
        minWidth: 180
      },
      {
        label: '语音房简介',
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
        prop: 'userNum',
        align: 'right',
        hide: status.value != '1'
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
        width: 180,
        hide: status.value != '0'
      },
      {
        label: '热门开始时间',
        prop: 'heatStartTime',
        slot: 'heatStartTime',
        width: 200
      },
      {
        label: '热门结束时间',
        prop: 'heatEndTime',
        slot: 'heatEndTime',
        width: 200
      },
      // {
      //   label: '状态',
      //   prop: 'status',
      //   slot: 'status',
      //   width: 110
      // },
      {
        label: '操作',
        prop: 'operation',
        slot: 'operation',
        width: 250,
        hide: status.value != '1'
      },
      {
        label: '操作',
        prop: 'operation',
        slot: 'operationForClosed',
        width: 180,
        hide: status.value == '1'
      }
    ].filter((opt) => opt.hide !== true) as TableOptions[]
)

const initQueryForm = () => {
  return {
    id: '',
    title: '',
    nickname: '',
    startTime: '',
    endTime: '',
    heatStartTime: '',
    heatEndTime: '',
    state: '1',
    type: 'VOICE',
    userId: ''
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

const createRoom = (rowData: any) => {
  console.log('查看用户详情', rowData)

  modalsStore.setActiveTab('createRoomModal', 'tab1')
  modalsStore.setModalData('createRoomModal', { activeRoomTab: 'roomTab2' })
  modalsStore.showModal('createRoomModal')
}

const openRulesDialog = (rowData: any) => {
  modalsStore.setActiveTab('rulesConfigModal', 'first')
  modalsStore.setModalData('rulesConfigModal', {})
  modalsStore.showModal('rulesConfigModal')
}

const viewUserDetails = (rowData: any) => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData.userId
  })
  modalsStore.showModal('userInfoModal')
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

const handleResetRefresh = () => {
  handleReset()
  fetchData()
}

const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
}

//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  if (_queryForm.state.toString() !== status.value.toString()) {
    currentPage.value = 1
  }
  let params = {
    ..._queryForm,
    page: currentPage.value,
    size: pageSize.value,
    type: 'VOICE'
  }
  if (params.state !== '1') {
    params.nickname = ''
  }
  try {
    const response = params.state === '1' ? await reqChatRoomList(params) : await getHistoryRoomList(params)
    if (response.success) {
      const tempList = response!.data?.list
      const enhancedList = await enhanceWithUserInfo(tempList)
      tableData.value = (enhancedList?.map((item: any) => {
        item.status = item.onlineState + ''
        item.createTime = params.state === '1' ? item.createTime : item.startTime
        item.offlineTime = params.state === '1' ? item.offlineTime : item.endTime
        return item
      }) || []) as any
      total.value = Number(response!.data!.total) || 0
      status.value = params.state
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const viewUserManagement = (data: any) => {
  console.log('成员管理', data)
  valueBus.resetValue('voiceRoomUserModal')
  valueBus.setValue('voiceRoomUserModal', { ...data, componentKey: Math.random() })
  router
    .push({
      path: '/voiceRoomManagement/voiceRoomUserManagement',
      query: { id: data.id, title: data.title }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}

const viewMessageManagement = (data: any) => {
  console.log('消息管理', data)
  valueBus.resetValue('voiceRoomUserModal')
  valueBus.setValue('voiceRoomUserModal', { id: data.id, componentKey: Math.random() })
  router
    .push({
      path: '/voiceRoomManagement/voiceRoomMessageManagement',
      query: { id: data.id }
    })
    .catch((err) => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('Navigation error:', err)
      }
    })
}
const doDelRoom = async (data: any) => {
  try {
    const response = await delRoom(data)
    if (response.success) {
      ElMessage.success('解散成功')
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const confirmDelRoom = (data: any) => {
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonText: t('button.cancel'),
    type: 'warning'
  })
    .then(() => doDelRoom(data))
    .catch(() => {
      throw new Error('用户取消操作')
    })
}
onMounted(async () => {
  console.log(manageSiteStore)

  fetchData()
})
</script>

<style scoped lang="less">
.wrapper {
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}

.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
</style>
