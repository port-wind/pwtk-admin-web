<script setup lang="ts">
import { reqClientTemplateInfoByWebsiteId } from '@/api/site'
import { IReqClientTemplateInfoByWebsiteIdData, IReqClientTemplateInfoByWebsiteIdQueryParams } from '@/api/site/type'
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
const templateFormData = ref<IReqClientTemplateInfoByWebsiteIdData>()
const templateOptions: FormOptions[] = [
  {
    type: 'spliceText',
    value: '',
    label: '模板名称 | ID:',
    prop: 'templateName',
    placeholder: '站点名称 | ID',
    spliceTextData: [
      {
        prop: 'templateName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'templateId',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  {
    type: 'text',
    value: '',
    label: '主题:',
    prop: 'theme',
    placeholder: '主题',
    attrs: {
      clearable: true
    }
  },
  {
    type: 'spliceText',
    value: '',
    label: '模板草图名称 | 代码:',
    prop: 'sketchName',
    placeholder: '站点名称 | ID',
    spliceTextData: [
      {
        prop: 'sketchName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'sketchCode',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  {
    type: 'spliceText',
    value: '',
    label: '系统模板名称 | ID:',
    prop: 'templateName',
    placeholder: '系统模板名称 | ID',
    spliceTextData: [
      {
        prop: 'sysTemplateRefName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'sysTemplateRef',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  // {
  //   type: 'text',
  //   value: '',
  //   label: 'CDN地址:',
  //   prop: 'cdnUrl',
  //   placeholder: 'CDN地址',
  //   rules: [
  //     {
  //       required: false,
  //       message: 'CDN地址不能为空',
  //       trigger: 'blur'
  //     }
  //   ],
  //   attrs: {
  //     clearable: true
  //   }
  // },
  {
    type: 'text',
    value: '',
    label: '在线客服代码:',
    prop: 'onlineServiceCode',
    placeholder: '在线客服代码',
    rules: [
      {
        required: false,
        message: '在线客服代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '统计代码链接:',
    prop: 'statsCodeJsUrl',
    placeholder: '统计代码链接',
    rules: [
      {
        required: false,
        message: '统计代码链接不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '备注:',
    prop: 'memo',
    placeholder: '备注',
    rules: [
      {
        required: false,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
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
    const query: IReqClientTemplateInfoByWebsiteIdQueryParams = {
      type: '1',
      websiteId: props.websiteId
    }
    const res = await reqClientTemplateInfoByWebsiteId(query)
    if (res.success) {
      templateFormData.value = res.data
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

<style lang="less" scoped></style>
