<template>
  <section class="wrapper">
    <section>
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        ref="ruleFormRef"
        @keyup.enter="fetchData()"
      >
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份" style="width: 80px" clearable>
            <el-option v-for="item in yearOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="issue">
          <el-input placeholder="期数" v-model="queryForm.issue" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <GameTypeList v-model="queryForm.gameType" clearable style="width: 90px" />
        </el-form-item>
        <el-form-item label="" prop="playTypeCode">
          <GamePlayTypeCode
            :biz="BizFlag.Insight"
            placeholder="投票类型"
            v-model="queryForm.playTypeCode"
            clearable
            style="width: 100px"
          />
        </el-form-item>
        <el-form-item label="" prop="payStatusName">
          <el-select v-model="queryForm.isHit" placeholder="结果" style="width: 120px" clearable>
            <el-option v-for="item in isHitOption" :key="item.value" :label="item.label" :value="item.value" />
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
    <section ref="tableRef" class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
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
        <template #issue="{ scope }">
          {{ scope.row.issue }}
        </template>

        <template #user="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.loginId) }}
            {{ scope.row.nickname && scope.row.loginId ? ' | ' : '' }}
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>

        <template #predictTitle="{ scope }">
          <p class="g-text-nowrap-ellipsis">{{ scope.row?.predictTitle }}</p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
        </template>
        <template #playTypeCode="{ scope }">
          <p>{{ scope.row?.playTypeName?.toString() }}</p>
        </template>
        <template #pointView="{ scope }">
          <p>
            {{ scope.row?.predictScore }}
            {{ scope.row?.saleCount?.toString() ? `| ${scope.row.saleCount}` : '' }}
          </p>
        </template>
        <template #predict="{ scope }">
          <PopoverList :content="scope.row.predict" :max-items="5"></PopoverList>
        </template>
        <template #isHit="{ scope }">
          <span
            :class="{
              'hit-success': scope.row.isHit === 'y',
              'hit-fail': scope.row.isHit === 'n',
              'hit-pending': scope.row.isHit === 'i'
            }"
          >
            {{ scope.row.isHit === 'y' ? '已中奖' : scope.row.isHit === 'n' ? '未中奖' : '未开奖' }}
          </span>
        </template>
      </m-table>
    </section>
  </section>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableDomHeight'
import { truncateText } from '@/utils/dataFormat'
import { getSaleList } from '@/api/expert/sale-list/index'
import { useModalsStore } from '@/stores/modalStore'
import PopoverList from '@/views/ExpertManagement/components/popover-list/index.vue'
import { IGetSaleListData, IGetSaleListQueryParams } from '@/api/expert/sale-list/type'
import GamePlayTypeCode from '@/components/gamePlayTypeCode/index.vue'
import { fetchGameTypes } from '@/utils/table'
import { BizFlag } from '@/api/betting/types'
const initQueryForm = (): IGetSaleListQueryParams => ({
  page: 1,
  size: 15,
  year: undefined, // number // 年份
  issue: undefined, // number // 期数
  gameType: undefined, // number // 彩种
  playTypeCode: undefined, // number // 投票类型
  isHit: undefined // 'y' | 'n' | 'i' // 开奖结果 (y中奖, n未中奖, i未开奖)
})

const yearOption = [
  {
    label: '2025',
    value: 2025
  },
  {
    label: '2024',
    value: 2024
  },
  {
    label: '2023',
    value: 2023
  },
  {
    label: '2022',
    value: 2022
  }
]
const isHitOption = [
  {
    label: '中奖',
    value: 'y'
  },
  {
    label: '未中奖',
    value: 'n'
  },
  {
    label: '未开奖',
    value: 'i'
  }
]

const onReset = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}

const options: TableOptions[] = [
  {
    prop: 'predictId',
    label: '卖料ID',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'year',
    label: '年份',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'issue',
    label: '期数',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'predictTitle',
    label: '卖料标题',
    slot: 'predictTitle',
    columAttr: { minWidth: 150 }
  },

  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'playTypeCode',
    label: '投票类型',
    slot: 'playTypeCode',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'predict',
    label: '推荐内容',
    slot: 'predict',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'pointView',
    label: '积分｜查看数',
    slot: 'pointView',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'createTime',
    label: '参与时间',
    dateName: 'createTime',
    columAttr: { minWidth: 120 }
  },
  {
    prop: 'isHit',
    label: '结果',
    slot: 'isHit'
  }
]

const modalsStore = useModalsStore()

const tableRef = ref()

// const activeTab = computed(() => modalsStore.userInfoModal.activeTab)
// console.log('🚀 ~ activeTab:', activeTab)
const isShow = ref(false)
const isLoading = ref(false)
const gameTypeList = ref()
const tableData = ref<IGetSaleListData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IGetSaleListQueryParams>(initQueryForm())

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

//搜索
async function fetchData() {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    const query: IGetSaleListQueryParams = {
      ...queryForm,
      userId: modalsStore.userInfoModal.modalData?.userId
    }
    let res = await getSaleList(query)
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
  () => [
    modalsStore.userInfoModal.activeTab,
    queryForm.page,
    queryForm.size,
    modalsStore.userInfoModal.modalData?.userId
  ],
  (newVal, oldVal) => {
    if (newVal[0] === 'saleList') {
      fetchData()
    }
  }
)

onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  fetchData()
})

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

const handTabs = (row) => {
  // return
  // router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    // ...modalsStore.userInfoModal.modalData,
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}
</script>

<style lang="less" scoped>
.wrapper {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.custom-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.hit-success {
  color: #67c23a;
}
.hit-fail {
  color: #f56c6c;
}
.hit-pending {
  color: #e6a23c;
}
</style>
