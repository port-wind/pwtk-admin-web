<template>
  <div class="auxiliarysegmentationstyle">
    <!-- 表单 -->
    <el-form label-width="80px" :model="configData">
      <!-- 空白高度 -->
      <el-form-item label="空白高度" class="form-item-left">
        <el-slider v-model="configData.blankHeight" :max="100" input-size="small" show-input @change="updateConfig" />
      </el-form-item>

      <div class="form-spacing" />

      <!-- 分割类型 -->
      <el-form-item class="form-item-left" label="分割类型">
        <div class="option-container">
          <el-tooltip
            v-for="(type, index) in segmentationTypes"
            :key="index"
            effect="dark"
            :content="type.text"
            placement="bottom"
          >
            <i
              class="iconfont"
              :class="[type.icon, configData.segmentationtype === type.value ? 'active' : '']"
              @click="handleSegmentationTypeChange(type.value)"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div class="form-spacing" />

      <!-- 选择样式 -->
      <el-form-item v-show="configData.segmentationtype === 1" class="form-item-left" label="选择样式">
        <div class="option-container">
          <el-tooltip
            v-for="(item, index) in borderTypes"
            :key="index"
            effect="dark"
            :content="item.text"
            placement="bottom"
          >
            <i
              class="iconfont"
              :class="[item.icon, configData.bordertp === item.type ? 'active' : '']"
              @click="handleBorderTypeChange(item.type)"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div v-show="configData.segmentationtype === 1" class="form-spacing" />

      <!-- 左右边距 -->
      <el-form-item v-show="configData.segmentationtype === 1" class="form-item-left" label="左右边距">
        <div class="option-container">
          <el-tooltip
            v-for="(padding, index) in paddingTypes"
            :key="index"
            effect="dark"
            :content="padding.text"
            placement="bottom"
          >
            <i
              class="iconfont"
              :class="[padding.icon, configData.paddType === padding.value ? 'active' : '']"
              @click="handlePaddingTypeChange(padding.value)"
            />
          </el-tooltip>
        </div>
      </el-form-item>

      <div v-show="configData.segmentationtype === 1" class="form-spacing" />

      <!-- 辅助线颜色 -->
      <el-form-item
        v-show="configData.segmentationtype === 1"
        label="辅助线颜色"
        class="form-item-left form-item-color"
      >
        <el-color-picker
          v-model="configData.auxliarColor"
          show-alpha
          class="color-picker"
          :predefine="predefineColors"
          @change="updateConfig"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="auxiliarysegmentationstyle">
import { ref, watch } from 'vue'
import type { IAuxiliarysegmentationProps } from '@/views/WebVision/components/componentsbiz/auxiliarysegmentation/type'

// Props 定义
interface Props {
  datas: {
    configParamJson: IAuxiliarysegmentationProps
  }
}

const props = defineProps<Props>()

// 预定义颜色
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

// 分割类型配置
const segmentationTypes = [
  { value: 0 as const, text: '辅助空白', icon: 'icon-fuzhukongbai_weixuanzhong' },
  { value: 1 as const, text: '辅助线', icon: 'icon-fuzhuxiantiao' }
]

// 边框类型配置
const borderTypes = [
  { icon: 'icon-icon_fengexian_shixian', text: '实线', type: 'solid' },
  { icon: 'icon-xuxian', text: '虚线', type: 'dashed' },
  { icon: 'icon-dianxian--', text: '点线', type: 'dotted' }
]

// 内边距类型配置
const paddingTypes = [
  { value: 0 as const, text: '无边距', icon: 'icon-icon_wubianju' },
  { value: 1 as const, text: '左右留边', icon: 'icon-icon_zuoyoubianju' }
]

// 配置数据
const configData = ref<IAuxiliarysegmentationProps>({ ...props.datas.configParamJson })

// 监听配置变化
watch(
  configData,
  (newVal) => {
    props.datas.configParamJson = { ...newVal }
  },
  { deep: true }
)

// 处理分割类型变更
const handleSegmentationTypeChange = (value: 0 | 1) => {
  configData.value.segmentationtype = value
  updateConfig()
}

// 处理边框类型变更
const handleBorderTypeChange = (type: string) => {
  configData.value.bordertp = type
  updateConfig()
}

// 处理内边距类型变更
const handlePaddingTypeChange = (value: 0 | 1) => {
  configData.value.paddType = value
  updateConfig()
}

// 更新配置
const updateConfig = () => {
  props.datas.configParamJson = { ...configData.value }
}
</script>

<style scoped lang="scss">
.auxiliarysegmentationstyle {
  width: 100%;
  padding: 0 10px 20px;
  box-sizing: border-box;

  // 标题样式
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  // 表单项左对齐
  .form-item-left {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  // 颜色选择器表单项
  .form-item-color {
    :deep(.el-form-item__label) {
      width: 100px !important;
    }
  }

  // 颜色选择器
  .color-picker {
    float: right;
  }

  // 表单间距
  .form-spacing {
    height: 20px;
  }

  // 选项容器
  .option-container {
    text-align: right;

    i {
      padding: 5px 14px;
      margin-left: 10px;
      border-radius: 0;
      border: 1px solid #ebedf0;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;

      &:last-child {
        font-size: 22px;
      }

      &.active {
        color: #155bd4;
        border: 1px solid #155bd4;
        background: #e0edff;
      }
    }
  }
}
</style>
