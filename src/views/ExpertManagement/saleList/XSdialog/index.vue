<script setup lang="ts">
import SaleInfo from './saleInfo.vue'

const isVisible = ref(false)
const predictId = ref('')
const activeName = ref('sale_tab')
const emits = defineEmits(['onClose'])
const openDailog = async (params?: { predictId?: string }) => {
  if (params?.predictId) {
    predictId.value = params.predictId
  }
  isVisible.value = true
  activeName.value = 'sale_tab'
}
export interface IExpose {
  openDailog: (_?: { predictId?: string }) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})
const onClose = () => {
  isVisible.value = false
  emits('onClose')
}
onUnmounted(() => {
  console.log('unmounted')
  isVisible.value = false
  predictId.value = ''
})
</script>

<template>
  <!-- dialog  -->
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="isVisible"
    append-to-body
    :close-on-click-modal="false"
    @close="onClose"
    class="tabs-dialog"
  >
    <el-tabs class="m_tabs" v-model="activeName">
      <el-tab-pane label="卖料" name="sale_tab" class="m_tabs_pane">
        <SaleInfo @onClose="onClose" :predictId="predictId" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style lang="less" scoped></style>
