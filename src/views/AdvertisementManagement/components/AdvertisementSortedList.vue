<template>
  <div style="width: 100%; display: flex; flex-direction: column; height: 100%; overflow: hidden">
    <section style="text-align: right; margin-bottom: 10px">
      <!-- <GameTypeList
        placeholder="彩种"
        v-model="postGametypeRef"
        allGame
        style="width: 120px"
        @change="handleGameTypeChange"
      /> -->
      <el-button type="primary" @click="handleRefresh" style="margin-left: 10px">重置</el-button>
    </section>
    <section style="flex: 1; display: flex; flex-direction: column; overflow: hidden" v-loading="isLoading">
      <!-- Combined draggable and non-draggable advertisements -->
      <div class="draggable-container">
        <!-- Table header -->
        <div class="draggable-table-header">
          <div class="header-cell" style="width: 100px">排序</div>
          <div class="header-cell" style="width: 100px">广告图片</div>
          <div class="header-cell" style="flex: 1">广告名称</div>
          <div class="header-cell" style="width: 200px">彩种</div>
          <div class="header-cell" style="width: 180px">开始时间</div>
          <div class="header-cell" style="width: 180px">结束时间</div>
          <div class="header-cell" style="width: 150px">广告状态</div>
        </div>

        <div class="table-wrapper">
          <vuedraggable
            :list="dataList"
            :disabled="false"
            item-key="id"
            :forceFallback="true"
            :animation="200"
            class="draggable-list"
            ghost-class="ghost-item"
            chosen-class="chosen-item"
            drag-class="drag-item"
            :move="checkMove"
            @start="handleDragStart"
            @end="handleDragEnd"
          >
            <template #item="{ element, index }">
              <div
                class="draggable-row"
                :class="{
                  'draggable-row--even': index % 2 === 0,
                  'draggable-row--draggable': element.isDraggable
                }"
              >
                <div class="row-cell" style="width: 100px">
                  <span class="row-index">{{ index + 1 }}</span>
                </div>
                <div class="row-cell" style="width: 100px">
                  <AsyncImage
                    fit="cover"
                    :src="getImageUrl(element.logo)"
                    style="width: 50px; height: 30px"
                    draggable="false"
                  />
                </div>
                <div class="row-cell" style="flex: 1; min-width: 0">
                  <p class="overflow-hidden g-text-nowrap-ellipsis">{{ element.name }}</p>
                </div>
                <div class="row-cell" style="width: 200px">
                  <p class="overflow-hidden g-text-nowrap-ellipsis">{{ element.gameTypeNameList.join(',') }}</p>
                </div>
                <div class="row-cell" style="width: 180px">
                  {{ unitFormatDate(Number(element.startTime), 'yyyy-MM-dd HH:mm:ss') }}
                </div>
                <div class="row-cell" style="width: 180px">
                  {{ unitFormatDate(Number(element.endTime), 'yyyy-MM-dd HH:mm:ss') }}
                </div>
                <div class="row-cell" style="width: 150px">
                  <el-tag v-if="element.taskStatus === '1'" type="warning">等待开始</el-tag>
                  <el-tag v-if="element.taskStatus === '2'" type="success">进行中</el-tag>
                  <el-tag v-if="element.taskStatus === '3'" type="danger">已完成</el-tag>
                </div>
              </div>
            </template>
          </vuedraggable>

          <!-- Finished advertisements (non-draggable, shown below active items) -->
          <div
            v-for="(element, index) in finishedDataList"
            :key="`finished-${element.id}`"
            class="draggable-row finished-row"
            :class="{ 'draggable-row--even': (dataList.length + index) % 2 === 0 }"
          >
            <div class="row-cell" style="width: 100px">
              <span class="row-index">{{ dataList.length + index + 1 }}</span>
            </div>
            <div class="row-cell" style="width: 100px">
              <AsyncImage
                fit="cover"
                :src="getImageUrl(element.logo)"
                style="width: 50px; height: 30px"
                draggable="false"
              />
            </div>
            <div class="row-cell" style="flex: 1; min-width: 0">
              <p class="overflow-hidden g-text-nowrap-ellipsis">{{ element.name }}</p>
            </div>
            <div class="row-cell" style="width: 200px">
              <p class="overflow-hidden g-text-nowrap-ellipsis">{{ element.gameTypeNameList.join(',') }}</p>
            </div>
            <div class="row-cell" style="width: 180px">
              {{ unitFormatDate(Number(element.startTime), 'yyyy-MM-dd HH:mm:ss') }}
            </div>
            <div class="row-cell" style="width: 180px">
              {{ unitFormatDate(Number(element.endTime), 'yyyy-MM-dd HH:mm:ss') }}
            </div>
            <div class="row-cell" style="width: 150px">
              <el-tag type="danger">已完成</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="button-row">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleSaveFunc">提交</el-button>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import vuedraggable from 'vuedraggable'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { reqAdvertisementSortList, reqAdvertisementSaveSort } from '@/api/advertisement'
