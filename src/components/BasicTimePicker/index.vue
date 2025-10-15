<!-- BasicTimePicker.vue -->
<template>
  <el-time-picker v-model="displayTime" :format="format" :clearable="clearable" @change="handleTimeChange" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

// Define props
const props = defineProps({
  modelValue: {
    type: Number, // Unix timestamp
    required: true
  },
  format: {
    type: String,
    default: 'HH:mm'
  },
  clearable: {
    type: Boolean,
    default: false
  }
})

// Define emits
const emit = defineEmits(['update:modelValue'])

// Convert Unix timestamp to Date object for the time picker
const displayTime = ref<Date>(new Date(props.modelValue))

onMounted(() => {
  if (props.modelValue) {
    displayTime.value = new Date(props.modelValue)
  }
})

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      displayTime.value = new Date(newValue)
    }
  }
)

// Handle time change from the picker
const handleTimeChange = (time: Date | null) => {
  if (!time) {
    emit('update:modelValue', null)
    return
  }

  // Get selected hours and minutes
  const hours = time.getHours()
  const minutes = time.getMinutes()

  // Create a date object with today's date and selected time
  const resultDate = new Date()
  resultDate.setHours(hours)
  resultDate.setMinutes(minutes)
  resultDate.setSeconds(0)
  resultDate.setMilliseconds(0)

  // Convert to Unix timestamp (milliseconds)
  emit('update:modelValue', resultDate.getTime())
}
</script>

<style lang="less" scoped></style>
