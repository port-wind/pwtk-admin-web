<template>
  <div style="width: 100%; display: flex; flex-direction: column; height: 100%">
    <section style="text-align: right">
      <el-button type="primary" @click="handleRefresh">重置</el-button>
    </section>
    <section style="flex: 1; display: flex; flex-direction: column; overflow: auto">
      <el-table
        show-overflow-tooltip
        :data="listForShow"
        v-loading="isLoading"
        stripe
        highlight-current-row
        style="width: 100%; flex: 1"
      >
        <el-table-column type="index" label="排序" width="100" />
        <el-table-column label="公告标题">
          <template #default="{ row }">
            <p class="overflow-hidden g-text-nowrap-ellipsis" type="primary">
              {{ row.announcementTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="公告内容" :show-overflow-tooltip="false">
          <template #default="{ row }">
            <SimplePopover v-model="row.announcementDesc"></SimplePopover>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="180">
          <template #default="{ row }">
            {{ unitFormatDate(Number(row.startTime), 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template #default="{ row }">
            {{ unitFormatDate(Number(row.endTime), 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="公告状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.taskStatus === '1'" type="warning">等待开始</el-tag>
            <el-tag v-if="row.taskStatus === '2'" type="success">进行中</el-tag>
            <el-tag v-if="row.taskStatus === '3'" type="danger">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <div
              style="display: flex; gap: 15px"
              v-if="listForShow.length > 0 && (row.taskStatus === '1' || row.taskStatus === '2')"
            >
              <el-link type="primary" @click="handleUp(row)" :disabled="row.adminIndex === 0">上移</el-link>
              <el-link type="primary" @click="handleDown(row)" :disabled="row.adminIndex === dataList.length - 1">
                下移
              </el-link>
              <el-link type="primary" @click="handleTop(row)" :disabled="row.adminIndex === 0">置顶</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="button-row">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleSaveFunc">提交</el-button>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import showErrorMessage from '@/utils/showErrorMessage'
import { useListReordering } from '@/views/PhotosSys/newspaper/composables/useListReordering'
import { reqAnnouncementListWithSort, reqAnnouncementSort } from '@/api/messageNotice'
import { unitFormatDate } from '@/utils/dateFormat/index'

const finishedDataList = ref<any>([])
const dataList = ref<any>([])
const listForShow = computed(() => {
  return [...dataList.value.map((item) => ({ ...item, adminIndex: item.index })), ...finishedDataList.value]
})
const isLoading = ref(false)
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = (await reqAnnouncementListWithSort({})) as any
    const temp = res.data
    if (res.success) {
      dataList.value = temp.announceList.map((item, index) => ({
        ...item,
        taskStatus: item.taskStatus.toString(),
        index
      }))
      finishedDataList.value = temp.completeList.map((item, index) => ({
        ...item,
        taskStatus: item.taskStatus.toString(),
        index
      }))
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    ElMessage.error('获取推荐排序列表失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits(['cancel'])

const { moveUp, moveDown, moveToTop } = useListReordering(dataList)

// To use it without mutating the original list:
const handleUp = (item: any) => {
  const newList = moveUp(item)
  console.log(newList)

  if (newList) {
    dataList.value = newList
  }
}
const handleDown = (item: any) => {
  const newList = moveDown(item)
  if (newList) {
    dataList.value = newList
  }
}
const handleTop = (item: any) => {
  const newList = moveToTop(item)
  if (newList) {
    dataList.value = newList
  }
}
const handleSaveFunc = async () => {
  isLoading.value = true
  try {
    const res = (await reqAnnouncementSort(dataList.value.map((item) => item.announcementId))) as any
    if (res.success) {
      ElMessage.success('保存成功')
      emit('cancel')
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    ElMessage.error('保存失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
const cancel = () => {
  emit('cancel')
}
const handleRefresh = () => {
  fetchData()
}

onMounted(async () => {
  await fetchData()
})
</script>

<style scoped>
.required-field-indicator {
  color: red;
  margin: 0 5px;
}
.button-row {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
  /* 使按钮靠右对齐 */
}
</style>
