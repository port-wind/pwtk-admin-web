<template>
  <div class="webAdStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <el-form-item label="标题名称" prop="title">
        <el-input v-model="datas.configParamJson.title" />
      </el-form-item>
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.configParamJson.pageCode" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="datas.configParamJson.model" placeholder="请选择模版">
          <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="列数" prop="columns">
        <el-input-number v-model="datas.configParamJson.columns" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="总数" prop="total">
        <el-input-number v-model="datas.configParamJson.total" :min="1" :max="100" />
      </el-form-item>
      <el-form-item label="点击反馈" prop="gridAttr.clickable">
        <el-switch v-model="datas.configParamJson.gridAttr.clickable" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="WebAdBoxStyle">
import { reactive, ref } from 'vue'

interface NavBarStyle {
  componentId: string
  componentName: string
  componentRef: string
  componentSort: string
  componentType: string
  configParamJson: {
    componentType: string
    componentName: string
    pageCode: string
    model: string
    title: string
    columns: number
    total: number
    gridAttr: {
      clickable: boolean
    }
  }
  isView: string
  memo: string
  pageCode: string
  pageRenderingSeq: number
  sketchCodeList: string
  status: string
  templateId: string
  websiteId: string
}

// 定义 props
const props = defineProps<{
  datas: NavBarStyle
}>()

// 添加新项目的方法
console.log('🚀 ----> webadboxstyle~HHHHHHHHH props.datas:', props.datas)
console.log('🚀 ----> webadboxstyle~88888899999 props.datas:', props.datas.configParamJson)

// let configParamJson = {}
// if (typeof props.datas.configParamJson === 'string') {
//   configParamJson = JSON.parse(props.datas.configParamJson)
// } else {
//   configParamJson = props.datas.configParamJson
// }

// const Com_state = reactive({
const rules = ref({
  // 校验表单输入
  // componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
  // model: [{ required: true, message: '请选择模版', trigger: 'change' }]
})

const modelOptions = [
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' }
]

const formData = reactive({
  componentName: null,
  pageCode: null,
  model: null,
  title: null,
  columns: null,
  total: null,
  gridAttr: null
})

// 引用表单
const ruleFormRef = ref()
// const searchId = sessionCache.getCache('searchId')
// const pageModel = sessionCache.getCache('pageModel')

const buildConfigParamJson = () => {
  return JSON.stringify({
    model: formData.model,
    title: formData.title,
    columns: formData.columns,
    total: formData.total,
    gridAttr: formData.gridAttr
  })
}
</script>

<style scoped lang="scss">
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
