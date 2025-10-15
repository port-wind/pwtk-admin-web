<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1, size: 15 })"
        ref="formRef"
      >
        <el-form-item label="" prop="bbsId" v-if="isBBSMain">
          <el-select v-model="queryForm.bbsId" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="资料大全" value="corpus" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="postId">
          <AutoComplete
            v-model="queryForm.postId"
            max-length="32"
            keyword="postId"
            :httpFunc="reqHttpBBsForumList"
            :displayFields="['postId']"
            :displayName="'postName'"
            :trigger-on-focus="true"
            placeholder="帖子ID"
            :isList="true"
            style="width: 140px"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumId" v-if="!isForumIdHidden">
          <AutoComplete
            v-model="queryForm.forumId"
            max-length="32"
            keyword="forumId"
            :httpFunc="getBBsForumIdById"
            :displayFields="['forumId']"
            :displayName="'forumName'"
            :trigger-on-focus="true"
            placeholder="论坛ID"
            isList
            style="width: 140px"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumId">
          <SelectUserIdAndNickname
            v-model="queryForm.postUserId!"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 140px"
          />
        </el-form-item>
        <el-form-item label="" prop="forumStatus">
          <GameTypeList placeholder="彩种" v-model="queryForm.postGametypeRef" allGame style="width: 90px" />
        </el-form-item>
        <el-form-item label="" prop="postYear">
          <el-select v-model="queryForm.postYear" placeholder="年份" style="width: 90px">
            <el-option v-for="(item, index) in YearTypes" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="postIssue">
          <el-input v-model.trim="queryForm.postIssue" placeholder="发布期数" style="width: 90px" />
        </el-form-item>
        <el-form-item label="" prop="">
          <el-select
            v-model="selections"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="1"
            placeholder="帖子标签"
            style="width: 140px"
          >
            <el-option label="置顶" value="isTop" />
            <el-option label="精选" value="isSelected" />
            <el-option label="热门" value="isHot" />
            <el-option label="爆款" value="isBloom" />
            <el-option label="推荐" value="isRecommended" />
          </el-select>
        </el-form-item>
        <template v-if="!(dynamicValue === 'guessVideo' || dynamicValue === 'guessImg' || dynamicValue === 'lottery')">
          <el-form-item label="" prop="tagId">
            <SelectTagList v-model="queryForm.tagId!" placeholder="用户标签" style="width: 100px" />
          </el-form-item>
          <el-form-item label="" prop="postStatus">
            <el-select v-model="queryForm.postStatus" placeholder="状态" style="width: 80px">
              <el-option label="启用" value="y" />
              <el-option label="关闭" value="n" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="time">
            <TimeSelect
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-model:startDate="queryForm.regStartTime"
              v-model:endDate="queryForm.regEndTime"
            ></TimeSelect>
          </el-form-item>
          <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="6"></ExpandableSection>
        </template>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData()" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
          <el-dropdown>
            <el-button class="ml-12px" type="success" :icon="Setting" plain>功能</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Plus" @click="() => handleAddButton({ forumId: dynamicValue })">
                  新增
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="Refresh"
                  :loading="isCacheLoading"
                  v-show="dynamicValue === 'myForum'"
                  @click="openClearCacheDialog()"
                >
                  刷新缓存
                </el-dropdown-item>
                <el-dropdown-item :icon="Operation" @click="handleConfig">修改规则配置</el-dropdown-item>
                <el-dropdown-item :icon="Finished" @click="handleAudit">审核</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <template v-if="showMultiOptions">
            <span class="ml-12px">批量:</span>
            <el-button class="ml-12px" type="success" plain @click="handleBatch('y')">开启</el-button>
            <el-button type="danger" plain @click="handleBatch('n')">关闭</el-button>
          </template>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="tableOptions"
        :data="tableData"
        :isLoading="isLoading"
        :multiSelect="true"
        :multi-select-logic="multiSelectLogic"
        :pagination="true"
        isEditRow
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #postInfo="{ scope }">
          <div style="display: flex; align-items: center">
            <p>
              <span v-if="scope.row.predictFlag === 'y'" style="color: red">#参赛贴#</span>
              <span class="like-a overflow-hidden" type="primary" @click="handleTableEdit(scope)">
                <!-- {{ truncateText(scope.row.title, 5) }} -->
                <el-popover placement="top-start" :width="200">
                  <template #reference>
                    <span>{{ truncateText(scope.row.title, 5) }}</span>
                  </template>
                  <div>{{ scope.row.title }}</div>
                </el-popover>
              </span>
            </p>
            <p style="margin-left: 10px; cursor: pointer; z-index: 999">
              <el-icon class="cursor-pointer" @click="handleScreenDetail(scope)">
                <Position />
              </el-icon>
            </p>
            <p style="margin-left: 10px; cursor: pointer; z-index: 999">
              <el-icon>
                <DocumentCopy
                  color="#7ecb5b"
                  @click="() => handleAddButton({ postId: scope.row.postId, forumId: dynamicValue })"
                />
              </el-icon>
            </p>
          </div>
        </template>
        <template #forumInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleForumEdit(scope)">
            {{ truncateText(scope.row.forumName, 6) }}
          </p>
        </template>
        <template #tags="{ scope }">
          <SimplePopover v-if="getTagLabels(scope)" :model-value="getTagLabels(scope)"></SimplePopover>
        </template>
        <template
          #tagId="{ scope }"
          v-if="!(dynamicValue === 'lottery' || dynamicValue === 'guessImg' || dynamicValue === 'guessVideo')"
        >
          <el-popover placement="top-start" :width="300">
            <template #reference>
              <el-tag v-for="(tag, index) in scope.row.userTagList" :key="index" type="info" size="small">
                {{ tag.tagName }}
              </el-tag>
            </template>
            <el-tag v-for="tag in scope.row.userTagList" :key="tag.tagId" type="info" size="small">
              {{ tag.tagName }}
            </el-tag>
          </el-popover>
        </template>
        <template #countInfo="{ scope }">
          <p
            class="overflow-hidden"
            v-if="
              (scope.row.likeCount && scope.row.likeCount != '0') ||
              (scope.row.favoriteCount && scope.row.favoriteCount != '0') ||
              (scope.row.threadCount && scope.row.threadCount != '0') ||
              (scope.row.readCount && scope.row.readCount != '0')
            "
          >
            <span>{{ scope.row.likeCount ? scope.row.likeCount : 0 }}</span>
            ｜
            <span>{{ scope.row.favoriteCount ? scope.row.favoriteCount : 0 }}</span>
            ｜
            <span>{{ scope.row.threadCount ? scope.row.threadCount : 0 }}</span>
            ｜
            <span>{{ scope.row.readCount ? scope.row.readCount : 0 }}</span>
          </p>
        </template>
        <template #postStatus="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.postStatus === 'y' ? '启用' : '关闭' }}
          </span>
          <status-toggle
            v-if="scope.row.postStatus"
            v-model="scope.row.postStatus"
            :field-name="'postStatus'"
            :item="scope.row"
            :update-api="updateStatus"
            @refresh-needed="fetchData"
          />
        </template>
        <template #isAttachment="{ scope }">
          <template v-if="scope?.row?.hasAttachment == 'y'">有</template>
          <template v-else>无</template>
        </template>
        <template #nickname="{ scope }">
          <!-- <el-link
            :title="scope.row.nickname"
            @click="handTabs(scope.row.postUserId)"
            class="like-a g-text-nowrap-ellipsis"
          >
            {{ truncateText(scope.row.nickname, 5) }}
          </el-link> -->
          <p class="like-a overflow-hidden" @click="handTabs(scope.row.postUserId)">
            {{ truncateText(scope.row.loginId) }} | {{ scope.row.nickname }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameNameByGameTypeCode(scope.row.postGametypeRef) }}</p>
        </template>
        <template #postTime="{ scope }">
          {{ unitFormatDate(scope.row.postTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
    <modalPostSeries v-if="modalsStore.postSeriesModal.isVisible" @refreshPage="fetchData" />
    <modalForumSeries @refreshPage="fetchData" />
    <modalPostScreenDetail v-if="modalsStore.postScreenDetailModal.isVisible" @refreshPage="fetchData" />

    <!-- <DialogPostContent v-model="addDialogVisible" /> -->
    <AddBBSPostDialog v-if="addDialogVisible" ref="AddBBSPostDialogRef" @on-closed="onClosed" />
    <clearGameTypeCacheDialog ref="clearGameTypeCacheDialogRef" :api="refreshCache" />
    <bbsPostConfig v-if="configDialogVisible" v-model="configDialogVisible" @close="handleConfigClose" />
    <auditDialog v-if="auditDialogVisible" v-model="auditDialogVisible" @close="handleAuditClose" />
    <UserListComponent></UserListComponent>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Setting, Search, Refresh, Plus, Operation, Finished } from '@element-plus/icons-vue'
import { reqHttpBBsForumList, updateStatus } from '@/api/bss/postContentManagement/index'
import { getBBsForumIdById } from '@/api/bss/forumManagement/index'
import type { IReqHttpBBsForumListData, IReqHttpBBsForumListQueryParams } from '@/api/bss/postContentManagement/types'
import { onchangeForMultiSelect, options } from '@/views/Bbs/bbsPostContentManagement/data'
import modalPostScreenDetail from '@/components/modalCommon/postScreenDetail/index.vue'
import router from '@/router'
import mTable from '@/components/mTable/index.vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import ExpandableSection from '@/components/expandIcon/index.vue'
//弹窗
import modalPostSeries from '@/components/modalCommon/postSeriesModal/index.vue'
import modalForumSeries from '@/components/modalCommon/forumSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { useBettingStore } from '@/stores/bettingStore'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { refreshCache } from '@/api/user'
import { useMultiSelectLogic, type MultiSelectState } from '@/composables/useMultiSelectLogic'

const routes = useRoute()
const isBBSMain = computed(() => routes.path.includes('/bbs/bbsPostContentManagement'))
const bettingStore = useBettingStore()
const modalsStore = useModalsStore()
const useRoutes = useRoute()
const queryRef = ref()
const formRef = ref()
const isExpanded = ref(false)
const tableData = ref<IReqHttpBBsForumListData[]>([])
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)
const configDialogVisible = ref(false)
const auditDialogVisible = ref(false)
const addDialogVisible = ref(false)

const AddBBSPostDialogRef = ref()
//弹窗需要
const forumDialogVisible = ref(false)
const forumId = ref('')

const clearGameTypeCacheDialogRef = ref()

const pathRegex = /^\/bbsList\/bbsPostContentList\/([A-Za-z0-9]+)$/
// 'GSLT', 'TJLT', 'JCTJLT', 'TPYMJC', 'SPYMJC'
const dynamicValue = computed<string | undefined>(() => {
  const match = useRoutes.path.match(pathRegex)
  return match ? match[1] : undefined // match[1] is the captured group (e.g., "GSLT")
})

const tableOptions = computed(() => {
  if (dynamicValue.value === 'lottery' || dynamicValue.value === 'guessImg' || dynamicValue.value === 'guessVideo') {
    return options.filter((item) => item.prop !== 'tagId')
  }
  return options
})

const isForumIdHidden = computed(() => {
  return pathRegex.test(useRoutes.path) && dynamicValue
})
const isCacheLoading = ref(false)
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'postId',
  useCheckedMap: false, // Enable checkedMap for this example
  onSelectionChange: (state: MultiSelectState) => {
    console.log('Selection changed:', state)
  }
})
const showMultiOptions = computed(() => {
  return multiSelectLogic.isAllSelected.value || multiSelectLogic.isIndeterminate.value
})
const initForm = (): IReqHttpBBsForumListQueryParams => ({
  postId: '',
  forumId: dynamicValue.value,
  postUserId: '',
  postGametypeRef: '',
  postYear: '',
  postIssue: '',
  postStatus: undefined,
  page: 1,
  size: 15,
  sortName: 'last_edit_time',
  sortOrder: 'DESC',
  regStartTime: '',
  regEndTime: '',
  tagId: '',
  bbsId: isBBSMain.value ? 'corpus' : ''
})
const selections = ref<string[]>([])

