<template>
  <div id="system_account" v-show="choosingIssue" style="width: 100%; display: flex; flex-direction: column">
    <m-table
      :options="options"
      :data="tableData"
      :isLoading="isLoading"
      :pagination="false"
      isEditRow
      stripe
      :show-overflow-tooltip="{ disabled: true }"
    >
      <template #issue="{ scope }">
        {{ scope.row.issue }}
      </template>

      <template #predictTitle="{ scope }">
        <p>{{ truncateText(scope.row?.predictTitle) }}</p>
      </template>
      <template #gameType="{ scope }">
        <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
      </template>
      <template #playTypeCode="{ scope }">
        <p>{{ scope.row?.playTypeName?.toString() }}</p>
      </template>
      <template #predict="{ scope }">
        <PopoverList :content="scope.row.predict" :max-items="5"></PopoverList>
      </template>
      <template #action="{ scope }">
        <el-button type="success" size="small" @click="handleChoosingIssue(scope.row)">选择</el-button>
      </template>
    </m-table>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { truncateText } from '@/utils/dataFormat'
import type { TableOptions } from '@/components/mTable/types'

const props = defineProps({
  lastList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const bettingStore = useBettingStore()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = bettingStore.getAllGetGameType().find((item) => item.gameType === gameType)
  return gameTypeObj ? gameTypeObj.gameTypeName : ''
})
const choosingIssue = ref(true)
const tableData = ref<any>([])

const isLoading = ref(false)
const options: TableOptions[] = [
  {
    prop: 'predictId',
    label: '卖料ID',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'year',
    label: '年份',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'issue',
    label: '期数',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'predictTitle',
    label: '卖料标题',
    slot: 'predictTitle',
    columAttr: { minWidth: 200 }
  },

  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'playTypeCode',
    label: '投票类型',
    slot: 'playTypeCode',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'predict',
    label: '推荐内容',
    slot: 'predict',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'action',
    label: '操作',
    slot: 'action',
    columAttr: { minWidth: 100 }
  }
]
const emit = defineEmits(['select'])
const handleChoosingIssue = (row: any) => {
  emit('select', row)
}

const fetchData = async () => {
  console.log('props.lastList', props.lastList)
  tableData.value = props.lastList
}

onMounted(() => {
  fetchData()
})
</script>
