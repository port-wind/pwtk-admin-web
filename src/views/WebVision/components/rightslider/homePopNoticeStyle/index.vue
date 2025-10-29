<template>
  <div class="webAdStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>

    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="Com_state.rules" class="lef">
      <!-- 组件名称 -->
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="formData.componentName" />
      </el-form-item>
      <!-- 组件编码 -->
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="formData.pageCode" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="formData.model" placeholder="请选择模版">
          <el-option v-for="item in Com_state.modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="标题名称" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>

      <el-form-item label="公告内容" prop="content">
        <el-input type="textarea" aria-placeholder="公告内容（富文本形式）" v-model="formData.content" />
      </el-form-item>
    </el-form>

    <!-- 提交按钮 -->
    <el-button class="sub-btn" type="primary" @click="onSubmit">更新</el-button>
  </div>
</template>

<script lang="ts" setup>
import { editSysComponent } from '@/api/webgw/sysCompent'
import { editTemplateComponent } from '@/api/webgw/template'
import { editWebsiteComponent } from '@/api/webgw/websit'
import { sessionCache } from '@/hooks/useSession'
import type { NavBarStyle } from '@/views/WebVision/type'
import { reactive, ref } from 'vue'

// 定义 props
const props = defineProps<{
  datas: NavBarStyle
}>()

let configParamJson = {}
if (typeof props.datas.configParamJson === 'string') {
  configParamJson = JSON.parse(props.datas.configParamJson)
} else {
  configParamJson = props.datas.configParamJson
}

const Com_state = reactive({
  rules: {
    // 校验表单输入
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
    model: [{ required: true, message: '请选择模版', trigger: 'change' }],
    title: [{ required: true, message: '请选择显示数量', trigger: 'blur' }],
    content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
  },
  modelOptions: [{ label: '模式 1', value: 's1' }]
})

const formData = reactive({
  componentName: props.datas.componentName,
  pageCode: props.datas?.pageCode,
  model: configParamJson.model,
  title: configParamJson.title,
  content: configParamJson.content
})

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

const buildConfigParamJson = () => {
  return JSON.stringify({
    model: formData.model,
    title: formData.title,
    content: formData.content
  })
}

// 监听 isEditJSON 的变化 执行代码同步
watch(
  () => props.isEditJSON,
  // 当 isEditJSON 变化时执行的函
  (newVal) => {
    if (newVal === true) {
      // console.log('newVal', newVal)
      // 当 isEditJSON 从 true 变为 false 时调用 handleSubmitData
      props.datas.configParamJson = buildConfigParamJson()
    }
  }
)
// console.log('searchId', searchId)
// console.log('pageModel', pageModel)
async function onSubmit() {
  // 验证表单
  const valid = ruleFormRef.value.validate((valid: boolean) => valid)
  if (!valid) {
    console.log('表单校验失败')
    return
  }
  // 处理提交数据
  const configParamJson = buildConfigParamJson()

  // console.log(Com_state.formData.itemData, 'itemData')

  const baseParams = {
    componentId: props.datas.componentId,
    componentName: formData.componentName,
    pageCode: formData.pageCode,
    configParamJson
  }
  // console.log('baseParams', baseParams)
  // return

  let params: any = { ...baseParams }
  let getAPI: Function

  switch (pageModel) {
    case 'templateMode':
      getAPI = editTemplateComponent
      params.templateId = searchId
      break
    case 'websiteMode':
      getAPI = editWebsiteComponent
      params.websiteId = searchId
      break
    case 'componentMode':
      getAPI = editSysComponent
      break
    default:
      console.error('Invalid pageModel:', pageModel)
      return
  }

  try {
    const response = await getAPI(params)
    if (response && response.success) {
      ElMessage({
        showClose: true,
        // message: response.errMessage,
        message: '更新成功',
        type: 'success'
      })
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
.webAdStyle {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* 标题 */
  h2 {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  .picke {
    float: right;
  }
  .sub-btn {
    position: relative;
    left: 0;
    bottom: 0;
  }

  .form-item-list {
    height: 8rem;
    overflow-y: auto;
    margin-bottom: 18px;
    text-align: center;
    border: 1px solid #9da0a3;
    .form-item-list-item {
      display: flex;
      justify-content: space-between;
      .del-btn {
        cursor: pointer;
        margin-left: 1rem;
      }
    }
  }
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 控制元素之间的间距 */
}

.el-form-item {
  flex: 1 1 200px; /* 控制每个元素的宽度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
