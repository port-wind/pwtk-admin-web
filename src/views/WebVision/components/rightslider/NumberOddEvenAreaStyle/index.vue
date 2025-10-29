<script setup lang="ts" name="NumberOddEvenAreaStyle">
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

// 初始化合数单双属性默认值（简化版）
const initializeNumberOddEvenDefaults = () => {
  if (!datas.value?.configParamJson) {
    return
  }

  const config = datas.value.configParamJson

  // 合数单双属性基础配置
  if (config.showNumberOddEven === undefined) config.showNumberOddEven = true
  if (config.numberOddEvenTitle === undefined) config.numberOddEvenTitle = '合数单双'

  // 合数单双区域样式（简化）
  if (!config.numberOddEvenAreaStyle) {
    config.numberOddEvenAreaStyle = {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 16,
      marginTop: 16
    }
  }

  // 合数单双网格样式（简化）
  if (!config.numberOddEvenGridStyle) {
    config.numberOddEvenGridStyle = {
      gap: 12
    }
  }

  // 合数单双卡片样式（简化）
  if (!config.numberOddEvenCardStyle) {
    config.numberOddEvenCardStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 12
    }
  }

  // 合数单双标题样式（简化）
  if (!config.numberOddEvenTitleStyle) {
    config.numberOddEvenTitleStyle = {
      fontSize: 18,
      color: '#2c3e50'
    }
  }

  // 合数单双元素样式（简化）
  if (!config.numberOddEvenElementStyle) {
    config.numberOddEvenElementStyle = {
      nameSize: 16,
      numberWidth: 24,
      numberHeight: 20,
      numberFontSize: 10,
      numberBorderRadius: 3,
      numberGap: 3
    }
  } else {
    // 确保数字按钮样式有默认值
    if (config.numberOddEvenElementStyle.numberWidth === undefined) config.numberOddEvenElementStyle.numberWidth = 24
    if (config.numberOddEvenElementStyle.numberHeight === undefined) config.numberOddEvenElementStyle.numberHeight = 20
    if (config.numberOddEvenElementStyle.numberFontSize === undefined)
      config.numberOddEvenElementStyle.numberFontSize = 10
    if (config.numberOddEvenElementStyle.numberBorderRadius === undefined)
      config.numberOddEvenElementStyle.numberBorderRadius = 3
    if (config.numberOddEvenElementStyle.numberGap === undefined) config.numberOddEvenElementStyle.numberGap = 3
  }
}

// 安全访问计算属性
const safeConfig = computed(() => {
  const config = datas.value?.configParamJson
  if (!config) return null

  // 确保初始化
  initializeNumberOddEvenDefaults()
  return config
})

// 组件挂载时初始化
onMounted(async () => {
  await nextTick()
  initializeNumberOddEvenDefaults()
})

// 监听数据变化
watch(
  () => datas.value,
  async () => {
    await nextTick()
    initializeNumberOddEvenDefaults()
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="NumberOddEvenAreaStyle" v-if="safeConfig">
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 合数单双基础配置 -->
      <el-divider content-position="left">合数单双基础配置</el-divider>

      <el-form-item label="显示合数单双" prop="showNumberOddEven">
        <el-switch v-model="datas.configParamJson.showNumberOddEven" />
      </el-form-item>

      <el-form-item label="合数单双标题" prop="numberOddEvenTitle">
        <el-input v-model="datas.configParamJson.numberOddEvenTitle" placeholder="请输入合数单双标题" />
      </el-form-item>

      <!-- 合数单双区域样式 -->
      <el-divider content-position="left">合数单双区域样式</el-divider>

      <el-form-item label="区域背景色" prop="numberOddEvenAreaStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.numberOddEvenAreaStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="区域圆角" prop="numberOddEvenAreaStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.numberOddEvenAreaStyle.borderRadius" :min="0" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域内边距" prop="numberOddEvenAreaStyle.padding">
        <el-slider v-model="datas.configParamJson.numberOddEvenAreaStyle.padding" :min="8" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域上边距" prop="numberOddEvenAreaStyle.marginTop">
        <el-slider v-model="datas.configParamJson.numberOddEvenAreaStyle.marginTop" :min="0" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 合数单双布局样式 -->
      <el-divider content-position="left">合数单双布局样式</el-divider>

      <el-form-item label="卡片间距" prop="numberOddEvenGridStyle.gap">
        <el-slider v-model="datas.configParamJson.numberOddEvenGridStyle.gap" :min="4" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片背景色" prop="numberOddEvenCardStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.numberOddEvenCardStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="卡片圆角" prop="numberOddEvenCardStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.numberOddEvenCardStyle.borderRadius" :min="0" :max="16" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片内边距" prop="numberOddEvenCardStyle.padding">
        <el-slider v-model="datas.configParamJson.numberOddEvenCardStyle.padding" :min="6" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 合数单双文字样式 -->
      <el-divider content-position="left">合数单双文字样式</el-divider>

      <el-form-item label="标题字体大小" prop="numberOddEvenTitleStyle.fontSize">
        <el-slider v-model="datas.configParamJson.numberOddEvenTitleStyle.fontSize" :min="14" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="标题文字颜色" prop="numberOddEvenTitleStyle.color">
        <el-color-picker v-model="datas.configParamJson.numberOddEvenTitleStyle.color" show-alpha />
      </el-form-item>

      <el-form-item label="合数单双名称大小" prop="numberOddEvenElementStyle.nameSize">
        <el-slider v-model="datas.configParamJson.numberOddEvenElementStyle.nameSize" :min="12" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 合数单双数字按钮样式 -->
      <el-divider content-position="left">合数单双数字按钮样式</el-divider>

      <el-form-item label="按钮宽度" prop="numberOddEvenElementStyle.numberWidth">
        <el-slider
          v-model="datas.configParamJson.numberOddEvenElementStyle.numberWidth"
          :min="20"
          :max="40"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮高度" prop="numberOddEvenElementStyle.numberHeight">
        <el-slider
          v-model="datas.configParamJson.numberOddEvenElementStyle.numberHeight"
          :min="16"
          :max="32"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮字体大小" prop="numberOddEvenElementStyle.numberFontSize">
        <el-slider
          v-model="datas.configParamJson.numberOddEvenElementStyle.numberFontSize"
          :min="8"
          :max="14"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮圆角" prop="numberOddEvenElementStyle.numberBorderRadius">
        <el-slider
          v-model="datas.configParamJson.numberOddEvenElementStyle.numberBorderRadius"
          :min="0"
          :max="8"
          show-input
        />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮间距" prop="numberOddEvenElementStyle.numberGap">
        <el-slider v-model="datas.configParamJson.numberOddEvenElementStyle.numberGap" :min="1" :max="8" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.NumberOddEvenAreaStyle {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-divider {
    margin: 24px 0 16px 0;
  }
}
</style>
