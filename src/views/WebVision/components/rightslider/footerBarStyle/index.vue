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

      <el-form-item label="背景色" prop="bgColor">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="formData.bgColor"
          show-alpha
          class="picke"
          :predefine="Com_state.predefineColors"
        ></el-color-picker>
      </el-form-item>

      <el-form-item label="文字颜色" prop="textColor">
        <!-- 颜色选择器 -->
        <el-color-picker
          v-model="formData.textColor"
          show-alpha
          class="picke"
          :predefine="Com_state.predefineColors"
        ></el-color-picker>
      </el-form-item>

      <el-form-item label="背景图片" prop="bgImg">
        <m-upload
          :uploadOption="uploadData"
          :show-file-list="true"
          :file-list="backList"
          @on-success="handleBGUploadSuccess"
          @on-remove="handleBGRemove"
          list-type="picture-card"
          :limit="1"
        >
          <template #uploadArea>
            <el-icon>
              <Plus />
            </el-icon>
          </template>
        </m-upload>
      </el-form-item>

      <div class="form-item-list">
        <template v-for="(footer, index) in formData.footerInfo" :key="index">
          <div class="form-item-list-item">
            <div class="form-item-list-item-top">
              <el-form-item :label="'是否富文本 ' + (index + 1)" :prop="'footerInfo.' + index + '.isRichText'">
                <el-switch v-model="footer.isRichText" active-value="y" inactive-value="n" />
              </el-form-item>
              <el-button type="danger" @click="removeFooter(index)" :icon="Delete"></el-button>
            </div>
            <el-form-item
              class="form-item-list-item-textarea"
              :label="'内容 ' + (index + 1)"
              :prop="'footerInfo.' + index + '.content'"
            >
              <el-input type="textarea" v-model="footer.content" placeholder="请输入内容" />
            </el-form-item>
          </div>
        </template>
        <el-button type="primary" class="form-item-list-addBtn" @click="addFooter" :icon="Plus"></el-button>
      </div>
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
import { NavBarStyle } from '@/views/WebVision/type'
import { reactive, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { fileUploadOption } from '@/api/system/upload/types'
import { UploadUserFile } from 'element-plus'

// 定义 props
const props = defineProps<{
  datas: NavBarStyle
}>()

const uploadData: fileUploadOption = {
  fileType: 'img', // 提供一个默认值
  uploadFrom: 'webVision/img',
  storageStyle: 1
}

const backList = ref<UploadUserFile[]>([]) // 上传背景图片

// 添加新项目的方法
let configParamJson = {}
if (typeof props.datas.configParamJson === 'string') {
  configParamJson = JSON.parse(props.datas.configParamJson)
} else {
  configParamJson = props.datas.configParamJson
}
// console.log('configParamJson', props.datas.configParamJson)
// console.log('configParamJson', configParamJson.tabsAttr)

// 处理上传成功
const handleBGUploadSuccess = (fileInfo) => {
  const {
    file: { name },
    file: { uid },
    response: { path }
  } = fileInfo
  // console.log('文件路径:', path)
  backList.value = [
    {
      name: name,
      url: path,
      uid: uid
    }
  ]
  formData.bgImg = path
}

const handleBGRemove = (file) => {
  backList.value = backList.value.filter((item) => item.uid !== file.uid)
  formData.bgImg = ''
}

const Com_state = reactive({
  rules: {
    // 校验表单输入
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
    model: [{ required: true, message: '请选择模版', trigger: 'change' }],
    title: [{ required: true, message: '请选择显示数量', trigger: 'blur' }]

    // content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
  },
  modelOptions: [{ label: '模式 1', value: 's1' }],
  predefineColors: [
    // 颜色选择器预设
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    '#409EFF',
    '#909399',
    '#C0C4CC',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577'
  ]
})

const formData = reactive({
  componentName: props.datas.componentName,
  pageCode: props.datas?.pageCode,
  model: configParamJson.model,
  bgColor: configParamJson.bgColor,
  bgImg: configParamJson.bgImg,
  textColor: configParamJson.textColor,
  footerInfo: configParamJson.footerInfo
})

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

const buildConfigParamJson = () => {
  return JSON.stringify({
    model: formData.model,
    bgColor: formData.bgColor,
    bgImg: formData.bgImg,
    textColor: formData.textColor,
    footerInfo: formData.footerInfo
  })
}

// 新增模块的方法
const addFooter = () => {
  formData.footerInfo.push({
    content: '',
    isRichText: 'n'
  })
}

// 删除模块的方法
const removeFooter = (index) => {
  formData.footerInfo.splice(index, 1)
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

  // console.log('Com_state.formData.itemData', formData)
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

  .picke {
    float: right;
  }
  .sub-btn {
    position: relative;
    left: 0;
    bottom: 0;
  }

  .form-item-list {
    height: 20rem;
    overflow-y: auto;
    margin-bottom: 18px;
    text-align: left;
    border: 1px solid #9da0a3;
    padding: 0.2rem;
    text-align: center;
    .form-item-list-item {
      margin: 0.3rem 0;
      border: 1px solid #9da0a3;
      padding: 0.2rem;
      // display: flex;
      // flex-wrap: wrap;
      // flex-direction: column;
      // justify-content: flex-start;
      .form-item-list-item-top {
        display: flex;
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
