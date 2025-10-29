<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData()"
      >
        <el-form-item label="" prop="fromUserSearchId">
          <AutoChoseLoginId v-model="queryForm.fromUserSearchId" />
        </el-form-item>
        <el-form-item label="" prop="fromUserNickname">
          <AutoChoseNickname v-model="queryForm.fromUserNickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="" prop="toUserSearchId">
          <AutoChoseLoginId placeholder="专家登入账号" v-model="queryForm.toUserSearchId" />
        </el-form-item>
        <el-form-item label="" prop="toUserNickname">
          <AutoChoseNickname v-model="queryForm.toUserNickname" placeholder="专家昵称" />
        </el-form-item>
        <el-form-item label="" prop="startTime">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
            style="width: 360px"
          ></TimeSelect>
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
        <template #fromUserSearchId="{ scope }">
          <el-link class="like-a g-text-nowrap-ellipsis" @click="() => openUserInfo(scope.row, 'reward', 'tab1')">
            {{ truncateText(scope.row.fromUserLoginId) }}
            {{ scope.row.fromUserLoginId && scope.row.fromUserNickname && ' | ' }}
            {{ truncateText(scope.row.fromUserNickname) }}
          </el-link>
        </template>
        <template #toUserSearchId="{ scope }">
          <el-link class="like-a g-text-nowrap-ellipsis" @click="() => openUserInfo(scope.row, 'rewarded', 'tab1')">
            {{ truncateText(scope.row.toUserLoginId) }}
            {{ scope.row.toUserLoginId && scope.row.toUserNickname && ' | ' }}
            {{ truncateText(scope.row.toUserNickname) }}
          </el-link>
        </template>
        <template #userId="{ scope }">
          <el-link class="like-a" @click="() => jumpToPointDetail(scope.row)">积分明细</el-link>
        </template>
      </m-table>
    </section>
  </section>
  <ConfigDialog v-if="unMountDailog" @close="unMountDailog = false" />
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TableOptions } from '@/components/mTable/types'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { useModalsStore } from '@/stores/modalStore'
import ConfigDialog from '@/views/ExpertManagement/pointsList/comps/configDialog.vue'
import { reqUserRewardList } from '@/api/user'
import type { IReqUserRewardListData, IReqUserRewardListQueryParams } from '@/api/user/type'
import { truncateText } from '@/utils/dataFormat'

interface QueryParams {
  userId?: string
  nickname?: string
}

const tableRef = ref()
const tableData = ref<IReqUserRewardListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)
const modalsStore = useModalsStore()
const router = useRouter()
const route = useRoute()
const urlQuery = route.query as QueryParams

const initQueryFormValue = (): IReqUserRewardListQueryParams => ({
  page: 1,
  size: 15,
  fromUserId: '',
  fromUserNickname: '',
  fromUserSearchId: '',
  toUserId: '',
  toUserNickname: '',
  toUserSearchId: '',
  startTime: undefined,
  endTime: undefined
})

//TODO: 临时采用 payment/list 接口来查询
const queryForm = reactive<IReqUserRewardListQueryParams>(initQueryFormValue())

const jumpToPointDetail = (row: IReqUserRewardListData) => {
  // router.push({
  //   name: 'pointDetail',
  //   query: { nickname: row.fromUserNickname }
  // })

  const url = router.resolve({
    name: 'pointDetail',
    query: { nickname: row.fromUserNickname, createTime: row.createTime }
  }).href

  window.open(url, '_blank') // 打开新的标签页
}

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'fromUserSearchId',
    label: '账户名称 | 账户昵称',
    columAttr: { minWidth: 160 },
    slot: 'fromUserSearchId'
  },
  {
    prop: 'changeScore',
    label: '打赏金额',
    columAttr: { minWidth: 90, align: 'right' }
  },
  {
    prop: 'toUserSearchId',
    label: '专家帐号｜昵称',
    columAttr: { minWidth: 160 },
    slot: 'toUserSearchId'
  },
  {
    prop: 'beforeScore',
    label: '变动前余额',
    columAttr: { minWidth: 90, align: 'right' }
  },
  {
    prop: 'afterScore',
    label: '当前余额',
    columAttr: { minWidth: 90, align: 'right' }
  },
  {
    prop: 'createTime',
    label: '操作时间',
    columAttr: { minWidth: 130 },
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    prop: 'userId',
    label: '查询',
    columAttr: { minWidth: 100 },
    slot: 'userId'
  }
]
const unMountDailog = ref<boolean>(false)
// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    //TODO: 临时采用 payment/list 接口来查询
    const query: IReqUserRewardListQueryParams = {
      ...queryForm
    }
    const response = await reqUserRewardList(query)
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
const openUserInfo = (row: IReqUserRewardListData, people: string, tab: string) => {
  let userId: string = ''
  switch (people) {
    case 'reward': //  账户名称 | 账户昵称
      userId = row.fromUserId
      break
    case 'rewarded': // 被打赏的人  专家帐号｜昵称
      userId = row.toUserId
      break
    default:
      break
  }

  if (userId) {
    modalsStore.setActiveTab('userInfoModal', tab)
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      userId
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
  queryForm.toUserSearchId = urlQuery.userId
  await fetchData()
})

watch(
  () => [queryForm.page, queryForm.size],
  (_newVal) => {
    fetchData()
  }
)

const setRule = () => {
  unMountDailog.value = true
}
</script>

<style scoped lang="less">
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
