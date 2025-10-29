<script setup lang="ts" name="headerTitle">
import type { IHeaderTitle } from './type'

interface IProps {
  datas: {
    configParamJson: IHeaderTitle
  }
}
const props = defineProps<IProps>()
const datas = ref(props.datas)
</script>

<template>
  <div>
    <el-form-item v-if="datas.configParamJson.titlePrefix" label="标题前缀" prop="titlePrefix">
      <el-input v-model="datas.configParamJson.titlePrefix" placeholder="标题前缀" />
    </el-form-item>
    <el-form-item label="header标题" prop="title">
      <el-input v-model="datas.configParamJson.title" placeholder="header标题" />
    </el-form-item>
    <el-form-item label="sub标题" prop="subtitle">
      <el-input v-model="datas.configParamJson.subtitle" placeholder="sub标题" />
    </el-form-item>
    <el-divider content-position="left">Header样式配置</el-divider>
    <el-row>
      <el-col :span="12">
        <el-form-item label="标题颜色" prop="titleColor">
          <el-color-picker v-model="datas.configParamJson.styleHeader.titleColor" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="子标题颜色" prop="subTitleColor">
          <el-color-picker v-model="datas.configParamJson.styleHeader.subTitleColor" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单色/渐变" prop="borderRadius">
          <el-switch v-model="datas.configParamJson.styleHeader.isGradient" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="头部背景色" prop="headerBgColor">
          <el-color-picker
            :disabled="datas.configParamJson.styleHeader.isGradient"
            v-model="datas.configParamJson.styleHeader.headerBgColor"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="头部渐变色1" prop="headerBg">
          <el-color-picker
            :disabled="!datas.configParamJson.styleHeader.isGradient"
            v-model="datas.configParamJson.styleHeader.headerBg"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="头部渐变色2" prop="headerBg2">
          <el-color-picker
            :disabled="!datas.configParamJson.styleHeader.isGradient"
            v-model="datas.configParamJson.styleHeader.headerBg2"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="圆角大小" prop="borderRadius">
          <el-input-number v-model="datas.configParamJson.styleHeader.borderRadius" :min="0" :max="100" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped></style>
