<script setup lang="ts" name="Zodiac12WuxingPageStyle">
import { ref, computed, defineProps, onMounted, watch, nextTick } from 'vue'
import type { FormInstance } from 'element-plus'

import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import WuxingAreaStyle from '@/views/WebVision/components/rightslider/WuxingAreaStyle/index.vue'
import WaveColorAreaStyle from '@/views/WebVision/components/rightslider/WaveColorAreaStyle/index.vue'
import NumberOddEvenAreaStyle from '@/views/WebVision/components/rightslider/NumberOddEvenAreaStyle/index.vue'

import type { IDatas } from '@/views/WebVision/components/componentsbiz/Zodiac12WuxingPage/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const datas = computed(() => props.datas)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 标签页状态管理
const activeTab = ref('zodiac') // 默认显示生肖样式配置

// 初始化默认值 - Zodiac12WuxingPage专用配置
const initializeDefaults = () => {
  if (!datas.value?.configParamJson) {
    return
  }

  const config = datas.value.configParamJson

  // Zodiac12WuxingPage专用默认配置 - 仅设置组件特定的默认值
  if (config.title === undefined) config.title = '玩法说明'
  if (config.subtitle === undefined) config.subtitle = '这是一个玩法说明'
  if (config.content === undefined) config.content = '这里是内容区域，您可以在此处添加任何文本内容。'
  if (config.enable === undefined) config.enable = true
  if (config.showGameType === undefined) config.showGameType = true
  if (config.forumId === undefined) config.forumId = '10'
  if (config.size === undefined) config.size = 10
  if (config.showClashNames === undefined) config.showClashNames = true

  // 确保基本配置对象存在
  if (!config.styleMain) {
    config.styleMain = {
      padding: 1,
      borderRadius: 0,
      backgroundColor: '#ffffff',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 400,
      textColor: '#333333'
    }
  }

  if (!config.styleHeader) {
    config.styleHeader = {
      backgroundColor: '#f8f9fa',
      isGradient: true,
      headerBgColor: '#4a90e2',
      headerBg: '#4a90e2',
      headerBg2: '#5aa5f0',
      subTitleColor: '#ffffff',
      titleColor: '#ffffff'
    }
  }

  // 波色属性基础配置
  if (config.showWaveColor === undefined) config.showWaveColor = true
  if (config.waveColorTitle === undefined) config.waveColorTitle = '波色'

  // 合数单双属性基础配置
  if (config.showNumberOddEven === undefined) config.showNumberOddEven = true
  if (config.numberOddEvenTitle === undefined) config.numberOddEvenTitle = '合数单双'

  // 确保所有样式对象存在 - 使用用户偏好的默认值
  if (!config.zodiacCardStyle) {
    config.zodiacCardStyle = {
      backgroundColor: '#ffffff',
      borderRadius: 0,
      borderColor: '#e9ecef',
      borderWidth: 0,
      padding: 0,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowBlur: 0,
      hoverShadowBlur: 0,
      hoverTransform: 'translateY(-1px)'
    }
  }

  if (!config.zodiacImageStyle) {
    config.zodiacImageStyle = {
      width: 24,
      height: 23,
      borderRadius: 0,
      backgroundColor: '#f8f9fa',
      borderColor: '#e9ecef',
      borderWidth: 0,
      marginBottom: 0
    }
  }

  if (!config.zodiacNameStyle) {
    config.zodiacNameStyle = {
      fontSize: 10,
      fontWeight: 400,
      color: '#2c3e50',
      marginBottom: 4,
      textAlign: 'center'
    }
  }

  if (!config.zodiacLayoutStyle) {
    config.zodiacLayoutStyle = {
      imagePosition: 'left' // left, center, right
    }
  }

  if (!config.numberButtonStyle) {
    config.numberButtonStyle = {
      width: 21,
      height: 19,
      borderRadius: 0,
      fontSize: 9,
      fontWeight: 400,
      gap: 0,
      shadowBlur: 3,
      hoverScale: 1.05,
      transition: 'all 0.1s ease'
    }
  }

  if (!config.gridLayoutStyle) {
    config.gridLayoutStyle = {
      columns: 4,
      gap: 0,
      padding: 0,
      backgroundColor: '#f8f9fa'
    }
  }

  if (!config.customColorMapping) {
    config.customColorMapping = {
      redWave: 'rgba(232, 14, 31, 1)',
      blueWave: '#3742fa',
      greenWave: '#2ed573'
    }
  }
}

// 安全访问计算属性
const safeConfig = computed(() => {
  const config = datas.value?.configParamJson
  if (!config) return null

  // 确保初始化
  initializeDefaults()
  return config
})

const textAlignOptions = ref([
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
])

const fontWeightOptions = ref([
  { label: '正常 (400)', value: 400 },
  { label: '中等 (500)', value: 500 },
  { label: '较粗 (600)', value: 600 },
  { label: '粗体 (700)', value: 700 },
  { label: '特粗 (800)', value: 800 }
])

const transitionOptions = ref([
  { label: '无动画', value: 'none' },
  { label: '快速 (0.1s)', value: 'all 0.1s ease' },
  { label: '正常 (0.2s)', value: 'all 0.2s ease' },
  { label: '慢速 (0.3s)', value: 'all 0.3s ease' }
])

const hoverTransformOptions = ref([
  { label: '无效果', value: 'none' },
  { label: '上移1px', value: 'translateY(-1px)' },
  { label: '上移2px', value: 'translateY(-2px)' },
  { label: '上移3px', value: 'translateY(-3px)' },
  { label: '轻微缩放', value: 'scale(1.02)' },
  { label: '明显缩放', value: 'scale(1.05)' }
])

// 组件挂载时立即初始化
onMounted(async () => {
  await nextTick()
  initializeDefaults()
})

// 监听数据变化，确保默认值存在
watch(
  () => datas.value,
  async () => {
    await nextTick()
    initializeDefaults()
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="Zodiac12WuxingPageStyle" v-if="safeConfig">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />

      <!-- 组件头部标题配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.Zodiac12WuxingPageStyle {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-divider {
    margin: 24px 0 16px 0;
  }
}
</style>
