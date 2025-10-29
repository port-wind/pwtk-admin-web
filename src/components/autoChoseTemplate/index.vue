<template>
  <el-autocomplete
    v-bind="$attrs"
    v-model.trim="state"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="请输入..."
    clearable
    @clear="onClear"
    @select="handleSelect"
    @change="inputChange"
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
import { listBlurTemplateWithUserInfo } from '@/api/site'
import { IListBlurTemplateWithUserInfoQueryParams } from '@/api/site/type'

interface IProps {
  modelValue: string | undefined
  ownerUserId?: string | undefined
  select?: boolean
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])
const refdom = ref()
const loadAll = ref<IAllData[]>([])
const afterSearchLoadAll = ref<IAllData[]>([])
const state = ref<string | undefined>(props.modelValue)

interface IAllData {
  value: string
  label: string
  all: string
  templateId: string
  sketchCode: string
  langCodes: string[]
  areaCodes: string[]
}

const userId = computed(() => props?.ownerUserId || '')

const defaultSuggest = (querySearch: string = ''): Promise<IAllData[]> => {
  return listBlurTemplateWithUserInfo({
    templateId: querySearch,
    ownerUserId: userId.value
  })
    .then((response) => {
      let results: IAllData[] = []
      if (response.success && response.data) {
        results = response.data!.map(({ templateName, templateId, ...rest }) => ({
          value: templateId,
          label: templateName,
          all: templateId + ' ' + templateName,
          templateId: templateId,
          templateName: templateName,
          ...rest
        }))
        return results
      }
      return results
    })
    .catch((error) => {
      console.error('获取模版id时出错', error)
      return []
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
    const query: IListBlurTemplateWithUserInfoQueryParams = {
      templateId: queryString,
      ownerUserId: props?.ownerUserId
    }
    const response = await listBlurTemplateWithUserInfo(query)
    if (response.success && response.data) {
      const results = response.data
        .map(({ templateName, templateId, ...rest }) => ({
          value: templateId,
          label: templateName,
          all: templateId + ' | ' + templateName,
          templateId: templateId,
          templateName: templateName,
          ...rest
        }))
        .filter(createFilter(queryString))

      afterSearchLoadAll.value = results

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

const inputChange = (value) => {
  if (props.select) {
    const res = afterSearchLoadAll.value.find((item) => item.value === value)
    if (res && state.value) {
      state.value = value
      emit('update:modelValue', value.trim())
    } else {
      console.info('当前无匹配的信息')
      emit('update:modelValue', '')
    }
  } else {
    // 随意搜索,打开这个
    state.value = value
    emit('update:modelValue', value.trim())
  }
}

const fetchData = (querySearch?: string) => {
  defaultSuggest(querySearch).then((res) => {
    loadAll.value = res
  })
}

watch(
  () => [props.modelValue, props?.ownerUserId],
  (newValue) => {
    state.value = newValue[0]
    fetchData(newValue[0])
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
