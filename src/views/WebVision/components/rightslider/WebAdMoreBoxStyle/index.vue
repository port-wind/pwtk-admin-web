<template>
  <div class="web-ad-more-box-style">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>

    <!-- 配置表单 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="state.rules" class="lef">
      <!-- 组件名称 -->
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="datas.componentName" />
      </el-form-item>

      <!-- 组件编码 -->
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.pageCode" />
      </el-form-item>

      <!-- 模版选择 -->
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="datas.configParamJson.model" placeholder="请选择模版">
          <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 标题设置 -->
      <el-form-item label="模块标题" prop="title">
        <el-input v-model="datas.configParamJson.title" placeholder="请输入模块标题" />
      </el-form-item>

      <!-- 每页显示数量 -->
      <el-form-item label="每页显示数量" prop="pageSize">
        <el-input-number v-model="datas.configParamJson.pageSize" :min="1" :max="20" />
      </el-form-item>

      <!-- 显示分页 -->
      <el-form-item label="显示分页">
        <el-switch v-model="datas.configParamJson.showPagination" />
      </el-form-item>

      <!-- 广告类型 -->
      <el-form-item label="广告类型" prop="adType">
        <el-select v-model="datas.configParamJson.adType" placeholder="请选择广告类型">
          <el-option v-for="item in adTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
import { reactive, ref, watch } from 'vue'

// 定义 props
const props = defineProps<{
  datas: {
    componentId: string
    componentName: string
    componentType: string
    pageCode?: string
    configParamJson: {
      model?: string
      title?: string
      pageSize?: number
      showPagination?: boolean
      adType?: string
    }
  }
}>()

const modelOptions = ref([
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' }
])

const adTypeOptions = ref([
  { label: '横幅广告', value: 'banner' },
  { label: '方形广告', value: 'square' },
  { label: '视频广告', value: 'video' },
  { label: '文字广告', value: 'text' }
])

// 使用 reactive 定义响应式数据
const state = reactive({
  rules: {
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
  }
})

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

// 监听 isEditJSON 的变化 执行代码同步
watch(
  () => props.isEditJSON,
  (newVal) => {
    if (newVal === true) {
      props.datas.configParamJson = JSON.stringify({
        model: props.datas.configParamJson.model,
        title: props.datas.configParamJson.title,
        pageSize: props.datas.configParamJson.pageSize,
        showPagination: props.datas.configParamJson.showPagination,
        adType: props.datas.configParamJson.adType
      })
    }
  }
)

async function onSubmit() {
  // 验证表单
  const valid = ruleFormRef.value.validate((valid: boolean) => valid)
  if (!valid) {
    console.log('表单校验失败')
    return
  }

  // 处理提交数据
  const configParamJson = JSON.stringify({
    model: props.datas.configParamJson.model,
    title: props.datas.configParamJson.title,
    pageSize: props.datas.configParamJson.pageSize,
    showPagination: props.datas.configParamJson.showPagination,
    adType: props.datas.configParamJson.adType
  })

  const baseParams = {
    componentId: props.datas.componentId,
    componentName: props.datas.componentName,
    pageCode: props.datas?.pageCode,
    configParamJson
  }

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

<style scoped lang="scss">
.web-ad-more-box-style {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;

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

  .sub-btn {
    position: relative;
    left: 0;
    bottom: 0;
  }
}
</style>
