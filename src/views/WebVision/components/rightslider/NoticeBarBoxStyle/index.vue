<template>
  <div class="notice-bar-box-style">
    <div class="style-section">
      <h3 class="section-title">公告内容</h3>
      <el-form-item label="公告文本">
        <el-input
          v-model="localConfig.text"
          type="textarea"
          :rows="3"
          placeholder="请输入公告内容"
          @input="updateConfig"
        />
      </el-form-item>
    </div>

    <div class="style-section">
      <h3 class="section-title">显示模式</h3>
      <el-form-item label="显示模式">
        <el-select v-model="localConfig.mode" @change="updateConfig">
          <el-option label="静态显示" value="static" />
          <el-option label="滚动显示" value="scrolling" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="localConfig.mode === 'scrolling'" label="滚动速度">
        <el-slider v-model="localConfig.speed" :min="20" :max="100" show-input @input="updateConfig" />
      </el-form-item>
    </div>

    <div class="style-section">
      <h3 class="section-title">图标设置</h3>
      <el-form-item label="显示左侧图标">
        <el-switch v-model="localConfig.showLeftIcon" @change="updateConfig" />
      </el-form-item>

      <el-form-item v-if="localConfig.showLeftIcon" label="左侧图标">
        <el-select v-model="localConfig.leftIcon" @change="updateConfig">
          <el-option label="音量" value="volume" />
          <el-option label="通知" value="notification" />
          <el-option label="信息" value="info" />
          <el-option label="警告" value="warning" />
        </el-select>
      </el-form-item>

      <el-form-item label="显示关闭按钮">
        <el-switch v-model="localConfig.showRightIcon" @change="updateConfig" />
      </el-form-item>

      <el-form-item label="可关闭">
        <el-switch v-model="localConfig.closeable" @change="updateConfig" />
      </el-form-item>
    </div>

    <div class="style-section">
      <h3 class="section-title">样式设置</h3>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="localConfig.background" show-alpha @change="updateConfig" />
      </el-form-item>

      <el-form-item label="文字颜色">
        <el-color-picker v-model="localConfig.color" @change="updateConfig" />
      </el-form-item>

      <el-form-item label="文字换行">
        <el-switch v-model="localConfig.wrapable" @change="updateConfig" />
      </el-form-item>
    </div>

    <div class="style-section">
      <h3 class="section-title">动画设置</h3>
      <el-form-item label="滚动动画">
        <el-switch v-model="localConfig.scrollable" @change="updateConfig" />
      </el-form-item>

      <el-form-item v-if="localConfig.scrollable" label="延迟时间(ms)">
        <el-input-number v-model="localConfig.delay" :min="0" :max="5000" :step="100" @change="updateConfig" />
      </el-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface Props {
  datas: any
  pageModel?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

const emit = defineEmits(['update-config'])

// 本地配置数据
const localConfig = reactive({
  text: '这是一条重要公告，请注意查看！',
  mode: 'static',
  leftIcon: 'volume',
  rightIcon: 'close',
  showLeftIcon: true,
  showRightIcon: true,
  closeable: true,
  scrollable: true,
  speed: 60,
  background: '#fffbe8',
  color: '#ed6a0c',
  wrapable: false,
  delay: 1000
})

// 初始化配置
onMounted(() => {
  if (props.datas?.configParamJson) {
    Object.assign(localConfig, props.datas.configParamJson)
  }
})

// 监听外部数据变化
watch(
  () => props.datas?.configParamJson,
  (newConfig) => {
    if (newConfig) {
      Object.assign(localConfig, newConfig)
    }
  },
  { deep: true }
)

// 更新配置
const updateConfig = () => {
  emit('update-config', {
    ...props.datas,
    configParamJson: { ...localConfig }
  })
}
</script>

<style lang="scss" scoped>
.notice-bar-box-style {
  padding: 16px;

  .style-section {
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;

    .section-title {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .el-form-item {
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
