<script setup lang="ts" name="ImageCardStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/ImageCard/type'
import { EUploadFrom } from '@/components/uploadImage/type'
import FileImageUpload from '@/components/FileImageUpload/index.vue'
interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})

const ruleFormRef = ref<FormInstance>()
</script>
<template>
  <div class="ImageCardStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="上传图片" prop="imageUrl">
        <FileImageUpload
          v-model="datas.configParamJson.imageUrl"
          type="info"
          :upload-from="EUploadFrom.BBS_MAINBOARD_ICON"
        />
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input v-model="datas.configParamJson.link" placeholder="请输入跳转链接" />
      </el-form-item>
      <el-form-item label="图片高度" prop="height">
        <el-switch
          v-model="datas.configParamJson.imageStyleJSON.enableHeight"
          :active-value="true"
          :inactive-value="false"
        />
        <el-input-number
          :disabled="!datas.configParamJson.imageStyleJSON.enableHeight"
          v-model="datas.configParamJson.imageStyleJSON.height"
          :min="1"
          placeholder="请输入高度"
        />
        <span style="margin-left: 10px">px</span>
      </el-form-item>
      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number
          v-model="datas.configParamJson.imageStyleJSON.borderRadius"
          :min="0"
          placeholder="请输入圆角"
        />
        <span style="margin-left: 10px">px</span>
      </el-form-item>
      <el-form-item label="是否显示" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          :disabled="!datas.configParamJson.enable"
          v-model="datas.configParamJson.title"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          :disabled="!datas.configParamJson.enable"
          v-model="datas.configParamJson.description"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
