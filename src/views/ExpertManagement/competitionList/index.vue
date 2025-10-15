<template>
  <section id="system_account" class="predict_relevent">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData">
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="issue">
          <el-input v-model="queryForm.issue" placeholder="期数" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.playTypeCode" placeholder="投票类型">
            <el-option label="全部" value="L" />
            <el-option v-for="item in playTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="loginId">
          <AutoChoseLoginId v-model="queryForm.searchId" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname placeholder="用户昵称" v-model="queryForm.nickname" />
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.isHit" placeholder="竞选结果">
            <el-option label="全部" value="L" />
            <el-option v-for="item in hitList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>

          <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            @click="() => handleSpecialClick('newsPaperIssue')"
          >
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
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
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
        </template>
        <template #predict="{ scope }">
          <PopoverList :content="scope.row.predict" :max-items="8"></PopoverList>
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
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import { fetchPlayTypeForCompetition } from '@/utils/table'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { fetchGameTypes } from '@/utils/table'
import { useModalsStore } from '@/stores/modalStore'
import { handleSpecialClick } from '@/components/checkboxTable/util'

import UserListComponent from '@/views/User/userList/userListComponent.vue'
import router from '@/router'
import PopoverList from '@/views/ExpertManagement/components/popover-list/index.vue'
import { predictList } from '@/api/betting'

const modalsStore = useModalsStore()
const { VITE_DEPLOY_CONFIG } = import.meta.env
// Refs
const gameTypeList = ref()
const playTypeList = ref()

const hitList = ref([
  { value: 'y', label: '已中奖' },
  { value: 'n', label: '未中奖' },
  { value: 'i', label: '未开奖' }
])
const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const isLoading = ref(false)

const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})

const dialogMode = ref<'edit' | 'add'>()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

const issueDialogVisible = ref(false)
const issueEditDialogVisible = ref(false)

// Constants

const initQueryFormValue = () => ({
  year: '',
  issue: '',
  gameType: '',
  playTypeCode: '',
  searchId: '',
  remoteValue: '',
  nickname: '',
  isHit: ''
})

const queryForm = reactive(initQueryFormValue())
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'year',
    label: '年份',
    align: 'right',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'issue',
    label: '期数',
    align: 'right',
    columAttr: { minWidth: 100 }
  },

  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'predictionTypeName',
    label: '竞选类型',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'predict',
    label: '竞选内容',
    slot: 'predict',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'user',
    label: '账户名称 | 账户昵称',
    slot: 'user',
    columAttr: { minWidth: 250 }
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

// Methods
const fetchData = async (val?: GetRequest) => {
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    postIssue: queryForm.issue,
    postYear: queryForm.year,
    bizFlag: 'p',
    ...queryForm
  }
  isLoading.value = true
  try {
    // queryForm 数据处理
    let { bizFlag, gameType, searchId, nickname, isHit, issue, loginId, page, playTypeCode, size, year } = params

    if (isHit === 'L') {
      isHit = undefined
    }

    //@ts-ignore
    if (year === 'L') {
      year = undefined
    }

    if (nickname === '') {
      nickname = undefined
    }

    if (loginId === '') {
      loginId = undefined
    }

    if (playTypeCode === 'L') {
      playTypeCode = undefined
    }
    //@ts-ignore
    if (gameType === 'L') {
      gameType = undefined
    }

    const response = await predictList({
      year,
      issue,
      page,
      size,
      bizFlag,
      searchId,
      isHit,
      playTypeCode,
      gameType,
      nickname
    })
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item
          }
        }) || []
      tableData.value =
        (list &&
          list?.map((item: any) => ({
            ...item
          }))) ||
        []
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
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handTabs = (row) => {
  console.log('🚀 ~ handTabs ~ row:', row)
  // return
  // router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    // ...modalsStore.userInfoModal.modalData,
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  playTypeList.value = await fetchPlayTypeForCompetition(isLoading)
  await fetchData()
  if (router.currentRoute.value.query.postId) {
    console.log('router.currentRoute.value', router.currentRoute.value)
  }
})
</script>

<style scoped lang="less">
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
