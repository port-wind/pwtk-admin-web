<template>
  <div :class="['icon-toggle', { 'icon-toggle-disabled': loading }]" @click="toggle">
    <img :src="currentIcon" :style="imageStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filterColor } from '@/const/commonSet'

const props = defineProps({
  inactiveIcon: { type: String, required: true },
  activeIcon: { type: String, required: true },
  inactiveColor: { type: String, required: true },
  activeColor: { type: String, required: true },
  initialState: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  disabledAction: { type: Boolean, default: false }
})
const emit = defineEmits(['update:initialState', 'toggle'])

const isActive = computed({
  get: () => props.initialState,
  set: (_) => {
    // emit('update:initialState', val)
  }
})

const currentIcon = computed(() => (isActive.value ? props.activeIcon : props.inactiveIcon))
function generateFilter(hex: string): string {
  // 生成过滤器字符串
  return filterColor[hex] ?? filterColor['thumb-up']
}
const imageStyle = computed(() => ({
  filter: isActive.value ? generateFilter(props.activeColor) : generateFilter(props.inactiveColor)
}))

const toggle = () => {
  if (props.disabledAction) {
    ElMessage({
      message: `请确认模拟用户`,
      type: 'warning'
    })
    return
  }
  if (props.loading) {
    return
  }

  emit('update:initialState', isActive.value)
}

onMounted(() => {})
</script>

<style scoped>
.icon-toggle {
  display: inline-block;
  cursor: pointer;
}

.icon-toggle-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

img {
  width: 18px;
  height: 18px;
}
</style>
