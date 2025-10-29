<script setup lang="ts" name="WuxingAreaStyle">
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

// 初始化五行属性默认值（简化版）
const initializeWuxingDefaults = () => {
  if (!datas.value?.configParamJson) {
    return
  }

  const config = datas.value.configParamJson

  // 五行属性基础配置
  if (config.showWuxing === undefined) config.showWuxing = true
  if (config.wuxingTitle === undefined) config.wuxingTitle = '五行对照'

  // 五行区域样式（简化）
  if (!config.wuxingAreaStyle) {
    config.wuxingAreaStyle = {
      backgroundColor: '#f8f9fa',
      borderRadius: 8,
      padding: 16,
      marginTop: 16
    }
  }

  // 五行网格样式（简化）
  if (!config.wuxingGridStyle) {
    config.wuxingGridStyle = {
      gap: 12
    }
  }

  // 五行卡片样式（简化）
  if (!config.wuxingCardStyle) {
    config.wuxingCardStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      padding: 12
    }
  }

  // 五行标题样式（简化）
  if (!config.wuxingTitleStyle) {
    config.wuxingTitleStyle = {
      fontSize: 18,
      color: '#2c3e50'
    }
  }

  // 五行元素样式（简化）
  if (!config.wuxingElementStyle) {
    config.wuxingElementStyle = {
      nameSize: 16,
      numberWidth: 24,
      numberHeight: 20,
      numberFontSize: 10,
      numberBorderRadius: 3,
      numberGap: 3
    }
  } else {
    // 确保数字按钮样式有默认值
    if (config.wuxingElementStyle.numberWidth === undefined) config.wuxingElementStyle.numberWidth = 24
    if (config.wuxingElementStyle.numberHeight === undefined) config.wuxingElementStyle.numberHeight = 20
    if (config.wuxingElementStyle.numberFontSize === undefined) config.wuxingElementStyle.numberFontSize = 10
    if (config.wuxingElementStyle.numberBorderRadius === undefined) config.wuxingElementStyle.numberBorderRadius = 3
    if (config.wuxingElementStyle.numberGap === undefined) config.wuxingElementStyle.numberGap = 3
  }
}

// 安全访问计算属性
const safeConfig = computed(() => {
  const config = datas.value?.configParamJson
  if (!config) return null

  // 确保初始化
  initializeWuxingDefaults()
  return config
})

// 组件挂载时初始化
onMounted(async () => {
  await nextTick()
  initializeWuxingDefaults()
})

// 监听数据变化
watch(
  () => datas.value,
  async () => {
    await nextTick()
    initializeWuxingDefaults()
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="WuxingAreaStyle" v-if="safeConfig">
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 五行基础配置 -->
      <el-divider content-position="left">五行基础配置</el-divider>

      <el-form-item label="显示五行属性" prop="showWuxing">
        <el-switch v-model="datas.configParamJson.showWuxing" />
      </el-form-item>

      <el-form-item label="五行标题" prop="wuxingTitle">
        <el-input v-model="datas.configParamJson.wuxingTitle" placeholder="请输入五行标题" />
      </el-form-item>

      <!-- 五行区域样式 -->
      <el-divider content-position="left">五行区域样式</el-divider>

      <el-form-item label="区域背景色" prop="wuxingAreaStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.wuxingAreaStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="区域圆角" prop="wuxingAreaStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.wuxingAreaStyle.borderRadius" :min="0" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域内边距" prop="wuxingAreaStyle.padding">
        <el-slider v-model="datas.configParamJson.wuxingAreaStyle.padding" :min="8" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="区域上边距" prop="wuxingAreaStyle.marginTop">
        <el-slider v-model="datas.configParamJson.wuxingAreaStyle.marginTop" :min="0" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 五行布局样式 -->
      <el-divider content-position="left">五行布局样式</el-divider>

      <el-form-item label="卡片间距" prop="wuxingGridStyle.gap">
        <el-slider v-model="datas.configParamJson.wuxingGridStyle.gap" :min="4" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片背景色" prop="wuxingCardStyle.backgroundColor">
        <el-color-picker v-model="datas.configParamJson.wuxingCardStyle.backgroundColor" show-alpha />
      </el-form-item>

      <el-form-item label="卡片圆角" prop="wuxingCardStyle.borderRadius">
        <el-slider v-model="datas.configParamJson.wuxingCardStyle.borderRadius" :min="0" :max="16" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="卡片内边距" prop="wuxingCardStyle.padding">
        <el-slider v-model="datas.configParamJson.wuxingCardStyle.padding" :min="6" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 五行文字样式 -->
      <el-divider content-position="left">五行文字样式</el-divider>

      <el-form-item label="标题字体大小" prop="wuxingTitleStyle.fontSize">
        <el-slider v-model="datas.configParamJson.wuxingTitleStyle.fontSize" :min="14" :max="24" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="标题文字颜色" prop="wuxingTitleStyle.color">
        <el-color-picker v-model="datas.configParamJson.wuxingTitleStyle.color" show-alpha />
      </el-form-item>

      <el-form-item label="五行名称大小" prop="wuxingElementStyle.nameSize">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.nameSize" :min="12" :max="20" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 五行数字按钮样式 -->
      <el-divider content-position="left">五行数字按钮样式</el-divider>

      <el-form-item label="按钮宽度" prop="wuxingElementStyle.numberWidth">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.numberWidth" :min="20" :max="40" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮高度" prop="wuxingElementStyle.numberHeight">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.numberHeight" :min="16" :max="32" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮字体大小" prop="wuxingElementStyle.numberFontSize">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.numberFontSize" :min="8" :max="14" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮圆角" prop="wuxingElementStyle.numberBorderRadius">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.numberBorderRadius" :min="0" :max="8" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="按钮间距" prop="wuxingElementStyle.numberGap">
        <el-slider v-model="datas.configParamJson.wuxingElementStyle.numberGap" :min="1" :max="8" show-input />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.WuxingAreaStyle {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-divider {
    margin: 24px 0 16px 0;
  }
}
</style>
