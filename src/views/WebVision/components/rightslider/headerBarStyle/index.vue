<template>
  <div class="navBarStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>

    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="Com_state.formData" :rules="Com_state.rules" class="lef">
      <!-- 组件名称 -->
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="Com_state.formData.componentName" />
      </el-form-item>
      <!-- 组件编码 -->
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="Com_state.formData.pageCode" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="Com_state.formData.model" placeholder="请选择模版">
          <el-option v-for="item in Com_state.modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="主题" prop="theme">
        <!-- 颜色选择器 -->
        <el-form-item label="主要色" prop="primary">
          <el-color-picker
            v-model="Com_state.formData.theme.primary"
            show-alpha
            class="picke"
            :predefine="Com_state.predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="次要色" prop="secondary">
          <el-color-picker
            v-model="Com_state.formData.theme.secondary"
            show-alpha
            class="picke"
            :predefine="Com_state.predefineColors"
          ></el-color-picker>
        </el-form-item>
        <el-form-item label="渐变方式" prop="gradient">
          <el-select v-model="Com_state.formData.gradient" placeholder="请选择渐变方式">
            <el-option label="从上到下" value="to bottom"></el-option>
            <el-option label="从左到右" value="to right"></el-option>
            <el-option label="从下到上" value="to top"></el-option>
            <el-option label="从右到左" value="to left"></el-option>
            <el-option label="左上右下" value="to top right,"></el-option>
            <el-option label="右下左上" value="to bottom left"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>

      <el-form-item label="属性设置" prop="Attr">
        <!-- 颜色选择器 -->
        <el-form-item label="是否吸顶" prop="sticky">
          <el-switch v-model="Com_state.formData.Attr.sticky" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>

        <el-form-item label="吸顶偏移" prop="offsetTop">
          <el-input-number
            v-model="Com_state.formData.Attr.offsetTop"
            controls-position="right"
            :min="0"
            :max="1000"
            :step="1"
          ></el-input-number>
        </el-form-item>
      </el-form-item>

      <div class="form-container">
        <el-form-item label="背景色" prop="bgColor" class="lef">
          <!-- 颜色选择器 -->
          <el-color-picker
            v-model="Com_state.formData.bgColor"
            show-alpha
            class="picke"
            :predefine="Com_state.predefineColors"
          ></el-color-picker>
        </el-form-item>

        <el-form-item label="文字颜色" prop="textColor" class="lef">
          <!-- 颜色选择器 -->
          <el-color-picker
            v-model="Com_state.formData.textColor"
            show-alpha
            class="picke"
            :predefine="Com_state.predefineColors"
          ></el-color-picker>
        </el-form-item>

        <el-form-item label="左边图片" prop="logoSrc">
          <m-upload
            :uploadOption="uploadData"
            :show-file-list="true"
            :file-list="leftImgList"
            @on-success="handleLeftUploadSuccess"
            @on-remove="handleLeftRemove"
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

        <el-form-item label="中间图片" prop="middleSrc">
          <m-upload
            :uploadOption="uploadData"
            :show-file-list="true"
            :file-list="middleImgList"
            @on-success="handleMidUploadSuccess"
            @on-remove="handleLeftRemove"
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
import type { NavBarStyle } from '@/views/WebVision/type'
import { reactive, ref } from 'vue'
import type { fileUploadOption } from '@/api/system/upload/types'
import mUpload from '@/components/mUpload/index.vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
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
const leftImgList = ref<UploadUserFile[]>([]) // 上传左边Logo
const middleImgList = ref<UploadUserFile[]>([]) // 上传中间Logo

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
  Com_state.formData.bgImg = path
}

const handleBGRemove = (file) => {
  backList.value = backList.value.filter((item) => item.uid !== file.uid)
  Com_state.formData.bgImg = ''
}
// 处理上传成功
const handleLeftUploadSuccess = (fileInfo) => {
  const {
    file: { name },
    file: { uid },
    response: { path }
  } = fileInfo
  // console.log('文件路径:', path)
  leftImgList.value = [
    {
      name: name,
      url: path,
      uid: uid
    }
  ]
  Com_state.formData.logoSrc = path
}

const handleLeftRemove = (file) => {
  leftImgList.value = leftImgList.value.filter((item) => item.uid !== file.uid)
  Com_state.formData.logoSrc = ''
}
// 处理上传成功
const handleMidUploadSuccess = (fileInfo) => {
  const {
    file: { name },
    file: { uid },
    response: { path }
  } = fileInfo
  // console.log('文件路径:', path)
  middleImgList.value = [
    {
      name: name,
      url: path,
      uid: uid
    }
  ]
  Com_state.formData.middleSrc = path
}

const handleMidRemove = (file) => {
  middleImgList.value = middleImgList.value.filter((item) => item.uid !== file.uid)
  Com_state.formData.middleSrc = ''
}

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
    logoSrc: [{ required: true, message: '请上Logo', trigger: 'blur' }]
    // model: [{ required: true, message: '请选择模版', trigger: 'change' }],
  },
  formData: {
    ...props.datas,
    ...configParamJson,
    Attr: {
      sticky: configParamJson?.Attr?.sticky ?? false,
      offsetTop: configParamJson?.Attr?.offsetTop ?? 0
    }
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

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

const buildConfigParamJson = () => {
  return JSON.stringify({
    model: Com_state.formData.model ?? 's1',
    logoSrc: Com_state.formData.logoSrc,
    middleSrc: Com_state.formData.middleSrc,
    bgImg: Com_state.formData.bgImg,
    bgColor: Com_state.formData.bgColor,
    textColor: Com_state.formData.textColor,
    theme: {
      primary: Com_state.formData?.theme?.primary,
      secondary: Com_state.formData?.theme?.secondary,
      gradient: Com_state.formData?.theme?.gradient
    },
    Attr: {
      sticky: Com_state.formData?.Attr?.sticky,
      offsetTop: Com_state.formData?.Attr?.offsetTop
    }
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

const getUpdate = async () => {
  // 处理提交数据
  const configParamJson = buildConfigParamJson()

  // console.log(Com_state.formData, 'configParamJson')
  // console.log(configParamJson, 'configParamJson')
  // return

  const baseParams = {
    componentId: props.datas.componentId,
    componentName: Com_state.formData.componentName,
    pageCode: Com_state.formData.pageCode,
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
  // 例如，更新某些状态或调用 API
}

// console.log('searchId', searchId)
// console.log('pageModel', pageModel)
async function onSubmit() {
  try {
    const valid = await ruleFormRef.value.validate()
    if (valid) {
      getUpdate()
    }
  } catch (error) {
    console.log('表单验证失败', error)
  }
}
</script>

<style scoped lang="less">
.navBarStyle {
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
