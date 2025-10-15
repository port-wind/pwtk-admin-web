<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        @keyup.enter="fetchData({ page: 1 })"
        :model="queryForm"
        class="custom-el-form no-rule"
      >
        <el-form-item label="" prop="websiteId">
          <AutoChoseWebSiteId v-model="queryForm.websiteId" placeholder="站点ID" style="width: 165px" />
        </el-form-item>
        <el-form-item label="" prop="websiteTitle">
          <el-input
            v-model.trim="queryForm.websiteTitle"
            placeholder="站点标题"
            clearable
            maxlength="128"
            style="width: 165px"
          />
        </el-form-item>
        <el-form-item label="" prop="ownerUserId">
          <SelectUserIdAndNickname
            v-model="queryForm.ownerUserId!"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 160px"
          />
        </el-form-item>

        <el-form-item label="" prop="websiteTemplateRef">
          <AutoChoseTemplate v-model="queryForm.websiteTemplateRef" placeholder="模版ID" :clearable="false" select />
        </el-form-item>

        <el-form-item label="" prop="websiteInnerName">
          <el-input v-model="queryForm.websiteInnerName" placeholder="站点内部名称" maxlength="128" />
        </el-form-item>

        <el-form-item label="" prop="langCodes">
          <el-select
            v-model="queryForm.langCodes"
            multiple
            placeholder="语言"
            style="width: 165px"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="areaCodes">
          <el-select
            v-model="queryForm.areaCodes"
            multiple
            placeholder="地区"
            style="width: 140px"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="() => openAddSiteDailog()" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #websiteId="{ scope }">
          <el-link class="like-a" type="primary" @click="openAddSiteDailog(scope.row.websiteId)">
            {{ scope.row.websiteInnerName }}
          </el-link>
        </template>
        <template #templateName="{ scope }">
          <el-link class="like-a" type="primary" @click="showTemplateInfoDialog(scope.row)">
            {{ scope.row.templateName }}
          </el-link>
        </template>
        <template #ownerUserId="{ scope }">
          <el-link class="like-a" type="primary" @click="showUserInfoDialog(scope.row)">
            {{ scope.row.userName }}
          </el-link>
        </template>
        <template #websiteStatus="{ scope }">
          <el-dropdown trigger="click" size="small" @command="stateChange">
            <span class="el-dropdown-link">
              <el-tag v-if="scope.row.websiteStatus == 'y'" class="mx-1" type="primary">启用</el-tag>
              <el-tag v-if="scope.row.websiteStatus == 'm'" class="mx-1" type="warning">维护</el-tag>
              <el-tag v-if="scope.row.websiteStatus == 'c'" class="mx-1" type="info">关闭</el-tag>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{
                    websiteId: scope.row.websiteId,
                    websiteStatus: 'y'
                  }"
                >
                  <el-tag class="mx-1" type="primary">启用</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="{ websiteId: scope.row.websiteId, websiteStatus: 'm' }">
                  <el-tag class="mx-1" type="warning">维护</el-tag>
                </el-dropdown-item>
                <el-dropdown-item :command="{ websiteId: scope.row.websiteId, websiteStatus: 'c' }">
                  <el-tag class="mx-1" type="info">关闭</el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #pageComponent="{ scope }">
          <el-text class="mx-1" type="primary">
            <el-link @click="handPageComponentTab(scope.row)" type="primary">查看</el-link>
          </el-text>
        </template>
        <template #statisticsCode="{ scope }">
          <el-text v-if="scope.row.hasStatsCode === 'y'" class="mx-1" type="primary">
            <el-link @click="openCodeTemplateDialog(scope.row)" type="primary">查看</el-link>
          </el-text>
          <el-text v-else class="mx-1" type="info"></el-text>
        </template>
        <template #langCodes="{ scope }">
          {{ formatLanguageData(scope.row.langCodes) }}
        </template>
        <template #areaCodes="{ scope }">
          {{ formatLanguageData(scope.row.areaCodes) }}
        </template>
      </m-table>
    </section>
  </section>

  <!-- 新增站点 -->
  <AddSiteDailog v-if="unMountAddSiteDailog" ref="AddSiteDailogRef" @onClose="handleClose" />

  <!-- 绑定模版 -->
  <AddTemplateDailog v-if="unMountAddTemplateDailog" ref="AddTemplateDailogRef" @onClose="handleClose" />

  <!-- 表格列	所属用户 -->
  <UserListComponent></UserListComponent>

  <!-- 统计代码 -->
  <CodeTemplate ref="CodeTemplateRef" />
</template>

<script setup lang="ts">
import i18n from '@/locales'
import router from '@/router'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

