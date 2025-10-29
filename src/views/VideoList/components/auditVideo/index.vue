<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    draggable
    @close="closeTabs"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="审核" name="audit" class="m_tabs_pane">
        <section ref="queryRef">
          <el-form
            :inline="true"
            class="custom-el-form no-rule"
            :model="queryForm"
            label-width="70px"
            @keyup.enter="fetchData()"
            ref="formRef"
          >
            <el-form-item label="" prop="search">
              <el-input v-model="queryForm.search" placeholder="视频标题" />
            </el-form-item>
            <el-form-item class="el-select-extra" label="" prop="userId">
              <SelectUserIdAndNickname
                v-model="queryForm.userId"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
                style="width: 160px"
              />
            </el-form-item>
            <el-form-item label="" prop="tagId">
              <SelectVideoTagList v-model="queryForm.tagId" placeholder="视频标签" style="width: 160px" />
            </el-form-item>
            <el-form-item label="" prop="auditStatus">
              <el-select v-model="queryForm.auditStatus" placeholder="审核状态" style="width: 120px">
                <el-option label="待审核" :value="0" />
                <el-option label="已驳回" :value="2" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="" prop="time">
              <TimeSelect
                start-placeholder="发布开始时间"
                end-placeholder="发布结束时间"
                v-model:startDate="queryForm.startTime"
                v-model:endDate="queryForm.endTime"
              ></TimeSelect>
            </el-form-item> -->

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="fetchData()" :loading="isLoading">查询</el-button>
              <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
              <el-button type="success" :icon="Check" @click="onSubmitAudit(1)" plain>过审</el-button>
              <el-button type="danger" :icon="Close" @click="onSubmitAudit(2)" plain>未过审</el-button>
            </el-form-item>
          </el-form>
        </section>
        <section style="display: flex; flex-direction: column; flex: 1; overflow: hidden">
          <div class="main_flex_table">
            <el-table ref="tableRef" :data="paginatedData" stripe highlight-current-row v-loading="isLoading">
              <el-table-column width="55" v-if="!resultFlag">
                <template #header>
                  <el-checkbox
                    v-model="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="(val) => handleSelectAll(val as boolean)"
                  />
                </template>
                <template #default="{ row }">
                  <el-checkbox v-model="row.checked" @change="(val) => handleCheckboxChange(row, val as boolean)" />
                </template>
              </el-table-column>

              <el-table-column label="视频标题" prop="title" min-width="180">
                <template #default="{ row }">
                  <SimplePopover :model-value="row.title"></SimplePopover>
                </template>
              </el-table-column>

              <el-table-column label="视频封面" prop="preview" min-width="180">
                <template #default="{ row }">
                  <el-image
                    v-if="row.preview"
                    style="width: 100px; height: 60px; object-fit: contain"
                    :src="row.preview"
                    :preview-src-list="[row.preview]"
                    preview-teleported
                    fit="contain"
                  />
                  <p v-else style="color: #999">暂无封面</p>
                </template>
              </el-table-column>

              <el-table-column label="用户昵称" prop="nickname" min-width="180">
                <template #default="{ row }">
                  <p class="like-a overflow-hidden" @click="viewUserDetails(row)">
                    {{ truncateText(row.nickname) }}
                  </p>
                </template>
              </el-table-column>

              <el-table-column label="引用标签" prop="tagId" min-width="180">
                <template #default="{ row }">
                  <p>
                    <SimplePopover
                      v-if="row.tags?.length"
                      :model-value="row.tags.map((tag: any) => `#${tag.name}`).join(',')"
                    ></SimplePopover>
                  </p>
                </template>
              </el-table-column>

              <el-table-column label="发布时间" prop="auditedAt" min-width="180">
                <template #default="{ row }">
                  {{ unitFormatDate(row.createdAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
                </template>
              </el-table-column>

              <el-table-column label="更新人" prop="updatedBy" min-width="180">
                <template #default="{ row }">
                  {{ truncateText(row.updatedByName) }}
                </template>
              </el-table-column>

              <el-table-column label="更新时间" prop="updatedAt" min-width="180">
                <template #default="{ row }">
                  {{ unitFormatDate(row.updatedAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
                </template>
              </el-table-column>

              <el-table-column label="操作" fixed="right" min-width="180">
                <template #default="{ row }">
                  <el-link type="primary" @click="() => viewVideoDetails(row)" style="margin-right: 10px">查询</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination" style="margin-bottom: 10px">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[15, 30, 50, 100]"
              :total="total"
              layout="prev, pager, next, jumper, ->, sizes, total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import { reactive, ref, onMounted, computed } from 'vue'
import { truncateText } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { batchAuditVideo, getVideoList } from '@/api/video'
import { accountInfo } from '@/api'
import { enhanceVideoWithUserInfo, viewUserDetails } from '../../videoUtils'

const isLoading = ref(true)
const activeTab = ref('audit')
const emits = defineEmits(['close', 'update:modelValue', 'showVideoDetails'])

const initQueryForm = () => {
  return {
    id: '',
    search: '',
    startTime: '',
    endTime: '',
    userId: '',
    tagId: '',
    auditStatus: 0
  }
}
const queryForm = reactive<any>(initQueryForm())
const numOfSuccess = ref(0)
const resultFlag = computed(() => numOfSuccess.value > 0)
const paginatedData = ref<any[]>([])
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
// Import time validation utilities
const CheckedMap = ref(new Map<string, boolean>())

// Function is now defined later in the file
const resetAllCheckedStatus = () => {
  const list = paginatedData.value
  const allChecked = list.length > 0 && list.every((item) => item.checked)
  const someChecked = list.some((item) => item.checked)
  isAllSelected.value = allChecked
  isIndeterminate.value = someChecked && !allChecked
}
function handleCheckboxChange(row: any, val: boolean) {
  CheckedMap.value.set(row.id, val)
  resetAllCheckedStatus()
}
const fetchData = async () => {
  // Only validate time if delayed effect is enabled
  isLoading.value = true
  try {
    const query: any = { ...queryForm, page: currentPage.value, pageSize: pageSize.value }
    const res = await getVideoList(query)
    if (res.success && res.data) {
      paginatedData.value = res.data.data.map((item) => ({
        ...item,
        checked: false,
        userId: item.userId
      }))
      const enhancedList = await enhanceVideoWithUserInfo(paginatedData.value)
      paginatedData.value = enhancedList
      resetAllCheckedStatus()
      CheckedMap.value.clear()
      total.value = Number(res.data.pagination.total)
    } else {
      ElMessage({
        message: '获取审核数据失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
defineExpose({
  async refresh() {
    await fetchData()
  }
})
const onSubmitAudit = async (auditStatus: 1 | 2) => {
  const someChoosed = paginatedData.value.some((item) => item.checked)
  if (!someChoosed) {
    ElMessage({
      message: '请选择要审核的帖子',
      type: 'warning'
    })
    return
  }
  isLoading.value = true
  console.log(CheckedMap.value)
  try {
    const query = {
      videoIds: Array.from(CheckedMap.value.keys()).filter((key) => CheckedMap.value.get(key)),
      auditStatus,
      auditPersonId: queryForm.auditPersonId,
      auditPersonName: queryForm.auditPersonName
    }
    console.log(query)

    const res = await batchAuditVideo(query)
    if (res.success) {
      ElMessage({
        message: '更新成功',
        type: 'success'
      })
      // 关闭dailog
      await fetchData()
    } else {
      ElMessage({
        message: '更新失败,请稍后再试试',
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
// Removed unused function
// const handleAuditEdit = (row: any) => {
//   isEditVisible.value = true
//   modalData.postId = row.postId
//   modalData.forumId = row.forumId
//   modalData.isOperateShow = true
// }
// Removed unused function
// const getGameNameByGameTypeCode = (gameTypeCode) => {
//   const res = bettingStore.gameType.find((item) => {
//     return item.gameType === gameTypeCode
//   })
//   return res?.gameTypeName
// }

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  CheckedMap.value.clear()
  fetchData()
}

const closeTabs = () => {
  emits('close')
  emits('update:modelValue', false)
}

const viewVideoDetails = (rowData: any) => {
  console.log('查看视频详情', rowData)
  // Implementation would be similar to VideoList component
  emits('showVideoDetails', rowData)
}

// Handle select all checkboxes
const handleSelectAll = (val: boolean) => {
  paginatedData.value.forEach((row) => {
    row.checked = val
    CheckedMap.value.set(row.id, val)
  })
  isAllSelected.value = val
  isIndeterminate.value = false
}

onMounted(async () => {
  await fetchData()
  const res = await accountInfo()
  if (res.success && res.data) {
    queryForm.auditPersonId = res.data.id
    queryForm.auditPersonName = res.data.username
  } else {
    ElMessage({
      message: '获取用户信息失败',
      type: 'error'
    })
  }
})
</script>

<style lang="less">
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  row-gap: 10px;
  .el-table {
    flex: 1;
  }
}
</style>
