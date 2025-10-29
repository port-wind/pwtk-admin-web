<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        @keyup.enter="fetchData({ page: 1 })"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
      >
        <el-form-item>
          <SelectDomain v-model="queryForm.domain" placeholder="域名" style="width: 168px" />
        </el-form-item>
        <el-form-item>
          <SelectUserIdAndNickname
            v-model="queryForm.ownerUserId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 168px"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.domainStatus" placeholder="域名类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="queryForm.websiteTitle" clearable placeholder="标题" style="width: 168px" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model.trim="queryForm.websiteInnerName"
            clearable
            placeholder="站点内部名称"
            style="width: 168px"
          />
        </el-form-item>
        <el-form-item>
          <AutoChoseWebSiteId v-model="queryForm.websiteRef" placeholder="綁定站点ID" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryForm.langCodes"
            multiple
            placeholder="语言"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
            style="width: 165px"
          >
            <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryForm.areaCodes"
            multiple
            placeholder="地区"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
            style="width: 140px"
          >
            <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="() => openAddDomainDialog()">新增</el-button>
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
        :show-overflow-tooltip="{ disabled: false }"
      >
        <template #domain="{ scope }">
          <a href="javascript:void(0)" class="domain-link" @click="openAddDomainDialog(scope.row.domain)">
            {{ scope.row.domain }}
          </a>
        </template>
        <template #domainFrom="{ scope }">{{ domainSource[scope.row.domainFrom] }}</template>
        <template #domainType="{ scope }">{{ domainType[scope.row.domainType] }}</template>
        <template #domainStatus="{ scope }">
          <div style="display: flex; justify-content: space-between">
            <span style="padding: 4px 0 0 0">{{ scope.row.domainStatus === 'y' ? '启用' : '关闭' }}</span>
            <el-switch
              v-model="scope.row.domainStatus"
              :active-value="'y'"
              :inactive-value="'n'"
              :before-change="() => statusChanged(scope.row, editDomain, () => fetchData(), 'domainStatus')"
            ></el-switch>
          </div>
        </template>
        <!-- 落地页 -->
        <template #landingPage="{ scope }">{{ landingPage[scope.row.landingPage] }}</template>
        <!-- 绑定站点 -->
        <template #websiteRef="{ scope }">
          <span class="like-a" @click="handleClickWebsite(scope.row)" v-text="scope.row.websiteRef" />
        </template>
        <!-- 所属用户 -->
        <template #ownerUserId="{ scope }">
          <!-- userName即loginId -->
          <p :title="scope.row.userName" class="like-a g-text-nowrap-ellipsis" @click="showUserInfoDialog(scope.row)">
            {{ scope.row.userName }}
          </p>
        </template>
        <template #langCodes="{ scope }">
          <span>{{ scope.row.langCodes.map((item) => t(item)).join(',') }}</span>
        </template>
        <template #areaCodes="{ scope }">
          {{
            scope.row.areaCodes
              .map((item) => {
                return country_map_label.find((country) => country.country_code.toLowerCase() === item.toLowerCase())
                  ?.country_name
              })
              .filter((item) => item)
              .join(',')
          }}
        </template>
        <template #isForceHttps="{ scope }">
          <span>{{ scope.row.isForceHttps === 'y' ? '是' : '否' }}</span>
        </template>
        <template #isSupportSsl="{ scope }">
          <span>{{ scope.row.isSupportSsl === 'y' ? '是' : '否' }}</span>
        </template>
        <template #sslExpiry="{ scope }">
          <span>{{ scope.row.sslExpiry }}</span>
        </template>
        <template #hasStatsCode="{ scope }">
          <el-text v-if="scope.row.hasStatsCode === 'y'" class="mx-1" type="primary">
            <el-link @click="openCodeTemplateDialog(scope.row)" type="primary">查看</el-link>
          </el-text>
          <el-text v-else class="mx-1" type="info"></el-text>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime) }}
        </template>
      </m-table>
    </section>
  </section>

  <!-- 新增 绑定站点 / 表格列 域名 -->
  <AddDomainDialog v-if="unMountDialog" ref="AddDomainDialogRef" @onClose="handleClose" />
  <!-- 站点详情 -->
  <EditWebsiteTabs ref="editWebsiteTabsRef" :kengengaaruka="false" v-if="modalsStore.websiteInfoModal.isVisible" />

  <!-- 统计代码 -->
  <CodeTemplate ref="CodeTemplateRef" />
  <!-- 表格列	所属用户 -->
  <UserListComponent></UserListComponent>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import i18n from '@/locales'
