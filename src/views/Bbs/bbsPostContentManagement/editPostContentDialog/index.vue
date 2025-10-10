<template>
  <el-dialog
    draggable
    class="tabs-dialog"
    overflow
    destroy-on-close
    :modelValue="visible"
    @update:modelValue="$emit('update:visible', $event)"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-tabs v-model="activeTab" style="flex: 1; overflow: hidden">
      <el-tab-pane label="帖子信息" name="first" class="m_tabs_pane" style="overflow: hidden; height: 100%">
        <modal-content :modal-data="modalData" @close="handleClose" @submit="handleSubmit" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  modalData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'refreshPage'])

const activeTab = ref('first')

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  handleClose()
  emit('refreshPage')
}
</script>

<style scoped lang="less">
:deep(.el-tabs__content) {
  height: 100%;
}
</style>
