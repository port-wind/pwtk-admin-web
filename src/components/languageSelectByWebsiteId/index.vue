<script setup lang="ts">
import { addTypeToObjects, FormOptions } from '@/utils/dataFormat'
import { optionsLang } from '@/const/options'
import { listBlurTemplateWithUserInfo } from '@/api/site'
import { GetLangCodes } from '@/api/site/domain'
interface IProps {
  modelValue: any
  websiteId?: string // 带过滤 如果传入默认加载存在的语言
}
const props = defineProps<IProps>()
const state = ref(props.modelValue)
const emits = defineEmits(['update:modelValue'])

const langRange = ref<FormOptions[]>([])

const fetchData = (filter?: string[]) => {
  if (filter) {
    langRange.value = addTypeToObjects(optionsLang, 'option').filter((item) => {
      return filter?.includes(item.value)
    })
    return
  }
  langRange.value = addTypeToObjects(optionsLang, 'option')
}
const onChange = (value) => {
  emits('update:modelValue', value)
}

const fetchDataByOwnerId = async ({ websiteId }) => {
  const res = await GetLangCodes({
    websiteId
  })
  if (res?.data && res?.data.websiteLangCodes) {
    fetchData(res?.data.websiteLangCodes)
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
    <el-option v-for="item in langRange" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<style lang="less" scoped></style>
