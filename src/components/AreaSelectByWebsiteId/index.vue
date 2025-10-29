<script setup lang="ts">
import { addTypeToObjects, FormOptions } from '@/utils/dataFormat'
import { optionsArea } from '@/const/options'
import { GetAreaCodes } from '@/api/site/domain'
interface IProps {
  modelValue: any
  websiteId?: string // 带过滤 如果传入默认加载存在的语言
}
const props = defineProps<IProps>()
const state = ref(props.modelValue)
const emits = defineEmits(['update:modelValue'])

const areaRange = ref<FormOptions[]>([])

const fetchData = (filter?: string[]) => {
  if (filter) {
    areaRange.value = addTypeToObjects(optionsArea, 'option').filter((item) => {
      return filter?.includes(item.value)
    })
    return
  }
  areaRange.value = addTypeToObjects(optionsArea, 'option')
}
const onChange = (value) => {
  emits('update:modelValue', value)
}

const fetchDataByOwnerId = async ({ websiteId }) => {
  const res = await GetAreaCodes({
    websiteId
  })
  if (res?.data && res?.data.websiteAreaCodes) {
    fetchData(res?.data.websiteAreaCodes)
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
  }
)

watch(
  () => props.websiteId,
  (newVal) => {
    if (newVal) {
      fetchDataByOwnerId({
        websiteId: newVal
      })
    }
  }
)

onMounted(() => {
  fetchData()
})
</script>

<template>
  <el-select multiple placeholder="语言" v-model="state" v-bind="$attrs" @change="onChange" clearable>
    <el-option v-for="item in areaRange" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<style lang="less" scoped></style>
