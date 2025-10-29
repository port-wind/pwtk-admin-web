<template>
  <el-select
    v-model="innerValue"
    v-bind="$attrs"
    class="my-select"
    value-key="tagId"
    filterable
    placeholder="用户标签"
    clearable
    :remote-method="querySearch"
    @change="change"
    :loading="loading"
    style="width: 160px"
  >
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="label">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getFormattedVideoTagList } from '@/api/video/index'

interface IProps {
  modelValue: string
}

const props = defineProps<IProps>()

const emits = defineEmits(['update:modelValue'])
interface IAllData {
  value: string
  label: string
}
const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref('') // 组件内部的 v-model 绑定

const fetchData = async () => {
  loading.value = true
  try {
    const result = await getFormattedVideoTagList()
    loadAll.value = result
  } catch (error) {
    ElMessage.error('获取视频标签时出错')
    loadAll.value = []
  } finally {
    loading.value = false
  }
}

const change = (val, _) => {
  emits('update:modelValue', val)
}

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.label.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData() // 如果搜索框为空，重新加载完整数据
  }
}

watch(
  () => props.modelValue,
  (newVal, _) => {
    innerValue.value = newVal
  }
)

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.my-select {
  width: 100%;
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
:deep(.el-select__wrapper) {
  width: 160px !important;
}
</style>
