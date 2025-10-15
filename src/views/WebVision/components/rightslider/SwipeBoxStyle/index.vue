<template>
  <div class="swipeStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>

    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="formData" :rules="Com_state.rules">
      <!-- 组件名称 -->
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="formData.componentName" />
      </el-form-item>
      <!-- 组件编码 -->
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="formData.pageCode" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select @change="changeModel" v-model="formData.model" placeholder="请选择模版">
          <el-option v-for="item in Com_state.modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="延迟时间" prop="duration" v-if="formData.otherAttrs">
        <el-input-number v-model="formData.otherAttrs.duration" :min="0" :max="100000"></el-input-number>
      </el-form-item>

      <div class="form-item-list" v-if="formData.model === 's1'">
        <div class="form-item-list-item" v-for="(item, index) in formData.swipeData" :key="index">
          <div class="form-item-list-item-text">
            <span>{{ index }}号:</span>
            <span>{{ item.alt }}</span>
          </div>
          <div class="form-item-list-item-btn">
            <el-button type="primary" @click="editItem(index)" :icon="Edit"></el-button>
            <el-button type="danger" @click="deleteItem(index)" :icon="Delete"></el-button>
          </div>
        </div>
        <el-button class="form-item-list-addBtn" type="primary" @click="addItem()" :icon="Plus"></el-button>
      </div>

      <div v-else-if="formData.model === 's2'">
        <section>
          <el-form-item label="每页数量" prop="option">
            <el-input-number v-model="formData.groupSize" :min="1" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="显示总条数" prop="total">
            <el-input-number v-model="formData.total" :min="1" :max="1000"></el-input-number>
          </el-form-item>
        </section>

        <div class="form-item-list">
          <div class="form-item-list-item" v-for="(item, index) in formData.swipeData" :key="index">
            <div class="form-item-list-item-text">
              <span>{{ item.index }}号:</span>
              <span>{{ item.alt }}</span>
            </div>
            <div class="form-item-list-item-btn">
              <el-button type="primary" @click="editItem(index)" :icon="Edit"></el-button>
              <el-button type="danger" @click="deleteItem(index)" :icon="Delete"></el-button>
            </div>
          </div>
          <el-button class="form-item-list-addBtn" type="primary" @click="addItem()" :icon="Plus"></el-button>
        </div>
      </div>

      <div class="form-item-list" v-else>
        <div class="form-item-list-item" v-for="(item, index) in formData.swipeData" :key="index">
          <div class="form-item-list-item-text">
            <span>{{ index }}号:</span>
            <span>{{ item.name }}</span>
          </div>
          <div class="form-item-list-item-btn">
            <el-button type="primary" @click="editItem(index)" :icon="Edit"></el-button>
            <el-button type="danger" @click="deleteItem(index)" :icon="Delete"></el-button>
          </div>
        </div>
        <el-button class="form-item-list-addBtn" type="primary" @click="addItem()" :icon="Plus"></el-button>
      </div>
    </el-form>

    <!-- 提交按钮 -->
    <el-button class="sub-btn" type="primary" @click="onSubmit">更新</el-button>

    <el-dialog v-model="dialogVisible" v-model:visible="dialogVisible" title="编辑广告" destroy-on-close width="50%">
      <el-form label-width="auto" :model="dialogForm" :rules="dialogFormRules" ref="dialogFormRef">
        <template v-if="formData.model === 's1' || formData.model === 's2'">
          <el-form-item v-if="formData.model === 's2'" label="排列顺序" prop="alt">
            <el-input-number v-model="dialogForm.index" :min="1" :max="100" />
          </el-form-item>

          <el-form-item label="图片上传" prop="image">
            <m-upload
              :uploadOption="uploadData"
              :show-file-list="true"
              :file-list="dialogForm.uploadList"
              @on-success="handleUploadSuccess"
              @on-remove="handleRemove"
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

          <el-form-item label="链接地址" prop="link">
            <el-input v-model="dialogForm.link" maxlength="200" />
          </el-form-item>

          <el-form-item label="图片描述" prop="alt">
            <el-input v-model="dialogForm.alt" maxlength="100" />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="标题" prop="name">
            <el-input v-model="dialogForm.name" maxlength="100" />
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-input type="textarea" v-model="dialogForm.content" />
          </el-form-item>
        </template>
        <!-- 其他表单项 -->
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDialogForm(dialogFormRef)">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { editSysComponent } from '@/api/webgw/sysCompent'
import { editTemplateComponent } from '@/api/webgw/template'
import { editWebsiteComponent } from '@/api/webgw/websit'
import { sessionCache } from '@/hooks/useSession'
import { webSiteStyle, swipeStyleForm } from '@/views/WebVision/type'
import { reactive, ref } from 'vue'
import { fileUploadOption } from '@/api/system/upload/types'
import type { UploadUserFile } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// import { Delete, Plus } from '@element-plus/icons-vue'
const dialogFormRef = ref<FormInstance>()
// 定义 props
const props = defineProps<{
  datas: webSiteStyle
}>()

