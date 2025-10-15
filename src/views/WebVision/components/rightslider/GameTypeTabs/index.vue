<template>
  <el-tabs
    v-model="activeTab"
    type="card"
    class="gametype-tabs"
    v-if="selectedGameTypes?.length > 0"
    @tab-change="(e: any) => onTabChange(e)"
  >
    <el-tab-pane
      v-for="gt in selectedGameTypes"
      :key="gt.gameType"
      :label="getGameName(gt.gameType)"
      :name="gt.gameType"
    >
      <slot :gameType="gt.gameType" :data="gt" />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { getGameName } from '../../componentsbiz/store/gameStore'
import { useMultiGameType } from '../../componentsbiz/composables/useMultiGameType'

interface Props {
  datas: any // The same datas object that useMultiGameType expects
}

interface Emits {
  (_: 'tab-change', __: string, ___: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
// 🎮 Use the existing useMultiGameType composable internally
const { activeTab, selectedGameTypes, handleTabClick } = useMultiGameType(props.datas)

// Handle tab change and emit event for maintainability
const onTabChange = (tabName: string) => {
  handleTabClick(tabName)
  const gameTypeData = selectedGameTypes.value.find((gt) => gt.gameType === tabName)
  emit('tab-change', tabName, gameTypeData)
}
</script>

<style scoped lang="scss">
.gametype-tabs {
  :deep(.el-tabs__content) {
    padding: 16px 0;
  }

  :deep(.el-tab-pane) {
    min-height: 200px;
  }
}
</style>
