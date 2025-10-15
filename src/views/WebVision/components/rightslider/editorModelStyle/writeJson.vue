<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: object
}>()
const emit = defineEmits(['update:modelValue'])
// 当前模式：'view' 预览模式，'edit' 编辑模式
const mode = ref<'view' | 'edit'>('view')

// 编辑时临时保存的 JSON 字符串
const tempJsonString = ref('')

// 点击区域，进入编辑模式
const handleEnterEdit = () => {
  mode.value = 'edit'
  tempJsonString.value = JSON.stringify(props.modelValue, null, 2)
}

// 失去焦点时，保存编辑
const handleBlur = () => {
  try {
    const parsed = JSON.parse(tempJsonString.value)
    emit('update:modelValue', parsed)
  } catch (error) {
    alert('JSON格式错误，请检查！')
  } finally {
    mode.value = 'view'
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (mode.value === 'view') {
      tempJsonString.value = JSON.stringify(newVal, null, 2)
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="write-json">
    <!-- 预览模式 -->
    <div v-if="mode === 'view'" @click="handleEnterEdit">
      <pre>{{ JSON.stringify(modelValue, null, 2) }}</pre>
    </div>

    <!-- 编辑模式 -->
    <div v-else>
      <textarea
        v-model="tempJsonString"
        style="width: 100%; font-family: monospace"
        @blur="handleBlur"
        autofocus
      ></textarea>
    </div>
  </div>
</template>

<style scoped>
.write-json {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  min-height: 400px;
  width: 100%;
}
pre {
  background: #f5f5f5;
  padding: 12px;
  overflow: auto;
  /* white-space: pre-wrap; */
  word-break: break-word;
  height: 408px;
}
textarea {
  display: block;
  border: none;
  outline: none;
  background: #f5f5f5;
  padding: 12px;
  height: 408px;
}
</style>
