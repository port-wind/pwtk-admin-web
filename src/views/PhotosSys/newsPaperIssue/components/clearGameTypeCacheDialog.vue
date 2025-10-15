<template>
  <el-dialog
    v-model="dialogVisible"
    class="tabs-dialog-small"
    draggable
    overflow
    destroy-on-close
    @close="onClosed"
    title=""
    width="580"
    :close-on-click-modal="false"
  >
    <div class="clear-wrapper">
      <h1 class="title">
        <template v-if="currentCleanGameType && getGameTypeName(currentCleanGameType)">
          请问是否要清除「{{ getGameTypeName(currentCleanGameType) }}」的缓存?
        </template>
        <template v-else>请选择你要清除缓存的彩种?</template>
      </h1>
      <div style="margin-top: 20px">
        <el-radio-group v-model="currentCleanGameType">
          <el-radio
            v-for="item in gameTypeListShow"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button
          type="primary"
          @click="handleClearGameType"
          :icon="Refresh"
          :disabled="!currentCleanGameType"
          :loading="isLoading"
        >
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useBettingStore } from '@/stores/bettingStore'
import { Refresh } from '@element-plus/icons-vue'

interface IProps {
  api: Function
}
const props = defineProps<IProps>()

const gameTypeList = ref<any[]>([])
const bettingStore = useBettingStore()
const dialogVisible = ref(false)
const isLoading = ref(false)
const clearCacheDialog = ref(false)
const emits = defineEmits(['onClose'])

const openDialog = (gameType) => {
  currentCleanGameType.value = gameType
  dialogVisible.value = true
}

export interface IExpose {
  openDialog: (gameType: string) => void
}
defineExpose<IExpose>({
  openDialog
})

const handleClose = () => {
  dialogVisible.value = false
  emits('onClose')
}

const onClosed = () => {
  dialogVisible.value = false
  emits('onClose')
}

const currentCleanGameType = ref('')

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.gameType === gameType)
  return gameTypeObj ? gameTypeObj.gameTypeName : ''
})

const gameTypeListShow = computed(() =>
  gameTypeList.value.map((item) => ({ label: item.gameTypeName, value: item.gameType }))
)

const handleClearGameType = async () => {
  isLoading.value = true
  try {
    const res = await props.api({ gameType: currentCleanGameType.value })
    if (res.success) {
      ElMessage({
        type: 'success',
        message: `已经清除缓存`
      })
    }
    dialogVisible.value = false
  } catch (error) {
    throw new Error('清除缓存失败..')
  } finally {
    clearCacheDialog.value = false
    isLoading.value = false
  }
}

onMounted(async () => {
  await bettingStore.getGameType()
  gameTypeList.value = bettingStore.getAllGetGameType()
})
</script>

<style scoped lang="less">
.clear-wrapper {
  padding: 20px;
}
.title {
  font-size: 16px;
  font-weight: bold;
}
</style>
