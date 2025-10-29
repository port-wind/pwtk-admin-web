<script setup lang="ts">
interface IProps {
  modelValue: UserTag[]
}

interface UserTag {
  createTime: number
  flag: string
  state: string
  tagId: string
  tagName: string
}

const props = defineProps<IProps>()
</script>

<template>
  <div class="tag">
    <el-tag v-for="tag in props.modelValue" :key="tag.tagId" type="info" size="small">
      {{ tag.tagName }}
    </el-tag>
  </div>
</template>

<style lang="less" scoped>
.tag {
  display: flex;
  gap: 5px;
}
</style>
