<template>
  <div class="footer-bar-box-style">
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
      <el-form-item label="显示Logo">
        <el-switch v-model="datas.configParamJson.showLogo" />
      </el-form-item>
      <el-form-item v-if="datas.configParamJson.showLogo" label="Logo地址" prop="logoUrl">
        <el-input v-model="datas.configParamJson.logoUrl" placeholder="请输入Logo图片地址" />
      </el-form-item>
      <el-form-item label="显示链接">
        <el-switch v-model="datas.configParamJson.showLinks" />
      </el-form-item>
      <el-form-item label="显示版权">
        <el-switch v-model="datas.configParamJson.showCopyright" />
      </el-form-item>
      <el-form-item v-if="datas.configParamJson.showCopyright" label="版权文字" prop="copyrightText">
        <el-input v-model="datas.configParamJson.copyrightText" placeholder="请输入版权信息" />
      </el-form-item>
      <el-form-item label="显示联系方式">
        <el-switch v-model="datas.configParamJson.showContact" />
      </el-form-item>
      <div v-if="datas.configParamJson.showContact">
        <el-form-item label="客服电话" prop="phone">
          <el-input v-model="datas.configParamJson.phone" placeholder="请输入客服电话" />
        </el-form-item>
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="datas.configParamJson.email" placeholder="请输入邮箱地址" />
        </el-form-item>
      </div>
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
      showLogo?: boolean
      logoUrl?: string
      showLinks?: boolean
      showCopyright?: boolean
      copyrightText?: string
      showContact?: boolean
      phone?: string
      email?: string
    }
  }
}>()

const modelOptions = ref([
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' }
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
        showLogo: props.datas.configParamJson.showLogo,
        logoUrl: props.datas.configParamJson.logoUrl,
        showLinks: props.datas.configParamJson.showLinks,
        showCopyright: props.datas.configParamJson.showCopyright,
        copyrightText: props.datas.configParamJson.copyrightText,
        showContact: props.datas.configParamJson.showContact,
        phone: props.datas.configParamJson.phone,
        email: props.datas.configParamJson.email
      })
    }
  }
)

async function onSubmit() {
  const valid = ruleFormRef.value.validate((valid: boolean) => valid)
  if (!valid) return

  const configParamJson = JSON.stringify({
    model: props.datas.configParamJson.model,
    showLogo: props.datas.configParamJson.showLogo,
    logoUrl: props.datas.configParamJson.logoUrl,
    showLinks: props.datas.configParamJson.showLinks,
    showCopyright: props.datas.configParamJson.showCopyright,
    copyrightText: props.datas.configParamJson.copyrightText,
    showContact: props.datas.configParamJson.showContact,
    phone: props.datas.configParamJson.phone,
    email: props.datas.configParamJson.email
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
.footer-bar-box-style {
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
