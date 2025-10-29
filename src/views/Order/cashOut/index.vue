<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef" class="video-search-area">
      <el-form :inline="true" class="search_left" :model="queryForm" @keyup.enter="fetchData(queryForm)">
        <el-form-item label="" prop="recordId">
          <el-input v-model="queryForm.recordId" placeholder="订单号" />
        </el-form-item>
        <el-form-item class="el-select-extra" label="" prop="userId">
          <SelectUserIdAndNickname
            v-model="queryForm.userId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
          />
        </el-form-item>
        <el-form-item label="" prop="state">
          <el-select v-model="queryForm.state" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="已兑换" :value="1" />
            <el-option label="兑换失败" :value="2" />
            <el-option label="待审核" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="下单开始时间"
            end-placeholder="下单结束时间"
            v-model:startDate="queryForm.createStartTime"
            v-model:endDate="queryForm.createEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="操作开始时间"
            end-placeholder="操作结束时间"
            v-model:startDate="queryForm.operateStartTime"
            v-model:endDate="queryForm.operateEndTime"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="3"></ExpandableSection>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <!-- <el-button type="danger" @click="handleAudit">
            <el-icon><Finished /></el-icon>
            审核
          </el-button> -->
          <el-button type="primary" @click="handleConfig">
            <el-icon><Setting /></el-icon>
            修改规则配置
          </el-button>
          <template v-if="showMultiOptions">
            <el-popover :visible="passAuditCashOutReasonVisible" placement="bottom" :width="300">
              <template #reference>
                <el-button
                  type="success"
                  :icon="Check"
                  @click=";(unPassAuditCashOutReasonVisible = false), preSubmitAudit(1)"
                  plain
                >
                  通过
                </el-button>
              </template>
              <!-- @click="onSubmitAudit(1)" -->
              <AuditCashOutReason
                v-if="passAuditCashOutReasonVisible"
                @close="passAuditCashOutReasonVisible = false"
                @submit="onSubmitAudit(1, $event)"
              ></AuditCashOutReason>
            </el-popover>
            <el-popover :visible="unPassAuditCashOutReasonVisible" placement="bottom" :width="300">
              <template #reference>
                <el-button
                  type="danger"
                  :icon="Close"
                  @click=";(passAuditCashOutReasonVisible = false), preSubmitAudit(2)"
                  plain
                >
                  拒绝
                </el-button>
              </template>
              <!-- @click="onSubmitAudit(1)" -->
              <AuditCashOutReason
                v-if="unPassAuditCashOutReasonVisible"
                @close="unPassAuditCashOutReasonVisible = false"
                @submit="onSubmitAudit(2, $event)"
              ></AuditCashOutReason>
            </el-popover>
          </template>
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
        :multi-select="true"
        :multi-select-logic="multiSelectLogic"
        class="table"
        :is-loading="isLoading"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #recordId="{ scope }">
          {{ scope.row.recordId }}
          <Copy :content="scope.row.recordId" />
        </template>
        <template #nickname="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.userNickname) }}
          </p>
        </template>
        <template #platAccount="{ scope }">
          <el-popover placement="top-start" :width="300">
            <template #reference>
              {{ truncateText(scope.row.platAccount) }}
            </template>
            {{ scope.row.platAccount }}
          </el-popover>
        </template>
        <template #platName="{ scope }">
          <el-popover placement="top-start" :width="300">
            <template #reference>
              {{ truncateText(scope.row.platName) }}
            </template>
            {{ scope.row.platName }}
          </el-popover>
        </template>
        <template #platUserName="{ scope }">
          <el-popover placement="top-start" :width="300">
            <template #reference>
              {{ truncateText(scope.row.platUserName) }}
            </template>
            {{ scope.row.platUserName }}
          </el-popover>
        </template>
        <template #state="{ scope }">
          <el-tag
            :type="getStateTagType(scope.row.state)"
            :effect="getStateTagEffect(scope.row.state)"
            v-if="String(scope.row.state) !== '3'"
          >
            {{ getStateText(scope.row.state) }}
          </el-tag>
          <el-tag v-else :type="getStateTagType(scope.row.state)" :effect="getStateTagEffect(scope.row.state)">
            {{ getStateText(scope.row.state) }}
          </el-tag>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #operateTime="{ scope }">
          {{ unitFormatDate(scope.row.operateTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #reason="{ scope }">
          <el-popover placement="top-start" :width="300" trigger="click" v-if="String(scope.row.state) !== '3'">
            <!-- <template #reference>
              {{ truncateText(scope.row.reason) }}
            </template>
            {{ scope.row.reason }} -->
            <template #reference>
              <el-link @click="singleAuditCashOutReasonVisible = true" plain>查看</el-link>
            </template>
            <!-- @click="onSubmitAudit(1)" -->
            <AuditCashOutReason :viewOnly="true" :reason="scope.row.reason"></AuditCashOutReason>
          </el-popover>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 用户页面 -->
  <UserListComponent></UserListComponent>
  <!-- 审核提现 -->
  <AuditCashOut v-if="showCashOutDialog" v-model="showCashOutDialog" @refresh="fetchData" />
  <!-- 修改规则配置 -->
  <el-dialog
    v-model="showConfigDialog"
    class="tabs-dialog"
    draggable
    overflow
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-tabs model-value="cashOutConfig" class="article-tabs m_tabs">
      <el-tab-pane label="提现规则配置" name="cashOutConfig" class="article-content m_tabs_pane">
        <CashOutConfig @close="showConfigDialog = false"></CashOutConfig>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'

import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import type { TableOptions } from '@/components/mTable/types'
import { truncateText } from '@/utils/dataFormat'
import { viewUserDetails } from '@/views/VideoList/videoUtils'
import { auditWithdrawal, reqWithdrawalList } from '@/api/order/orderList'
import ExpandableSection from '@/components/expandIcon/index.vue'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'

const isExpanded = ref(false)
const passAuditCashOutReasonVisible = ref(false)
const unPassAuditCashOutReasonVisible = ref(false)
const singleAuditCashOutReasonVisible = ref(false)
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'id',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  },
  checkableStrategy: (row) => {
    console.log('row', row)
    return String(row.state) !== '3'
  }
})
const showMultiOptions = computed(() => {
  return multiSelectLogic.isAllSelected.value || multiSelectLogic.isIndeterminate.value
})
const showCashOutDialog = ref(false)
const showConfigDialog = ref(false)
const tableData = ref<any[]>([])
const queryRef = ref()
const options: TableOptions[] = [
  {
    label: '订单号',
    prop: 'recordId',
    slot: 'recordId',
    minWidth: 180
  },
  {
    label: '用户昵称',
    prop: 'nickname',
    slot: 'nickname',
    minWidth: 180
  },
  {
    label: '兑换平台',
    prop: 'platName',
    slot: 'platName',
    minWidth: 120
  },
  {
    label: '平台姓名',
    prop: 'platUserName',
    slot: 'platUserName',
    minWidth: 120
  },
  {
    label: '平台帐号',
    prop: 'platAccount',
    slot: 'platAccount',
    minWidth: 120
  },
  {
    label: '兑换金额',
    prop: 'amount',
    align: 'right'
  },
  {
    label: '下单时间',
    prop: 'createTime',
    slot: 'createTime',
    minWidth: 180
  },
  {
    label: '状态',
    prop: 'state',
    slot: 'state',
    minWidth: 100
  },
  {
    label: '理由',
    prop: 'reason',
    slot: 'reason',
    minWidth: 80
  },
  {
    label: '操作人',
    prop: 'operateName'
  },
  {
    label: '操作时间',
    prop: 'operateTime',
    slot: 'operateTime',
    minWidth: 180
  }
]

