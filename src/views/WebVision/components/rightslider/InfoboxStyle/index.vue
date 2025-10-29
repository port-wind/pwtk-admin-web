<script setup lang="ts" name="InfoboxStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/Infobox/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()
</script>
<template>
  <div class="InfoboxStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="第一行文本" prop="line1">
        <el-input v-model="datas.configParamJson.line1" placeholder="请输入第一行内容" />
      </el-form-item>

      <el-form-item label="第二行文本" prop="line2">
        <el-input v-model="datas.configParamJson.line2" placeholder="请输入第二行内容" />
      </el-form-item>

      <el-form-item label="第三行文本" prop="line3">
        <el-input v-model="datas.configParamJson.line3" placeholder="请输入第三行内容" />
      </el-form-item>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleJSON.backgroundColor" />
      </el-form-item>
      <el-form-item label="文字颜色" prop="textColor">
        <el-color-picker v-model="datas.configParamJson.styleJSON.textColor" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