import { reqDomain, editDomain } from '@/api/site/domain'
import { options } from '@/views/Site/Domain/data'
import { domainType, domainSource, landingPage } from '@/const/options.json'
import { optionsLang, optionsArea } from '@/const/options'
import type { IReqDomainQueryParams, IReqDomainData } from '@/api/site/domain/types'
import { useModalsStore } from '@/stores/modalStore'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { statusChanged } from '@/utils/table'
import CodeTemplate from '@/views/Site/comps/CodeTemplate.vue'
import country_cn from '@/assets/json/country_cn.json'
import country_tw from '@/assets/json/country_tw.json'
import country_en from '@/assets/json/country_en.json'

const lang = localStorage.getItem('language')
const country_map_label = computed(() => {
  switch (lang) {
    case 'zh-cn':
      return country_cn
    case 'zh-tw':
      return country_tw
    case 'en':
      return country_en
    default:
      return country_cn
  }
})

const { t } = i18n.global

const modalsStore = useModalsStore()

const tableRef = ref()
const queryRef = ref()
const tableData = ref<IReqDomainData[]>([])
const editDialogVisible = ref(false)
const popupFormData = ref<IReqDomainData>()
const editWebsiteTabsRef = ref(null)
const unMountDialog = ref<boolean>(false)
const AddDomainDialogRef = ref()
const CodeTemplateRef = ref<InstanceType<typeof CodeTemplate>>()

const openCodeTemplateDialog = (row: IReqDomainData) => {
  if (CodeTemplateRef.value) {
    CodeTemplateRef.value?.open({
      statsCodeInit: row.statsCodeInit,
      statsCodeInit2: row.statsCodeInit2,
      statsCodeInit3: row.statsCodeInit3,
      statsCodeInit4: row.statsCodeInit4,
      statsCodeJsUrl: row.statsCodeJsUrl,
      statsCodeJsUrl2: row.statsCodeJsUrl2,
      statsCodeJsUrl3: row.statsCodeJsUrl3,
      statsCodeJsUrl4: row.statsCodeJsUrl4
    })
  }
}

const openAddDomainDialog = (domain?: string) => {
  unMountDialog.value = true
  nextTick(() => {
    AddDomainDialogRef.value!.openDialog(domain)
  })
}

const total = ref(0)
const isLoading = ref<boolean>(false)

const initFormQuery = (): IReqDomainQueryParams => ({
  page: 1,
  size: 15,
  domain: '',
  ownerUserId: '',
  websiteRef: '',
  langCodes: [],
  areaCodes: [],
  websiteTitle: '',
  websiteInnerName: '',
  sortName: 'create_time',
  sortOrder: 'DESC',
  domainStatus: 'L'
})
const queryForm = reactive<IReqDomainQueryParams>(initFormQuery())

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initFormQuery())
  fetchData()
}

const handleSizeChange = (val: number) => {
  queryForm.size = val
  queryForm.page = 1
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

const fetchData = async (vals?: Partial<IReqDomainQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqDomainQueryParams = {
      ...queryForm,
      ...vals
    }
    if (query.domainStatus === 'L') {
      delete query.domainStatus
    }

    if (vals) {
      Object.assign(queryForm, vals)
    }

    const response = await reqDomain(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const handleClickWebsite = (row) => {
  modalsStore.setActiveTab('websiteInfoModal', 'tab1')
  modalsStore.setModalData('websiteInfoModal', {
    websiteId: row.websiteRef,
    showOtherTabs: true,
    websiteInnerName: row.websiteInnerName,
    canHandleSubmit: true,
    isVisible: true,
    hasRightToSubmit: false
  })
  modalsStore.showModal('websiteInfoModal')
}

const showUserInfoDialog = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.ownerUserId
  })
  modalsStore.showModal('userInfoModal')
}

const handleClose = async (isEdit: boolean) => {
  const { page, size } = queryForm
  Object.assign(queryForm, initFormQuery())
  console.log(isEdit)

  if (isEdit) {
    queryForm.page = page
    queryForm.size = size
  }

  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.wrapper {
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}
</style>
