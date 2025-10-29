<template>
  <el-autocomplete
    v-bind="$attrs"
    v-model="state"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="请输入..."
    clearable
    @clear="onClear"
    @select="handleSelect"
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
import { onMounted, ref } from 'vue'
import { type IReqSetWebSiteListIdQueryParams, reqSetWebSiteListId } from '@/api/site/index'

interface IProps {
  ownerUserId: string
}
const props = defineProps<IProps>()

const userId = computed(() => props.ownerUserId)

interface IEmit {
  (e: 'onSelect', value: IAllData | null): void
}
const emit = defineEmits<IEmit>()
const refdom = ref()
const loadAll = ref<IAllData[]>([])
const state = ref<string>('')

interface IAllData {
  value: string
  label?: string
  all?: string
}

const defaultSuggest = (): Promise<IAllData[]> => {
  if (props.ownerUserId) {
    return reqSetWebSiteListId({
      ownerUserId: props.ownerUserId
    }).then((response) => {
      let results: IAllData[] = []
      if (response.success && response.data) {
        results = response.data!.map((val) => ({
          value: val.websiteId,
          label: val.websiteInnerName,
          all: val.websiteId + ' ' + val.websiteInnerName
        }))
        return results
      }
      return results
    })
  } else {
    return Promise.reject()
  }
}

const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb(loadAll.value)
    return
  }
  try {
    if (props.ownerUserId) {
      const query: IReqSetWebSiteListIdQueryParams = {
        ownerUserId: props.ownerUserId
      }
      const response = await reqSetWebSiteListId(query)
      if (response.success && response.data) {
        const results = response.data.map((val) => ({
          value: val.websiteId,
          label: val.websiteInnerName,
          all: val.websiteId + ' ' + val.websiteInnerName
        }))
        console.log('🚀 ~ results ~ results:', results)
        cb(results)
      } else {
        cb([])
      }
    }
  } catch (error) {
    ElMessage.error('获取绑定站点id时出错')
    cb([])
  }
}

const onChange = () => {}

const handleSelect = (item: IAllData) => {
  emit('onSelect', item)
}
const onClear = (evt) => {
  refdom.value.focus()
  emit('onSelect', null)
}

const fetchData = async () => {
  const result = await defaultSuggest()
  loadAll.value = result
}

onMounted(() => {
  fetchData()
})

watch(
  () => props.ownerUserId,
  (newVal, oldVal) => {
    fetchData()
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