import { useOptions, optionsLang, optionsArea } from '@/const/options'
import { sessionCache } from '@/hooks/useSession'
import { useModalsStore } from '@/stores/modalStore'

import { reqGetALLWebsiteList, reqWebsiteCodeStatus } from '@/api/site/index'
import type { IReqGetALLWebsiteListData, IReqGetALLWebsiteListQueryParams } from '@/api/site/type'

import AddSiteDailog from '@/views/Site/siteManagement/new/addSiteDailog.vue'
import AddTemplateDailog from '@/views/Site/templateManagement/components/addTemplateDailog.vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { options } from '@/views/Site/siteManagement/data'
import CodeTemplate from '@/views/Site/comps/CodeTemplate.vue'
import showErrorMessage from '@/utils/showErrorMessage'

const modalsStore = useModalsStore()
const { t } = i18n.global
const CodeTemplateRef = ref<InstanceType<typeof CodeTemplate>>()
const queryRef = ref()
const unMountAddSiteDailog = ref<boolean>(false)
const AddSiteDailogRef = ref()
const unMountAddTemplateDailog = ref<boolean>(false)
const AddTemplateDailogRef = ref()
const emit = defineEmits(['closeEvent'])
const isLoading = ref<boolean>(false)

const initFormQuery = (): IReqGetALLWebsiteListQueryParams => ({
  page: 1,
  size: 15,
  sortName: 'CREATE_TIME',
  sortOrder: 'DESC',
  websiteId: '',
  websiteInnerName: '',
  websiteTitle: '',
  ownerUserId: '',
  websiteTemplateRef: '',
  langCodes: [],
  areaCodes: [],
  pageCode: ''
})

const total = ref<number>(0)
const tableData = ref<IReqGetALLWebsiteListData[]>([])
const queryForm = reactive<IReqGetALLWebsiteListQueryParams>(initFormQuery())

const { formatData: formatLanguageData } = useOptions(optionsLang)

const openCodeTemplateDialog = (row: IReqGetALLWebsiteListData) => {
  if (CodeTemplateRef.value) {
    CodeTemplateRef.value?.open({
      statsCodeInit: row.statsCodeInit,
      statsCodeJsUrl: row.statsCodeJsUrl
    })
  }
}

const openAddSiteDailog = (websiteId?: string) => {
  unMountAddSiteDailog.value = true
  nextTick(() => {
    AddSiteDailogRef.value!.openDailog(websiteId)
  })
}

const openAddTemplateDailog = (templateId?: string) => {
  unMountAddTemplateDailog.value = true
  nextTick(() => {
    AddTemplateDailogRef.value.openDailog(templateId)
  })
}

const showTemplateInfoDialog = (row) => {
  openAddTemplateDailog(row.websiteTemplateRef)
}

//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IReqGetALLWebsiteListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqGetALLWebsiteListQueryParams = {
      ...queryForm,
      ..._queryForm
    }
    if (_queryForm) {
      Object.assign(queryForm, _queryForm)
    }

    const response = await reqGetALLWebsiteList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
    isLoading.value = false
  }
}

const showUserInfoDialog = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.ownerUserId
  })
  modalsStore.showModal('userInfoModal')
}

const stateChange = (row: IReqGetALLWebsiteListData) => {
  switch (row.websiteStatus) {
    case 'c':
      // 关闭必须清空关联模版
      ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
        confirmButtonText: t('button.determine'),
        cancelButtonClass: t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          reqWebsiteCodeStatus(row).then(() => {
            fetchData()
          })
        })
        .catch(() => {})
      break
    case 'm':
      ElMessageBox.confirm(t('pop.areyousurepageMaintenance'), t('pop.warn'), {
        confirmButtonText: t('button.determine'),
        cancelButtonClass: t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          reqWebsiteCodeStatus(row).then(() => {
            fetchData()
          })
        })
        .catch(() => {})
      break
    case 'y':
      ElMessageBox.confirm(t('pop.areyousurepageOpen'), t('pop.warn'), {
        confirmButtonText: t('button.determine'),
        cancelButtonClass: t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          reqWebsiteCodeStatus(row).then(() => {
            fetchData()
          })
        })
        .catch(() => {})
      break
    default:
      return
  }
}

function openInNewTab(route: string, params: Record<string, string>) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}

const handPageComponentTab = (row) => {
  sessionCache.setCache('siteRowInfo', row)
  const websiteId = row.websiteId
  const templateId = row.websiteTemplateRef

  // openInNewTab('/webVision', { websiteId })
  // openInNewTab('/webVisionBuilder', { websiteId })
  // openInNewTab('/webVisionWebsite', { websiteId })
  openInNewTab('/webVisionBuilderWebsite', { websiteId })
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

const handleClose = () => {
  fetchData()
}

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initFormQuery())
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
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
