<template>
  <el-autocomplete
    v-bind="$attrs"
    v-model="state"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="搜索草图模版..."
    clearable
    @clear="onClear"
    @input="inputChange"
    @select="handleSelect"
  >
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.label }} - {{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { reqGetALLSketchList } from '@/api/site'

interface IProps {
  modelValue: string | undefined
  ownerUserId?: string | undefined
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])
const refdom = ref()
const loadAll = ref<IAllData[]>([])
const state = ref<string | undefined>(props.modelValue)

interface IAllData {
  value: string
  label: string
  all: string
}

const defaultSuggest = (): Promise<IAllData[]> => {
  return reqGetALLSketchList({}).then((response) => {
    let results: IAllData[] = []
    if (response.success && response.data) {
      results = response.data!.map(({ sketchCode, sketchName }) => ({
        value: sketchCode,
        label: sketchName,
        all: sketchCode + ' | ' + sketchName
      }))
      return results
    }
    return results
  })
}

const createFilter = (queryString: string) => {
  return (item: IAllData) => {
    return item.all.toLowerCase().includes(queryString.toLowerCase())
  }
}

const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb(loadAll.value)
    return
  }

  try {
    const response = await reqGetALLSketchList()

    if (response.success && response.data) {
      const results = response.data
        .map(({ sketchCode, sketchName }) => ({
          value: sketchCode,
          label: sketchName,
          all: sketchCode + '|' + sketchName
        }))
        .filter(createFilter(queryString))

      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    ElMessage.error('获取模版id时出错')
    cb([])
  }
}

const handleSelect = (item: IAllData) => {
  state.value = item.value
  emit('update:modelValue', item.value)
}
const onClear = (evt) => {
  refdom.value.focus()
  emit('update:modelValue', '')
}
const inputChange = (val) => {
  state.value = val
  emit('update:modelValue', val)
}

const fetchData = async () => {
  const result = await defaultSuggest()
  loadAll.value = result
}

watch(
  () => props.modelValue,
  (newValue) => {
    state.value = newValue
  }
)

onMounted(() => {
  fetchData()
})
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
