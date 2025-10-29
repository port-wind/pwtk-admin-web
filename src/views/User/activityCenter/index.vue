<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1, size: 15 })"
      >
        <el-form-item label="" prop="activityName">
          <AutoComplete
            v-model="queryForm.activityName"
            :httpFunc="reqHttpActivityCenter"
            keyword="activityName"
            placeholder="活动名称"
            :displayFields="['activityName']"
            :trigger-on-focus="true"
            isPage
            isList
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.beginTime"
            v-model:endDate="queryForm.endTime"
            style="width: 260px"
          ></TimeSelect>
        </el-form-item>
        <el-form-item prop="talents">
          <el-select v-model="queryForm.talents" placeholder="对象" multiple style="width: 100px">
            <el-option v-for="(value, key) in talentMap" v-bind:key="key" :label="value" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1, size: 15 })" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="() => openAddDialog()">
            <el-icon>
              <Plus />
            </el-icon>
            新增
          </el-button>
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
        key="activityId"
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #imageInfo="{ scope }">
          <div v-if="scope.row.imgPath" class="async-image">
            <AsyncImage fit="cover" :src="getImageUrl(scope.row.imgPath)" />
          </div>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #activityName="{ scope }">
          <p class="like-a overflow-hidden" type="primary" @click="openAddDialog(scope.row)">
            {{ scope.row.activityName }}
          </p>
        </template>
        <template #beginTime="{ scope }">
          {{ unitFormatDate(scope.row.beginTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #talents="{ scope }">
          {{ getTalents(scope.row) }}
        </template>
        <template #state="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.state === '1' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.state"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="() => onBeforeChange(scope.row)"
            :loading="scope.row.isSwitchLoading"
          />
        </template>
      </m-table>
    </section>

    <ActivityCenterDialog ref="ActivityCenterDialogRef" v-if="ActivityCenterDialogMount" @onClose="onCloseDialog" />
  </section>
</template>

<script setup lang="ts">
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { reqHttpActivityCenter, editUserActivity } from '@/api/user/activityCenter'
import TimeSelect from '@/components/timeSelect2/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import getImageUrl from '@/utils/getImageUrl'
import { options } from '@/views/User/activityCenter/data'
import type { IReqHttpActivityCenterData, IReqHttpActivityCenterQueryParams } from '@/api/user/activityCenter/type'

// 在数据模型中添加 isSwitchLoading 属性（可选）
interface IReqHttpActivityCenterDataExtended extends IReqHttpActivityCenterData {
  isSwitchLoading?: boolean
}

const tableData = ref<IReqHttpActivityCenterData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)
const ActivityCenterDialogMount = ref(false)
const ActivityCenterDialogRef = ref()

const openAddDialog = (row?: IReqHttpActivityCenterData) => {
  ActivityCenterDialogMount.value = true
  nextTick(() => {
    ActivityCenterDialogRef.value.open(row)
  })
}

const talentMap = {
  // 1: '高手',
  2: '专家'
}

const initQueryFormValue = (): IReqHttpActivityCenterQueryParams => ({
  page: 1,
  size: 15,
  sortOrder: 'DESC',
  // sortName: 'createTime',
  activityName: '',
  talents: undefined,
  beginTime: '',
  endTime: ''
  // clientType: ''
})

const queryForm = reactive<IReqHttpActivityCenterQueryParams>(initQueryFormValue())

const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())

  fetchData()
}

const onCloseDialog = (isEdit: boolean) => {
  const { page, size } = queryForm
  Object.assign(queryForm, initQueryFormValue())
  console.log(isEdit)

  if (isEdit) {
    queryForm.page = page
    queryForm.size = size
  }

  fetchData()
}

// Methods
const fetchData = async (val?: Partial<IReqHttpActivityCenterQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqHttpActivityCenterQueryParams = { ...queryForm, ...val }
    const response = await reqHttpActivityCenter(query)
    if (response.success) {
      tableData.value = response.data.list.map((item) => ({
        ...item,
        isSwitchLoading: false // 初始化加载状态
      }))
      total.value = Number(response.data.total)
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

const handleSizeChange = (val: number) => {
  queryForm.size = val
  queryForm.page = 1
  fetchData()
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

/**切换状态 */
const onBeforeChange = (row: IReqHttpActivityCenterDataExtended): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    // 设置加载状态
    row.isSwitchLoading = true

    // 记录原始状态，以便失败时回滚
    const originalState = row.state

    // 切换状态（这里只是预览切换，实际由后端决定）
    row.state = row.state === '1' ? '0' : '1'

    try {
      const res = await editUserActivity(row)
      if (res.success) {
        // 请求成功，状态已更新，resolve true
        row.state = row.state === '1' ? '0' : '1'
        resolve(true)
      } else {
        // 请求失败，回滚状态并 reject
        row.state = originalState
        showErrorMessage(res)
        reject(false)
      }
    } catch (error) {
      // 异常处理，回滚状态
      row.state = originalState
      console.error('Error updating state:', error)
      reject(false)
    } finally {
      // 无论成功或失败，结束加载状态
      row.isSwitchLoading = false
    }
  })
}

const getTalents = (row) => {
  return row.talents.map((talent) => talentMap[talent]).join('、')
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
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
.async-image {
  width: 48px;
  height: 48px;
}
.async-image img {
  width: 100%;
}
</style>
