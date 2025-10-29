<template>
  <section class="wrapper">
    <section id="system_account">
      <mSearch
        :isLoading="isLoading"
        :formOptions="bindedSearchOptions"
        :buttonOptions="searchBtnOptions"
        @reset="reset"
        @query="handleSearch"
        ref="searchRef"
      >
        <template v-if="props.domainType === 2" #autoCompleteDomain="{ scope, form }">
          <AutoComplete
            v-model="form.domain"
            placeholder="域名"
            keyword="domain"
            :is-page="true"
            :is-list="true"
            :displayFields="['domain']"
            :trigger-on-focus="true"
            :httpFunc="reqUnBingWebsiteDomain"
            :searchObj="{ websiteRef: '', type: '2', page: currentPage, size: pageSize }"
          ></AutoComplete>
        </template>
        <template v-else #autoCompleteDomain="{ scope, form }">
          <AutoComplete
            v-model="form.domain"
            placeholder="域名"
            keyword="domain"
            :is-page="false"
            :is-list="false"
            :displayFields="['domain']"
            :trigger-on-focus="true"
            :httpFunc="reqBingWebsiteDomain"
            :searchObj="{
              websiteRef: props.websiteId,
              type: '1',
              page: currentPage,
              size: pageSize
            }"
          ></AutoComplete>
        </template>
        <template #timeLine="{ scope, form }">
          <el-date-picker v-model="form.createTime" type="date" placeholder="请选择创建时间" style="width: 100%" />
        </template>
        <!--   <template #userId="{ scope, form }">
          <AutoComplete
            v-model="form.ownerUserId"
            placeholder="用户ID"
            keyword="searchId"
            :is-list="true"
            :isPage="true"
            :displayFields="['loginId', 'userId']"
            inputValue="userId"
            :trigger-on-focus="true"
            :httpFunc="reqUserList"
          ></AutoComplete>
        </template> -->
      </mSearch>
    </section>
    <section class="custom-table">
      <!-- <el-table height="500" key="id" border v-dragable="dragOptions" :data="data">
        <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label" />
      </el-table> -->
      <m-table
        :page-sizes="pageSizes"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :is-dragable="true"
        @on-drag="handleDragChange"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #domainFrom="{ scope }">
          <span>{{ domainSource[scope.row.domainFrom] }}</span>
        </template>
        <template #domainType="{ scope }">
          <span>{{ mapDomainType[scope.row.domainType] }}</span>
        </template>
        <template #force="{ scope }">
          <span style="margin-right: 10px">{{ scope.row.isForceHttps === 'y' ? '是' : '否' }}</span>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 0px">
            {{ scope.row.domainStatus === 'y' ? '启用' : '关闭' }}
          </span>
        </template>
        <template #default="{ row }">{{ landingPage[row.landingPage] }}</template>
        <template #websiteRefAndWebsiteInnerName="{ scope }">
          <div>{{ scope.row.websiteInnerName }}</div>
          <div>{{ scope.row.websiteRef }}</div>
        </template>
        <template #userNameAndOwnerUserId="{ scope }">
          <span>{{ scope.row.userName }}</span>
          <el-icon v-if="scope.row.ownerUserId" @click="jumpView({ id: scope.row.ownerUserId, tab: 'tab1' })">
            <Position />
          </el-icon>
        </template>
        <template #handleButton="{ scope }">
          <template v-if="type === '1'">
            <el-button
              style="color: black"
              type="success"
              :disabled="disableOperation"
              @click="
                handleBindOrUnBind({
                  websiteId: props.websiteId,
                  type: '1',
                  domainStatus: 'n',
                  domain: scope.row.domain
                })
              "
            >
              解绑
            </el-button>
          </template>
          <template v-else>
            <el-button
              type="success"
              :disabled="disableOperation"
              @click="
                handleBindOrUnBind({
                  websiteId: props.websiteId,
                  type: '2',
                  domainStatus: 'y',
                  domain: scope.row.domain
                })
              "
              style="color: black"
            >
              绑定
            </el-button>
          </template>
        </template>
      </m-table>
    </section>
  </section>
</template>

