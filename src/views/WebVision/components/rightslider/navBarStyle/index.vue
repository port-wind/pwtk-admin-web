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
      <el-form-item label="自定义" prop="tabsAttr">
        <el-input type="textarea" v-model="Com_state.formData.tabsAttr" placeholder="自定义属性"></el-input>
      </el-form-item>
      <p class="nav-item-title">导航列表</p>
      <div class="form-item-list">
        <div v-for="(item, index) in Com_state.formData.itemData" :key="index" class="form-item-list-item">
          <el-form-item label="名称" :prop="`itemData.${index}.name`">
            <el-input v-model="item.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="ID" :prop="`itemData.${index}.id`">
            <el-input v-model="item.id" placeholder="请输入ID"></el-input>
          </el-form-item>

          <el-button class="del-btn" type="danger" :icon="Delete" circle @click="removeItem(index)" />
        </div>
        <el-button type="primary" :icon="Plus" circle @click="addItem" />
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
import { Delete, Plus } from '@element-plus/icons-vue'

// 定义 props
const props = defineProps<{
  datas: NavBarStyle
}>()

// console.log('props', props.datas)
// console.log('props', JSON.parse(props.datas.configParamJson))

// const modelOptions = ref([
//   { label: '模式 1', value: 's1' },
//   { label: '模式 2', value: 's2' },
//   { label: '模式 3', value: 's3' }
// ])
// console.log('props', props)
// 使用 reactive 定义响应式数据

// const itemData = reactive([])

// 添加新项目的方法
const addItem = () => {
  Com_state.formData.itemData.push({ name: '', id: '' })
}

// 删除项目的方法
const removeItem = (index: number) => {
  Com_state.formData.itemData.splice(index, 1)
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
    model: [{ required: true, message: '请选择模版', trigger: 'change' }],
    itemData: {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      id: [{ required: true, message: '请输入ID', trigger: 'blur' }]
    }
  },
  formData: {
    ...props.datas,
    ...configParamJson,
    tabsAttr: JSON.stringify(configParamJson.tabsAttr)
  },
  modelOptions: [{ label: '模式 1', value: 's1' }]
})

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')
// 监听 isEditJSON 的变化 执行代码同步
watch(
  () => props.isEditJSON,
  // 当 isEditJSON 变化时执行的函
  (newVal) => {
    if (newVal === true) {
      // console.log('newVal', newVal)
      // 当 isEditJSON 从 true 变为 false 时调用 handleSubmitData
      props.datas.configParamJson = JSON.stringify({
        model: Com_state.formData.model,
        tabsAttr: Com_state.formData.tabsAttr,
        itemData: Com_state.formData.itemData
      })
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
  const configParamJson = JSON.stringify({
    model: Com_state.formData.model,
    tabsAttr: Com_state.formData.tabsAttr,
    itemData: Com_state.formData.itemData
  })

  // console.log(Com_state.formData.itemData, 'itemData')

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
  .nav-item-title {
    margin-bottom: 0.4rem;
  }
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
