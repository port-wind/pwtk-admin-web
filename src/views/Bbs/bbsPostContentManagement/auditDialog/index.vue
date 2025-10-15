<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    @close="emits('close')"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="审核帖子" name="audit" class="m_tabs_pane">
        <section ref="queryRef">
          <el-form
            :inline="true"
            class="custom-el-form no-rule"
            :model="queryForm"
            label-width="70px"
            @keyup.enter="fetchData()"
            ref="formRef"
          >
            <el-form-item label="">
              <AutoComplete
                v-model="queryForm.postId"
                max-length="32"
                keyword="postId"
                :httpFunc="reqHttpBBsForumList"
                :displayFields="['postId']"
                :displayName="'postName'"
                :trigger-on-focus="true"
                placeholder="帖子ID"
                :searchObj="{ postStatus: 'i' }"
                :isList="true"
                style="width: 140px"
              ></AutoComplete>
            </el-form-item>
            <el-form-item label="">
              <AutoComplete
                v-model="queryForm.forumId"
                max-length="32"
                keyword="forumId"
                :httpFunc="getBBsForumIdById"
                :displayFields="['forumId']"
                :displayName="'forumName'"
                :trigger-on-focus="true"
                placeholder="论坛ID"
                :searchObj="{ businessType: 'review' }"
                isList
                style="width: 140px"
              ></AutoComplete>
            </el-form-item>
            <el-form-item label="">
              <SelectUserIdAndNickname
                v-model="queryForm.postUserId!"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
                style="width: 140px"
              />
            </el-form-item>
            <el-form-item label="">
              <GameTypeList placeholder="彩种" v-model="queryForm.postGametypeRef" allGame style="width: 90px" />
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="queryForm.postYear" placeholder="年份" style="width: 90px">
                <el-option v-for="(item, index) in YearTypes" :label="item.label" :value="item.value" :key="index" />
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model.trim="queryForm.postIssue" placeholder="发布期数" style="width: 90px" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :icon="Search" @click="fetchData()" :loading="isLoading">查询</el-button>
              <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
              <el-button type="success" :icon="Check" @click="onSubmitAudit('y')" plain>过审</el-button>
              <el-button type="danger" :icon="Close" @click="onSubmitAudit('n')" plain>未过审</el-button>
            </el-form-item>
          </el-form>
        </section>
        <section style="display: flex; flex-direction: column; flex: 1; overflow: hidden">
          <div class="main_flex_table">
            <el-table ref="tableRef" :data="paginatedData" :loading="isLoading" stripe highlight-current-row>
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
              <el-table-column label="帖子标题" width="150">
                <template #default="{ row }">
                  <div style="display: flex; align-items: center">
                    <p>
                      <span v-if="row.predictFlag === 'y'" style="color: red">#参赛贴#</span>
                      <span class="like-a overflow-hidden" type="primary" @click="handleAuditEdit(row)">
                        {{ truncateText(row.title) }}
                      </span>
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="论坛" align="left">
                <template #default="{ row }">
                  {{ truncateText(row.forumName) }}
                </template>
              </el-table-column>
              <el-table-column label="彩种">
                <template #default="{ row }">
                  <p>{{ getGameNameByGameTypeCode(row.postGametypeRef) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="发布年份" prop="postYear" align="left" width="150"></el-table-column>
              <el-table-column label="发布期数" prop="postIssue" align="left" width="150"></el-table-column>
              <el-table-column label="附件" prop="hasAttachment" align="left" width="150">
                <template #default="{ row }">
                  <template v-if="row?.hasAttachment == 'y'">有</template>
                  <template v-else>无</template>
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
  <EditPostContentDialog
    v-if="isEditVisible"
    :visible="isEditVisible"
    :modalData="modalData"
    @update:visible="isEditVisible = $event"
    @refreshPage="fetchData"
  />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh, Check, Close } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { postReviewAudit, reqHttpBBsForumList } from '@/api/bss/postContentManagement'
import { getBBsForumIdById } from '@/api/bss/forumManagement'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import { useBettingStore } from '@/stores/bettingStore'

const isEditVisible = ref(false)
const modalData = reactive<{ postId: string; forumId: string; isOperateShow: boolean }>({
  postId: '',
  forumId: '',
  isOperateShow: false
})
const isLoading = ref(true)
const activeTab = ref('audit')
const emits = defineEmits(['close'])
const initQueryFormValue = () => ({
  postId: '',
  forumId: '',
  postUserId: '',
  postGametypeRef: '',
  postYear: '',
  postIssue: ''
})
const queryForm = reactive<any>(initQueryFormValue())
const numOfSuccess = ref(0)
const resultFlag = computed(() => numOfSuccess.value > 0)
const paginatedData = ref<any[]>([])
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const bettingStore = useBettingStore()
// Import time validation utilities
const CheckedMap = ref(new Map<string, boolean>())

function handleSelectAll(val: boolean) {
  paginatedData.value.forEach((row) => {
    row.checked = val
    CheckedMap.value.set(row.postId, val)
  })
  isAllSelected.value = val
  isIndeterminate.value = false
}
const resetAllCheckedStatus = () => {
  const list = paginatedData.value
  const allChecked = list.length > 0 && list.every((item) => item.checked)
  const someChecked = list.some((item) => item.checked)
  isAllSelected.value = allChecked
  isIndeterminate.value = someChecked && !allChecked
}
function handleCheckboxChange(row: any, val: boolean) {
  CheckedMap.value.set(row.postId, val)
  resetAllCheckedStatus()
}
const fetchData = async () => {
  // Only validate time if delayed effect is enabled
  isLoading.value = true
  try {
    const query: any = { ...queryForm, page: currentPage.value, size: pageSize.value, postStatus: 'i' }

    const res = await reqHttpBBsForumList(query)
    if (res.success) {
      paginatedData.value = res.data.list.map((item) => ({
        ...item,
        checked: false
      }))
      resetAllCheckedStatus()
      CheckedMap.value.clear()
      total.value = Number(res.data.total)
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
const onSubmitAudit = async (auditStatus: 'y' | 'n') => {
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
      postId: Array.from(CheckedMap.value.keys()).filter((key) => CheckedMap.value.get(key)),
      status: auditStatus
    }
    console.log(query)

    const res = await postReviewAudit(query)
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
const handleAuditEdit = (row: any) => {
  isEditVisible.value = true
  modalData.postId = row.postId
  modalData.forumId = row.forumId
  modalData.isOperateShow = true
}
const getGameNameByGameTypeCode = (gameTypeCode) => {
  const res = bettingStore.gameType.find((item) => {
    return item.gameType === gameTypeCode
  })
  return res?.gameTypeName
}
const resetButton = () => {
  Object.assign(queryForm, initQueryFormValue())
  CheckedMap.value.clear()
  fetchData()
}
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less">
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  row-gap: 10px;
}
</style>
