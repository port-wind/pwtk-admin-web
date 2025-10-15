<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form :inline="true" class="custom-el-form no-rule" :model="queryForm" @keyup.enter="fetchData(queryForm)">
        <el-form-item label="" prop="searchName">
          <el-input v-model="queryForm.searchName" placeholder="任务名称" :style="{ width: '147px' }" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <SelectUserIdAndNickname
            v-model="queryForm.userId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="创建人"
            :style="{ width: '147px' }"
          />
          <!-- <AutoChoseNickname v-model="queryForm.nickname" placeholder="创建人"
            @on-select="(info) => (queryForm.creatorId = info?.other?.userId!)" :style="{ width: '147px' }" /> -->
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryForm.status" placeholder="任务状态" :style="{ width: '147px' }">
            <el-option value="L" label="全部">全部</el-option>
            <el-option
              v-for="item in StatusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="预计开始时间"
            end-placeholder="预计结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect2>
        </el-form-item>
        <!-- <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection> -->
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
            新增
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
        <template #name="{ scope }">
          <p class="like-a overflow-hidden" @click="viewTaskDetails(scope.row)">
            {{ truncateText(scope.row.name) }}
          </p>
          <!-- <p class="overflow-hidden" v-else>{{ truncateText(scope.row.name) }}</p> -->
        </template>
        <template #creater="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.creatorNickname) }}
          </p>
        </template>
        <template #description="{ scope }">
          {{ truncateText(scope.row.description) }}
        </template>
        <template #startTime="{ scope }">
          {{ unitFormatDate(scope.row.startTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.estimatedEndTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #remark="{ scope }">
          {{ truncateText(scope.row.remark) }}
        </template>

        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ findLabelByValue(scope.row.status) }}
          </span>
        </template>
        <template #operation="{ scope }">
          <el-link
            v-if="scope.row.status === 'PENDING' || scope.row.status === 'IN_PROGRESS'"
            style="color: red; margin-right: 20px"
            @click="confirmDelTask(scope.row)"
          >
            取消
          </el-link>
        </template>
      </m-table>
    </section>
  </section>
  <!-- 用户页面 -->
  <UserListComponent></UserListComponent>
  <!-- 创建房间 -->
  <CreateTaskRoomDialog
    v-if="showCreateTaskRoomDialog"
    v-model="showCreateTaskRoomDialog"
    :taskId="selectedRow.id!"
    activeRoomTab="voiceRoom"
    @refresh="fetchData"
  />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import i18n from '@/locales'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import type { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { useModalsStore } from '@/stores/modalStore'
import { truncateText } from '@/utils/dataFormat'
import { cancelVoiceRoomTask, getVoiceRoomTaskList } from '@/api/task'

const { t } = i18n.global as any
const selectedRow = ref<{ id?: string }>({})
const modalsStore = useModalsStore()
const tableData = ref<any[]>([])
// const isExpanded = ref(false)
const queryRef = ref()
const StatusOptions = [
  { value: 'PENDING', label: '等待开始' },
  { value: 'IN_PROGRESS', label: '进行中' },
  { value: 'COMPLETED', label: '已完成' },
  { value: 'CANCELLED', label: '已取消' },
  { value: 'FAILED', label: '已失败' }
]
const showCreateTaskRoomDialog = ref(false)
const options = computed(
  () =>
    [
      {
        label: '任务名称',
        prop: 'name',
        slot: 'name',
        minWidth: 180
      },
      {
        label: '房间简介',
        prop: 'description',
        slot: 'description',
        minWidth: 150
      },
      {
        label: '创建人',
        prop: 'creater',
        slot: 'creater',
        minWidth: 150
      },
      {
        label: '预计开始时间',
        prop: 'startTime',
        slot: 'startTime',
        width: 180
      },
      {
        label: '预计结束时间',
        prop: 'endTime',
        slot: 'endTime',
        width: 180
      },
      {
        label: '状态',
        prop: 'status',
        slot: 'status',
        width: 110
      },
      {
        label: '备注',
        prop: 'remark',
        slot: 'remark',
        width: 180
      },
      {
        label: '操作',
        prop: 'operation',
        slot: 'operation',
        width: 100
      }
    ] as TableOptions[]
)

const initQueryForm = () => {
  return {
    searchName: '',
    nickname: '',
    creatorId: '',
    startTime: '',
    endTime: '',
    heatStartTime: '',
    heatEndTime: '',
    status: ''
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

const createRoom = () => {
  selectedRow.value = {}
  showCreateTaskRoomDialog.value = true
}

const viewUserDetails = (rowData: any) => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData.creatorId
  })
  modalsStore.showModal('userInfoModal')
}

const viewTaskDetails = (rowData: any) => {
  console.log('查看任务详情', rowData)
  selectedRow.value = rowData
  showCreateTaskRoomDialog.value = true
}
//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  const params = {
    ..._queryForm,
    page: currentPage.value,
    pageSize: pageSize.value
  }
  if (params.status === 'L') {
    params.status = ''
  }
  try {
    const response = await getVoiceRoomTaskList(params)
    if (response.success) {
      const tempList = response!.data?.items
      const pagination = response!.data?.pagination
      tableData.value = tempList || []
      total.value = Number(pagination?.total) || 0
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const returnFetchData = () => {
  fetchData(queryForm)
}
const findLabelByValue = (value: string) => {
  const option = StatusOptions.find((op) => op.value === value)
  return option ? option.label : undefined
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

const doDelRoom = async (data: any) => {
  try {
    const response = await cancelVoiceRoomTask({ id: data.id })
    if (response.success) {
      ElMessage.success('取消成功')
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const confirmDelTask = (data: any) => {
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
  fetchData()
})
</script>

<style scoped lang="less">
.blue-text {
  color: #409eff;
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
