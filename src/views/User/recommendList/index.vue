<template>
  <section class="wrapper" id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData()">
        <el-form-item label="" prop="loginId">
          <AutoChoseLoginId v-model="queryForm.searchId" style="width: 155px" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname placeholder="邀请人昵称" v-model="queryForm.nickname" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChosePromotionCode placeholder="邀请码" v-model="queryForm.promotionCode" clearable />
        </el-form-item>
        <el-form-item label="邀请人数:" prop="nickname" class="item-label">
          <el-row>
            <el-col :span="10">
              <el-input type="number" v-model="queryForm.inviteLowerLimit" placeholder="最少" />
            </el-col>
            <el-col :span="2" style="text-align: center">~</el-col>
            <el-col :span="10">
              <el-input type="number" v-model="queryForm.inviteUpperLimit" placeholder="最多" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="奖励积分:" prop="nickname" class="item-label">
          <el-row>
            <el-col :span="10">
              <el-input type="number" v-model="queryForm.awardLowerLimit" placeholder="最少" />
            </el-col>
            <el-col :span="2" style="text-align: center">~</el-col>
            <el-col :span="10">
              <el-input type="number" v-model="queryForm.awardUpperLimit" placeholder="最多" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
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
          <el-button type="primary" @click="setRule">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            修改规则配置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #loginId="{ scope }">
          <el-link class="like-a g-text-nowrap-ellipsis" @click="() => openUserInfo(scope.row, 'tab1')">
            {{ truncateText(scope.row.loginId, 20) + ' | ' + truncateText(scope.row.nickname, 20) }}
          </el-link>
        </template>
        <template #status="{ scope }">
          <el-tag type="success" v-if="scope.row.status === 'y'">启用</el-tag>
          <el-tag type="info" v-else>禁用</el-tag>
        </template>
        <template #operation="{ scope }">
          <el-link class="like-a" @click="() => openInvitationDialog(scope.row)">查看</el-link>
        </template>
      </m-table>
    </section>
  </section>
  <!-- 修改配置规则 -->
  <RecommandConfigDialog v-if="unMountConfigDailog" @close="unMountConfigDailog = false" />
  <!-- 查看某个人的邀请人列表 -->
  <RecommandDetailDialog v-if="unMountDetailDialog" ref="detailDialogRef" />
  <!-- 打开用户信息 -->
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, watch } from 'vue'
import { truncateText } from '@/utils/dataFormat'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { useModalsStore } from '@/stores/modalStore'
import RecommandDetailDialog from '@/views/User/recommendList/comps/RecommandDetailDialog.vue'
import { reqPromoteList } from '@/api/user/prommot'
import type { TableOptions } from '@/components/mTable/types'
import type { IReqUserRewardListData } from '@/api/user/type'
import type { IReqPromoteListData, IReqPromoteListQueryParams } from '@/api/user/prommot/type'

const tableRef = ref()
const tableData = ref<IReqPromoteListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)
const modalsStore = useModalsStore()
const initQueryFormValue = (): IReqPromoteListQueryParams => ({
  page: 1,
  size: 15,
  searchId: '',
  nickname: '',
  promotionCode: '',
  inviteLowerLimit: undefined,
  inviteUpperLimit: undefined,
  awardLowerLimit: undefined,
  awardUpperLimit: undefined
})
//TODO: 临时采用 payment/list 接口来查询
const queryForm = reactive<IReqPromoteListQueryParams>(initQueryFormValue())
// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    //TODO: 临时采用 payment/list 接口来查询
    const query: IReqPromoteListQueryParams = {
      ...queryForm
    }
    const response = await reqPromoteList(query)
    const dataList = response.data.list
    if (response.success && dataList.length > 0) {
      tableData.value = response.data.list
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

const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  fetchData()
}

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'loginId',
    label: '邀请人帐号｜昵称',
    slot: 'loginId'
  },
  {
    prop: 'status',
    label: '邀请人状态',
    slot: 'status',
    columAttr: { width: 100 }
  },
  {
    prop: 'promotionCode',
    label: '邀请码',
    columAttr: { width: 100 }
  },
  {
    prop: 'inventCount',
    label: '邀请人数',
    columAttr: { width: 80, align: 'right' }
  },
  {
    prop: 'level1Count',
    label: '一级拉新用户数',
    columAttr: { width: 130, align: 'right' }
  },
  {
    prop: 'level2Count',
    label: '二级拉新用户数',
    columAttr: { width: 130, align: 'right' }
  },
  {
    prop: 'updateTime',
    label: '更新时间',
    dateName: 'updateTime',
    formatStr: 'yyyy-MM-dd HH:mm',
    columAttr: { width: 150 }
  },
  {
    prop: 'awardScore',
    label: '奖励积分',
    columAttr: { width: 80, align: 'right' }
  },
  {
    prop: 'userId',
    label: '操作',
    slot: 'operation',
    columAttr: { width: 60 }
  }
]
const unMountConfigDailog = ref<boolean>(false)

const unMountDetailDialog = ref<boolean>(false)
const detailDialogRef = ref()

const openUserInfo = (row: IReqPromoteListData, tab: string) => {
  if (row.userId) {
    modalsStore.setActiveTab('userInfoModal', tab)
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
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

onMounted(async () => {
  await fetchData()
})

watch(
  () => [queryForm.page, queryForm.size],
  (_newVal) => {
    fetchData()
  }
)

const setRule = () => {
  unMountConfigDailog.value = true
}

const openInvitationDialog = (row: IReqUserRewardListData) => {
  unMountDetailDialog.value = true
  nextTick(() => {
    detailDialogRef.value!.openDailog(row)
  })
}
</script>

<style scoped lang="less">
.item-label {
  :deep(.el-form-item__label) {
    width: 75px !important;
  }
}
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
