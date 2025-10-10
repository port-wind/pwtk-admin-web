<script setup lang="ts">
import { ref } from 'vue'
import {
  reqPaymentList,
  confirmPayment,
  cancelPayment,
  type IConfirmPaymentQueryParams,
  type ICancelPaymentQueryParams
} from '@/api/order/orderList/index'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore } from '@/stores/modalStore'
import { EOrderState, type IReqPaymentListData, type IReqPaymentListQueryParams } from '@/api/order/orderList/type'
import ExpandableSection from '@/components/expandIcon/index.vue'

const modalsStore = useModalsStore()
const isExpanded = ref(false)
const tableData = ref<IReqPaymentListData[]>([])
const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const initalValue = ref<any>(0)
const queryRef = ref()
const initQueryForm = (): IReqPaymentListQueryParams => {
  return {
    page: 1,
    size: 15,
    payOrderId: '',
    userId: '',
    nickname: '',
    beginCreateTime: '',
    endCreateTime: '',
    beginOperateTime: '',
    endOperateTime: ''
  }
}

const initPaymentOrder = (): IReqPaymentListData => {
  return {
    amount: 0,
    bizId: 0,
    bizType: '',
    createTime: '',
    payOrderId: 0,
    state: EOrderState.PENDING_VALIDATION,
    userId: 0,
    score: 0
  }
}
const states = ref('1')
const options = [
  {
    value: '1',
    label: '全部',
    data: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    value: '2',
    label: '充值成功',
    data: [2, 5]
  },
  {
    value: '3',
    label: '支付中',
    data: [0, 1]
  },
  {
    value: '4',
    label: '订单关闭',
    data: [6]
  },
  {
    value: '5',
    label: '充值失败',
    data: [4]
  },
  {
    value: '6',
    label: '支付超时',
    data: [3]
  }
]

const currentOrder = ref<IReqPaymentListData>(initPaymentOrder())
const queryForm = reactive(initQueryForm())

