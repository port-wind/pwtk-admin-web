<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" @keyup.enter="fetchData(queryForm)">
        <el-form-item label="" prop="task_name">
          <el-input v-model="queryForm.task_name" placeholder="任务名称" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname
            v-model="queryForm.nickname"
            placeholder="创建人"
            @on-select="(info) => (queryForm.creatorId = info?.other?.userId!)"
          />
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryForm.status" placeholder="任务状态">
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
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="createRoom">
            <el-icon><Plus /></el-icon>
            新增
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
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #name="{ scope }">
          <p class="like-a overflow-hidden" @click="viewTaskDetails(scope.row)">
            {{ truncateText(scope.row.task_name || scope.row.room_name || '匿名直播间') }}
          </p>
          <!-- <p class="overflow-hidden" v-else>{{ truncateText(scope.row.name) }}</p> -->
        </template>
        <template #creater="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row, 'userId')">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #description="{ scope }">
          {{ truncateText(scope.row.room_description) }}
        </template>
        <template #startTime="{ scope }">
          {{ unitFormatDate(scope.row.start_time, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #enable_loop_streaming="{ scope }">
          {{ scope.row.enable_loop_streaming ? '是' : '否' }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.loop_end_time ?? scope.row.end_time, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #remark="{ scope }">
          {{ truncateText(scope.row.remark) }}
        </template>
        <template #updateTime="{ scope }">
          {{ unitFormatDate(scope.row.updated_at, 'yyyy-MM-dd HH:mm:ss') }}
        </template>

        <template #status="{ scope }">
          <span
            style="font-size: 12px; font-weight: 500"
            :style="{
              color: findStatusByValue(scope.row.status).color
            }"
          >
            {{ findStatusByValue(scope.row.status).label }}
          </span>
        </template>
        <template #operation="{ scope }">
          <!-- {{ scope.row.status }} -->
          <el-link
            v-if="
              scope.row.status !== 'transcoding' && scope.row.status !== 'canceled' && scope.row.status !== 'completed'
            "
            style="color: red; margin-right: 20px"
            @click="confirmDelTask(scope.row)"
          >
            取消
          </el-link>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 用户页面 -->
  <UserListComponent></UserListComponent>
  <!-- 创建房间 -->
  <CreateTaskRoomDialog
    v-if="showCreateTaskRoomDialog"
    v-model="showCreateTaskRoomDialog"
    :taskId="selectedRow.id!"
    activeRoomTab="liveRoom"
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
import { truncateText } from '@/utils/dataFormat'
import { cancelLiveTask, getVideoTaskList } from '@/api/task/liveTaskIndex'
import { enhanceWithUserInfo } from '@/api/chat'
import { viewUserDetails } from '@/views/VideoList/videoUtils'

const { t } = i18n.global as any
const selectedRow = ref<{ id?: string }>({})
const tableData = ref<any[]>([])
// const isExpanded = ref(false)
const queryRef = ref()
const StatusOptions = [
  { value: 'pending_transcoding', label: '等待转码', color: '#E6A23C' },
  { value: 'pending_start', label: '等待开始', color: '#409EFF' },
  { value: 'transcoding', label: '转码中', color: '#9C27B0' },
  { value: 'streaming', label: '推流中', color: '#67C23A' },
  { value: 'transcoding_failed', label: '转码失败', color: '#F56C6C' },
  { value: 'streaming_failed', label: '推流失败', color: '#F56C6C' },
  { value: 'canceled', label: '已取消', color: '#909399' },
  { value: 'completed', label: '已完成', color: '#67C23A' }
]
const findStatusByValue = (value: string) => {
  const option = StatusOptions.find((op) => op.value === value)
  return option || { label: '未知状态', color: '#909399' }
}
const showCreateTaskRoomDialog = ref(false)
const options = computed(
  () =>
    [
      {
        label: '任务名称',
        prop: 'name',
        slot: 'name',
        minWidth: 150
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
        label: '重复播放',
        prop: 'enable_loop_streaming',
        slot: 'enable_loop_streaming',
        width: 100
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
        width: 150
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
    task_name: '',
    nickname: '',
    creatorId: '',
    startTime: '',
    endTime: '',
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

const viewTaskDetails = (rowData: any) => {
  console.log('查看任务详情', rowData)
  selectedRow.value = rowData
  showCreateTaskRoomDialog.value = true
}
//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  const params: any = {
    ..._queryForm,
    created_by_user_id: _queryForm.creatorId,
    start_time_from: _queryForm.startTime,
    start_time_to: _queryForm.endTime,
    page: currentPage.value,
    pageSize: pageSize.value
  }
  if (params.status === 'L' || params.status === '') {
    delete params.status
  }
  try {
    const response = await getVideoTaskList(params)
    if (response.success) {
      let tempList = response!.data?.tasks.map((item: any) => {
        return {
          ...item,
          userId: item.created_by_user_id
        }
      })
      tempList = await enhanceWithUserInfo(tempList)
      tableData.value = tempList || []
      total.value = Number(response!.data?.total) || 0
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
    const response = await cancelLiveTask({ id: data.id })
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