const dialogVisible = ref(false)
const dialogForm = ref<{
  _index: number
  link: string
  alt: string
  name: string
  content: string
  index: number
  uploadList: UploadUserFile[]
}>({
  _index: 0,
  link: '',
  alt: '',
  name: '',
  content: '',
  index: 0,
  uploadList: []
})

// const uploadList = ref<UploadUserFile[]>([]) // 上传左边Logo
// 处理上传成功
//传成功

let configParamJson = {}
if (typeof props.datas.configParamJson === 'string') {
  configParamJson = JSON.parse(props.datas.configParamJson)
} else {
  configParamJson = props.datas.configParamJson
}

const editModel = ref(false)
// console.log('configParamJson', props.datas.configParamJson)
// console.log('configParamJson', configParamJson)
const uploadData: fileUploadOption = {
  fileType: 'img', // 提供一个默认值
  uploadFrom: 'webVision/img',
  storageStyle: 1
}

const Com_state = reactive({
  rules: {
    // 校验表单输入
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
    // model: [{ required: true, message: '请选择模版', trigger: 'change' }],
  },
  modelOptions: [
    { label: '模式 1', value: 's1' },
    { label: '模式 2', value: 's2' },
    { label: '模式 3', value: 's3' }
  ]
})

// 动态验证规则
const dialogFormRules = computed(() => {
  switch (formData.model) {
    case 's1':
      return {
        // image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        // alt: [{ required: true, message: '请输入图片描述', trigger: 'blur' }]
      }
    case 's2':
      return {
        // image: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        // index: [{ required: true, message: '请输入排列顺序', trigger: 'blur' }],
        // groupSize: [{ required: true, message: '请输入每页显示数量', trigger: 'blur' }],
        // total: [{ required: true, message: '请输入总数量', trigger: 'blur' }]
      }
    case 's3':
      return {
        // name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        // content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    default:
      return {} // 如果没有匹配的模式，返回空对象
  }
})

const addItem = () => {
  editModel.value = false
  formData.swipeData.push({
    // _index: formData.swipeData.length,
    link: '',
    alt: '',
    name: '',
    content: '',
    index: formData.swipeData.length + 1,
    uploadList: []
  })
}
const editItem = (index) => {
  // console.log('index', index)
  dialogVisible.value = true
  editModel.value = true
  const item = formData.swipeData[index]

  dialogForm.value = {
    _index: index,
    link: item.link || '', // Provide a default value
    alt: item.alt || '', // Provide a default value
    name: item.name || '', // Provide a default value
    content: item.content || '', // Provide a default value
    index: item.index || formData.swipeData.length,
    uploadList: item.uploadList || [] // Ensure uploadList is included
  }
  // console.log('dialogForm.value', dialogForm.value)
}

const deleteItem = (index: number) => {
  // formData.swipeData ? formData.swipeData.splice(index, 1) : configParamJson.swipeData.splice(index, 1)
  formData.swipeData.splice(index, 1)
}
// 处理上传成功
const handleUploadSuccess = (fileInfo) => {
  const {
    file: { name, uid },
    response: { path }
  } = fileInfo
  dialogForm.value.uploadList.push({
    name,
    url: path,
    uid
  })
}

const handleRemove = (file) => {
  dialogForm.value.uploadList = dialogForm.value.uploadList.filter((item) => item.uid !== file.uid)
}

const formData = reactive<swipeStyleForm>({
  componentName: props.datas.componentName,
  pageCode: props.datas?.pageCode,
  model: configParamJson.model ?? 's1',
  swipeData: configParamJson.swipeData ?? [],
  groupSize: configParamJson.groupSize,
  otherAttrs: configParamJson.otherAttrs,
  total: configParamJson.total
})

const changeModel = () => {
  const modelActions = {
    s1: () => {
      if (configParamJson.model === 's1') {
        formData.swipeData = configParamJson.swipeData
        formData.otherAttrs = configParamJson.otherAttrs
      } else {
        resetFormData()
      }
    },
    s2: () => {
      if (configParamJson.model === 's2') {
        formData.swipeData = configParamJson.swipeData
        formData.groupSize = configParamJson.groupSize
        formData.otherAttrs = configParamJson.otherAttrs
        formData.total = configParamJson.total
      } else {
        resetFormData(true)
      }
    },
    s3: () => {
      if (configParamJson.model === 's3') {
        formData.swipeData = configParamJson.swipeData
        formData.otherAttrs = configParamJson.otherAttrs
      } else {
        resetFormData()
      }
    }
  }

  const resetFormData = (includeGroupSize = false) => {
    formData.swipeData = []
    formData.otherAttrs = {
      duration: 500
    }
    if (includeGroupSize) {
      formData.groupSize = 0
      formData.total = 0
    }
  }

  const action = modelActions[formData.model]
  if (action) {
    action()
  }
}

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

const submitDialogForm = async (formEl: FormInstance | undefined) => {
  // 这里可以添加表单验证逻辑
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('fields', form.value)
      // console.log('isValid', valid)
      // 提交成功后，向 swipeData 数组中添加新数据
      if (editModel.value) {
        const index = dialogForm.value._index
        formData.swipeData[index] = { image: dialogForm.value.uploadList[0].url, ...dialogForm.value } // 更新现有条目
      } else {
        formData.swipeData?.push({
          image: dialogForm.value.uploadList[0].url,
          ...dialogForm.value
        })
      }

      // 清空新数据
      dialogForm.value._index = 0
      dialogForm.value.uploadList = []
      dialogForm.value.alt = ''
      dialogForm.value.link = ''
      dialogForm.value.name = ''
      dialogForm.value.content = ''
      dialogForm.value.index = 0

      // 关闭对话框
      dialogVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}

const buildConfigParamJson = () => {
  return JSON.stringify({
    model: formData.model ?? 's1',
    groupSize: formData?.groupSize ?? 1,
    total: formData.total ?? 1,
    otherAttrs: formData.otherAttrs ?? {},
    swipeData: formData.swipeData
  })
}
// 监听 isEditJSON 的变化 执行代码同步
watch(
  () => props.isEditJSON,
  // 当 isEditJSON 变化时执行的函
  (newVal) => {
    if (newVal) {
      // console.log('newVal', newVal)
      // 当 isEditJSON 从 true 变为 false 时调用 handleSubmitData
      props.datas.configParamJson = buildConfigParamJson()
    }
  }
)

const getUpdate = async () => {
  // 处理提交数据
  const configParamJson = buildConfigParamJson()

  // console.log(formData, 'configParamJson')
  // console.log(configParamJson, 'configParamJson')
  // return

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
.swipeStyle {
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

  // .lef {
  //   :deep(.el-form-item__label) {
  //     text-align: left;
  //   }
  // }

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
    overflow: auto;
    margin-bottom: 18px;
    // text-align: center;
    border: 1px solid #9da0a3;
    padding: 0.3rem;
    display: flex;
    align-items: center;

    .form-item-list-item {
      display: flex;
      flex-direction: column;
      // align-items: center;
      padding: 0.3rem;
      text-align: center;
      background-color: #2670b9;
      margin: 0 0.3rem;
      cursor: pointer;
      border: 1px solid #9da0a3;
      border-radius: 0.4rem;
      height: 4.5rem;

      .form-item-list-item-text {
        color: #f2f4f6;
        margin-bottom: 0.2rem;
      }
      .form-item-list-item-btn {
        display: flex;
      }
    }
    .form-item-list-addBtn {
      margin-top: 1rem;
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
