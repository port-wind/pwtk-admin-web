<template>
  <div v-if="isVisible" class="front-modal" :style="{ width: windowWidth + 'px', height: windowHeight + 'px' }">
    <el-tabs v-model="activeName" style="flex: 1; overflow: hidden; display: flex; flex-direction: column">
      <el-tab-pane
        label="帖子信息"
        name="first"
        class="m_tabs_pane"
        style="overflow: hidden; height: 100%; display: flex; flex-direction: column"
      >
        <modal-content :modal-data="modalData" @close="closeTabs" @submit="handleSubmit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { useModalsStore } from '@/stores/modalStore'

const emit = defineEmits(['refreshPage'])
const modalsStore = useModalsStore()
const modalData = computed(() => modalsStore.postScreenDetailModal.modalData || {})
const isVisible = computed(() => modalsStore.postScreenDetailModal.isVisible)
const activeName = ref('first') //tab默认显示
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
//关闭窗口
const closeTabs = () => {
  modalsStore.hideModal('postScreenDetailModal')
}

const handleSubmit = () => {
  closeTabs()
  emit('refreshPage')
}
onMounted(async () => {})
</script>

<style scoped lang="less">
/* Optional: Add some padding or other styles as needed */
.front-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
}
:deep(.m_tabs) {
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__content) {
  flex: 1;
}
</style>
