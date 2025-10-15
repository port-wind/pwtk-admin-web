<template>
  <section>
    <!-- Query Component -->
    <Query @search="handleSearch" @reset="handleReset" />

    <!-- Table Section -->
    <section style="flex: 1; overflow-y: auto">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #user="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.loginId) }}
            {{ scope.row.nickname && scope.row.loginId ? ' | ' : '' }}
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #status="{ scope }">
          <span>
            {{ scope.row.status === 'y' ? '启用' : '禁用' }}
          </span>
        </template>
      </m-table>
    </section>
  </section>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'

import { truncateText } from '@/utils/dataFormat'
import { TableOptions } from '@/components/mTable/types'
import { getIntegrate } from '@/api/user/leader'
import { useLeaderSharedLogic } from '@/views/User/leaderboard/useLeaderSharedLogic'
const {
  tableData,
  currentPage,
  pageSize,
  total,
  isLoading,
  currentQueryParams,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  handTabs
} = useLeaderSharedLogic((params) => fetchData(params))

const options: TableOptions[] = [
  {
    prop: 'index',
    label: '排行',
    align: 'center',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'user',
    label: '账户名称 | 账户昵称',
    slot: 'user', // Use a slot if you need custom rendering
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'currentHeat',
    label: '当前人气',
    align: 'right',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'currentScore',
    label: '当前积分',
    align: 'right',
    columAttr: { minWidth: 120 }
  },
  {
    prop: 'currentFans',
    label: '当前粉丝数',
    align: 'right',
    columAttr: { minWidth: 120 }
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    align: 'center',
    columAttr: { minWidth: 80 }
  }
]

// Fetch data from API
const fetchData = async (params?: any) => {
  isLoading.value = true
  try {
    const fetchParams = {
      page: currentPage.value,
      size: pageSize.value,
      ...(params || currentQueryParams)
    }

    const response = await getIntegrate(fetchParams)
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      tableData.value = dataList.map((item, index) => ({
        ...item,
        index: (currentPage.value - 1) * pageSize.value + index + 1
      }))
      total.value = Number(response?.data?.total) || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

// On mount, load game types and initial data
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
section {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
