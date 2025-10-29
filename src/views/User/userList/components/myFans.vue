<template>
  <!-- 我的粉丝 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input v-model.trim="queryForm.fromUserId" maxlength="64" placeholder="关注者ID" clearable />
        </el-form-item>
        <el-form-item label="" prop="toUserNickname" style="width: 200px">
          <el-input v-model.trim="queryForm.fromUserNickname" maxlength="64" placeholder="关注者昵称" clearable />
        </el-form-item>
        <el-form-item label="" prop="voteType">
          <el-select v-model="queryForm.relationFlag" placeholder="关系类型" clearable style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.relationFlag" :key="key" :value="key" :label="value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
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
        <template #fromUserNickname="{ scope }">
          <div class="g-text-nowrap-ellipsis">{{ scope.row.fromUserNickname }}</div>
        </template>
        <template #userDisplay="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.fromUserId }}
            </span>
            <copy v-if="scope.row.fromUserId != ''" :content="scope.row.fromUserId"></copy>
          </p>
        </template>
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.fanTime) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import { reqListUserRelationship } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
import { dataSemantics } from '@/utils/dataSemantics'
import { IReqListUserRelationshipData, IReqListUserRelationshipQueryParams, IReqUserListData } from '@/api/user/type'

const props = defineProps({
  accountInfo: {
    type: Object as () => IReqUserListData | null
  }
})
const initQueryForm = (): IReqListUserRelationshipQueryParams => ({
  page: 1,
  size: 5,
  fromUserId: undefined,
  toUserId: props!.accountInfo!.userId,
  fromUserNickname: '',
  relationFlag: 'L',
  toUserIdPrecise: true,
  sortOrder: 'DESC',
  sortName: 'fan_time'
})

// 获取路由对象
const tableData = ref<IReqListUserRelationshipData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IReqListUserRelationshipQueryParams>(initQueryForm())

//loading 按钮
const isLoading = ref(false)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'fromUserId',
    label: '关注用户ID',
    slot: 'userDisplay'
  },
  {
    prop: 'fromUserNickname',
    label: '用户昵称',
    slot: 'fromUserNickname'
  },
  {
    prop: 'relationFlag',
    label: '关系标记',
    json: {
      sourceName: 'relationFlag',
      keyName: 'relationFlag'
    }
  },
  {
    prop: 'fanTime',
    label: '建立关系时间',
    slot: 'time'
  }
]

//搜索
async function fetchData() {
  isLoading.value = true
  try {
    const query: IReqListUserRelationshipQueryParams = {
      ...queryForm
    }
    let res = await reqListUserRelationship(query)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    console.error('fetchData ~ error:', error)
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

watch(
  () => [queryForm.fromUserId, queryForm.fromUserNickname, queryForm.relationFlag],
  ([fromUserId, fromUserNickname, relationFlag], [_fromUserId, _fromUserNickname, _relationFlag]) => {
    if (fromUserId !== _fromUserId || fromUserNickname !== _fromUserNickname || relationFlag !== _relationFlag) {
      Object.assign(queryForm, { page: 1, size: 15 })
    }
  },
  {
    deep: true
  }
)

watch(
  () => [queryForm.page, queryForm.size],
  (_newVal) => {
    fetchData()
  }
)

onMounted(() => {
  fetchData()
})
</script>
