<template>
  <div style="width: 100%; display: flex; flex-direction: column; height: 100%">
    <section>
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
            <el-form-item label="" prop="gameType" style="width: 10rem">
              <GameTypeList v-model="queryForm.gameType" with-default @on-select="fetchData" />
            </el-form-item>

            <el-form-item style="margin-left: auto">
              <!-- <el-button type="primary" @click="fetchData" :loading="isLoading">
                <el-icon><Search /></el-icon>
                查询
              </el-button> -->
              <!-- <el-button @click="reset" :loading="isLoading">
                <el-icon><Search /></el-icon>
                重置
              </el-button> -->
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-form :inline="true" class="search_left" :model="configForm" label-width="70px">
            <el-form-item label="" prop="gameType">
              <span class="required-field-indicator">*超管可选</span>
              <el-input-number
                v-if="isSuperAdmin"
                v-model="configForm.adminCount"
                :min="minCount"
                :max="maxCount"
                :step="1"
                :precision="0"
                step-strictly
                controls-position="right"
                :rules="{
                  required: true,
                  message: '该值不可为空',
                  trigger: 'change'
                }"
                style="width: 6rem"
                @change="adminCountChanged"
              />
              <span v-else class="required-field-indicator">{{ configForm.superAdminCount || 0 }}</span>
              <span class="required-field-indicator">张</span>
            </el-form-item>
            <el-form-item label="" prop="gameType">
              <span class="required-field-indicator">*管端可选</span>
              <el-input-number
                v-if="isSuperAdmin"
                v-model="configForm.superAdminCount"
                :min="minCount"
                :max="maxCount"
                :step="1"
                :precision="0"
                step-strictly
                controls-position="right"
                :rules="{
                  required: true,
                  message: '该值不可为空',
                  trigger: 'change'
                }"
                style="width: 6rem"
                @change="superAdminCountChanged"
              />
              <span v-else class="required-field-indicator">{{ configForm.adminCount || 0 }}</span>
              <span class="required-field-indicator">张</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </section>
    <section style="flex: 1; display: flex; flex-direction: column">
      <el-table
        show-overflow-tooltip
        :data="listForShow"
        v-loading="isLoading"
        stripe
        highlight-current-row
        style="width: 100%; flex: 1"
      >
        <el-table-column type="index" label="排序" width="100" />
        <el-table-column label="彩种" width="110">
          <template #default="{ row }">
            {{ getGameTypeName(row.gameType) }}
          </template>
        </el-table-column>
        <el-table-column label="报纸名称" width="220">
          <template #default="{ row }">
            {{ row.newspaperName }}
          </template>
        </el-table-column>
        <el-table-column label="系列名称" width="220">
          <template #default="{ row }">
            {{ row.seriesName }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            {{ row.status === 'y' ? '启用' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="彩色" width="110">
          <template #default="{ row }">
            {{ row.isColorful === 'y' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <div style="display: flex; gap: 15px" v-if="listForShow.length > 0 && row.recommendResource === 'admin'">
              <el-link type="primary" @click="handleUp(row)" :disabled="row.adminIndex === 0">上移</el-link>
              <el-link type="primary" @click="handleDown(row)" :disabled="row.adminIndex === dataList.length - 1">
                下移
              </el-link>
              <el-link type="primary" @click="handleTop(row)" :disabled="row.adminIndex === 0">置顶</el-link>
              <el-link type="danger" @click="handleDelete(row)">删除</el-link>
            </div>
            <div v-else-if="row.recommendResource === 'super'">超管数据不可操作</div>
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
import { editRecommendTop, getRecommendTop, updateRecommend } from '@/api/photoSys/news'
import { useBettingStore } from '@/stores/bettingStore'
import showErrorMessage from '@/utils/showErrorMessage'
import { useListReordering } from '@/views/PhotosSys/newspaper/composables/useListReordering'

const bettingStore = useBettingStore()

const queryForm = reactive({
  gameType: ''
})
const configForm = reactive({
  adminCount: 0,
  superAdminCount: 0
})
const minCount = 0
const maxCount = 10
const isSuperAdmin = false
const getGameTypeName = (gameType: string) => {
  return (
    bettingStore.getAllGetGameType().find((item) => item.gameType.toString() === gameType.toString())?.gameTypeName ||
    ''
  )
}
const superDataList = ref<any>([])
const dataList = ref<any>([])
const listForShow = computed(() => {
  return [...superDataList.value, ...dataList.value.map((item) => ({ ...item, adminIndex: item.index }))]
})
const isLoading = ref(false)
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = (await getRecommendTop({ gameType: queryForm.gameType })) as any
    const temp = res.data
    if (res.success) {
      const list = temp?.list || []
      dataList.value = list
        .filter((item) => item.recommendResource === 'admin')
        .map((item, index) => ({
          ...item,
          index
        }))
      superDataList.value = list
        .map((item, index) => ({
          ...item,
          index
        }))
        .filter((item) => item.recommendResource === 'super')
      configForm.adminCount = temp.adminCount
      configForm.superAdminCount = temp.superAdminCount
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

const adminCountChanged = () => {
  if (configForm.adminCount + configForm.superAdminCount <= maxCount) return
  ElMessage.warning(`超管和管端的推荐总和不能超过${maxCount}张`)
  configForm.superAdminCount = maxCount - configForm.adminCount
}
const superAdminCountChanged = () => {
  if (configForm.adminCount + configForm.superAdminCount <= maxCount) return
  ElMessage.warning(`超管和管端的推荐总和不能超过${maxCount}张`)
  configForm.adminCount = maxCount - configForm.superAdminCount
}
const { moveUp, moveDown, moveToTop, removeItem } = useListReordering(dataList)

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
const toCancelRecommend = async (item: any) => {
  ElMessageBox.confirm('此操作将取消推荐该报纸，确定取消推荐吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    isLoading.value = true
    try {
      const res = await updateRecommend({
        recommendTop: 'n',
        newspaperCode: item.newspaperCode
      })
      if (res.success) {
        ElMessage.success('取消推荐成功')
        const newList = removeItem(item)
        if (newList) {
          dataList.value = newList
        }
      } else {
        showErrorMessage(res)
      }
    } catch (error) {
      ElMessage.error('取消推荐失败')
    } finally {
      isLoading.value = false
    }
  })
}
const handleDelete = async (item: any) => {
  try {
    await toCancelRecommend(item)
  } catch (error) {
    console.error(error)
  }
}
const handleSaveFunc = async () => {
  const codeList = dataList.value.map((item) => ({ newspaperCode: item.newspaperCode }))
  if (codeList.length > configForm.adminCount) {
    ElMessage.warning(`推荐排序不能超过${configForm.adminCount}张`)
    return
  }
  isLoading.value = true
  try {
    const res = (await editRecommendTop({
      gameType: queryForm.gameType,
      adminCount: configForm.adminCount,
      superAdminCount: configForm.superAdminCount,
      list: dataList.value.map((item) => ({ newspaperCode: item.newspaperCode }))
    })) as any
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

onMounted(async () => {
  await bettingStore.getGameType()
  queryForm.gameType = bettingStore.getActiveGameType()[0].gameType
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