<script setup lang="ts">
import { defineExpose, ref } from 'vue'
import type { TableOptions } from '@/components/mTable/types'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import type { GetRequest, TableData } from '@/api/system/upload/types'
import { landingPage, domainSource } from '@/const/options.json'
import {
  reqBingWebsiteDomain,
  reqUnBingWebsiteDomain,
  reqDomain,
  batchUpdateDomainList,
  type IReqBingWebsiteDomainData,
  type IBatchUpdateDomainListQueryParams
} from '@/api/site'
import { vDragable } from 'element-plus-table-dragable'
import { pageSizes } from './data'
import { reqUserList } from '@/api/user/index'
import { useRoute } from 'vue-router'
const route = useRoute()
const disableOperation = route.path === '/site/domainManagement'
let domain: string = ''
const searchRef = ref()
const mapDomainType = ref({
  f: '前端',
  m: '管端',
  z: '总管',
  p: '前端永久',
  b: '前端备用'
})
const router = useRouter()
import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()
const userId: Ref<string> = ref('')
const jumpView = ({ id, tab }) => {
  userId.value = id
  /* modalsStore.showModal('userInfoForJumpModal')
  modalsStore.setActiveTab('userInfoForJumpModal', tab)
  modalsStore.setModalData('userInfoForJumpModal', {
    ...modalsStore.userInfoForJumpModal.modalData,
    userId: userId.value,
    showCommitButton: false
  }) */
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
function openInNewTab(route, params) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}
interface DomainConfig {
  websiteRef: string
  type: '1' | '2' // assuming "type" can have a limited set of string values
  // y,启用;c,关闭;n,维护',
  domainStatus: 'y' | 'n' | '' | 'c'
  domainType: string
  promotionCode: string
  domain: string
  isForceHttps: string
  createTime: string | Date
}
interface BindDataInterface {
  websiteId: string
  type: '1' | '2'
  domainStatus: string
  domain: string
}
const emit = defineEmits<{
  (event: 'updateActiveTab', clickedDomain: string): void
}>()
const initBindData = (): BindDataInterface => ({
  websiteId: '',
  type: '1',
  domainStatus: '',
  domain: ''
})
const initSearchData = (): DomainConfig => ({
  websiteRef: '',
  type: '1',
  domainStatus: '',
  domainType: '',
  promotionCode: '',
  domain: '',
  isForceHttps: '',
  createTime: ''
})
const websiteTitleObj = {
  prop: 'websiteTitle',
  label: '标题',
  slot: 'websiteTitle'
  // width: '150'
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'domain',
    label: '域名',
    fixed: 'left',
    isCopyText: true,
    width: '240'
  },
  {
    prop: 'domainFrom',
    label: '来源',
    slot: 'domainFrom',
    columAttr: {
      width: 70
    }
  },
  {
    prop: 'domainType',
    label: '类型',
    slot: 'domainType',
    columAttr: {
      width: 70
    }
    // width: 70
  },
  {
    prop: 'domainStatus',
    label: '状态',
    slot: 'status',
    columAttr: {
      width: 70
    }
    // width: 70
  },
  /* {
    prop: 'landingPage',
    slot: 'landingPage',
    label: '落地页'
  }, */
  /* {
    prop: 'websiteRefAndWebsiteInnerName',
    // label: '绑定站点',
    label: '绑定站点',
    slot: 'websiteRefAndWebsiteInnerName'
  }, */
  {
    prop: 'userNameAndOwnerUserId',
    label: '账户名称 | 账户昵称',
    width: '300',
    slot: 'userNameAndOwnerUserId',
    columAttr: {
      width: 160
    }
  },
  {
    prop: 'websiteTitle',
    label: '标题',
    width: '180',
    columAttr: {
      width: 140
    }
  },
  {
    prop: 'handleButton',
    label: '操作',
    slot: 'handleButton',
    columAttr: {
      minWidth: 100
    }
  }
]

const onChangeIsShown = async (row: IReqBingWebsiteDomainData) => {
  const data: IBatchUpdateDomainListQueryParams[] = [
    {
      domain: row.domain,
      isShown: row.isShown
    }
  ]
  await batchUpdateDomainList(data)
}

//页面初始化获取数据 如果有OBJ那么就是绑定或者解绑，如果没有那么就是查询这个table
const reset = () => {
  pageSize.value = 5
  currentPage.value = 1
}

const handleSearch = (inputParameters?: any) => {
  isLoading.value = true
  //  必传参数domainStatsTag 域名状态tag. a已经绑定的域名。b未绑定的域名
  // 绑定时候传入websiteRef 未绑定传入空
  let websiteRef: string = ''
  let req = reqBingWebsiteDomain
  switch (props.domainType) {
    // 已绑定站点
    case 1:
      type.value = '1'
      websiteRef = props.websiteId
      queryTableValue.websiteRef = props.websiteId
      req = reqBingWebsiteDomain
      Object.assign(bindedSearchOptions, bindedSearchOptionsInit())
      break
    // 未绑定站点
    case 2:
      type.value = '2'
      websiteRef = props.websiteId
      queryTableValue.websiteRef = props.websiteId
      req = reqUnBingWebsiteDomain
      Object.assign(bindedSearchOptions, unBindedSearchOptionsInit())
      break
    default:
      type.value = '1'
      websiteRef = props.websiteId
      queryTableValue.websiteRef = props.websiteId
      req = reqBingWebsiteDomain
      Object.assign(bindedSearchOptions, bindedSearchOptionsInit())
      break
  }
  let sendedParameters = {
    websiteRef,
    type: props.domainType.toString(),
    ownerUserId: props.ownerUserId
    // sortName: 'modify_time',
    // sortOrder: 'ASC'
  }
  if (props.domainType === 1) {
    // sendedParameters = removeProperty(sendedParameters, 'ownerUserId')
    sendedParameters.type = '1'
  }
  sendedParameters = {
    page: currentPage.value,
    size: pageSize.value,
    ...sendedParameters,
    ...inputParameters
  }

  return req(sendedParameters)
    .then((res) => {
      if (res && res.success) {
        tableData.value = res.data.list.map((item, index) => {
          return {
            ...item,
            index
          }
        })
        total.value = Number(res.data.total)
      }
      // console.log('handleSearch result:', res) // 添加日志
      return res
    })
    .finally(() => {
      isLoading.value = false
    })
}

