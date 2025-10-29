<template>
  <div class="MyTestComponentStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form :model="datas.configParamJson" :rules="rules" ref="ruleFormRef" class="myTestComponent-style">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-divider content-position="left">基础设置</el-divider>

      <el-form-item label="文本内容">
        <el-input
          v-model="datas.configParamJson.text"
          type="textarea"
          :rows="3"
          placeholder="请输入要显示的文本内容"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="文字对齐">
        <el-radio-group v-model="datas.configParamJson.textAlign">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-divider content-position="left">外观设置</el-divider>

      <el-form-item label="背景颜色">
        <el-color-picker v-model="datas.configParamJson.backgroundColor" />
      </el-form-item>

      <el-form-item label="文字颜色">
        <el-color-picker v-model="datas.configParamJson.textColor" />
      </el-form-item>

      <el-form-item label="内边距">
        <el-slider v-model="datas.configParamJson.padding" :min="0" :max="50" :step="2" show-stops show-input />
      </el-form-item>

      <el-form-item label="最小高度">
        <el-slider v-model="datas.configParamJson.minHeight" :min="50" :max="300" :step="10" show-stops show-input />
      </el-form-item>

      <el-form-item label="圆角">
        <el-slider v-model="datas.configParamJson.borderRadius" :min="0" :max="20" :step="2" show-stops show-input />
      </el-form-item>

      <el-divider content-position="left">字体设置</el-divider>

      <el-form-item label="字体大小">
        <el-slider v-model="datas.configParamJson.fontSize" :min="12" :max="24" :step="1" show-stops show-input />
      </el-form-item>

      <el-form-item label="字体粗细">
        <el-slider v-model="datas.configParamJson.fontWeight" :min="100" :max="900" :step="100" show-stops show-input />
      </el-form-item>

      <el-divider content-position="left">快速样式</el-divider>

      <el-form-item label="预设样式">
        <el-space>
          <el-button @click="applyPreset('default')">默认</el-button>
          <el-button @click="applyPreset('primary')" type="primary">强调</el-button>
          <el-button @click="applyPreset('warning')" type="warning">警告</el-button>
          <el-button @click="applyPreset('success')" type="success">成功</el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="MyTestComponentStyle">
import { ref, reactive } from 'vue'
import shareComponent from '../shareComponent/index.vue'
import componentHeadTitle from '../componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'

interface Props {
  datas: any
}

const props = defineProps<Props>()

const ruleFormRef = ref<FormInstance>()

// 表单验证规则
const rules = reactive({
  text: [{ required: true, message: '请输入文本内容', trigger: 'blur' }]
})

// 应用预设样式
const applyPreset = (preset: string) => {
  const presets = {
    default: {
      backgroundColor: '#f5f5f5',
      textColor: '#333333',
      fontSize: 14,
      fontWeight: 400
    },
    primary: {
      backgroundColor: '#ecf5ff',
      textColor: '#409eff',
      fontSize: 16,
      fontWeight: 500
    },
    warning: {
      backgroundColor: '#fdf6ec',
      textColor: '#e6a23c',
      fontSize: 14,
      fontWeight: 600
    },
    success: {
      backgroundColor: '#f0f9ff',
      textColor: '#67c23a',
      fontSize: 14,
      fontWeight: 500
    }
  }

  const presetConfig = presets[preset]
  if (presetConfig) {
    Object.assign(props.datas.configParamJson, presetConfig)
  }
}
</script>

<style lang="scss" scoped>
.MyTestComponentStyle {
  padding: 16px;

  .myTestComponent-style {
    :deep(.el-form-item__label) {
      font-weight: 500;
    }

    :deep(.el-divider__text) {
      font-weight: 600;
      color: #409eff;
    }
  }
}
</style>
