<template>
  <div id="system_account" class="main_container">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm">
        <el-form-item prop="bizTypeCode" v-if="useStore.labelOption.length > 0">
          <el-select v-model="queryForm.bizTypeCode" placeholder="星星活动">
            <el-option label="全部" value="L" />
            <el-option v-for="item in useStore.labelOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="queryForm.type" placeholder="星星类型">
            <el-option label="全部" value="L" />
            <el-option label="星星增加" value="1" />
            <el-option label="星星减少" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect2>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        :pageSizes="[5, 15, 30, 50, 100]"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
      >
        <template #chageStar="{ scope }">
          <span>{{ Number(scope.row.changeStar) > 0 ? '星星增加' : '星星减少' }}</span>
        </template>
      </m-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqPointRulesStarDetail } from '@/api/user/pointRules'
import type { TableOptions } from '@/components/mTable/types'
//上传相关
import { useBettingStore } from '@/stores/bettingStore'
import type { IReqPointRulesStarDetailData, IReqPointRulesStarDetailQueryParams } from '@/api/user/pointRules/type'

const props = defineProps<{
  accountInfo: any
}>()
const tableData = ref<IReqPointRulesStarDetailData[]>([])
const useStore = useBettingStore()
const initQueryForm = (): IReqPointRulesStarDetailQueryParams => {
  return {
    page: 1,
    size: 15,
    sortOrder: 'DESC',
    sortName: 'create_time'
  }
}

const queryForm = reactive<IReqPointRulesStarDetailQueryParams>(initQueryForm())
const total = ref<number>(0)
// const bizTypeCodeList = ref<any[]>([])
//新增弹窗
//loading 按钮
const isLoading = ref(false)

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const options = ref<TableOptions[]>([
  {
    label: '星星活动',
    prop: 'bizDesc'
  },
  {
    label: '星星类型',
    prop: 'bizTypeName'
  },
  {
    label: '星星明细',
    prop: 'changeStar',
    align: 'right'
  },
  {
    label: '变动前余额',
    prop: 'beforeStar',
    align: 'right'
  },
  {
    label: '当前余额',
    prop: 'afterStar',
    align: 'right'
  },
  {
    label: '操作人',
    prop: 'operatorDesc'
  },
  {
    prop: 'createTime',
    label: '操作时间',
    columAttr: { minWidth: 130 },
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  }
])
//页面初始化获取数据
const fetchData = async () => {
  const params: IReqPointRulesStarDetailQueryParams = {
    ...queryForm,
    userId: props.accountInfo.userId
  }
  // if (params.type === 'L') {
  //   delete params.type
  // }
  isLoading.value = true
  try {
    const response = await reqPointRulesStarDetail(params)
    if (response.success) {
      tableData.value = response!.data!.list.map((item: any) => ({
        ...item,
        bizTypeName: Number(item.changeStar) > 0 ? '星星增加' : '星星减少'
      }))
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
const handleResetRefresh = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}
// const bizTypeCodeList = computed(() => {
//   console.log('useStore.startEvent', useStore.startEvent)
//   return useStore.startEvent.map((item) => ({
//     label: item.bizDesc,
//     value: item.bizCode
//   }))
// })
// console.log('🚀 ~ bizTypeCodeList ~ bizTypeCodeList:', bizTypeCodeList)

onMounted(async () => {
  if (useStore.startEvent!.length === 0) {
    await useStore.getStarEventList()
  }
  fetchData()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
.gray-box {
  background-color: #f5f7fa;
  border: none;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
}

.el-row {
  margin-bottom: 0;
}

.el-col {
  margin-bottom: 10px;
  padding: 10px;
}

.stat-header {
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}

.stat-content {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blue-text {
  color: #409eff;
}
</style>
