<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef" class="video-search-area">
      <el-form :inline="true" class="search_left" :model="queryForm" @keyup.enter="fetchData(queryForm)">
        <el-form-item label="" prop="search">
          <el-input v-model="queryForm.search" placeholder="视频标题" maxlength="15" />
        </el-form-item>
        <el-form-item class="el-select-extra" label="" prop="userId">
          <SelectUserIdAndNickname
            v-model="queryForm.userId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
          />
        </el-form-item>
        <el-form-item label="" prop="tagId">
          <el-select
            v-model="queryForm.tagIds"
            placeholder="视频标签"
            clearable
            filterable
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            :loading="isLoading"
            @visible-change="handleTagListVisibleChange"
            class="video-search-area-select"
          >
            <el-option
              v-for="item in tagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="width: 260px"
            />
          </el-select>
          <!-- <SelectVideoTagList v-model="queryForm.tagId" placeholder="视频标签" style="width: 160px" /> -->
        </el-form-item>
        <el-form-item label="" prop="isPublished">
          <el-select v-model="queryForm.isPublished" placeholder="是否发布">
            <el-option label="全部" value="L" />
            <el-option label="上架" :value="true" />
            <el-option label="下架" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="time">
          <TimeSelect
            start-placeholder="发布开始时间"
            end-placeholder="发布结束时间"
            v-model:startDate="queryForm.publishedAfter"
            v-model:endDate="queryForm.publishedBefore"
          ></TimeSelect>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-dropdown style="margin-left: 10px">
            <el-button class="ml-12px" type="success" :icon="Setting" plain>功能</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Plus" @click="() => createVideo()">新增</el-dropdown-item>
                <!-- <el-dropdown-item :icon="Operation" @click="openRulesDialog">修改规则配置</el-dropdown-item> -->
                <el-dropdown-item :icon="Finished" @click="handleAudit">审核</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
        :is-loading="isLoading"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #title="{ scope }">
          <SimplePopover :model-value="scope.row.title"></SimplePopover>
        </template>
        <template #preview="{ scope }">
          <!-- <nativeVideoViewer v-if="scope.row.preview" :video-source="scope.row.videoPath" /> -->
          <el-image
            v-if="scope.row.preview"
            style="width: 100px; height: 60px; object-fit: contain"
            :src="scope.row.preview"
            :preview-src-list="[scope.row.preview]"
            preview-teleported
            fit="contain"
          />
          <p v-else style="color: #999">暂无封面</p>
        </template>
        <template #nickname="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ truncateText(scope.row.nickname) }}
          </p>
        </template>
        <template #tagId="{ scope }">
          <p>
            <SimplePopover
              v-if="scope.row.tags?.length"
              :model-value="scope.row.tags.map((tag: any) => `#${tag.name}`).join(',')"
            ></SimplePopover>
          </p>
        </template>
        <template #updatedAtTimestamp="{ scope }">
          {{ unitFormatDate(scope.row.updatedAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #updatedBy="{ scope }">
          {{ truncateText(scope.row.updatedByName) }}
        </template>
        <template #auditedAtTimestamp="{ scope }">
          {{ unitFormatDate(scope.row.auditedAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #operation="{ scope }">
          <el-link type="primary" @click="() => viewVideoDetails(scope.row)" style="margin-right: 10px">查询</el-link>
          <el-link v-if="!scope.row.isPublished" type="success" @click="() => publishVideo(scope.row)">上架</el-link>
          <el-link v-else type="danger" @click="() => offlineVideo(scope.row)">下架</el-link>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 用户页面 -->
  <UserListComponent></UserListComponent>
  <!-- 创建房间 -->
  <CreateVideoDialog v-if="showCreateVideoDialog" v-model="showCreateVideoDialog" @refresh="fetchData" />

  <!-- 编辑视频 -->
  <EditVideoDialog
    v-if="showEditVideoDialog"
    v-model="showEditVideoDialog"
    :video-data="selectedVideo"
    @refresh="returnFromDetails"
  />
  <!-- 审核视频 -->
  <AuditVideo
    v-if="showAuditVideoDialog"
    v-model="showAuditVideoDialog"
    ref="auditVideoRef"
    @refresh="fetchData"
    @showVideoDetails="viewVideoDetails"
  />
  <!-- 规则配置 -->
  <VideoConfig v-if="showVideoConfigDialog" v-model="showVideoConfigDialog" @refresh="fetchData" />
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Refresh, Setting, Plus, Finished } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { enhanceWithUserInfo } from '@/api/chat'
import type { TableOptions } from '@/components/mTable/types'
import { getFormattedVideoTagList, getVideoList } from '@/api/video'
import { truncateText } from '@/utils/dataFormat'
import CreateVideoDialog from './components/createVideoDialog.vue'
import EditVideoDialog from './components/editVideoDialog.vue'
import { toggleVideo, viewUserDetails } from './videoUtils'
import { useBettingStore } from '@/stores/bettingStore'

const bettingStore = useBettingStore()
const showCreateVideoDialog = ref(false)
const showEditVideoDialog = ref(false)
const showAuditVideoDialog = ref(false)
const showVideoConfigDialog = ref(false)
const manageSiteStore = useManageSiteStore()
const tableData = ref<any[]>([])
const selectedVideo = ref<any>(null)
// const isExpanded = ref(false)
const queryRef = ref()
const tagList = ref<any[]>([])
const auditVideoRef = ref<any>(null)
const options: TableOptions[] = [
  {
    label: '视频标题',
    prop: 'title',
    slot: 'title',
    minWidth: 180
  },
  {
    label: '视频封面',
    prop: 'preview',
    slot: 'preview',
    minWidth: 180
  },
  {
    label: '用户昵称',
    prop: 'nickname',
    slot: 'nickname',
    minWidth: 180
  },
  {
    label: '引用标签',
    prop: 'tagId',
    slot: 'tagId',
    minWidth: 180
  },
  {
    label: '发布时间',
    prop: 'auditedAtTimestamp',
    slot: 'auditedAtTimestamp',
    minWidth: 180
  },
  {
    label: '更新人',
    prop: 'updatedBy',
    slot: 'updatedBy',
    minWidth: 180
  },
  {
    label: '更新时间',
    prop: 'updatedAtTimestamp',
    slot: 'updatedAtTimestamp',
    minWidth: 180
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation',
    fixed: 'right',
    minWidth: 180
  }
]

const initQueryForm = () => {
  return {
    id: '',
    search: '',
    publishedAfter: '',
    publishedBefore: '',
    userId: '',
    tagIds: [],
    isPublished: 'L'
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

const createVideo = () => {
  showCreateVideoDialog.value = true
}

const viewVideoDetails = async (rowData: any) => {
  console.log('查看视频详情', rowData)
  selectedVideo.value = rowData
  console.log('selectedVideo', selectedVideo.value)
  await nextTick()
  showEditVideoDialog.value = true
}

// const openRulesDialog = () => {
//   console.log('修改规则配置')
//   showVideoConfigDialog.value = true
// }
const handleAudit = () => {
  console.log('审核')
  showAuditVideoDialog.value = true
}
//页面初始化获取数据
const fetchData = async (_queryForm = queryForm) => {
  const params = {
    ..._queryForm,
    auditStatus: '1',
    page: currentPage.value,
    pageSize: pageSize.value,
    tagIds: _queryForm.tagIds.join(',')
  }
  if (params.isPublished === 'L') {
    // @ts-ignore
    delete params.isPublished
  }
  isLoading.value = true
  try {
    const response = await getVideoList(params)
    if (response.success) {
      console.log(response)
      const tempList = response.data.data
      const enhancedList = await enhanceWithUserInfo(tempList)
      tableData.value = (enhancedList?.map((item: any) => {
        return {
          ...item
        }
      }) || []) as any
      total.value = Number(response!.data!.pagination!.total) || 0
      //   status.value = params.state
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const returnFromDetails = () => {
  fetchData()
  if (showAuditVideoDialog.value) {
    auditVideoRef.value?.refresh()
  }
}
const publishVideo = async (rowData: any) => {
  console.log('上架视频', rowData)
  const res = await toggleVideo(rowData)
  if (res) {
    fetchData()
  }
}

const offlineVideo = async (rowData: any) => {
  console.log('下架视频', rowData)
  const res = await toggleVideo(rowData)
  if (res) {
    fetchData()
  }
}

const returnFetchData = () => {
  fetchData(queryForm)
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  returnFetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData(queryForm)
}
const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
}
const handleResetRefresh = () => {
  handleReset()
  fetchData()
}
const handleTagListVisibleChange = async (visible: boolean) => {
  if (!visible) {
    return
  }
  isLoading.value = true
  tagList.value = await getFormattedVideoTagList()
  isLoading.value = false
}
onMounted(async () => {
  console.log(manageSiteStore)
  await bettingStore.getGameType()
  await fetchData()
  tagList.value = await getFormattedVideoTagList()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */

.blue-text {
  color: #409eff;
}

::v-deep(.el-select-extra) {
  .el-select__wrapper {
    width: 9rem !important;
  }
}

.video-search-area {
  .video-search-area-select {
    ::v-deep(.el-select__wrapper) {
      width: 180px !important;
    }

    ::v-deep(.el-tag) {
      max-width: 80px !important;
    }
  }
}
</style>