const queryForm = reactive<IReqHttpBBsForumListQueryParams>(initForm())
const openClearCacheDialog = () => {
  clearGameTypeCacheDialogRef.value!.openDialog(queryForm.postGametypeRef)
}
//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

//弹窗编辑按钮点击
const handleTableEdit = (scope: any) => {
  modalsStore.showModal('postSeriesModal')
  modalsStore.setActiveTab('postSeriesModal', 'first')
  modalsStore.setModalData('postSeriesModal', {
    postId: scope.row.postId,
    forumId: scope.row.forumId,
    isOperateShow: true
  })
}
const handleScreenDetail = (scope: any) => {
  const routeData = router.resolve({
    path: useRoutes.fullPath,
    query: { postId: scope.row.postId }
  })
  window.open(routeData.href, '_blank')
}

const getGameNameByGameTypeCode = (gameTypeCode) => {
  const res = bettingStore.gameType.find((item) => {
    return item.gameType === gameTypeCode
  })
  return res?.gameTypeName
}
/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */

//---------------------------------------------------Search新增按钮点击---------------------------------------------------
const handleAddButton = (params?: any) => {
  addDialogVisible.value = true
  nextTick(() => {
    AddBBSPostDialogRef.value.openDialog(params)
  })
}

//页面初始化获取数据
const fetchData = async (queryParams?: Partial<IReqHttpBBsForumListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqHttpBBsForumListQueryParams = {
      ...queryForm,
      ...queryParams
    }
    if (query.postGametypeRef === 'L') {
      query.postGametypeRef = ''
    }
    if (query.bbsId === 'L') {
      query.bbsId = ''
    }

    selections.value.forEach((item) => {
      query[item] = 'y'
    })

    const response = await reqHttpBBsForumList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
      tableData.value.forEach((item) => {
        if (!item.title) {
          if (item.postContent) {
            item.title = item.postContent.slice(0, 10)
          } else {
            item.title = '帖子标题'
          }
        }
      })
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
const handleBatch = async (openStatus: 'y' | 'n') => {
  console.log('handleBatchOpen')
  const { selectedKeys } = multiSelectLogic.getSelectedData(tableData.value)
  console.log('selectedKeys', selectedKeys)

  if (selectedKeys.length === 0) {
    ElMessage.warning(`请选择要${openStatus === 'y' ? '开启' : '关闭'}的帖子`)
    return
  }

  try {
    isLoading.value = true

    // Use Promise.all for parallel execution with proper error handling
    await onchangeForMultiSelect(selectedKeys, openStatus)

    ElMessage.success(`成功${openStatus === 'y' ? '开启' : '关闭'} ${selectedKeys.length} 个帖子`)
    await fetchData() // Refresh data after successful operation
    multiSelectLogic.clearSelection(tableData.value) // Clear selection after operation
  } catch (error) {
    console.error('Error batch open:', error)
    ElMessage.error(`批量${openStatus === 'y' ? '开启' : '关闭'}操作失败，请重试`)
  } finally {
    isLoading.value = false
  }
}
// 用户详情
const handTabs = (userId: string) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId
  })
  modalsStore.showModal('userInfoModal')
}
const handleConfig = () => {
  configDialogVisible.value = true
}
const handleAudit = () => {
  auditDialogVisible.value = true
}
const handleConfigClose = async () => {
  configDialogVisible.value = false
  await fetchData()
}
const handleAuditClose = async () => {
  auditDialogVisible.value = false
  await fetchData()
}

