<template>
  <section ref="queryRef">
    <el-form
      :inline="true"
      class="custom-el-form no-rule"
      :model="queryForm"
      label-width="70px"
      @keyup.enter="fetchData()"
      ref="formRef"
    >
      <el-form-item class="el-select-extra" label="" prop="userId">
        <SelectUserIdAndNickname
          v-model="queryForm.userId"
          id="userId"
          :group="['nickname', 'loginId']"
          placeholder="用户昵称｜帐号"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select v-model="queryForm.status" placeholder="请选择状态" style="width: 120px">
          <el-option label="全部" :value="'L'" />
          <el-option label="收藏" :value="1" />
          <el-option label="取消收藏" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="time">
        <TimeSelect
          start-placeholder="收藏开始时间"
          end-placeholder="收藏结束时间"
          v-model:startDate="queryForm.startTime"
          v-model:endDate="queryForm.endTime"
        ></TimeSelect>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="fetchData()" :loading="isLoading">查询</el-button>
        <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
      </el-form-item>
    </el-form>
  </section>
  <section style="display: flex; flex-direction: column; flex: 1; overflow: hidden">
    <div class="main_flex_table">
      <el-table ref="tableRef" :data="paginatedData" stripe highlight-current-row v-loading="isLoading">
        <el-table-column label="用户昵称" prop="nickname">
          <template #default="{ row }">
            <p v-if="!row.isAnonymous" class="like-a overflow-hidden" @click="viewUserDetails(row, 'actorId')">
              {{ truncateText(row.nickname) }}
            </p>
            <p v-else class="overflow-hidden">
              匿名用户
              <copy :content="sanitizedActorId(row.actorId)" />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="用户行为" prop="status">
          <template #default="{ row }">
            {{ row.status === 1 ? '收藏' : '取消收藏' }}
          </template>
        </el-table-column>
        <el-table-column label="收藏时间" prop="updatedAtTimestamp">
          <template #default="{ row }">
            {{ unitFormatDate(row.updatedAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
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
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { reactive, ref, onMounted } from 'vue'
import { truncateText } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { getVideoFavoriteList } from '@/api/video'
import { enhanceVideoWithUserInfo, viewUserDetails, sanitizedActorId } from '../videoUtils'

const props = defineProps<{
  videoData: any
}>()
const isLoading = ref(true)
const initQueryForm = () => {
  return {
    id: props.videoData.id,
    startTime: '',
    endTime: '',
    userId: '',
    status: 'L'
  }
}
const queryForm = reactive<any>(initQueryForm())
const paginatedData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
// Import time validation utilities

const fetchData = async () => {
  // Only validate time if delayed effect is enabled
  isLoading.value = true
  try {
    const query: any = { ...queryForm, page: currentPage.value, pageSize: pageSize.value }
    if (queryForm.status === 'L') {
      delete query.status
    }
    const res = await getVideoFavoriteList(query)
    if (res.success && res.data) {
      paginatedData.value = res.data.items.map((item) => ({
        ...item,
        userId: item.actorId
      }))
      const enhancedData = await enhanceVideoWithUserInfo(paginatedData.value)
      paginatedData.value = enhancedData
      console.log('enhancedData', enhancedData)
      total.value = Number(res.data.pagination.totalItems)
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
const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
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
  .el-table {
    flex: 1;
  }
}
</style>
