<template>
  <section id="system_account">
    <!-- Search Form -->
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="issue">
          <el-input v-model.trim="queryForm.issue" placeholder="期数" />
        </el-form-item>

        <el-form-item label="" prop="name">
          <el-input v-model.trim="queryForm.name" placeholder="图纸名称" />
        </el-form-item>

        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeListShow" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="newspaperName">
          <AutoComplete
            v-model="queryForm.newspaperName"
            max-length="255"
            isList
            keyword="newspaperName"
            :httpFunc="getNewsPaperList"
            :displayFields="['newspaperName']"
            :trigger-on-focus="true"
            placeholder="报纸名称"
            @select="handleNewspaperNameQuerySelect"
            @keyup.enter="fetchData"
          />
        </el-form-item>

        <el-form-item label="" prop="newspaperCode">
          <AutoComplete
            v-model="queryForm.newspaperCode"
            max-length="255"
            isList
            keyword="newspaperCode"
            :httpFunc="getNewsPaperList"
            :displayFields="['newspaperCode']"
            :trigger-on-focus="true"
            placeholder="报纸ID"
            @select="handleNewspaperCodeQuerySelect"
            @keyup.enter="fetchData"
          />
        </el-form-item>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" :icon="Search" @click="fetchData()" :loading="tableState.isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="handleReset" plain>重置</el-button>
          <!-- <el-button type="success" :icon="Plus" @click="openAddDialog">新增</el-button>
          <el-button type="default" :icon="Plus" plain @click="batchAdd">批量创建</el-button>
          <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            :icon="Connection"
            @click="() => handleSpecialClick('newsPaperIssue')"
          >
            同步
          </el-button> -->
          <el-dropdown>
            <el-button class="ml-12px" type="success" :icon="Setting" plain>功能</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Plus" @click="openAddDialog">新增</el-dropdown-item>
                <el-dropdown-item :icon="Plus" plain @click="batchAdd">批量上传</el-dropdown-item>
                <el-dropdown-item :icon="Refresh" @click="openClearCacheDialog">刷新缓存</el-dropdown-item>
                <el-dropdown-item
                  :icon="Connection"
                  @click="() => handleSpecialClick('newsPaperIssue')"
                  v-if="isShowCheckboxTable"
                  plain
                >
                  同步
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </section>

    <!-- Table -->
    <section class="account-table">
      <m-table
        :options="tableOptions"
        :data="tableState.tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="tableState.isLoading"
        isEditRow
        pagination
        stripe
        :total="tableState.total"
        :currentPage="tableState.currentPage"
        :pageSize="tableState.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #issue="{ scope }">
          {{ scope.row.issue }}
        </template>

        <template #name="{ scope }">
          <el-link class="like-a" @click="handleClickDetail(scope.row)">
            {{ truncateText(scope.row.name, 6) || scope.row.name }}
          </el-link>
        </template>

        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleSeriesClickDetail(scope.row)">
            {{ truncateText(scope.row.seriesName, 6) }}
          </p>
        </template>

        <template #newspaperCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleNewsPaperClickDetail(scope.row)">
            {{ truncateText(scope.row.newspaperName, 6) }}
          </p>
        </template>

        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
        </template>

        <template #tags="{ scope }">
          <el-popover :content="getTagLabels(scope)" placement="top" width="250" v-if="getTagLabels(scope)">
            <template #reference>
              {{ truncateText(getTagLabels(scope), 5) }}
            </template>
          </el-popover>
        </template>

        <template #imgPath="{ scope }">
          <div v-if="scope.row.imgPath" class="image-container">
            <el-image
              :src="VITE_CDN_URL + scope.row.imgPath"
              :preview-src-list="[VITE_CDN_URL + scope.row.imgPath]"
              :initial-index="0"
              fit="cover"
              class="thumbnail-image"
              :preview-teleported="true"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div v-else class="no-image">
            <el-icon><Picture /></el-icon>
          </div>
        </template>

        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row, update, fetchData)"
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>
  <IssueDialog
    v-if="issueDialogVisible"
    :issueId="selectedRow.issueId"
    v-model:visible="issueDialogVisible"
    :mode="dialogMode"
    @save="() => fetchData()"
  />

  <!-- Related Modals -->
  <modalNewsSeries v-if="modalsStore.newsSeriesModal.isVisible" :isOperateShow="false" @refreshPage="refetchData" />

  <photoSeriesModal :isOperateShow="false" @alreadySubmit="handleSeriesSave" />

  <batchAddIssues v-if="modalsStore.batchAddIssueModal.isVisible" @refresh="refetchData" />

  <checkbox-table v-if="modalsStore.checkboxTable.isVisible" />

  <clearGameTypeCacheDialog ref="clearGameTypeCacheDialogRef" :api="clearCache" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Refresh, Plus, Connection, Setting, Picture } from '@element-plus/icons-vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import modalNewsSeries from '@/components/modalCommon/newsSeriesModal/index.vue'
