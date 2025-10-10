<template>
  <el-autocomplete
    v-model="state"
    v-bind="$attrs"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="站点ID"
    clearable
    @input="onInput"
    @change="onChange"
  >
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { type ISelectIdAndNameQueryParams, selectIdAndName } from '@/api/user/index'

interface IProps {
  isSubOnly?: boolean
  modelValue: string | undefined
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'onSelect', value: IAllData | null): void
  (e: 'update:modelValue', value: string): void
}

const emits = defineEmits<IEmit>()
const refdom = ref()
const currentSelect = ref<IAllData | null>()
const loadAll = ref<IAllData[]>([])
const state = ref<string | undefined>('')

interface IAllData {
  value: string
  label: string
}

const defaultSuggest = (): Promise<IAllData[]> => {
  return selectIdAndName({}).then((response) => {
    let results: IAllData[] = []
    if (response.success && response.data) {
      results = response.data.map((item) => ({
        value: item,
        label: item
      }))
      return results
    }
    return results
  })
}

const querySearch = (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb(loadAll.value)
    return
  }
  try {
    const query: ISelectIdAndNameQueryParams = {
      websiteId: queryString
    }
    selectIdAndName(query).then((res) => {
      if (res.success && res.data) {
        const results = res.data.map((item) => ({
          value: item,
          label: item
        }))
        cb(results)
      } else {
        cb([])
      }
    })
  } catch (error) {
    ElMessage.error('获取websiteId 时出错')
    cb([])
  }
}

const fetchData = async () => {
  const result = await defaultSuggest()
  loadAll.value = result
}

onMounted(() => {
  fetchData()
})

const onInput = (value) => {
  // / 只保留数字字符
  const numericValue = value.trim().replace(/[^0-9]/g, '')
  state.value = numericValue
  emits('update:modelValue', numericValue)
}

const onChange = (value) => {
  const numericValue = value.replace(/[^0-9]/g, '')
  state.value = numericValue
  emits('update:modelValue', numericValue)
}

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    state.value = newVal
  }
)
</script>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