const onClosed = () => {
  addDialogVisible.value = false
  fetchData()
}
// 使用示例

const resetButton = () => {
  Object.assign(queryForm, initForm())
  selections.value = []
  fetchData()
}

const handleForumEdit = (scope: any) => {
  forumId.value = scope.row.forumId
  modalsStore.showModal('forumSeriesModal')
  modalsStore.setModalData('forumSeriesModal', {
    forumId: forumId.value
  })
  forumDialogVisible.value = true
}

//table标签的展示
const getTagLabels = (scope: any) => {
  const labels: string[] = []
  if (scope.row.isRecommended === 'y') labels.push('推荐')
  if (scope.row.isHot === 'y') labels.push('热门')
  if (scope.row.isSelected === 'y') labels.push('精选')
  if (scope.row.isTop === 'y') labels.push('置顶')
  if (scope.row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

//页面初始化加载
onMounted(async () => {
  if (pathRegex.test(useRoutes.path)) {
    const dynamicV = computed<string | undefined>(() => {
      const match = useRoutes.path.match(pathRegex)
      return match ? match[1] : undefined // match[1] is the captured group (e.g., "GSLT")
    })
    fetchData({ forumId: dynamicV.value })
  } else {
    fetchData()
  }
  const { query } = router.currentRoute.value
  queryForm.postId = query.mainPostId as string
  if (query.postId) {
    modalsStore.showModal('postScreenDetailModal')
    modalsStore.setActiveTab('postScreenDetailModal', 'first')
    modalsStore.setModalData('postScreenDetailModal', {
      postId: query.postId,
      isOperateShow: true
    })
  }
})

watch(
  () => [queryForm.page, queryForm.size],
  (_, __) => {
    fetchData()
  }
)
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

.ml-12px {
  margin-left: 12px;
}
</style>
