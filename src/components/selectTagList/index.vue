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
import { reqCustomerTags, type IReqCustomerTagsData, type IReqCustomerTagsQueryParams } from '@/api/user/customerTags'

interface IProps {
  modelValue: string
}

const props = defineProps<IProps>()

const emits = defineEmits(['update:modelValue'])
const rawData = ref<IReqCustomerTagsData[]>([])

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref('') // 组件内部的 v-model 绑定

interface IAllData {
  value: string
  label: string
}

const fetchData = async () => {
  loading.value = true
  try {
    const query: IReqCustomerTagsQueryParams = {
      page: 1,
      size: 200
    }
    const res = await reqCustomerTags(query)
    // const result = mergeIssues(res[0])
    if (res.success && res?.data) {
      rawData.value = res.data.list
      // value: convertNumberToString(item.issue),
      const result = res.data.list
        .filter((i) => i.flag === '内部标签')
        .map((item) => {
          return {
            value: item.tagId,
            label: item.tagName
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
  (newVal, oldVal) => {
    innerValue.value = newVal
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
