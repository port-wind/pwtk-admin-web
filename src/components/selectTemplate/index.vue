<template>
  <el-select
    v-model="state"
    v-bind="$attrs"
    value-key="id"
    class="my-select"
    filterable
    remote
    placeholder="请选择模版名称"
    clearable
    :remote-method="fetchData"
    :loading="loading"
    @change="handleChange"
  >
    <el-option v-for="item in loadAll" :key="item.id" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { reqTemplateList } from '@/api/site'

interface IProps {
  modelValue: string
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref(props.modelValue)
interface IAllData {
  id: string
  value: string
  label: string
}

const fetchData = async (query: string) => {
  try {
    const res = await reqTemplateList({
      page: 1,
      size: 10000,
      templateName: query
    })
    if (res.success) {
      loadAll.value =
        res.data?.list.map((v) => {
          return {
            id: v.templateId,
            value: v.templateId,
            label: v.templateName
          }
        }) || []
    }
  } catch {}
}

// const querySearch = (queryString: string) => {
//   if (queryString.trim()) {
//     setTimeout(() => {
//       const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
//       loadAll.value = results.length ? results : []
//     }, 200)
//   } else {
//     fetchData(queryString) // 如果搜索框为空，重新加载完整数据
//   }
// }
// 同步外部传入的 v-model 数据
watch(
  () => state.value,
  (newVal) => {
    if (newVal === undefined) {
      emit('update:modelValue', '')
      return
    }
    emit('update:modelValue', newVal)
  }
)

const handleChange = (val: string) => {
  console.log('val1111', val)
}

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
    fetchData(newVal)
  }
)

onMounted(() => {
  fetchData(props.modelValue)
})
</script>

<style scoped>
.my-select {
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
