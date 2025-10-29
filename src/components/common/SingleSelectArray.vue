<template>
  <el-select v-model="internalValue" v-bind="$attrs" @change="handleChange">
    <slot></slot>
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const internalValue = ref<string | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue.length > 0 ? newValue[0] : null
  },
  { immediate: true }
)

const handleChange = (value: string) => {
  emit('update:modelValue', value ? [value] : [])
}
</script>
