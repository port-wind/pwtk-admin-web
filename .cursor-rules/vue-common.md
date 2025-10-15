# Vue.js 通用开发规范

## Vue 3 + TypeScript 规范

### 组件结构

```vue
<template>
  <div class="component-name">
    <!-- 模板内容 -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// Props 定义
interface Props {
  data?: any
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 响应式数据
const isLoading = ref(false)
const formData = reactive({})
</script>

<style lang="scss" scoped>
.component-name {
  // 组件样式
}
</style>
```

### 命名规范

- **文件名**: kebab-case (如: `user-list.vue`)
- **组件名**: PascalCase (如: `UserList`)
- **变量名**: camelCase (如: `isLoading`)
- **常量名**: UPPER_SNAKE_CASE (如: `API_BASE_URL`)

### API 调用模式

```typescript
const getData = async () => {
  try {
    isLoading.value = true
    const res = await api.getData()
    if (res.success) {
      // 处理成功数据
    }
  } catch (error) {
    ElMessage.error('请求失败')
  } finally {
    isLoading.value = false
  }
}
```
