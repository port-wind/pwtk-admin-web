<script setup lang="ts">
import { addTypeToObjects, FormOptions } from '@/utils/dataFormat'
import { optionsLang } from '@/const/options'
import { listBlurTemplateWithUserInfo } from '@/api/site'
interface IProps {
  modelValue: any
  templateId?: string // 带过滤 如果传入默认加载存在的语言
  ownerUserId?: string // 带过滤
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

const fetchDataByOwnerId = async ({ ownerUserId, templateId }) => {
  const res = await listBlurTemplateWithUserInfo({
    templateId,
    ownerUserId
  })
  if (res?.data && res?.data[0] && res?.data[0].langCodes) {
    fetchData(res?.data[0].langCodes)
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
  }
)

watch(
  () => [props.ownerUserId, props.templateId],
  (newVal) => {
    if (newVal) {
      fetchDataByOwnerId({
        ownerUserId: newVal[0],
        templateId: newVal[1]
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
