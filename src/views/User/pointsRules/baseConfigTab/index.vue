<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="m_tabs" @tab-change="handleTabClick">
      <PointConfigTab @cancel="cancle" @refreshPage="close" />
      <StarConfigTab @cancel="cancle" @refreshPage="close" />
      <TaskRewardConfigTab @cancel="cancle" @refreshPage="close" />
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import PointConfigTab from './PointConfigTab.vue'
import StarConfigTab from './StarConfigTab.vue'

const modalsStore = useModalsStore()
const isVisible = computed(() => modalsStore.editBaseConfigModal.isVisible)
const activeTab = computed(() => modalsStore.editBaseConfigModal.activeTab)
const emit = defineEmits(['callBack', 'refreshPage'])

const close = () => {
  emit('refreshPage')
  modalsStore.hideModal('editBaseConfigModal')
}

const cancle = () => {
  modalsStore.hideModal('editBaseConfigModal')
  modalsStore.resetModal('editBaseConfigModal')
  modalsStore.editBaseConfigModal.activeTab = 'basic'
}

const handleTabClick = (tab) => {
  console.log(tab)
}
</script>
