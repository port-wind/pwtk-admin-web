<template>
  <div class="website-wrapper">
    <h2>{{ datas.componentType }}</h2>
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" class="demo-form-inline">
      <!-- 组件ID -->
      <el-form-item class="componentId" prop="componentId">
        <el-input v-model="form.componentId" />
      </el-form-item>

      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="form.pageCode" />
      </el-form-item>
      <!-- JSON数据 -->
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { ComponentStyle } from '@/views/WebVision/type'
import _, { cloneDeep, sum } from 'lodash-es'
import { editTemplateComponent } from '@/api/webgw/template/index'
import { editWebsiteComponent } from '@/api/webgw/websit/index'

const ruleFormRef = ref<FormInstance>()
// 接收 props
const props = defineProps({
  datas: { type: Object as PropType<ComponentStyle>, required: true },
  pageModel: { type: String }
})
// 定义表单数据
const form = ref({ ...props.datas })

// watch(
//   () => props.datas,
//   (newVal) => {
//     form.value = newVal
//   },
//   { deep: true }
// )
interface RuleForm {
  componentName: string
  configParamJson: string
}
const rules = reactive<FormRules<RuleForm>>({
  configParamJson: [
    { required: true, message: '请输入json数据', trigger: 'blur' },
    { min: 3, max: 5000, message: '不能小于3个字符，不能大于5000个字符', trigger: 'blur' }
  ]
})
const emit = defineEmits(['submitPage'])
// 提交方法
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('fields', form.value)
      // console.log('fields', fields)
      // console.log('submit!')
      // emit('submitPage', form.value)
      handleSubmit()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// const jsonInput = ref('') // 输入的 JSON 字符串
// const jsonOutput = ref('') // 格式化后的 JSON 输出

// 提交 数据
const handleSubmit = async () => {
  let getAPI: any
  switch (props.pageModel) {
    case 'templateMode':
      //模版
      getAPI = editTemplateComponent
      break
    case 'websiteMode':
      //站点
      getAPI = editWebsiteComponent
      break

    default:
      break
  }
  try {
    const param = cloneDeep(form.value)
    const response = await getAPI({
      ...param
    })
    if (response && response.success) {
      // console.log('response', response)
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'success'
      })
      emit('submitPage', form.value)
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
</script>

<style scoped lang="less">
.website-wrapper {
  width: 100%;
  left: 0;
  top: 0;
  padding: 0;
  box-sizing: border-box;
  .demo-form-inline {
    display: none;
  }
  .componentId {
    display: none;
  }
  /* 标题 */
  h2 {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
}
</style>
