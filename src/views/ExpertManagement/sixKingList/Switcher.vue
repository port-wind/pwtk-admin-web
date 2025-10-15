<template>
  <component :is="currentComponent" :key="componentKey" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ExpertStatistics from './ExpertStatistics.vue'
import HistoryChampion from './HistoryChampion.vue'
import WinningStreakRank from './WinningStreakRank.vue'
import Sixking from './Sixking.vue'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'

const sixKingListPage = useSixKingListPageStore()
// const props = defineProps<Props>()

// Component mapping
const components = {
  expert_statistics: ExpertStatistics,
  history_champion: HistoryChampion,
  winning_streak_rank: WinningStreakRank,
  sixking: Sixking
}
const componentKey = computed(() => `${sixKingListPage.currentTabs}`)

const currentComponent = computed(() => components[sixKingListPage.currentTabs] || null)
</script>