const fetchData = async () => {
  isLoading.value = true

  const params: IReqPaymentListQueryParams = {
    ...queryForm,
    page: currentPage.value,
    size: pageSize.value
  }
  const statesData = options.find((item) => item.value === states.value)
  if (statesData) {
    params.states = statesData.data
  }
  try {
    const response: any = await reqPaymentList(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
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

const resetButton = () => {
  states.value = '1'
  Object.assign(queryForm, initQueryForm())
  console.log(queryForm)
  currentPage.value = 1
  fetchData()
}

const dialogFormVisible = ref(false)
const form = reactive({
  amount: 0
})

const topup = async () => {
  const params: IConfirmPaymentQueryParams = {
    amount: initalValue.value,
    payOrderId: currentOrder.value.payOrderId.toString()
  }
  try {
    const response: any = await confirmPayment(params)
    if (response.success) {
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    dialogFormVisible.value = false
    currentOrder.value = initPaymentOrder()
  }
}

const cancelOrder = async (row) => {
  const query: ICancelPaymentQueryParams = {
    payOrderId: row.payOrderId,
    userId: row.userId
  }
  try {
    const response: any = await cancelPayment(query)
    if (response.success) {
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const handTabs = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId,
    showCommitButton: false
  })
  modalsStore.showModal('userInfoModal')
}

const onCloseTopUpDialogPanel = () => {
  dialogFormVisible.value = false
  currentOrder.value = initPaymentOrder()
  initalValue.value = ''
}

const openConfirmTopUp = (row) => {
  dialogFormVisible.value = true
  currentOrder.value = row

  initalValue.value = row.amount
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryForm"
        class="search_left"
        label-width="70px"
        @keyup.enter="fetchData()"
      >
        <el-form-item prop="payOrderId">
          <AutoComplete
            v-model="queryForm.payOrderId as string"
            :httpFunc="reqPaymentList"
            keyword="payOrderId"
            placeholder="订单号"
            :displayFields="['payOrderId']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="userId">
          <AutoChoseLoginId v-model="queryForm.userId as string" />
        </el-form-item>
        <el-form-item prop="nickname">
          <AutoComplete
            v-model="queryForm.nickname"
            :httpFunc="reqUserList"
            keyword="nickname"
            placeholder="用户昵称"
            :displayFields="['nickname']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="states">
          <el-select v-model="states" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="createTime">
          <TimeSelect
            start-placeholder="下单开始时间"
            end-placeholder="下单结束时间"
            v-model:startDate="queryForm.beginCreateTime"
            v-model:endDate="queryForm.endCreateTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item prop="operateTime">
          <TimeSelect
            start-placeholder="操作开始时间"
            end-placeholder="操作结束时间"
            v-model:startDate="queryForm.beginOperateTime"
            v-model:endDate="queryForm.endOperateTime"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection>

        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton()" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <el-table
        v-loading="isLoading"
        :data="tableData"
        stripe
        highlight-current-row
        style="height: 100%; width: 100%"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="订单号" key="payOrderId" prop="payOrderId" minWidth="190" />
        <el-table-column label="账户名称 | 账户昵称" key="userLoginId" prop="userLoginId" minWidth="220">
          <template #default="{ row }">
            <p class="like-a overflow-hidden" @click="handTabs(row)">{{ row.userLoginId }} | {{ row.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="充值类型" key="bizType" prop="bizType" minWidth="85">
          <template #default="{ row }">
            <span v-if="row.bizType == 's'">积分充值</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="right" key="amount" prop="amount" minWidth="80" />
        <el-table-column label="转换积分" align="right" key="score" prop="score" minWidth="80" />
        <el-table-column label="下单时间" key="createTime" prop="createTime" minWidth="170">
          <template #default="{ row }">
            {{ unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" key="state" prop="state" minWidth="85">
          <template #default="{ row }">
            <el-tag v-if="row.state == 0 || row.state == 1" size="large" type="warning" effect="dark">支付中</el-tag>
            <el-tag v-else-if="row.state == 2 || row.state == 5" size="large" type="success" effect="plain">
              充值成功
            </el-tag>
            <el-tag v-else-if="row.state == 4" size="large" type="danger" effect="dark">充值失败</el-tag>
            <el-tag v-else-if="row.state == 3" size="large" type="danger" effect="dark">支付超时</el-tag>
            <el-tag v-else-if="row.state == 6" size="large" type="info">订单关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" key="operation" prop="operation" minWidth="100">
          <template #default="{ row }">
            <div class="wrapper-option">
              <div>
                <el-link
                  v-if="!(row.state === 2 || row.state === 5 || row.state === 6)"
                  class="like-a"
                  @click="openConfirmTopUp(row)"
                >
                  手动充值
                </el-link>
              </div>
              <div>
                <el-link v-if="row.state == 0 || row.state == 1" class="like-a" @click="cancelOrder(row)">
                  取消订单
                </el-link>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" key="operateName" prop="operateName" minWidth="80" />
        <el-table-column label="操作时间" align="left" key="operateTime" prop="operateTime" minWidth="175">
          <template #default="{ row }">
            <span v-if="row.operateTime">
              {{ unitFormatDate(row.operateTime, 'yyyy-MM-dd HH:mm:ss') }}
            </span>
            <!-- <span v-else-if="row.state == 0 || row.state == 1" class="like-a" @click="cancelOrder(row)">取消订单</span> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
  </section>
  <UserListComponent></UserListComponent>

  <!-- 手动充值金额 dialog 窗口 -->
  <el-dialog
    class="custom-dialog"
    @close="onCloseTopUpDialogPanel()"
    v-model="dialogFormVisible"
    title=""
    width="500"
    left
  >
    <el-form :model="form" label-width="auto">
      <el-form-item label="">
        <el-text size="large">警告</el-text>
      </el-form-item>
      <el-form-item label="">
        <div class="warnning-info">
          <el-icon :size="24" color="#d9001b"><WarningFilled /></el-icon>
          确定要进行要执行确认充值吗？
        </div>
      </el-form-item>
      <el-form-item label="订单金额:">
        <el-input type="number" :disabled="!!currentOrder.amount" style="width: 100px" v-model="initalValue" />
      </el-form-item>
      <el-form-item label="转换积分:">
        <el-text>{{ initalValue * 100 }}</el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCloseTopUpDialogPanel()">取消</el-button>
        <el-button type="primary" @click="topup()">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less">
:root {
  --el-color-danger: #d9001b;
}

.el-tag--large {
  height: 26px;
  padding: 2px;
  --el-icon-size: 20px;
  font-family: PingFangTC-Regular, 'PingFang TC', sans-serif;
  min-width: 54px;
}

.wrapper-option {
  display: flex;
  column-gap: 20px;
}
.warnning-info {
  display: flex;
  place-items: center;
  gap: 10px;
}
</style>
