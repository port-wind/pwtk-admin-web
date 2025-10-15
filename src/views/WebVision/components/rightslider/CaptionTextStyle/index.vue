<template>
  <div class="CaptionTextStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form :model="datas.configParamJson" :rules="rules" ref="ruleFormRef" class="CaptionText-style">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <header-title :datas="datas" />

      <el-divider content-position="left">基础设置</el-divider>

      <el-form-item label="启用状态">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      <el-form-item label="标题内容">
        <el-input v-model="datas.configParamJson.name" placeholder="请输入标题" show-word-limit />
      </el-form-item>

      <el-form-item label="描述内容">
        <el-input
          type="textarea"
          v-model="datas.configParamJson.description"
          placeholder="请输入要说明的文字，最多 100 字"
          maxlength="100"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="显示位置">
        <el-radio-group v-model="datas.configParamJson.positions">
          <el-radio-button label="left">居左</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">居右</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-divider content-position="left">快速配置</el-divider>

      <div class="preset-configs">
        <el-button-group>
          <el-button v-for="preset in presetConfigs" :key="preset.name" size="small" @click="applyPresetConfig(preset)">
            {{ preset.name }}
          </el-button>
        </el-button-group>
      </div>

      <el-divider content-position="left">字体设置</el-divider>

      <el-form-item label="标题大小" prop="wordSize">
        <el-slider v-model="datas.configParamJson.wordSize" :min="12" :max="32" show-input />
      </el-form-item>
      <el-form-item label="描述大小" prop="descriptionSize">
        <el-slider v-model="datas.configParamJson.descriptionSize" :min="10" :max="24" show-input />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题粗细" prop="wordWeight">
            <el-select v-model="datas.configParamJson.wordWeight" placeholder="选择粗细">
              <el-option :value="100" label="极细 (100)" />
              <el-option :value="200" label="细 (200)" />
              <el-option :value="300" label="较细 (300)" />
              <el-option :value="400" label="正常 (400)" />
              <el-option :value="500" label="中等 (500)" />
              <el-option :value="600" label="较粗 (600)" />
              <el-option :value="700" label="粗 (700)" />
              <el-option :value="800" label="较重 (800)" />
              <el-option :value="900" label="最重 (900)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述粗细" prop="descriptionWeight">
            <el-select v-model="datas.configParamJson.descriptionWeight" placeholder="选择粗细">
              <el-option :value="100" label="极细 (100)" />
              <el-option :value="200" label="细 (200)" />
              <el-option :value="300" label="较细 (300)" />
              <el-option :value="400" label="正常 (400)" />
              <el-option :value="500" label="中等 (500)" />
              <el-option :value="600" label="较粗 (600)" />
              <el-option :value="700" label="粗 (700)" />
              <el-option :value="800" label="较重 (800)" />
              <el-option :value="900" label="最重 (900)" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="框体高度">
        <el-slider v-model="datas.configParamJson.wordHeight" :min="20" :max="100" show-input />
      </el-form-item>

      <el-divider content-position="left">颜色设置</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题颜色">
            <el-color-picker v-model="datas.configParamJson.wordColor" show-alpha :predefine="predefineColors" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="描述颜色">
            <el-color-picker v-model="datas.configParamJson.descriptionColor" show-alpha :predefine="predefineColors" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="背景颜色">
        <el-color-picker v-model="datas.configParamJson.backColor" show-alpha :predefine="predefineColors" />
      </el-form-item>

      <el-divider content-position="left">样式设置</el-divider>

      <el-form-item label="底部分割线">
        <el-switch v-model="datas.configParamJson.borderBott" />
      </el-form-item>

      <el-divider content-position="left">更多设置</el-divider>

      <el-form-item label="显示更多按钮">
        <el-switch v-model="datas.configParamJson.more.show" />
      </el-form-item>

      <div v-show="datas.configParamJson.more.show" class="more-settings">
        <el-form-item label="更多样式">
          <el-radio-group v-model="datas.configParamJson.more.type">
            <el-radio :value="0">链接样式</el-radio>
            <el-radio :value="1">按钮样式</el-radio>
            <el-radio :value="2">图标样式</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="datas.configParamJson.more.type !== 2" label="更多文字">
          <el-input v-model="datas.configParamJson.more.text" placeholder="请输入更多按钮文字" />
        </el-form-item>

        <el-form-item label="跳转方式">
          <el-radio-group v-model="datas.configParamJson.more.httpType">
            <el-radio :value="10">内部链接</el-radio>
            <el-radio :value="11">外部链接</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input v-model="datas.configParamJson.more.http" placeholder="请输入跳转链接" show-word-limit />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="CaptionTextStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/CaptionText/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({
  // wordSize: [
  //   { required: true, message: '请输入标题大小', trigger: 'blur' },
  //   { type: 'number', min: 12, max: 32, message: '标题大小范围：12-32', trigger: 'blur' }
  // ],
  // descriptionSize: [
  //   { required: true, message: '请输入描述大小', trigger: 'blur' },
  //   { type: 'number', min: 10, max: 24, message: '描述大小范围：10-24', trigger: 'blur' }
  // ],
  // wordWeight: [{ required: true, message: '请选择标题粗细', trigger: 'change' }],
  // descriptionWeight: [{ required: true, message: '请选择描述粗细', trigger: 'change' }]
})

const ruleFormRef = ref<FormInstance>()

// 预设配置
const presetConfigs = [
  {
    name: '标题样式',
    config: {
      wordSize: 18,
      descriptionSize: 14,
      wordWeight: 600,
      descriptionWeight: 400,
      wordColor: '#333333',
      descriptionColor: '#666666'
    }
  },
  {
    name: '副标题样式',
    config: {
      wordSize: 16,
      descriptionSize: 12,
      wordWeight: 500,
      descriptionWeight: 300,
      wordColor: '#555555',
      descriptionColor: '#999999'
    }
  },
  {
    name: '小标题样式',
    config: {
      wordSize: 14,
      descriptionSize: 12,
      wordWeight: 400,
      descriptionWeight: 200,
      wordColor: '#666666',
      descriptionColor: '#aaaaaa'
    }
  }
]

// 预设颜色
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#409EFF',
  '#909399',
  '#C0C4CC',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  Object.assign(props.datas.configParamJson, preset.config)
}
</script>

<style lang="scss" scoped>
.CaptionTextStyle {
  .CaptionText-style {
    padding: 0 10px;
  }

  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .preset-configs {
    margin-bottom: 16px;
  }

  .more-settings {
    background-color: #f5f7fa;
    padding: 16px;
    border-radius: 8px;
    margin-top: 12px;
    border-left: 4px solid #409eff;
  }

  :deep(.el-radio-button__inner) {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
