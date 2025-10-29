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
        <el-form-item label="" prop="word">
          <el-input v-model="queryForm.word" placeholder="敏感词" />
        </el-form-item>

        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="状态" style="width: 100px">
            <el-option label="全部" :value="-1" />
            <el-option label="启用" :value="1" />
            <el-option label="关闭" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="startTime">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="openNewSensitiveWordDialog" plain>新增</el-button>
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
      >
        <template #word="{ scope }">
          <SimplePopover v-if="scope.row.word" v-model="scope.row.word"></SimplePopover>
        </template>
        <template #createdAt="{ scope }">
          {{ unitFormatDate(scope.row.createdAt, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #status="{ scope }">
          <el-switch
            class="switch-custom"
            v-model="scope.row.status"
            :loading="isLoading"
            :active-value="1"
            :inactive-value="0"
            :inactive-text="scope.row.status === 1 ? '启用' : '关闭'"
            @change="(val) => onchange(scope.row, val)"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
        <template #option="{ scope }">
          <el-popconfirm class="box-item" @confirm="confirmEvent(scope.row)" title="确定要删除吗" placement="top">
            <template #reference>
              <el-button type="danger" size="small" plain>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </m-table>
    </section>

    <AddSensitiveWordDialog ref="AddSensitiveWordDialogRef" @onClose="handleClose" />
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { options } from '@/views/System/sensitiveWord/data'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import {
  reqDeleteSensitiveWordList,
  reqSensitiveWordList,
  reqUpdateSensitiveWordList
} from '@/api/system/sensitiveWord'
import type {
  IReqDeleteSensitiveWordListQueryParams,
  IReqSensitiveWordListData,
  IReqSensitiveWordListQueryParams,
  IReqUpdateSensitiveWordListQueryParams
} from '@/api/system/sensitiveWord/type'
import AddSensitiveWordDialog from './addSensitiveWordDialog.vue'

const tableRef = ref()
const queryRef = ref()
const AddSensitiveWordDialogRef = ref()
const tableData = ref<IReqSensitiveWordListData[]>([])

const total = ref<number>(0)

const initFormQuery = (): IReqSensitiveWordListQueryParams => {
  return {
    page: 1,
    size: 15,
    sortName: 'createdAt',
    sortOrder: 'DESC',
    word: '',
    status: -1,
    statusDesc: '',
    startTime: '',
    endTime: ''
  }
}

const queryForm = reactive<IReqSensitiveWordListQueryParams>(initFormQuery())

//loading 按钮
const isLoading = ref(false)

const openNewSensitiveWordDialog = () => {
  AddSensitiveWordDialogRef.value.open()
}

const confirmEvent = async (row: IReqSensitiveWordListData) => {
  try {
    const query: IReqDeleteSensitiveWordListQueryParams = {
      id: row.id,
      word: row.word
    }
    const res = await reqDeleteSensitiveWordList(query)
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      fetchData()
    }
  } catch (error) {}
}

//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IReqSensitiveWordListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqSensitiveWordListQueryParams = {
      ...queryForm,
      ..._queryForm
    }
    if (_queryForm) {
      Object.assign(queryForm, _queryForm)
    }

    if (query.status === -1) {
      delete query.status
    }

    const response = await reqSensitiveWordList(query)
    if (response.success) {
      tableData.value = response.data.list
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

// 更新状态
const onchange = async (row: IReqSensitiveWordListData, val) => {
  console.log('🚀 ~ beforeChange ~ val:', row, val)
  try {
    if (row.id) {
      isLoading.value = true
      const query: IReqUpdateSensitiveWordListQueryParams = {
        id: row.id,
        word: row.word,
        status: val
      }
      const response = await reqUpdateSensitiveWordList(query)
      if (response.success) {
        fetchData()
        ElMessage.success('操作成功')
      } else {
        showErrorMessage(response)
      }
    }
  } catch (error) {
    throw new Error('更新错误')
  } finally {
    isLoading.value = false
  }
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
  Object.assign(queryForm, initFormQuery())
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

.switch-custom .el-switch__label.is-active {
  color: #303133;
}
</style>
