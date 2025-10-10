<template>
  <div class="navBarStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>

    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="Com_state.formData" :rules="Com_state.rules">
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

      <el-form-item label="显示条数" prop="pageSize">
        <el-input-number v-model="Com_state.formData.pageSize" :min="1" :max="30" />
      </el-form-item>

      <el-form-item label="模块标题" prop="title">
        <el-input v-model="Com_state.formData.title" />
      </el-form-item>

      <el-form-item label="列表类型" prop="listType">
        <el-select v-model="Com_state.formData.listType" placeholder="请选择模版">
          <el-option
            v-for="item in Com_state.listTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 根据选择的列表类型展示不同的模块 -->
      <div v-if="Com_state.formData.listType === 'BBS'">
        <el-form-item label="BBS ID" prop="bbsId">
          <el-input v-model="Com_state.formData.bbsId" placeholder="请输入BBS Id" maxlength="100" />
        </el-form-item>
        <!-- BBS 模块的具体内容 -->
      </div>

      <div v-else-if="Com_state.formData.listType === 'mainBoard'">
        <el-form-item label="主板 ID" prop="mainBoardId">
          <el-input v-model="Com_state.formData.mainBoardId" placeholder="请输入主板 Id" maxlength="100" />
        </el-form-item>
        <!-- 主板模块的具体内容 -->
      </div>

      <div v-else-if="Com_state.formData.listType === 'forum'">
        <el-form-item label="论坛 ID" prop="forumId">
          <el-input v-model="Com_state.formData.forumId" placeholder="请输入论坛 Id" maxlength="100" />
        </el-form-item>
        <!-- 论坛模块的具体内容 -->
      </div>

      <div v-else-if="Com_state.formData.listType === 'post'">
        <!-- <span>帖子默认为最新帖子列表</span> -->
        <el-form-item label="帖子 ID" prop="postId">
          <el-input v-model="Com_state.formData.postId" disabled placeholder="帖子默认为最新帖子列表" maxlength="100" />
        </el-form-item>
        <!-- 帖子模块的具体内容 -->
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
import type { navBBSListBoxStyle } from '@/views/WebVision/type'
import { reactive, ref } from 'vue'
// import { Delete, Plus } from '@element-plus/icons-vue'
// 定义 props
const props = defineProps<{
  datas: navBBSListBoxStyle
}>()

// 处理上传成功
//传成功
let configParamJson = {}
if (typeof props.datas.configParamJson === 'string') {
  configParamJson = JSON.parse(props.datas.configParamJson)
} else {
  configParamJson = props.datas.configParamJson
}

// console.log('configParamJson', props.datas.configParamJson)
// console.log('configParamJson', configParamJson)

const listType = computed(() => {
  if (configParamJson.bbsId) {
    return 'BBS'
  } else if (configParamJson.mainBoardId) {
    return 'mainBoard'
  } else if (configParamJson.forumId) {
    return 'forum'
  } else if (configParamJson.postId) {
    return 'post'
  }
  return null // 如果没有值，返回 null 或其他默认值
})

const Com_state = reactive({
  rules: {
    // 校验表单输入
    componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
    // model: [{ required: true, message: '请选择模版', trigger: 'change' }],
  },
  formData: {
    componentName: props.datas.componentName,
    pageCode: props.datas?.pageCode,
    model: configParamJson.model ?? 's1',
    listType: listType.value ?? 'BBS',
    pageSize: configParamJson.pageSize ?? 0,
    title: configParamJson.title ?? null,
    bbsId: configParamJson.bbsId ?? null,
    forumId: configParamJson.forumId ?? null,
    mainBoardId: configParamJson.bbsId ?? null,
    postId: configParamJson.postId ?? null,
    id: configParamJson.id ?? null,
    titleBg: configParamJson.titleBg ?? null,
    contentBgImg: configParamJson.contentBgImg ?? null
  },
  modelOptions: [
    { label: '模式 1', value: 's1' },
    { label: '模式 2', value: 's2' }
  ],
  listTypeOptions: [
    { label: 'BBS', value: 'BBS' },
    { label: '主板', value: 'mainBoard' },
    { label: '论坛', value: 'forum' },
    { label: '帖子', value: 'post' }
  ]
})

const getConfigParam = () => {
  const { listType, bbsId, forumId, mainBoardId, postId } = Com_state.formData
  switch (listType) {
    case 'BBS':
      return { bbsId, forumId: null, mainBoardId: null, postId: null }
    case 'mainBoard':
      return { bbsId: null, forumId: null, mainBoardId, postId: null }
    case 'forum':
      return { bbsId: null, forumId, mainBoardId: null, postId: null }
    case 'post':
      return { bbsId: null, forumId: null, mainBoardId: null, postId: '' }
    default:
      return { bbsId: null, forumId: null, mainBoardId: null, postId: null }
  }
}

// 引用表单
const ruleFormRef = ref()
const searchId = sessionCache.getCache('searchId')
const pageModel = sessionCache.getCache('pageModel')

const buildConfigParamJson = () => {
  const configParams = getConfigParam()
  return JSON.stringify({
    model: Com_state.formData.model ?? 's1',
    pageSize: Com_state.formData.pageSize ?? 0,
    title: Com_state.formData.title ?? null,
    // bbsId: Com_state.formData.bbsId ?? null,
    // forumId: Com_state.formData.forumId ?? null,
    // mainBoardId: Com_state.formData.bbsId ?? null,
    // postId: Com_state.formData.postId ?? null,
    id: Com_state.formData.id ?? null,
    titleBg: Com_state.formData.titleBg ?? null,
    contentBgImg: Com_state.formData.contentBgImg ?? null,
    ...configParams // 使用展开运算符合并对象
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
    overflow-y: auto;
    margin-bottom: 18px;
    text-align: center;
    border: 1px solid #9da0a3;
    .form-item-list-item {
      display: flex;
      justify-content: space-between;
      gap: 0.4rem;

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