import photoSeriesModal from '@/components/modalCommon/photoSeriesModal/index.vue'
import batchAddIssues from '@/views/PhotosSys/newsPaperIssue/batchAddIssues/index.vue'
import count from '@/utils/tableHeight'
import { YearTypes, truncateText } from '@/utils/dataFormat'
import { statusChanged } from '@/utils/table'
import { clearCache, getNewsPaperList, update } from '@/api/photoSys/issues'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { useModalsStore } from '@/stores/modalStore'
import { useBettingStore } from '@/stores/bettingStore'

// Import composables
import { useIssueTable } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueTable'
import { type DialogMode } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import clearGameTypeCacheDialog from '@/views/PhotosSys/newsPaperIssue/components/clearGameTypeCacheDialog.vue'
// Component setup
const route = useRoute()
const modalsStore = useModalsStore()
const bettingStore = useBettingStore()
const tableRef = ref()
const gameTypeList = ref<any[]>([])
const gameTypeListShow = computed(() =>
  gameTypeList.value.map((item) => ({ label: item.gameTypeName, value: item.gameType }))
)
const { VITE_DEPLOY_CONFIG } = import.meta.env
const { VITE_PROXY_UPLOAD, VITE_SERVER_CALLBACK, VITE_CDN_URL, VITE_STORY_TYPE } = webConfigApi
const dialogMode = ref<DialogMode>('')
// Composables initialization
const {
  tableState,
  queryForm,
  tableOptions,
  fetchData,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  getTagLabels
} = useIssueTable()

// Local state
const selectedRow = ref<any>({})
// const activeTab = ref('content')
const issueDialogVisible = ref(false)
const clearCacheDialog = ref(false)
const isLoading = ref(false)
const currentCleanGameType = ref<string>(queryForm.gameType)

const clearGameTypeCacheDialogRef = ref()

const openClearCacheDialog = () => {
  clearGameTypeCacheDialogRef.value!.openDialog(queryForm.gameType)
}

const gameTypeObject = computed(() => {
  return gameTypeListShow.value.find((item) => item.value === currentCleanGameType.value)
})

// Computed properties
const isShowCheckboxTable = computed(() => VITE_DEPLOY_CONFIG === 'super')

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.gameType === gameType)
  return gameTypeObj ? gameTypeObj.gameTypeName : ''
})
// Methods for handling search form
const handleNewspaperNameQuerySelect = (item: any) => {
  const { newspaperName } = item.valueObj
  queryForm.newspaperName = newspaperName
}

const handleNewspaperCodeQuerySelect = (item: any) => {
  const { newspaperCode } = item.valueObj
  queryForm.newspaperCode = newspaperCode
}
// Dialog management
const openAddDialog = async () => {
  // resetForm()
  // rxState.dialogMode = 'add'
  dialogMode.value = 'add'
  issueDialogVisible.value = true
}

const batchAdd = async () => {
  modalsStore.showModal('batchAddIssueModal')
}

const handleClickDetail = async (row: any) => {
  selectedRow.value = row

  dialogMode.value = 'edit'
  issueDialogVisible.value = true
}

// Modal handlers
const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', { id: row.seriesCode })
}

const handleNewsPaperClickDetail = (row: any) => {
  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    seriesCode: row.seriesCode,
    newspaperCode: row.newspaperCode,
    newspaperId: row.newspaperId,
    lineFormData: row,
    formMode: 'edit'
  })
}

const handleSeriesSave = (isNeedResetPage: boolean) => {
  if (isNeedResetPage) {
    tableState.currentPage = 1
    tableState.pageSize = 15
  }
  fetchData()
}

const refetchData = () => {
  const { modalData } = modalsStore.newsSeriesModal
  if (modalData?.formMode === 'add') {
    tableState.currentPage = 1
    tableState.pageSize = 15
  }
  fetchData()
  modalsStore.hideModal('newsSeriesModal')
  modalsStore.resetModal('newsSeriesModal')
  modalsStore.hideModal('photoSeriesModal')
  modalsStore.resetModal('photoSeriesModal')
}

// 加载基础数据
const fetchCommonData = async () => {
  // 加载 彩种类型
  await bettingStore.getGameType()
}

// Lifecycle hooks
onMounted(async () => {
  await fetchCommonData()
  queryForm.newspaperCode = route.query?.newspaperCode as string
  gameTypeList.value = bettingStore.getAllGetGameType()
  await fetchData()
})
</script>

<style scoped lang="less">
.tabs-dialog {
  .button-row {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    gap: 12px;
  }
}

.like-a {
  cursor: pointer;
  color: blue;

  &:hover {
    text-decoration: underline;
  }
}

.overflow-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ml-12px {
  margin-left: 12px;
}

/* 图片相关样式 */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.thumbnail-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail-image:hover {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}

.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}
</style>
