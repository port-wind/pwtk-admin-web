<template>
  <el-select
    v-model="innerValue"
    v-bind="$attrs"
    class="my-select"
    filterable
    value-key="ip"
    placeholder="请选择IP"
    clearable
    @change="change"
    :loading="loading"
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
import { getIpTopList } from '@/api/user'
import type { IGetIpTopListData } from '@/api/user/type'

interface IProps {
  ip: string
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'on-select', value): void
}

const emit = defineEmits<IEmit>()
const rawData = ref<IGetIpTopListData[]>([])

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref(props.ip) // 组件内部的 v-model 绑定

interface IAllData {
  value: string
  label: string
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getIpTopList()
    // const result = mergeIssues(res[0])
    if (res.success && res?.data) {
      rawData.value = res.data
      // value: convertNumberToString(item.issue),
      const result = res.data.map((item) => {
        return {
          value: item.ip,
          label: item.city + ' ' + item.region + ' ' + item.ip
        }
      })
      loadAll.value = result
    } else {
      loadAll.value = []
    }
  } catch (error) {
    ElMessage.error('获取IP时出错')
  } finally {
    loading.value = false
  }
}

const change = (val, val2) => {
  const selected = rawData.value.find((item) => item.ip === val)
  emit('on-select', selected)
}

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData() // 如果搜索框为空，重新加载完整数据
  }
}

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
