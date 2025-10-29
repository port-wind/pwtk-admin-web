<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    :model-value="true"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs model-value="mainTab" class="m_tabs">
      <el-tab-pane class="m_tabs_pane" label="创建视频" name="mainTab" :stretch="true">
        <CreateVideo @refresh="emit('refresh')" @close="closeTabs" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'refresh', 'close'])

defineProps<{
  modelValue: boolean
}>()

const closeTabs = () => {
  emit('close')
  emit('update:modelValue', false)
}

onMounted(() => {})
</script>
<style scoped lang="less"></style>
