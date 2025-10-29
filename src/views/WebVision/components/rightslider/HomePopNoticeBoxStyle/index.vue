<template>
  <div class="home-pop-notice-box-style">
    <h2>{{ datas.componentType }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="state.rules" class="lef">
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="datas.componentName" />
      </el-form-item>
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.pageCode" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="datas.configParamJson.model" placeholder="请选择模版">
          <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="datas.configParamJson.title" placeholder="请输入公告标题" />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input type="textarea" v-model="datas.configParamJson.content" placeholder="请输入公告内容" :rows="4" />
      </el-form-item>
      <el-form-item label="样式风格" prop="style">
        <el-select v-model="datas.configParamJson.style" placeholder="请选择样式风格">
          <el-option v-for="item in styleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="显示图标">
        <el-switch v-model="datas.configParamJson.showIcon" />
      </el-form-item>
      <el-form-item label="显示时间">
        <el-switch v-model="datas.configParamJson.showTime" />
      </el-form-item>
      <el-form-item label="显示关闭按钮">
        <el-switch v-model="datas.configParamJson.showClose" />
      </el-form-item>
      <el-form-item label="自动关闭">
        <el-switch v-model="datas.configParamJson.autoClose" />
      </el-form-item>
      <el-form-item v-if="datas.configParamJson.autoClose" label="关闭延时(秒)" prop="duration">
        <el-input-number v-model="datas.configParamJson.duration" :min="1" :max="60" />
      </el-form-item>
    </el-form>
    <el-button class="sub-btn" type="primary" @click="onSubmit">更新</el-button>
  </div>
</template>

<script lang="ts" setup>
import { editSysComponent } from '@/api/webgw/sysCompent'
import { editTemplateComponent } from '@/api/webgw/template'
import { editWebsiteComponent } from '@/api/webgw/websit'
import { sessionCache } from '@/hooks/useSession'
import { reactive, ref, watch } from 'vue'

const props = defineProps<{
  datas: {
    componentId: string
    componentName: string
    componentType: string
    pageCode?: string
    configParamJson: {
      model?: string
      title?: string
      content?: string
      style?: string
      showIcon?: boolean
      showTime?: boolean
      showClose?: boolean
      autoClose?: boolean
      duration?: number
    }
  }
}>()

const modelOptions = ref([
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' }
])

const styleOptions = ref([
  { label: '默认样式', value: 'default' },
  { label: '警告样式', value: 'warning' },
  { label: '信息样式', value: 'info' },
  { label: '成功样式', value: 'success' }
])

const state = reactive({
  rules: {
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
  }
})

const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

watch(
  () => props.isEditJSON,
  (newVal) => {
    if (newVal === true) {
      props.datas.configParamJson = JSON.stringify({
        model: props.datas.configParamJson.model,
        title: props.datas.configParamJson.title,
        content: props.datas.configParamJson.content,
        style: props.datas.configParamJson.style,
        showIcon: props.datas.configParamJson.showIcon,
        showTime: props.datas.configParamJson.showTime,
        showClose: props.datas.configParamJson.showClose,
        autoClose: props.datas.configParamJson.autoClose,
        duration: props.datas.configParamJson.duration
      })
    }
  }
)

async function onSubmit() {
  const valid = ruleFormRef.value.validate((valid: boolean) => valid)
  if (!valid) return

  const configParamJson = JSON.stringify({
    model: props.datas.configParamJson.model,
    title: props.datas.configParamJson.title,
    content: props.datas.configParamJson.content,
    style: props.datas.configParamJson.style,
    showIcon: props.datas.configParamJson.showIcon,
    showTime: props.datas.configParamJson.showTime,
    showClose: props.datas.configParamJson.showClose,
    autoClose: props.datas.configParamJson.autoClose,
    duration: props.datas.configParamJson.duration
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
.home-pop-notice-box-style {
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

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