import getImageUrl from '@/utils/getImageUrl'
import { useBettingStore } from '@/stores/bettingStore'

const bettingStore = useBettingStore()
const finishedDataList = ref<any>([])
const cacheMap = ref<any>(new Map<string, { dataList: any[]; finishedDataList: any[] }>())
const dataList = ref<any>([])
const isLoading = ref(false)
const postGametypeRef = ref('')

const gameTypeList = computed(() => {
  // return props.showActiveGameTypes ? bettingStore.getActiveGameType() : bettingStore.getAllGetGameType()
  return bettingStore.getAllGetGameType()
})
const setCacheData = (gameType: string) => {
  console.log('setCacheData', gameType)
  cacheMap.value.set(gameType, {
    dataList: dataList.value.map((item) => item),
    finishedDataList: finishedDataList.value.map((item) => item)
  })
}
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await reqAdvertisementSortList()
    if (res.success) {
      // Use advertisementList and completeList from the new API response
      dataList.value = res.data.advertisementList.map((item, index) => ({
        ...item,
        taskStatus: item.taskStatus.toString(),
        index,
        isDraggable: item.taskStatus === 1 || item.taskStatus === 2, // Only active items are draggable
        gameTypeNameList: item.gameTypeList.map((g) => {
          const gameType = gameTypeList.value.find((gItem) => gItem.gameType.toString() === g.toString())
          return gameType ? gameType.gameTypeName : ''
        })
      }))

      finishedDataList.value = res.data.completeList.map((item, index) => ({
        ...item,
        taskStatus: item.taskStatus.toString(),
        index,
        isDraggable: false, // Finished items are not draggable
        gameTypeNameList: item.gameTypeList.map((g) => {
          const gameType = gameTypeList.value.find((gItem) => gItem.gameType.toString() === g.toString())
          return gameType ? gameType.gameTypeName : ''
        })
      }))
      setCacheData(postGametypeRef.value)
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    ElMessage.error('获取广告排序列表失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits(['cancel'])

// Check if item can be moved (only draggable items can be moved)
const checkMove = (evt: any) => {
  const draggedElement = evt.draggedContext?.element
  return draggedElement && draggedElement.isDraggable
}

// Prevent text selection during drag
const handleDragStart = (_evt: any) => {
  // Prevent any text selection
  document.onselectstart = () => false
  document.ondragstart = () => false
}

// Handle drag end event to update the index order
const handleDragEnd = (_evt: any) => {
  // Re-enable text selection
  document.onselectstart = null
  document.ondragstart = null

  // Clear any existing selection
  if (window.getSelection) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
    }
  }

  // Update the index property for each item based on the new order
  dataList.value.forEach((item, index) => {
    item.index = index
  })
  console.log(
    'Drag ended, new order:',
    dataList.value.map((item) => ({ id: item.id, name: item.name, index: item.index }))
  )
}
const handleSaveFunc = async () => {
  isLoading.value = true
  console.log('handleSaveFunc', cacheMap.value)
  setCacheData(postGametypeRef.value)
  try {
    const res = await reqAdvertisementSaveSort(dataList.value.map((item) => item.id))
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
const loadCacheData = (gameType: string) => {
  const cacheData = cacheMap.value.get(gameType)
  if (cacheData) {
    dataList.value = cacheData.dataList
    finishedDataList.value = cacheData.finishedDataList
  } else {
    ElMessage.error('缓存数据不存在')
  }
}

watch(postGametypeRef, (newVal, oldVal) => {
  if (newVal !== oldVal && !!oldVal) {
    setCacheData(oldVal)
  }
  if (cacheMap.value.has(newVal)) {
    console.log('loadCacheData', newVal)
    loadCacheData(newVal)
  } else {
    console.log('fetchData', newVal)
    fetchData()
  }
})
onMounted(async () => {
  await bettingStore.getGameType()
  // console.log(gList)
  // postGametypeRef.value = gList.length > 0 ? gList[0].gameType : ''
  console.log(gameTypeList.value)
  postGametypeRef.value = gameTypeList.value.length > 0 ? gameTypeList.value[0].gameType : ''
  console.log(postGametypeRef.value)
  await fetchData()

  // Additional prevention for text selection during drag
  document.addEventListener('selectstart', (e) => {
    if (e.target && (e.target as HTMLElement).closest('.draggable-list')) {
      e.preventDefault()
    }
  })
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

/* Draggable table styles */
.draggable-table-header {
  display: flex;
  width: 100%;
  background-color: var(--el-table-header-bg-color, #fafafa);
  font-weight: bold;
  font-size: 14px;
  color: var(--el-table-header-text-color, #909399);
  border: 1px solid var(--el-table-border-color, #ebeef5);
  border-bottom: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-cell {
  padding: 12px 8px;
  border-right: 1px solid var(--el-table-border-color, #ebeef5);
  display: flex;
  align-items: center;
  min-height: 40px;
  flex-shrink: 0;
}

.header-cell:last-child {
  border-right: none;
}

.draggable-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  /* Prevent text selection during drag */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.table-wrapper {
  width: 100%;
  display: block;
  flex: 1;
  padding-top: 0;
}

.draggable-list {
  min-height: 100px;
  width: 100%;
  display: block;
  /* Prevent text selection during drag */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.draggable-row {
  display: flex;
  width: 100%;
  background-color: #fff;
  transition: background-color 0.2s ease;
  border: 1px solid var(--el-table-border-color, #ebeef5);
  border-top: none;
  /* Prevent text selection during drag */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.draggable-row--draggable {
  cursor: move;
}

.draggable-row--even {
  background-color: var(--el-table-stripe-bg-color, #fafafa);
}

.draggable-row:hover {
  background-color: var(--el-table-row-hover-bg-color, #f5f7fa);
}

.finished-row {
  cursor: default !important;
  opacity: 0.8;
}

.finished-row:hover {
  background-color: var(--el-color-info-light-9) !important;
}

.row-cell {
  padding: 12px 8px;
  border-right: 1px solid var(--el-table-border-color, #ebeef5);
  display: flex;
  align-items: center;
  min-height: 40px;
  font-size: 14px;
  flex-shrink: 0;
  /* Prevent text selection in cells */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.row-cell:last-child {
  border-right: none;
}

/* Ensure all text elements inside rows are not selectable */
.draggable-row p,
.draggable-row span,
.draggable-row div {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Ensure ellipsis works properly */
.g-text-nowrap-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.row-index {
  font-weight: bold;
  color: var(--el-color-primary);
}

/* Simple ghost item styling */
.ghost-item {
  opacity: 0.5 !important;
  background-color: var(--el-color-primary-light-8) !important;
}

/* Simple chosen item styling */
.chosen-item {
  background-color: var(--el-color-primary-light-9) !important;
}

/* Simple drag item styling */
.drag-item {
  background-color: var(--el-color-primary-light-7) !important;
  border-left: 3px solid var(--el-color-primary) !important;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .header-cell,
  .row-cell {
    padding: 8px 4px;
    font-size: 12px;
  }

  .drag-hint {
    display: none;
  }
}
</style>
