<template>
  <!-- JSON 编辑模式 共通页面  -->
  <div class="custommodulestyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules">
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="datas.componentName" />
      </el-form-item>
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.pageCode" />
      </el-form-item>
      <!-- 组件名称 -->
      <!-- <el-form-item label="标题内容">
        <el-input v-model="datas.name" placeholder="请输入标题" show-word-limit />
      </el-form-item> -->
      <!-- JSON数据 -->
      <el-form-item label="JSON数据" prop="jsonData">
        <writeJSON v-if="datas?.configParamJson" v-model="datas.configParamJson" />
        <!-- <pre>
          {{ datas.configParamJson }}
        </pre>
        <el-input v-model="currentConfigParamJson" :rows="22" type="textarea" placeholder="请输入 JSON 格式数据" /> -->
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item label=" ">
        <!-- <el-button type="primary" @click="onSubmit(ruleFormRef)">更新</el-button> -->
        <el-button type="default" @click="formatJson" @mousedown.prevent>格式化</el-button>
        <el-button type="default" @click="toolShow()">html工具</el-button>
      </el-form-item>
    </el-form>

    <ToolPop v-model="dialogVisible" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { JSONComponentStyle } from '@/views/WebVision/type'
import { attempt, isError } from 'lodash-es'
import { editTemplateComponent } from '@/api/webgw/template/index'
import { editWebsiteComponent } from '@/api/webgw/websit/index'
import { editSysComponent } from '@/api/webgw/sysCompent/index'
import { sessionCache } from '@/hooks/useSession'
import writeJSON from './writeJson.vue'
import ToolPop from './components/ToolPop.vue'

interface IProps {
  datas: any
}

const props = defineProps<IProps>()

const emits = defineEmits(['update'])

interface RuleForm {
  componentName: string
  configParamJson: string
}
const rules = reactive<FormRules<RuleForm>>({
  componentName: [{ required: true, message: '请输入组件名' }],
  configParamJson: [
    { required: true, message: '请输入json数据', trigger: 'blur' },
    { min: 3, max: 5000, message: '不能小于3个字符，不能大于5000个字符', trigger: 'blur' }
  ]
})

const currentConfigParamJson = ref('')
const configParamJson = computed(() => {
  props.datas
})
const onSubmit = (formEl: FormInstance | undefined) => {
  emits('update', props.datas)
}

const ruleFormRef = ref<FormInstance>()
// // 接收 props

// const dialogVisible = ref(false)
const dialogVisible = ref(false)
const toolShow = () => {
  dialogVisible.value = true
}

// // 定义表单数据
// const form = ref({ ...props.datas })
// watch(
//   () => props.datas,
//   (NewSetStyle) => {
//     emits('update', NewSetStyle)
//   },
//   { deep: true }
// )

// const emit = defineEmits(['submitJson'])
// console.log('123123123',props.datas)
// // 提交方法
// const onSubmit = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       // console.log('fields', form.value)
//       // console.log('fields', fields)
//       // console.log('submit!')
//       handleSubmit()
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
// const searchId = sessionCache.getCache('searchId')
// const handleSubmit = async () => {
//   let getAPI: any
//   let params = {}
//   // console.log('props.pageModel', props.pageModel)
//   switch (props.pageModel) {
//     case 'templateMode':
//       //模版
//       getAPI = editTemplateComponent
//       params = {
//         componentId: props.datas.componentId,
//         componentName: props.datas.componentName,
//         pageCode: props.datas?.pageCode,
//         templateId: searchId,
//         configParamJson: props.datas.configParamJson
//         // ...form.value
//       }
//       break
//     case 'websiteMode':
//       //站点
//       getAPI = editWebsiteComponent
//       params = {
//         componentId: props.datas.componentId,
//         componentName: props.datas.componentName,
//         pageCode: props.datas?.pageCode,
//         websiteId: searchId,
//         configParamJson: props.datas.configParamJson
//         // ...form.value
//       }
//       break
//     case 'componentMode':
//       //组件
//       getAPI = editSysComponent
//       params = {
//         componentId: props.datas.componentId,
//         componentName: props.datas.componentName,
//         pageCode: props.datas?.pageCode,
//         configParamJson: props.datas.configParamJson
//         // ...form.value
//       }
//       break
//   }

//   // console.log('form.value', params)
//   // return
//   try {
//     const response = await getAPI({
//       ...params
//     })
//     if (response && response.success) {
//       // console.log('response', response)
//       ElMessage({
//         showClose: true,
//         message: response.errMessage,
//         type: 'success'
//       })
//       emit('submitJson', response.data)
//     } else {
//       ElMessage({
//         showClose: true,
//         message: response.errMessage,
//         type: 'error'
//       })
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)
//   }
// }
// // const jsonInput = ref('') // 输入的 JSON 字符串
// // const jsonOutput = ref('') // 格式化后的 JSON 输出

// 格式化 JSON 输入
const formatJson = () => {
  if (!props.datas.configParamJson) return
  const result = attempt(JSON.parse, props.datas.configParamJson)
  if (isError(result)) {
    ElMessage.error('JSON 格式无效，保持原样')
    // 如果解析失败，保持原样
    return
  }
  // 解析成功，格式化 JSON
  // props.datas.configParamJson = JSON.stringify(result, null, 2)
  props.datas.configParamJson = JSON.stringify(result, null, 2)
  // ElMessage.success('JSON 格式化成功')
}

// // const cancelFormat = (str: string) => {
// //   // 将格式化的JSON转换为一行
// //   const jsonObj = JSON.parse(str)
// //   return JSON.stringify(jsonObj)
// // }

// // 提交 JSON 数据
// // const handleSubmit = () => {
// //   try {
// //     jsonOutput.value = JSON.parse(jsonInput.value)
// //     ElMessage.success('JSON 数据已成功提交')
// //   } catch (error) {
// //     ElMessage.error('提交失败，输入的内容不是有效的 JSON 格式')
// //   }
// // }
</script>

<style scoped lang="less">
.custommodulestyle {
  width: 100%;
  left: 0;
  top: 0;
  padding: 0;
  box-sizing: border-box;
  .componentId,
  .websiteId {
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
