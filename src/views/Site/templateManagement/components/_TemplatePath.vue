<template>
  <section class="section-wrapper">
    <section class="header-inside-dialog">
      <h3>层级表示(</h3>
      <el-breadcrumb v-if="rulesDialogVisible" :separator-icon="ArrowRight">
        <el-breadcrumb-item :key="item" v-for="(item, index) in parentPath">
          <span class="like-a" @click="checkParentData(item, index)">
            {{ item.templateName + '|' + item.templateId }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>)</h3>
    </section>
    <section class="section-custom-table">
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
        <template #websiteInnerName="{ scope }">
          <span @click="openGetBingTemplateWebsite(scope.row)" class="like-a">
            {{ scope.row.websiteInnerName }}
          </span>
        </template>
        <template #userName="{ scope }">
          <span>{{ scope.row.userName }}</span>
          <el-icon v-if="scope.row.userName" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
            <Position />
          </el-icon>
        </template>
        <template #websiteStatus="{ scope }">
          <span>{{ getWebsiteStatusLabel(scope.row.websiteStatus) }}</span>
        </template>
      </m-table>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import {} from '@/api/user/prommot'
import { ArrowRight } from '@element-plus/icons-vue'
import { IReqDetailListData, IReqDetailListQueryParams, IReqPromoteListData } from '@/api/user/prommot/type'
import { TableOptions } from '@/components/mTable/types'
import { getWebsiteStatusLabel } from '@/views/Site/sketchManagement/components/data'
import {
  reqBingWebsiteDomain,
  getBingTemplateWebsite,
  IGetBingTemplateWebsiteData,
  IGetBingTemplateWebsiteQueryParams,
  IReqBingWebsiteDomainQueryParams
} from '@/api/site'

const props = defineProps<{
  templateId: string
  templateName: string
}>()
const router = useRouter()
const bingTemplateWebsite = ref<IGetBingTemplateWebsiteData>()
const isLoading = ref(false)
const tableData = ref<IGetBingTemplateWebsiteData[]>([])
const currentRow = ref<IReqPromoteListData>()
const parentPath = reactive<
  {
    templateName?: string
    templateId?: string
  }[]
>([])
const rulesDialogVisible = ref<Boolean>(false)
const total = ref<number>()
const queryForm = reactive<IReqDetailListQueryParams>({
  page: 1,
  size: 15,
  promotionCode: ''
})

// userId: number // int64
//   loginId: string
//   nickname: string
//   userStatus: string
//   promotionCodeList: string[] // array of strings
//   cnt: number // int32
//   regTime: string // format: yyyy-MM-dd HH:mm:ss
// 被邀请人帐号|昵称 被邀请人状态 邀请码 邀请人数 注册时间

const options: TableOptions[] = [
  { prop: 'websiteInnerName', label: '站点名称', slot: 'websiteInnerName' },
  { prop: 'userName', label: '账户名称 | 账户昵称', slot: 'userName' },
  { prop: 'websiteStatus', label: '状态', slot: 'websiteStatus' },
  { prop: 'websiteTitle', label: '标题' },
  {
    prop: 'regTime',
    label: '注册时间',
    dateName: 'regTime'
  }
  // { prop: 'userId', label: '邀请人帐号｜昵称' },
  // { prop: 'loginId', label: '邀请人帐号｜昵称' },
]
const onClose = () => {
  parentPath.length = 0
}

// 1. getBingTemplateWebsite
const openGetBingTemplateWebsite = (row: IGetBingTemplateWebsiteData) => {
  //   parentPath.length = index + 1
  //   parentPath.value.push(row)
  //   fetchData(row.id)

  parentPath.splice(1)
  parentPath.push({ templateName: row.templateName, templateId: row.websiteId })
  reqBingWebsiteDomain({
    websiteRef: row.websiteId,
    sortOrder: 'ASC',
    sortName: 'create_time',
    page: queryForm.page,
    size: queryForm.size
  }).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.data.list
      total.value = Number(res.data.total)
    }
  })
}

// 2. getBingWebsiteDomain
const openGetBingWebsiteDomain = (row) => {
  parentPath.length = 1
  parentPath.push({ templateName: row.websiteInnerName, templateId: row.websiteId })
  reqBingWebsiteDomain({
    websiteRef: row.websiteId,
    sortOrder: 'ASC',
    sortName: 'create_time',
    page: queryForm.page,
    size: queryForm.size
  }).then((res: any) => {
    if (res && res.success) {
      tableData.value = res.data.list
      total.value = Number(res.data.total)
    }
  })
}

const handleSizeChange = (val: number) => {
  queryForm.size = val
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const checkParentData = (parentPathItem, index) => {
  parentPath.length = index + 1
  fetchData(parentPathItem.promotionCode)
}

const checkChildData = (row: IReqDetailListData) => {
  parentPath.push({
    templateName: row.nickname,
    templateId: row.userId
  })
  // fetchData(row.[0])
}
const userId: Ref<string> = ref('')
const jumpView = ({ id, tab }) => {
  userId.value = id
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
const currentPage = ref(1)
const pageSize = ref(5)

const subFetchData = async () => {
  // reqBingWebsiteDomain
  const sendedParameters = {
    page: currentPage.value,
    size: pageSize.value,
    websiteTemplateRef: props.templateId
  }

  const queryForm: IReqBingWebsiteDomainQueryParams = {
    page: 0,
    size: 0,
    websiteRef: ''
  }
  await reqBingWebsiteDomain(queryForm)
}

const openBingWebsiteDomain = (row) => {}

const fetchData = async (templateId) => {
  isLoading.value = true
  try {
    const sendedParameters: IGetBingTemplateWebsiteQueryParams = {
      sortOrder: 'ASC',
      sortName: 'create_time',
      page: currentPage.value,
      size: pageSize.value,
      websiteTemplateRef: templateId
    }
    getBingTemplateWebsite(sendedParameters)
      .then((res) => {
        if (res && res.success) {
          tableData.value = res.data.list
          total.value = Number(res.data.total)
          bingTemplateWebsite.value = res.data.list[0]
          parentPath.splice(0)
          parentPath.push({
            templateName: props.templateName,
            templateId: props.templateId
          })
        }
        return res
      })
      .finally(() => {
        isLoading.value = false
      })
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

export interface IExpose {
  openDailog: (row: IReqPromoteListData) => void
}

watch(
  () => [props.templateId, props.templateName],
  (newVal) => {
    if (newVal) {
      fetchData(newVal)
    }
    // getBingTemplateWebsite websiteTemplateRef:Test1020          引用的草图代码:
    // getBingTemplateWebsite  --> 1330836562564350656 (websiteId)
    // getBingWebsiteDomain  websiteRef: 1330836562564350656
    // getBingWebsiteDomain  websiteRef: 1330836562564350656
    // getBingWebsiteDomain  websiteRef: 1330836562564350656
  }
)
</script>

<style lang="scss" scoped>
.section-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.section-custom-table {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.custom-table {
}

.header-inside-dialog {
  display: flex;
}
</style>
