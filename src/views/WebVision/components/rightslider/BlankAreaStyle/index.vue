<template>
  <div class="BlankAreaStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form :model="datas.configParamJson" :rules="rules" ref="ruleFormRef" class="blank-area-style">
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
          <el-radio-button label="left">居左</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">居右</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-divider content-position="left">尺寸设置</el-divider>

      <el-form-item label="最小高度">
        <el-slider v-model="datas.configParamJson.minHeight" :min="50" :max="300" show-input />
        <span style="margin-left: 10px; color: #999">px</span>
      </el-form-item>

      <el-form-item label="内边距">
        <el-slider v-model="datas.configParamJson.padding" :min="0" :max="50" show-input />
        <span style="margin-left: 10px; color: #999">px</span>
      </el-form-item>

      <el-form-item label="圆角">
        <el-slider v-model="datas.configParamJson.borderRadius" :min="0" :max="20" show-input />
        <span style="margin-left: 10px; color: #999">px</span>
      </el-form-item>

      <el-divider content-position="left">字体设置</el-divider>

      <el-form-item label="字体大小">
        <el-slider v-model="datas.configParamJson.fontSize" :min="12" :max="24" show-input />
        <span style="margin-left: 10px; color: #999">px</span>
      </el-form-item>

      <el-form-item label="字体粗细">
        <el-select v-model="datas.configParamJson.fontWeight" placeholder="选择字体粗细">
          <el-option :value="300" label="较细 (300)" />
          <el-option :value="400" label="正常 (400)" />
          <el-option :value="500" label="中等 (500)" />
          <el-option :value="600" label="较粗 (600)" />
          <el-option :value="700" label="粗体 (700)" />
        </el-select>
      </el-form-item>

      <el-divider content-position="left">颜色设置</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="背景颜色">
            <el-color-picker v-model="datas.configParamJson.backgroundColor" show-alpha :predefine="predefineColors" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="datas.configParamJson.textColor" show-alpha :predefine="predefineColors" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">快速配置</el-divider>

      <div class="preset-configs">
        <el-button-group>
          <el-button v-for="preset in presetConfigs" :key="preset.name" size="small" @click="applyPresetConfig(preset)">
            {{ preset.name }}
          </el-button>
        </el-button-group>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="BlankAreaStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/BlankArea/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 预定义颜色
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#f5f5f5',
  '#ffffff',
  '#000000'
])

// 预设配置
const presetConfigs = [
  {
    name: '默认样式',
    config: {
      backgroundColor: '#f5f5f5',
      textColor: '#333333',
      fontSize: 14,
      fontWeight: 400,
      textAlign: 'center',
      padding: 20,
      minHeight: 100,
      borderRadius: 4
    }
  },
  {
    name: '强调样式',
    config: {
      backgroundColor: '#1989fa',
      textColor: '#ffffff',
      fontSize: 16,
      fontWeight: 600,
      textAlign: 'center',
      padding: 25,
      minHeight: 120,
      borderRadius: 8
    }
  },
  {
    name: '警告样式',
    config: {
      backgroundColor: '#ff9500',
      textColor: '#ffffff',
      fontSize: 15,
      fontWeight: 500,
      textAlign: 'center',
      padding: 20,
      minHeight: 100,
      borderRadius: 6
    }
  },
  {
    name: '成功样式',
    config: {
      backgroundColor: '#52c41a',
      textColor: '#ffffff',
      fontSize: 15,
      fontWeight: 500,
      textAlign: 'center',
      padding: 20,
      minHeight: 100,
      borderRadius: 6
    }
  }
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  Object.assign(props.datas.configParamJson, preset.config)
}
</script>

<style lang="scss" scoped>
.BlankAreaStyle {
  .preset-configs {
    .el-button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}
</style>
