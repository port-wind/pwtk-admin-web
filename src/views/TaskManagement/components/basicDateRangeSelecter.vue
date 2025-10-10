<!-- DateRangeSelector.vue -->
<template>
  <el-date-picker
    v-model="dateRange"
    type="datetimerange"
    range-separator="-"
    unlink-panels
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    v-bind="$attrs"
    @change="handleChange"
    :disabled-date="disableDateFn"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
// Define emits
const emit = defineEmits<{
  (_: 'update:modelValue', __: [Date, Date]): void
  (_: 'change', __: [Date, Date]): void
}>()

// Define props
const props = defineProps<{
  modelValue?: [Date, Date]
  disableDateFn?: (_: Date) => boolean
}>()

// Create a computed property for two-way binding
const dateRange = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value as [Date, Date])
  }
})

// Handle change event
const handleChange = (value: [Date, Date] | null) => {
  emit('change', value as [Date, Date])
}
</script>
