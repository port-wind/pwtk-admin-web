<script setup lang="ts" name="WaveColorAreaStyle">
import { ref, computed, defineProps, onMounted, watch, nextTick } from 'vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/Zodiac12WuxingPage/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const datas = computed(() => props.datas)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 初始化波色属性默认值（简化版）
const initializeWaveColorDefaults = () => {
  if (!datas.value?.configParamJson) {
    return
  }

  const config = datas.value.configParamJson

  // 波色属性基础配置
  if (config.showWaveColor === undefined) config.showWaveColor = true
  if (config.waveColorTitle === undefined) config.waveColorTitle = '波色'

  // 波色区域样式（简化）
  if (!config.waveColorAreaStyle) {
    config.waveColorAreaStyle = {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 16,
      marginTop: 16
    }
  }

  // 波色网格样式（简化）
  if (!config.waveColorGridStyle) {
    config.waveColorGridStyle = {
      gap: 12
    }
  }

  // 波色卡片样式（简化）
  if (!config.waveColorCardStyle) {
    config.waveColorCardStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 12
    }
  }

  // 波色标题样式（简化）
  if (!config.waveColorTitleStyle) {
    config.waveColorTitleStyle = {
      fontSize: 18,
      color: '#2c3e50'
    }
  }

  // 波色元素样式（简化）
  if (!config.waveColorElementStyle) {
    config.waveColorElementStyle = {
      nameSize: 16,
      numberWidth: 24,
      numberHeight: 20,
      numberFontSize: 10,
      numberBorderRadius: 3,
      numberGap: 3
    }
  } else {
    // 确保数字按钮样式有默认值
    if (config.waveColorElementStyle.numberWidth === undefined) config.waveColorElementStyle.numberWidth = 24
    if (config.waveColorElementStyle.numberHeight === undefined) config.waveColorElementStyle.numberHeight = 20
    if (config.waveColorElementStyle.numberFontSize === undefined) config.waveColorElementStyle.numberFontSize = 10
    if (config.waveColorElementStyle.numberBorderRadius === undefined)
      config.waveColorElementStyle.numberBorderRadius = 3
    if (config.waveColorElementStyle.numberGap === undefined) config.waveColorElementStyle.numberGap = 3
  }
}

// 安全访问计算属性
const safeConfig = computed(() => {
  const config = datas.value?.configParamJson
  if (!config) return null

  // 确保初始化
  initializeWaveColorDefaults()
  return config
})

// 组件挂载时初始化
onMounted(async () => {
  await nextTick()
  initializeWaveColorDefaults()
})

// 监听数据变化
watch(
  () => datas.value,
  async () => {
    await nextTick()
    initializeWaveColorDefaults()
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="WaveColorAreaStyle" v-if="safeConfig">
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 波色基础配置 -->
      <el-divider content-position="left">波色基础配置</el-divider>

      <el-form-item label="显示波色" prop="showWaveColor">
        <el-switch v-model="datas.configParamJson.showWaveColor" />
      </el-form-item>

      <el-form-item label="波色标题" prop="waveColorTitle">
        <el-input v-model="datas.configParamJson.waveColorTitle" placeholder="请输入波色标题" />
      </el-form-item>

      <!-- 波色区域样式 -->
      <el-divider content-position="left">波色区域样式</el-divider>

      <el-form-item label="区域背景色" prop="waveColorAreaStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.waveColorAreaStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="区域圆角" prop="waveColorAreaStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.waveColorAreaStyle.borderRadius" :min="0" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域内边距" prop="waveColorAreaStyle.padding">
        <el-slider v-model="datas.configParamJson.waveColorAreaStyle.padding" :min="8" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域上边距" prop="waveColorAreaStyle.marginTop">
        <el-slider v-model="datas.configParamJson.waveColorAreaStyle.marginTop" :min="0" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 波色布局样式 -->
      <el-divider content-position="left">波色布局样式</el-divider>

      <el-form-item label="卡片间距" prop="waveColorGridStyle.gap">
        <el-slider v-model="datas.configParamJson.waveColorGridStyle.gap" :min="4" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片背景色" prop="waveColorCardStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.waveColorCardStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="卡片圆角" prop="waveColorCardStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.waveColorCardStyle.borderRadius" :min="0" :max="16" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片内边距" prop="waveColorCardStyle.padding">
        <el-slider v-model="datas.configParamJson.waveColorCardStyle.padding" :min="6" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 波色文字样式 -->
      <el-divider content-position="left">波色文字样式</el-divider>

      <el-form-item label="标题字体大小" prop="waveColorTitleStyle.fontSize">
        <el-slider v-model="datas.configParamJson.waveColorTitleStyle.fontSize" :min="14" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="标题文字颜色" prop="waveColorTitleStyle.color">
        <el-color-picker v-model="datas.configParamJson.waveColorTitleStyle.color" show-alpha />
      </el-form-item>

      <el-form-item label="波色名称大小" prop="waveColorElementStyle.nameSize">
        <el-slider v-model="datas.configParamJson.waveColorElementStyle.nameSize" :min="12" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 波色数字按钮样式 -->
      <el-divider content-position="left">波色数字按钮样式</el-divider>

      <el-form-item label="按钮宽度" prop="waveColorElementStyle.numberWidth">
        <el-slider v-model="datas.configParamJson.waveColorElementStyle.numberWidth" :min="20" :max="40" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮高度" prop="waveColorElementStyle.numberHeight">
        <el-slider v-model="datas.configParamJson.waveColorElementStyle.numberHeight" :min="16" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮字体大小" prop="waveColorElementStyle.numberFontSize">
        <el-slider v-model="datas.configParamJson.waveColorElementStyle.numberFontSize" :min="8" :max="14" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮圆角" prop="waveColorElementStyle.numberBorderRadius">
        <el-slider
          v-model="datas.configParamJson.waveColorElementStyle.numberBorderRadius"
          :min="0"
          :max="8"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮间距" prop="waveColorElementStyle.numberGap">
        <el-slider v-model="datas.configParamJson.waveColorElementStyle.numberGap" :min="1" :max="8" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.WaveColorAreaStyle {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-divider {
    margin: 24px 0 16px 0;
  }
}
</style>
