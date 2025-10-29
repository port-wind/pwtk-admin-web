<script setup lang="ts" name="TopNavBarStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/TopNavBar/type'
import { EUploadFrom } from '@/components/uploadImage/type'
interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const rules = ref({
  // componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
  // pageCode: [{ required: true, message: '请输入页面编码', trigger: 'blur' }]
})

const queryForm = ref({
  logo: ''
})
// const PUBLIC_CDN_URL = 'https://stt.pwtk.cc/'
// 定义 props 接收父组件传入的数据
const getFullUrl = (url: string, baseUrl: string): string => {
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}

const ruleFormRef = ref<FormInstance>()
</script>
<template>
  <div class="TopNavBarStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas.configParamJson" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="标题">
        <el-input v-model="datas.configParamJson.title" />
      </el-form-item>
      <el-form-item label="是否显示置顶按钮">
        <el-switch v-model="datas.configParamJson.isTop" />
      </el-form-item>
      <el-form-item label="Logo">
        <el-input v-model="datas.configParamJson.logo" class="logo-item" />
        <!-- <van-image
          v-if="datas.configParamJson.logo"
          class="top-nav-bar-logo"
          :src="getFullUrl(datas.configParamJson.logo, PUBLIC_CDN_URL)"
          :alt="datas.configParamJson.title"
        /> -->
        <FileImageUpload
          v-model="datas.configParamJson.logo"
          type="info"
          :upload-from="EUploadFrom.BBS_MAINBOARD_ICON"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.top-nav-bar-logo {
  border-radius: 5px;
  height: 64px;
  width: 64px;
  border: 1px dashed #ccc;
}

.logo-item {
  margin-bottom: 10px;
  // align-items: center;
  // justify-content: space-between;
}
</style>