const initQueryForm = () => {
  return {
    recordId: '',
    nickname: '',
    state: 'L',
    createStartTime: '',
    createEndTime: '',
    operateStartTime: '',
    operateEndTime: '',
    userId: ''
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

// 状态标签相关函数
const getStateText = (state: number | string) => {
  switch (Number(state)) {
    case 1:
      return '已兑换'
    case 2:
      return '兑换失败'
    case 3:
      return '待审核'
    default:
      return '未知状态'
  }
}

const getStateTagType = (state: number | string) => {
  switch (Number(state)) {
    case 1:
      return 'success'
    case 2:
      return 'danger'
    case 3:
      return 'warning'
    default:
      return 'info'
  }
}

const getStateTagEffect = (state: number | string): 'plain' | 'light' | 'dark' => {
  switch (Number(state)) {
    case 1:
      return 'light'
    case 2:
      return 'light'
    case 3:
      return 'light'
    default:
      return 'light'
  }
}

// const handleAudit = () => {
//   console.log('审核')
//   showCashOutDialog.value = true
// }
const handleConfig = () => {
  console.log('修改规则配置')
  showConfigDialog.value = true
}
//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  const params = {
    ..._queryForm,
    page: currentPage.value,
    size: pageSize.value,
    userSearchId: _queryForm.userId
  }
  if (params.state === 'L') {
    // @ts-ignore
    delete params.state
  }
  isLoading.value = true
  try {
    const response = await reqWithdrawalList(params)
    if (response.success) {
      console.log(response)
      const tempList = response.data.list
      tableData.value = tempList
      total.value = Number(response.data.total) || 0
      //   status.value = params.state
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
const preSubmitAudit = (type: 1 | 2) => {
  const someChoosed = tableData.value.some((item) => item.checked)
  if (!someChoosed) {
    ElMessage({
      message: '请选择要审核的帖子',
      type: 'warning'
    })
    return
  }
  if (type === 1) {
    passAuditCashOutReasonVisible.value = true
  } else {
    unPassAuditCashOutReasonVisible.value = true
  }
}
const onSubmitAudit = async (auditStatus: 1 | 2, reasonForm?: any) => {
  const someChoosed = tableData.value.some((item) => item.checked)
  if (!someChoosed) {
    ElMessage({
      message: '请选择要审核的帖子',
      type: 'warning'
    })
    return
  }
  isLoading.value = true
  try {
    const query = {
      idList: tableData.value.filter((item) => item.checked).map((item) => item.recordId),
      state: auditStatus,
      reason: reasonForm?.reason
    }
    console.log(query)

    const res = await auditWithdrawal(query)
    if (res.success) {
      ElMessage({
        message: '操作成功',
        type: 'success'
      })
      // 关闭dailog
      await fetchData()
      if (auditStatus === 1) {
        passAuditCashOutReasonVisible.value = false
      } else {
        unPassAuditCashOutReasonVisible.value = false
      }
      fetchData()
    } else {
      ElMessage({
        message: '操作失败,请稍后再试试',
        type: 'error'
      })
    }
  } catch (error: any) {
    console.error(error)
    const msg = error.code && error.code === 'ERR_NETWORK' ? '网络异常,请稍后再试' : '操作失败,请稍后再试'
    ElMessage({
      message: msg,
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
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

onMounted(async () => {
  await fetchData()
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
