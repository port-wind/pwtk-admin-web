<template>
  <el-autocomplete
    v-model="state"
    v-bind="$attrs"
    ref="refdom"
    :fetch-suggestions="querySearch"
    placeholder="请输入..."
    @input="onInput"
  >
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.year }} - {{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import service from '@/service/index'
interface IProps {
  gameType: string
  modelValue: string //issue
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'onSelect', value: IAllData | null): void
  (e: 'update:modelValue', value: string): void
}

const emits = defineEmits<IEmit>()
const refdom = ref()
const loadAll = ref<IAllData[]>([])
const state = ref<string>()

interface IAllData {
  value: string
  issue: string
  issueShort: string
  year: string
  label: string
}
const gameKey = { '2032': 'a6', '1': 'hk6', '3995': 'sg6', '84': 'tw6', '5': 'xa6', '6': 'kl8' }

function mergeIssues(data) {
  if (data.length < 2) {
    return data[0]?.issues.map((issue) => ({ ...issue, year: data[0]?.year })) || []
  }

  const firstGroup = data[0]
  const secondGroup = data[1]

  let mergedIssues = firstGroup.issues.map((issue) => ({ ...issue, year: firstGroup.year }))

  if (mergedIssues.length < 12) {
    const neededCount = 12 - mergedIssues.length
    const additionalIssues = secondGroup.issues
      .slice(0, neededCount)
      .map((issue) => ({ ...issue, year: secondGroup.year }))
    mergedIssues = [...mergedIssues, ...additionalIssues]
  }
  return mergedIssues
}

const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  const results = queryString ? loadAll.value.filter(createFilter(queryString)) : loadAll.value
  cb(results)
}
const createFilter = (queryString: string) => {
  return (issueList: IAllData) => {
    try {
      return issueList?.value?.toLowerCase().includes(queryString?.toLowerCase())
    } catch (error) {
      console.error(error)
    }
  }
}
function convertNumberToString(value) {
  return typeof value === 'number' ? value.toString() : value
}

const fetchData = async () => {
  if (props.gameType) {
    try {
      const res = await service.kv().getRecentYearsIssueList(gameKey[props.gameType]).do()
      const result = mergeIssues(res[0])
      if (result) {
        const data = result.flatMap((item) => {
          return {
            ...item,
            issue: convertNumberToString(item.issue),
            value: convertNumberToString(item.issue),
            label: item.issue,
            year: convertNumberToString(item.year)
          }
        })
        loadAll.value = data
        state.value = data[0].value
        emits('update:modelValue', data[0].value)
      } else {
        loadAll.value = []
      }
    } catch (error) {
      ElMessage.error('获取issue时出错')
    }
  }
}

onMounted(() => {
  fetchData()
})

const onInput = (value) => {
  emits('update:modelValue', value)
}

watch(
  () => props.gameType,
  async (newVal) => {
    if (newVal) {
      await fetchData()
    } else {
      loadAll.value = []
    }
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
  }
)
</script>

<style>
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
