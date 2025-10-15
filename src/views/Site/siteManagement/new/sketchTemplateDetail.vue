<script setup lang="ts">
import { reqSketchInfoByWebsiteId } from '@/api/site'
import { IReqSketchInfoByWebsiteIdData, IReqSketchInfoByWebsiteIdQueryParams } from '@/api/site/type'
import { optionsArea, optionsLang, optionsSketch } from '@/const/options'

interface IProps {
  websiteId: string
}
interface FormOptions {
  type: 'text' | 'spliceText'
  value: string
  label: string
  prop: string
  placeholder?: string
  textData?: TextData
  spliceTextData?: spliceTextData[]
  rules?: Rule[]
  attrs?: Attrs
}
interface Attrs {
  clearable?: boolean
}
interface TextData {
  isCopy: boolean
}
interface Rule {
  required: boolean
  message: string
  trigger: string
  min?: number
  max?: number
}
interface spliceTextData {
  prop: string
  displayType: 'text' | 'truncated' | 'other'
  showCopy?: boolean
}

const props = defineProps<IProps>()
const templateFormData = ref<IReqSketchInfoByWebsiteIdData>()
const templateOptions: FormOptions[] = [
  {
    type: 'text',
    value: '',
    label: '草图名称:',
    prop: 'sketchName'
  },
  {
    type: 'text',
    value: '',
    label: '草图代码:',
    prop: 'sketchCode'
  },
  {
    type: 'text',
    value: '',
    label: '草图类型:',
    prop: 'sketchType'
  },
  {
    type: 'text',
    value: '',
    label: '语言:',
    prop: 'langCodes'
  },
  {
    type: 'text',
    value: '',
    label: '地区:',
    prop: 'areaCodes'
  },
  {
    type: 'text',
    value: '',
    label: '备注:',
    prop: 'memo'
  }
]
const templateColumOption = {
  twoColum: 20,
  threeColum: 30
}
const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

const fetchData = async () => {
  if (props.websiteId) {
    const query: IReqSketchInfoByWebsiteIdQueryParams = {
      type: '1',
      websiteId: props.websiteId
    }
    const res = await reqSketchInfoByWebsiteId(query)
    if (res.success) {
      console.log('🚀 ~ fetchData ~ res:', res.data)
      templateFormData.value = res.data
      //@ts-ignore
      templateFormData.value.sketchType = optionsSketch.find((item) => item.value === res.data?.sketchType)?.label

      //@ts-ignore
      templateFormData.value.langCodes = res.data?.langCodes
        .map((lang) => {
          return optionsLang.find((l) => l.value === lang)?.label
        })
        .join(',')

      //@ts-ignore
      templateFormData.value.areaCodes = res.data?.areaCodes
        .map((code) => {
          return optionsArea.find((l) => l.value === code)?.label
        })
        .join(',')
    }
  }
}
watch(
  () => props.websiteId,
  () => {
    fetchData()
  }
)

onMounted(() => {
  fetchData()
})
</script>

<template>
  <m-form
    ref="formTemplateRef"
    :modelForm="templateFormData"
    :options="templateOptions"
    :commonSpan="16"
    :columnOption="templateColumOption"
    label-width="160"
    :rowAttrs="rowAttrs"
    class="dialog-form"
    style="justify-content: center"
  ></m-form>
</template>
