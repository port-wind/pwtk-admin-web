<script setup lang="ts">
import { ref } from 'vue'
import type { TableOptions } from '@/components/mTable/types'
import { reqHistoricalChampion } from '@/api/user/index'
import type { IReqHistoricalChampionData } from '@/api/user/type'
import { useModalsStore } from '@/stores/modalStore'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'
import { truncateText } from '@/utils/dataFormat'
const modalsStore = useModalsStore()
const sixKingListPage = useSixKingListPageStore()
const tableData = ref<IReqHistoricalChampionData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)

const options: TableOptions[] = [
  {
    prop: 'userId',
    label: '账户名称 | 账户昵称',
    slot: 'userId',
    columAttr: {
      minWidth: '160px'
    }
  },
  {
    prop: 'gameTypeShortName',
    label: '彩种',
    columAttr: {
      minWidth: '80px'
    }
  },
  {
    prop: 'playTypeName',
    label: '游戏类型',
    columAttr: {
      minWidth: '80px'
    }
  },
  {
    prop: 'total',
    label: '总参与',
    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'winTotal',
    label: '胜',

    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'failTotal',
    label: '负',
    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'winRate',
    label: '胜率',
    columAttr: {
      minWidth: '80px',
      align: 'right'
    }
  },
  {
    prop: 'checkTime',
    label: '更新时间',
    dateName: 'checkTime',
    columAttr: {
      minWidth: '80px'
    }
  }
]

// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const query = {
      ...sixKingListPage.queryForm
    }

    delete query.startIssue
    delete query.endIssue
    delete query.current
    delete query.page
    delete query.size
    delete query.loginOrUserId
    delete query.playTypeCode
    delete query.sortName
    delete query.sortOrder
    delete query.isAll

    if (query.issue && query.issue == -1) {
      //@ts-ignore
      delete query.issue
    }

    const response = await reqHistoricalChampion(query)
    if (response.success) {
      tableData.value = response.data.list.map((item, index) => {
        return {
          ...item,
          index: index + 1
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

const shouldFetchData = computed(() => {
  return sixKingListPage.queryForm.gameType && sixKingListPage.queryForm.issue
})

onMounted(() => {
  if (shouldFetchData.value) {
    fetchData()
  }
})
</script>

<template>
  <section class="wrapper">
    <section>
      <QueryForm current-tabs="history" @onSubmit="() => fetchData()" @onReset="() => fetchData()" />
    </section>
    <section class="custom-table">
      <m-table :options="options" :data="tableData" :isLoading="isLoading" :total="total">
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
