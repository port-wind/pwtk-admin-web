<script setup lang="ts">
import { ref } from 'vue'
import type { TableOptions } from '@/components/mTable/types'
import { reqWinningStreakList } from '@/api/user/index'
import type { IReqWinningStreakListData } from '@/api/user/type'
import { FormInstance } from 'element-plus'
import { useModalsStore } from '@/stores/modalStore'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'
import { truncateText } from '@/utils/dataFormat'
const sixKingListPage = useSixKingListPageStore()
const ruleFormRef = ref<FormInstance>()
const modalsStore = useModalsStore()
const tableData = ref<IReqWinningStreakListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)

const options: TableOptions[] = [
  {
    prop: 'index',
    label: '排名',
    columAttr: {
      width: '60px'
    }
  },
  {
    prop: 'userId',
    label: '账户名称 | 账户昵称',
    slot: 'userId',
    columAttr: {
      minWidth: '160px'
    }
  },
  {
    prop: 'gameTypeName',
    label: '彩种',
    columAttr: {
      minWidth: '80px'
    }
  },
  {
    prop: 'parentPlayTypeName',
    label: '游戏类型',
    columAttr: {
      minWidth: '80px'
    }
  },
  {
    prop: 'playTypeName',
    label: '玩法种类',
    columAttr: {
      minWidth: '80px'
    }
  },
  {
    prop: 'recentContinueWinCount',
    label: '当前连胜',
    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'saleCount',
    label: '查看数',
    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'createTime',
    label: '更新时间',
    dateName: 'createTime',
    columAttr: {
      minWidth: '80px'
    }
  }
]

const openUserInfo = (row) => {
  if (row.userId) {
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      userId: row.userId
    })
    modalsStore.showModal('userInfoModal')
  } else {
    ElMessage({
      message: `未找到用户ID`,
      type: 'error'
    })
  }
}

// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const query = {
      isAll: true,
      ...sixKingListPage.queryForm
    }

    delete query.current
    delete query.userId
    delete query.issue
    delete query.startIssue
    delete query.endIssue

    const response = await reqWinningStreakList(query)
    if (response.success) {
      tableData.value = response.data.list.map((item, index) => {
        return {
          ...item,
          index: (sixKingListPage.queryForm.page - 1) * sixKingListPage.queryForm.size + index + 1
        }
      })
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

const handleSizeChange = (val: number) => {
  sixKingListPage.queryForm.size = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  sixKingListPage.queryForm.page = val
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <section class="wrapper">
    <section>
      <QueryForm current-tabs="winning" @onSubmit="() => fetchData()" @onReset="() => fetchData()" />
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        pagination
        stripe
        :total="total"
        :currentPage="sixKingListPage.queryForm.page"
        :pageSize="sixKingListPage.queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #userId="{ scope }">
          <el-link class="like-a g-text-nowrap-ellipsis" @click="openUserInfo(scope.row)">
            {{ truncateText(scope.row.userId) }}
            {{ scope.row.userId && scope.row.nickname && ' | ' }}
            {{ truncateText(scope.row.nickname) }}
          </el-link>
        </template>
      </m-table>
    </section>
  </section>
  <!-- 打开用户信息 -->
  <UserListComponent></UserListComponent>
</template>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  .custom-table {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
  }
}
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
</style>
