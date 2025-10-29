<template>
  <el-autocomplete
    v-model="state"
    v-bind="$attrs"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="请输入..."
    clearable
    @clear="onClear"
    @select="handleSelect"
    @input="onInput"
  >
    <!--
   @input="inputChange"
    -->
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.label }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { searchPromotionCode } from '@/api/site'
import { ISearchPromotionCodeQueryParams } from '@/api/site/type'

interface IProps {
  modelValue: string | undefined
}
const props = defineProps<IProps>()

interface IEmit {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()
const refdom = ref()
const loadAll = ref<IAllData[]>([])
const state = ref<string | undefined>('')

interface IAllData {
  value: string
  label: string
  id: any
}

const defaultSuggest = (): Promise<IAllData[]> => {
  return searchPromotionCode({
    page: 1,
    size: 100
  }).then((response) => {
    let results: IAllData[] = []
    if (response.success && response.data) {
      results = response.data.list.map((item) => ({
        value: item.promotionCode,
        label: item.nickname + ' - ' + item.promotionCode,
        id: item.userId
      }))
      return results
    }
    return results
  })
}

const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb(loadAll.value)
    return
  }

  try {
    const query: ISearchPromotionCodeQueryParams = {
      page: 1,
      size: 100,
      promotionCode: queryString
    }
    const response = await searchPromotionCode(query)
    if (response.success && response.data) {
      const results = response.data.list.map((item) => ({
        value: item.promotionCode,
        label: item.nickname + ' - ' + item.promotionCode,
        id: item.userId
      }))
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    ElMessage.error('获取邀请码时出错')
    cb([])
  }
}

const handleSelect = (item: IAllData) => {
  emit('update:modelValue', item.value)
}

const onClear = (evt) => {
  refdom.value.focus()
  emit('update:modelValue', '')
}

const fetchData = async () => {
  const result = await defaultSuggest()
  loadAll.value = result
}
const onInput = (val) => {
  state.value = val
  emit('update:modelValue', val)
}

onMounted(() => {
  fetchData()
})

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
