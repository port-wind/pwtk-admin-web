<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import type { IGameType } from '@/api/global/types'

// 定义 emits
const emit = defineEmits<{
  (_e: 'onSelect', _value: IGameType[]): void
  (_e: 'update:modelValue', _value: string[]): void
  (_e: 'defaultLoaded', _value: string[]): void
}>()

const props = defineProps<{
  modelValue: string[]
  withDefault?: boolean
  allGame?: boolean
  showTotal?: boolean //是否显示全部， 默认不显示
}>()

const tempValue = ref<string[]>([])
const bettingStore = useBettingStore()

const gameTypeList = computed(() => {
  return bettingStore.getAllGetGameType()
})

const handleChange = (val: string[]) => {
  const selectedGameTypes = bettingStore.gameType.filter((item) => val.includes(item.gameType))
  emit('update:modelValue', val)
  emit('onSelect', selectedGameTypes)
}

onMounted(async () => {
  tempValue.value = props.modelValue || []
  if (bettingStore.gameType.length === 0) {
    await bettingStore.getGameType()
  }
  if (props.withDefault) {
    const defaultGameType = gameTypeList.value.find((item) => item.status === 'y')?.gameType
    if (defaultGameType) {
      tempValue.value = [defaultGameType]
      emit('update:modelValue', tempValue.value)
      emit('defaultLoaded', tempValue.value)
    }
  }
})

watch(
  () => props.modelValue,
  (val) => {
    tempValue.value = val || []
  }
)
</script>

<template>
  <el-select
    v-bind="$attrs"
    v-model="tempValue"
    @change="handleChange"
    placeholder="彩种"
    multiple
    collapse-tags
    collapse-tags-tooltip
  >
    <el-option v-if="props.showTotal" label="全部" value="0"></el-option>
    <el-option
      v-for="item in gameTypeList"
      :key="item.gameType"
      :label="item.gameTypeName"
      :value="item.gameType"
      :disabled="!props.allGame && item.status === 'n'"
      :title="!props.allGame && item.status === 'n' ? '当前彩票已停止' : ''"
    />
  </el-select>
</template>

<style lang="less" scoped></style>
