<template>
  <section class="wrapper">
    <section>
      <el-form :inline="true" class="custom-el-form no-rule" :model="searchFormModel" ref="formRef">
        <el-form-item label="" prop="websiteId">
          <el-input v-model="queryForm.websiteId" placeholder="站点ID" />
        </el-form-item>
        <el-form-item label="" prop="websiteTemplateRef">
          <el-input v-model="queryForm.websiteTemplateRef" placeholder="模版ID" />
          <!-- <AutoChoseTemplate
            v-model="queryForm.websiteTemplateRef"
            placeholder="模版ID"
          /> -->
        </el-form-item>
        <el-form-item class="search-btn">
          <el-button type="primary" @click="fetchData()">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button
            @click="resetSearchForm"
            :style="{
              color: 'var(--el-color-primary)',
              borderColor: 'var(--el-color-primary)',
              backgroundColor: '#e9f3ff'
            }"
          >
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
        :data="tableList"
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
        highlight-current-row
        :show-overflow-tooltip="true"
      >
        <template #websiteId="{ scope }">
          <div>{{ scope.row.websiteId }}</div>
        </template>
        <template #websiteStatus="{ scope }">
          <div>
            {{ scope.row.websiteStatus === 'y' ? '启用' : '维护' }}
          </div>
        </template>
        <template #isSysTemplate="{ scope }">
          <el-button type="success" @click="handleBindWebsite(scope.row.websiteId)" style="color: black">
            绑定
          </el-button>
        </template>
      </m-table>
    </section>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { getWebSiteInfo, setBingWebSite } from '@/api/site'
import { useModalsStore } from '@/stores/modalStore'
import { IGetWebSiteInfoQueryParams, ISetWebSiteListIdQueryParams } from '@/api/site/type'
import { IListTypeCode } from '@/api/betting/types'
import { TableOptions } from '@/components/mTable/types'
import { FormInstance } from 'element-plus'

interface IProps {
  domain: string
  dialogHeight: number
  originOwnerUserId: string
}
const props = defineProps<IProps>()
const ownerUserForm = ref<boolean>(false)
const total = ref(0)
const formRef = ref<FormInstance>()
const emit = defineEmits(['onCallback'])
const initQueryForm = (): IGetWebSiteInfoQueryParams => ({
  page: 1,
  size: 5,
  ownerUserId: props.originOwnerUserId,
  websiteId: '',
  websiteTemplateRef: ''
})
const queryForm = reactive<IGetWebSiteInfoQueryParams>(initQueryForm())
const tableList = ref<IListTypeCode[]>([])
const isLoading = ref<boolean>(false)
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

const options: TableOptions[] = [
  {
    prop: 'websiteTitle',
    label: '站点名称',
    fixed: 'left',
    columAttr: {
      minWidth: 180
    }
  },
  {
    prop: 'userName',
    label: '账户名称 | 账户昵称',
    columAttr: {
      minWidth: 180
    }
  },
  {
    prop: 'templateName',
    label: '绑定模板名称',
    columAttr: {
      minWidth: 230
    }
  },
  {
    prop: 'websiteStatus',
    label: '状态',
    slot: 'websiteStatus',
    columAttr: {
      minWidth: 55
    }
  },
  {
    prop: 'websiteTitle',
    label: '标题',
    columAttr: {
      minWidth: 120
    }
  },
  {
    prop: 'isSysTemplate',
    label: '操作',
    slot: 'isSysTemplate',
    columAttr: {
      minWidth: 86
    }
  }
]
const initAccountInfo = () => ({})
const accountInfo = ref<any>(initAccountInfo())
const closeUserDialog = () => {
  Object.assign(accountInfo.value, initAccountInfo())
  ownerUserForm.value = false
}
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}
// 定义接口
interface SearchFormModel {
  websiteId: string
  ownerUserId: string
  websiteTemplateRef: string
}
// 初始化方法
function initSearchFormModel(): SearchFormModel {
  return {
    websiteId: '',
    ownerUserId: '',
    websiteTemplateRef: ''
  }
}
// 搜索表单数据
const searchFormModel = ref<SearchFormModel>(initSearchFormModel())

// 获取路由对象
const router = useRouter()
const userId: Ref<string> = ref('')

const modalsStore = useModalsStore()
const jumpView = ({ id, tab }) => {
  userId.value = id
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
// 搜索方法
const fetchData = async () => {
  if (!props.originOwnerUserId) {
    return
  }
  try {
    const query: IGetWebSiteInfoQueryParams = {
      ...queryForm,
      ownerUserId: props.originOwnerUserId
    }
    const res = await getWebSiteInfo(query)
    if (res.success) {
      const { list } = res.data
      tableList.value = list
      total.value = Number(res.data.total)
    } else {
      console.error('res.errMessage', res.errMessage)
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
    // else if (sendParams.ownerUserId == '') {
    //   total.value = 0
    //   tableList.value = []
    // } else {
    // }
  } catch (error) {
  } finally {
  }
}
// 如果需要重置表单
function resetSearchForm() {
  formRef.value?.resetFields()
  Object.assign(queryForm, initQueryForm())
}

const handleBindWebsite = async (websiteId: string) => {
  console.log('🚀 ~ handleBindWebsite ~ websiteId:', websiteId)
  const query: ISetWebSiteListIdQueryParams = {
    domain: props.domain,
    domainStatus: 'y',
    websiteId: websiteId
  }
  const res = await setBingWebSite(query)
  if (res.success) {
    ElMessage({
      message: '绑定完成',
      type: 'success',
      duration: 2000 // 显示时间，单位为毫秒
    })
    emit('onCallback')
  } else {
    ElMessage({
      message: '绑定失败',
      type: 'error',
      duration: 2000 // 显示时间，单位为毫秒
    })
  }
}

onMounted(() => {
  fetchData()
})

watch(
  () => [props.originOwnerUserId, queryForm],
  (newVal) => {
    fetchData()
  },
  {
    deep: true
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
  height: calc(100vh - 210px);
  display: flex;
  flex-direction: column;
}
</style>
