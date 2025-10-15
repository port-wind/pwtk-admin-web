<template>
  <el-select
    v-model="innerValue"
    v-bind="$attrs"
    value-key="id"
    class="my-select"
    filterable
    remote
    placeholder="选择主办板块"
    clearable
    :remote-method="fetchData"
    :loading="loading"
    @change="handleChange"
    @clear="handleClear"
  >
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { reqHttp } from '@/api/bss/mainboardManagement'

interface IProps {
  modelValue: string
}

const props = defineProps<IProps>()
const emit = defineEmits<{
  (e: 'onSelect', value: string | undefined): void
  (e: 'onClear'): void
  (e: 'update:modelValue', value: string): void
}>()

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref(props.modelValue) // 组件内部的 v-model 绑定

interface IAllData {
  id: string
  value: string
  label: string
}

const fetchData = async (queryString?: string) => {
  loading.value = true
  try {
    const res1 = await reqHttp({
      page: 1,
      size: 1000,
      bbsId: 'websiteGames'
    })
    if (res1.success && res1.data && res1.data.list && res1.data.list.length > 0) {
      const data = res1.data.list.map((item) => ({
        id: item.mainboardId!,
        value: item.mainboardId!,
        label: item.mainbordName!
      }))
      loadAll.value = data
    } else {
      loadAll.value = []
    }
  } catch (error) {
    ElMessage.error('获取主板ID时出错')
  } finally {
    loading.value = false
  }
}

const handleClear = () => {
  emit('onClear')
}

const handleChange = (val) => {
  emit('onSelect', val)
}
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal
  }
)

// 同步外部传入的 v-model 数据
watch(
  () => innerValue.value,
  (newVal) => {
    emit('update:modelValue', newVal || '')
  }
)

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.my-select {
  width: 100%;
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