// 解绑N   绑定传Y
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}
const tableData = ref<IReqBingWebsiteDomainData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)
//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
// 定义和接收 props
const props = defineProps({
  mode: {
    type: String as PropType<'default' | 'domainPage'>,
    default: 'default',
    required: false
  },
  websiteId: {
    type: String,
    required: true
  },
  domainType: {
    type: Number,
    required: true
  },
  ownerUserId: {
    type: String,
    default: ''
  },
  activeTab: {
    type: String
  }
})
onMounted(() => {
  handleSearch()
})
// type1绑定 2解绑 y绑定 n解绑
let type = ref('1')
// 解绑or绑定
const handleBindOrUnBind = (params) => {
  domain = params.domain
  isLoading.value = true
  //  return  console.log('para', params,mode);//domainPage
  const sendedParams: BindDataInterface = {
    ...initBindData(),
    ...params,
    websiteId: props.websiteId
  }
  // console.log('sendedParams', sendedParams)
  // 通过website的ID获取已绑定的域名和没有绑定的域名
  reqDomain(sendedParams)
    .then(() => {
      return handleSearch({ ...searchRef.value.getFormData() })
    })
    .then((res) => {})
    .finally(() => {
      isLoading.value = false
    })
}

let queryTableValue = initSearchData()

const dadDoFetch = (params) => {
  let type = '1'
  if (params.websiteRef) {
    type = '1'
  } else {
    type = '2'
  }
  params.type = type
  console.log('searchRef.value.getFormData()', searchRef.value.getFormData())
  params = { ...searchRef.value.getFormData() }
  handleSearch(params)
}
// 定义暴露
defineExpose({ dadDoFetch })
const bindedSearchOptionsInit = (): SearchOption[] => [
  {
    prop: 'domain',
    type: 'autoComplete',
    slot: 'autoCompleteDomain'
  },

  {
    prop: 'domainType',
    type: 'select',
    width: '110px',
    selectData: {
      selectName: 'domainType',
      placeholder: '类型'
    }
  }
]
const bindedSearchOptions = reactive<SearchOption[]>(bindedSearchOptionsInit())
const unBindedSearchOptionsInit = (): SearchOption[] => [
  {
    prop: 'domain',
    type: 'autoComplete',
    slot: 'autoCompleteDomain'
  },

  {
    prop: 'domainType',
    type: 'select',
    width: '110px',
    selectData: {
      selectName: 'domainType',
      placeholder: '类型'
    }
  },
  {
    prop: 'userId',
    type: 'autoComplete',
    slot: 'userId'
  }
]

const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}

watch(
  () => props.activeTab,
  (newVal, oldVal) => {
    handleSearch()
  }
)

const handleDragChange = async (value) => {
  try {
    isLoading.value = true
    const data = value.map((item) => {
      return {
        domain: item.domain,
        isShown: item.isShown
      }
    })

    console.table(data)
    await batchUpdateDomainList(data)

    setTimeout(() => {
      isLoading.value = false
      handleSearch()
    }, 1000)
  } catch (error) {}

  // 查询一下
}

/// 测试一下。。。。
const dragableOptions = [
  {
    selector: 'tbody', // add drag support for row
    option: {
      // sortablejs's option
      animation: 150,
      onEnd: async (evt) => {
        // const data = tableData.value.map((item, index) => {
        //   return {
        //     domain: item.domain,
        //     isShown: item.isShown
        //   }
        // })
        // await batchUpdateDomainList(data)
      }
    }
  }
]
// const dragOptions = [
//   {
//     selector: 'thead tr', // add drag support for column
//     option: {
//       // sortablejs's option
//       animation: 150,
//       onEnd: (evt) => {
//         console.log('🚀 ~ evt:', evt)
//         let oldCol: any = {}
//         Object.assign(oldCol, columns.value[evt.oldIndex])
//         columns.value.splice(evt.oldIndex, 1) // 因为新增了数据，所以要移除原来的列的index要在原来的基础上
//         setTimeout(() => {
//           columns.value.splice(evt.newIndex, 0, oldCol) // 把原来的列数据添加到新的位置，然后再从原位置移除它，触发table的重绘
//         }, 30)
//         console.log(evt.oldIndex, evt.newIndex)
//       }
//     }
//   },
//   {
//     selector: 'tbody', // add drag support for row
//     option: {
//       // sortablejs's option
//       animation: 150,
//       onEnd: (evt) => {
//         ElMessage.success(`Drag the ${evt.oldIndex}th row to ${evt.newIndex}`)
//         console.log(evt.oldIndex, evt.newIndex)
//       }
//     }
//   }
// ]
</script>
<style scoped>
/* .main_flex_table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto; /* 如果内容可能溢出 */
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 210px);
  display: flex;
  flex-direction: column;
}
</style>
