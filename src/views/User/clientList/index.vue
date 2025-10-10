<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        @keyup.enter="fetchData(true)"
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
      >
        <el-form-item label="" prop="cid">
          <el-input v-model="queryForm.cid" maxlength="40" placeholder="客户端ID" />
        </el-form-item>
        <el-form-item label="" prop="searchId">
          <SelectUserIdAndNickname
            v-model="queryForm.searchId!"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 160px"
          />
          <!-- <AutoChoseLoginId v-model="queryForm.searchId"/> -->
        </el-form-item>
        <el-form-item label="" prop="regIP">
          <el-input v-model="queryForm.regIP" maxlength="40" placeholder="IP" />
        </el-form-item>
        <el-form-item label="" prop="langCodes">
          <TimeSelect
            start-placeholder="申请开始时间"
            end-placeholder="申请结束时间"
            v-model:startDate="queryForm.regStartTime"
            v-model:endDate="queryForm.regEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="businessType">
          <el-select v-model="queryForm.businessType" placeholder="终端类型" style="width: 160px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.businessType" :key="key" :label="value" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData(true)" :loading="isLoading">
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
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(queryRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSizes="[15, 30, 50, 100]"
      >
        <template #cidDisplay="{ scope }">
          <span class="like-a" type="primary" @click="handTabs(scope.row)">
            {{ transformString(scope.row.cid) }}
          </span>
          <p>
            {{ _Options.businessType[scope.row.businessType] }} |
            {{ _Options.clientFlag[scope.row.clientFlag] }}
          </p>
          <span v-if="scope.row.lastUserId" class="like-a" type="primary" @click="lastHandTabs(scope.row.lastUserId)">
            {{ scope.row.lastUserLoginId }}
          </span>
        </template>
        <template #reg="{ scope }">
          <p>{{ scope.row.regIP }}</p>
          <p>{{ unitFormatDate(scope.row.regTime) }}</p>
        </template>
      </m-table>
    </section>
  </section>
  <!-- 未注册tab页面 -->
  <el-dialog
    class="tabs-dialog"
    draggable
    overflow
    destroy-on-close
    v-model="isTabs"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :lazy="true" label="基本信息" name="basicInformation">
        <BasicInformation :accountInfo="accountInfo"></BasicInformation>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名点赞" name="likeAnonymously">
        <LikeAnonymously :accountInfo="accountInfo"></LikeAnonymously>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名收藏" name="collectionAnonymously">
        <CollectionAnonymously :accountInfo="accountInfo"></CollectionAnonymously>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名关注" name="followAnonymously">
        <FollowAnonymously :accountInfo="accountInfo"></FollowAnonymously>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名投票" name="visitAnonymously">
        <VoatAnonymously :accountInfo="accountInfo"></VoatAnonymously>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="浏览记录" name="browsingHistory">
        <BrowsingHistory :accountInfo="accountInfo"></BrowsingHistory>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <!-- 注册用户tab页面 -->
  <UserListComponent></UserListComponent>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { TableOptions } from '@/components/mTable/types'
import _Options from '@/const/options.json'
import { reqUserInfo } from '@/api/user/index'
import { reqClientList } from '@/api/user/clientList/index'
import TimeSelect from '@/components/timeSelect/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
//未注册用户信息
//基本信息
import BasicInformation from './components/basicInformation.vue'
//匿名点赞
import LikeAnonymously from './components/likeAnonymously.vue'
//匿名收藏
import CollectionAnonymously from './components/collectionAnonymously.vue'
//匿名关注
import FollowAnonymously from './components/followAnonymously.vue'
//匿名投票
import VoatAnonymously from './components/voatAnonymously.vue'
//浏览记录
import BrowsingHistory from '@/views/User/clientList/components/browsingHistory.vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import count from '@/utils/tableHeight'
import i18n from '@/locales'

const { t } = i18n.global as any
import { useModalsStore } from '@/stores/modalStore'
import { IReqClientListData, IReqClientListQueryParams } from '@/api/user/clientList/type'
const modalsStore = useModalsStore()
const initQueryForm = (): IReqClientListQueryParams => ({
  cid: '',
  regIP: '',
  businessType: undefined,
  regStartTime: '',
  regEndTime: '',
  searchId: '',
  sortOrder: 'DESC',
  sortName: 'reg_time',
  page: 1,
  size: 15
})

// 获取路由对象
const useRoutes = useRoute()
const isTabs = ref(false)
const isRegisterTabs = ref(false)
const tableData = ref<IReqClientListData[]>([])
const queryRef = ref()
const total = ref<number>(0)
const queryForm = reactive<IReqClientListQueryParams>(initQueryForm())
const activeName = ref('basicInformation')
const accountInfo = ref({})
//loading 按钮
const isLoading = ref(false)
const userId: any = ref('')

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'cid',
    label: '客户端',
    slot: 'cidDisplay',
    width: 220
  },
  {
    prop: 'ua',
    label: 'UA'
  },
  {
    prop: 'regIP',
    label: 'IP',
    slot: 'reg'
  },
  {
    prop: 'os',
    label: 'OS'
  }
]

//搜索
async function fetchData(search?: boolean) {
  isLoading.value = true
  try {
    const query: IReqClientListQueryParams = {
      ...queryForm
    }
    if (search) {
      query.page = 1
    }
    let res = await reqClientList(query)
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
  fetchData()
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

function transformString(originalStr) {
  // 获取前三位和后四位
  let prefix = originalStr.slice(0, 3)
  let suffix = originalStr.slice(-4)

  // 中间用三个星号替代
  let transformedStr = `${prefix}***${suffix}`

  return transformedStr
}

const handleClick = (tab, event) => {}
const handTabs = (row) => {
  Object.assign(accountInfo.value, { ...row })
  console.log(row)
  isTabs.value = true
}
const lastHandTabs = (id) => {
  userId.value = id
  isRegisterTabs.value = true
  showUserInfo(id)
}
const showUserInfo = (id) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: id
  })
  modalsStore.showModal('userInfoModal')
}
const closeTabs = () => {
  isTabs.value = false
  activeName.value = 'basicInformation'
  accountInfo.value = {}
}

onMounted(() => {
  viewFunction()
  fetchData()
})

const viewFunction = () => {
  let data = useRoutes.query
  if (data.type == '1') {
    userId.value = data.viewId
    isRegisterTabs.value = true
    showUserInfo(data.viewId)
  }
}

watch(
  () => [queryForm.page, queryForm.size],
  (newVal, oldVal) => {
    fetchData()
  }
)
</script>
<style lang="less" scoped>
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
