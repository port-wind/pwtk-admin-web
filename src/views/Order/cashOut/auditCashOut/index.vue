<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    draggable
    @close="closeTabs"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="审核" name="audit" class="m_tabs_pane">
        <section ref="queryRef">
          <el-form
            :inline="true"
            class="custom-el-form no-rule"
            :model="queryForm"
            label-width="70px"
            @keyup.enter="fetchData()"
            ref="formRef"
          >
            <el-form-item label="" prop="recordId">
              <el-input v-model="queryForm.recordId" placeholder="订单号" />
            </el-form-item>
            <el-form-item class="el-select-extra" label="" prop="userId" style="width: 130px">
              <SelectUserIdAndNickname
                v-model="queryForm.userId"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
              />
            </el-form-item>
            <el-form-item label="" prop="time">
              <TimeSelect
                start-placeholder="下单开始时间"
                end-placeholder="下单结束时间"
                v-model:startDate="queryForm.createStartTime"
                v-model:endDate="queryForm.createEndTime"
              ></TimeSelect>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="fetchData()" :loading="isLoading">查询</el-button>
              <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
              <el-popover :visible="passAuditCashOutReasonVisible" placement="bottom" :width="300">
                <template #reference>
                  <el-button
                    type="success"
                    :icon="Check"
                    @click=";(unPassAuditCashOutReasonVisible = false), preSubmitAudit(1)"
                    plain
                  >
                    过审
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
                    未过审
                  </el-button>
                </template>
                <!-- @click="onSubmitAudit(1)" -->
                <AuditCashOutReason
                  v-if="unPassAuditCashOutReasonVisible"
                  @close="unPassAuditCashOutReasonVisible = false"
                  @submit="onSubmitAudit(2, $event)"
                ></AuditCashOutReason>
              </el-popover>
              <!-- <el-button type="success" :icon="Check" @click="onSubmitAudit(1)" plain>过审</el-button> -->
              <!-- <el-button type="danger" :icon="Close" @click="onSubmitAudit(2)" plain>未过审</el-button> -->
            </el-form-item>
          </el-form>
        </section>
        <section style="display: flex; flex-direction: column; flex: 1; overflow: hidden">
          <div class="main_flex_table">
            <m-table
              :options="options"
              :data="tableData"
              :total="total"
              :currentPage="currentPage"
              :pageSize="pageSize"
              :multi-select="true"
              :multi-select-logic="multiSelectLogic"
              pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
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
              <template #createTime="{ scope }">
                {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </template>
            </m-table>
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { truncateText } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { viewUserDetails } from '@/views/VideoList/videoUtils'
import type { TableOptions } from '@/components/mTable/types'
import { auditWithdrawal, reqWithdrawalList } from '@/api/order/orderList'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'

const isLoading = ref(true)
const activeTab = ref('audit')
const emits = defineEmits(['close', 'update:modelValue', 'refresh'])
const passAuditCashOutReasonVisible = ref(false)
const unPassAuditCashOutReasonVisible = ref(false)
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
    label: '兑换金额',
    prop: 'amount',
    align: 'right'
  },
  {
    label: '下单时间',
    prop: 'createTime',
    slot: 'createTime',
    minWidth: 130
  }
]

const initQueryForm = () => {
  return {
    recordId: '',
    nickname: '',
    createStartTime: '',
    createEndTime: '',
    userId: ''
  }
}
const queryForm = reactive<any>(initQueryForm())
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'recordId',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  }
})

const fetchData = async () => {
  // Only validate time if delayed effect is enabled
  isLoading.value = true
  try {
    const query: any = {
      ...queryForm,
      page: currentPage.value,
      size: pageSize.value,
      state: '3',
      userSearchId: queryForm.userId
    }
    const res = await reqWithdrawalList(query)
    if (res.success && res.data) {
      tableData.value = res.data.list.map((item) => ({
        ...item,
        checked: false,
        userId: item.userId
      }))
      total.value = Number(res.data.total)
    } else {
      ElMessage({
        message: '获取审核数据失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
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
      emits('refresh')
    } else {
      ElMessage({
        message: '操作失败,请稍后再试试',
        type: 'error'
      })
    }
  } catch (error) {
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
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}

const closeTabs = () => {
  emits('close')
  emits('update:modelValue', false)
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
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less">
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  row-gap: 10px;
  .el-table {
    flex: 1;
  }
}
</style>
