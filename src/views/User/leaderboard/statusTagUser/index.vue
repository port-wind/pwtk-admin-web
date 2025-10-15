<template>
  <span class="el-dropdown-link">
    <el-tag v-if="status === 'y'" class="mx-1" type="primary">启用</el-tag>
    <el-tag v-else-if="status === 'n'" class="mx-1" type="warning">停用</el-tag>
    <el-tag v-else-if="status === 't'" class="mx-1" type="warning">停权</el-tag>
    <el-tag v-else-if="status === 'f'" class="mx-1" type="warning">冻结</el-tag>
    <el-tag v-else-if="status === 'u'" class="mx-1" type="primary">未启用</el-tag>
    <el-tag v-else-if="status === 'z'" class="mx-1" type="primary">保留</el-tag>
    <el-tag v-else-if="status === 'v'" class="mx-1" type="primary">浏览</el-tag>
    <el-tag v-else-if="status === 'x'" class="mx-1" type="info">关停</el-tag>
  </span>
</template>

<script setup lang="ts">
defineProps({
  status: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="less">
/* Add any necessary styles here */
</style>
