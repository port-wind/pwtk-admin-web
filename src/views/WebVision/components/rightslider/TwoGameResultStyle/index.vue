<template>
  <div class="noticestyle">
    <!-- 标题 -->
    <h2>{{ datas.componentType }}</h2>
    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="state.rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <StoreGameTypeList :datas="datas" />

      <el-form-item label="模版选择" prop="model">
        <el-select v-model="datas.configParamJson.model" placeholder="请选择模版">
          <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否展示" class="isShow">
        <div>
          <el-switch v-model="datas.configParamJson.isOpenTime" />
          开奖时间
        </div>
        <div>
          <el-switch v-model="datas.configParamJson.isHistory" />
          历史开奖
        </div>
        <div>
          <el-switch v-model="datas.configParamJson.isNextIssue" />
          下期开奖
        </div>
        <div>
          <el-switch v-model="datas.configParamJson.isIssue" />
          期数展示
        </div>
        <div>
          <el-switch v-model="datas.configParamJson.isIcon" />
          图标展示
        </div>
        <div>
          <el-switch v-model="datas.configParamJson.isLongName" />
          全名简名
        </div>
      </el-form-item>
      <el-form-item label="动图">
        <FileImageUpload
          v-model="datas.configParamJson.imageUrl"
          type="info"
          :upload-from="EUploadFrom.BBS_MAINBOARD_ICON"
          immediate
        />
      </el-form-item>
      <!-- 
      <el-form-item label="下期开奖">
        <el-switch v-model="datas.configParamJson.isNextIssue" />
      </el-form-item>
      <el-form-item label="期数展示">
        <el-switch v-model="datas.configParamJson.isIssue" />
      </el-form-item>
      <el-form-item label="图标展示">
        <el-switch v-model="datas.configParamJson.isIcon" />
      </el-form-item> -->
      <!-- <el-form-item label="全名简名">
        <el-switch v-model="datas.configParamJson.isLongName" />
      </el-form-item> -->
      <!-- <el-form-item label="展示彩种">
        <el-checkbox-group v-model="datas.configParamJson.showArray">
          <el-checkbox value="2032" title="a6">澳彩</el-checkbox>
          <el-checkbox value="1" title="hk6">港彩</el-checkbox>
          <el-checkbox value="6" title="kl8">快乐8</el-checkbox>
          <el-checkbox value="5" title="xa6">新澳彩</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
    </el-form>
    <!-- 提交按钮 -->
    <!-- <el-button class="sub-btn" type="primary" @click="onSubmit">更新</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import type { GameResultStyle } from '@/views/WebVision/type'
import { reactive, ref, defineComponent } from 'vue'
import { EUploadFrom } from '@/components/uploadImage/type'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
defineComponent({
  name: 'GameResultBox'
})
interface IProps {
  datas: GameResultStyle
}
// 定义 props
defineProps<IProps>()

const active = ref([])

const modelOptions = ref([
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' },
  { label: '模式 4', value: 's4' },
  { label: '模式 5', value: 's5' }
])
// console.log('props', props)
// 使用 reactive 定义响应式数据
const state = reactive({
  rules: {
    // 校验表单输入
    componentName: [
      // 页面名称
      { required: true, message: '请输入组件名称', trigger: 'blur' }
    ]
  }
  // modelOptions: [
  //   { label: '模式 1', value: 's1' },
  //   { label: '模式 2', value: 's2' },
  //   { label: '模式 3', value: 's3' }
  // ]
})

// 引用表单
const ruleFormRef = ref()
// const searchId = sessionCache.getCache('searchId')
// const pageModel = sessionCache.getCache('pageModel')
// 监听 isEditJSON 的变化 执行代码同步
// watch(
//   () => props.isEditJSON,
//   // 当 isEditJSON 变化时执行的函
//   (newVal) => {
//     if (newVal === true) {
//       // console.log('newVal', newVal)
//       // 当 isEditJSON 从 true 变为 false 时调用 handleSubmitData
//       props.datas.configParamJson = JSON.stringify({
//         model: props.datas.model,
//         isHistory: props.datas.isHistory,
//         isNextIssue: props.datas.isNextIssue,
//         isIssue: props.datas.isIssue,
//         isIcon: props.datas.isIcon,
//         isLongName: props.datas.isLongName,
//         showArray: props.datas.showArray
//       })
//     }
//   }
// )
// console.log('searchId', searchId)
// console.log('pageModel', pageModel)
// async function onSubmit() {
//   // 验证表单
//   const valid = ruleFormRef.value.validate((valid: boolean) => valid)
//   if (!valid) {
//     console.log('表单校验失败')
//     return
//   }
//   // 处理提交数据
//   const configParamJson = JSON.stringify({
//     model: props.datas.model,
//     isHistory: props.datas.isHistory,
//     isNextIssue: props.datas.isNextIssue,
//     isIssue: props.datas.isIssue,
//     isIcon: props.datas.isIcon,
//     isLongName: props.datas.isLongName,
//     showArray: props.datas.showArray
//   })

//   const baseParams = {
//     componentId: props.datas.componentId,
//     componentName: props.datas.componentName,
//     pageCode: props.datas?.pageCode,
//     configParamJson
//   }

//   let params: any = { ...baseParams }
//   let getAPI: Function

//   switch (pageModel) {
//     case 'templateMode':
//       getAPI = editTemplateComponent
//       params.templateId = searchId
//       break
//     case 'websiteMode':
//       getAPI = editWebsiteComponent
//       params.websiteId = searchId
//       break
//     case 'componentMode':
//       getAPI = editSysComponent
//       break
//     default:
//       console.error('Invalid pageModel:', pageModel)
//       return
//   }

//   try {
//     const response = await getAPI(params)
//     if (response && response.success) {
//       ElMessage({
//         showClose: true,
//         // message: response.errMessage,
//         message: '更新成功',
//         type: 'success'
//       })
//     } else {
//       ElMessage({
//         showClose: true,
//         message: response.errMessage,
//         type: 'error'
//       })
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error)
//   }
// }
</script>

<style scoped lang="less">
.noticestyle {
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

  /* 颜色选择器 */
  .picke {
    float: right;
  }
  .sub-btn {
    position: relative;
    left: 0;
    bottom: 0;
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
