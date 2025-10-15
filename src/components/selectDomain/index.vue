<template>
  <el-select
    v-model="innerValue"
    v-bind="$attrs"
    value-key="id"
    class="my-select"
    filterable
    remote
    placeholder="域名"
    clearable
    :remote-method="querySearch"
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
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { type IQueryDomainConfigBbsAndNavigaData, queryDomainConfigBbsAndNaviga } from '@/api/site/nav/index'

const rawData = ref<IQueryDomainConfigBbsAndNavigaData[]>([])
const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref('') // 组件内部的 v-model 绑定

interface IAllData {
  id: string
  value: string
  label: string
}

const fetchData = async (queryString: string) => {
  loading.value = true
  try {
    const res = await queryDomainConfigBbsAndNaviga({
      domain: queryString
    })
    // const result = mergeIssues(res[0])
    if (res.success && res?.data) {
      rawData.value = res.data
      // value: convertNumberToString(item.issue),
      const result = res.data.map((item) => {
        return {
          id: item.domain,
          value: item.domain,
          label: item.domain
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

const querySearch = async (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    await fetchData(queryString)
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData('') // 如果搜索框为空，重新加载完整数据
  }
}

onMounted(() => {
  fetchData('')
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
