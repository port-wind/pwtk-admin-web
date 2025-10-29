<template>
  <section class="wrapper">
    <section>
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="72px"
        ref="ruleFormRef"
        @keyup.enter="fetchData()"
      >
        <el-form-item label="购买状态:" prop="payStatus">
          <el-select v-model="queryForm.payStatus" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in payStatusOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="担保支付:" prop="guaranteed">
          <el-select v-model="queryForm.guaranteed" placeholder="请选择" style="width: 120px">
            <el-option v-for="item in guaranteedOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="onReset()" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSizes="[5, 15, 30, 50, 100]"
      >
        <template #userId="{ scope }">
          <el-text class="g-text-nowrap-ellipsis">
            {{ truncateText(scope.row.saleNickname) + ' | ' + truncateText(scope.row.saleLoginId) }}
          </el-text>
        </template>
        <template #payStatusName="{ scope }">
          <el-text>{{ scope.row.payStatusName }}</el-text>
        </template>
        <template #guaranteed="{ scope }">
          <template v-if="scope.row.guaranteed == 'y'">
            <el-tag type="success">是</el-tag>
          </template>
          <template v-else>
            <el-tag type="info">否</el-tag>
          </template>
        </template>
        <template #id="{ scope }">
          <el-link class="like-a" @click="jumptoSalePage(scope.row)">心水详情</el-link>
        </template>
      </m-table>
    </section>
  </section>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableDomHeight'
import { getBuyingList } from '@/api/expert/buying-list/index'
import { IGetBuyingListData, IGetBuyingListQueryParams } from '@/api/expert/buying-list/type'
import { useModalsStore } from '@/stores/modalStore'
import { useRouter } from 'vue-router'
import { truncateText } from '@/utils/dataFormat'
import { FormInstance } from 'element-plus'

const initQueryForm = (): IGetBuyingListQueryParams => ({
  page: 1,
  size: 15,
  payStatus: undefined, //0未到账，1已到账，2已退回
  guaranteed: undefined
})

// 购买状态: payStatus
// 担保支付:guaranteed

//Table需要的数据
const options: TableOptions[] = [
  { prop: 'userId', label: '专家账号｜昵称', slot: 'userId', columAttr: { minWidth: '160px' } },
  { prop: 'payStatusName', label: '购买状态', slot: 'payStatusName', columAttr: { minWidth: '80px' } },
  { prop: 'guaranteed', label: '担保支付', slot: 'guaranteed', columAttr: { minWidth: '80px' } },
  { prop: 'point', label: '支付积分', columAttr: { minWidth: '100px' } },
  {
    prop: 'createTime',
    label: '购买时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { minWidth: '170px' }
  },
  { prop: 'id', label: '操作', slot: 'id', columAttr: { width: '80px' } }
]
const payStatusOption = [
  {
    label: '未到账',
    value: '0'
  },
  {
    label: '已到账',
    value: '1'
  },
  {
    label: '已退回',
    value: '2'
  }
]
/**
 * 担保支付
 */
const guaranteedOption = [
  {
    label: '是',
    value: 'y'
  },
  {
    label: '否',
    value: 'n'
  }
]
const router = useRouter()
const modalsStore = useModalsStore()
const tableRef = ref()
const isShow = ref(false)
const isLoading = ref(false)
const tableData = ref<IGetBuyingListData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetBuyingListQueryParams>(initQueryForm())

//表单校验
const ruleFormRef = ref<FormInstance>()

const onReset = () => {
  Object.assign(queryForm, initQueryForm())
  ruleFormRef?.value?.resetFields()
}

//搜索
async function fetchData() {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    const query: IGetBuyingListQueryParams = {
      ...queryForm,
      userId: modalsStore.userInfoModal.modalData?.userId
    }
    let res = await getBuyingList(query)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

watch(
  () => [modalsStore.userInfoModal.activeTab, queryForm.page, queryForm.size],
  (newVal, oldVal) => {
    if (newVal[0] === 'buyingList') {
      fetchData()
    }
  }
)

const jumptoSalePage = (row: IGetBuyingListData) => {
  // router.push({
  //   name: 'saleList',
  //   query: {
  //     id: row.predictionId
  //   }
  // })

  // modalsStore.hideModal('userInfoModal')
  const url = router.resolve({
    path: '/expertManagement/saleList',
    query: { id: row.predictionId }
  })
  window.open(url.href, '_blank') // 在新窗口打开链接
}

onMounted(() => {
  fetchData()
})

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}
</script>

<style lang="less" scoped>
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.wrapper {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}
</style>
