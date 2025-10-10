<template>
  <div class="CommoditySearchStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form :model="datas.configParamJson" :rules="rules" ref="ruleFormRef" class="commodity-search-style">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <header-title :datas="datas" />

      <el-divider content-position="left">基础设置</el-divider>

      <el-form-item label="启用状态">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      <el-form-item label="搜索框高度">
        <el-slider v-model="datas.configParamJson.heights" :min="30" :max="60" show-input />
      </el-form-item>

      <el-form-item label="文本位置">
        <el-radio-group v-model="datas.configParamJson.textPosition">
          <el-radio v-for="option in positionOptions" :key="option.value" :label="option.value">
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="显示扫一扫">
        <el-switch v-model="datas.configParamJson.sweep" />
      </el-form-item>

      <el-divider content-position="left">快速配置</el-divider>

      <div class="preset-configs">
        <el-button-group>
          <el-button v-for="preset in presetConfigs" :key="preset.name" size="small" @click="applyPresetConfig(preset)">
            {{ preset.name }}
          </el-button>
        </el-button-group>
      </div>

      <el-divider content-position="left">搜索样式设置</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="显示搜索图标">
            <el-switch v-model="datas.configParamJson.searchStyle.showIcon" />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="显示扫描按钮">
            <el-switch v-model="datas.configParamJson.searchStyle.showScanButton" />
          </el-form-item>
        </el-col> -->
      </el-row>

      <el-form-item label="占位文本">
        <el-input v-model="datas.configParamJson.searchStyle.placeholder" />
      </el-form-item>

      <el-form-item label="扫描按钮文字">
        <el-input v-model="datas.configParamJson.searchStyle.scanButtonText" />
      </el-form-item>

      <el-form-item label="圆角大小">
        <el-slider v-model="datas.configParamJson.borderRadius" :min="0" :max="30" show-input />
      </el-form-item>

      <el-form-item label="边框宽度">
        <el-slider v-model="datas.configParamJson.searchStyle.inputBorderWidth" :min="0" :max="5" show-input />
      </el-form-item>

      <el-form-item label="内边距">
        <el-slider v-model="datas.configParamJson.searchStyle.inputPadding" :min="8" :max="24" show-input />
      </el-form-item>

      <el-divider content-position="left">颜色设置</el-divider>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="背景色">
            <el-color-picker v-model="datas.configParamJson.backgroundColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="输入框背景">
            <el-color-picker v-model="datas.configParamJson.searchStyle.inputBackground" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="边框颜色">
            <el-color-picker v-model="datas.configParamJson.searchStyle.inputBorderColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文字颜色">
            <el-color-picker v-model="datas.configParamJson.textColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="图标颜色">
            <el-color-picker v-model="datas.configParamJson.searchStyle.iconColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="扫描按钮颜色">
            <el-color-picker v-model="datas.configParamJson.searchStyle.scanButtonColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">热词管理</el-divider>

      <div class="hotwords-management">
        <div class="hotwords-header">
          <el-button type="primary" size="small" @click="addHotword">
            <el-icon><Plus /></el-icon>
            添加热词
          </el-button>
        </div>

        <div class="hotwords-list">
          <vuedraggable :list="datas.configParamJson.hotwords" item-key="id" :animation="200" handle=".drag-handle">
            <template #item="{ element, index }">
              <div class="hotword-item">
                <div class="hotword-row">
                  <div class="drag-handle">
                    <el-icon><More /></el-icon>
                  </div>
                  <el-input v-model="element.text" placeholder="热词内容" style="flex: 1; margin-right: 8px" />
                  <el-switch
                    v-model="element.enabled"
                    inline-prompt
                    active-text="显示"
                    inactive-text="隐藏"
                    style="margin-right: 8px"
                  />
                  <el-button type="danger" size="small" @click="deleteHotword(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </vuedraggable>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="CommoditySearchStyle">
import { ref } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import type { FormInstance } from 'element-plus'
import { Delete, Plus, More } from '@element-plus/icons-vue'
import type { IDatas, IHotword } from '@/views/WebVision/components/componentsbiz/CommoditySearch/type'
import { ElMessage } from 'element-plus'
import vuedraggable from 'vuedraggable'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 添加热词
const addHotword = () => {
  const newHotword: IHotword = {
    id: generateId(),
    text: '新热词',
    enabled: true,
    order: props.datas.configParamJson.hotwords.length + 1
  }
  props.datas.configParamJson.hotwords.push(newHotword)
}

// 删除热词
const deleteHotword = (index: number) => {
  if (props.datas.configParamJson.hotwords.length <= 1) {
    ElMessage.warning('至少保留一个热词')
    return
  }
  props.datas.configParamJson.hotwords.splice(index, 1)
  // 重新排序
  props.datas.configParamJson.hotwords.forEach((item, idx) => {
    item.order = idx + 1
  })
}

// 位置选项
const positionOptions = [
  { value: 0, label: '居左' },
  { value: 1, label: '居中' }
]

// 预设配置
const presetConfigs = [
  {
    name: '简约风格',
    config: {
      borderRadius: 20,
      backgroundColor: '#ffffff',
      borderColor: '#e0e0e0'
    }
  },
  {
    name: '现代风格',
    config: {
      borderRadius: 8,
      backgroundColor: '#f8f9fa',
      borderColor: '#ddd'
    }
  },
  {
    name: '经典风格',
    config: {
      borderRadius: 4,
      backgroundColor: '#ffffff',
      borderColor: '#ccc'
    }
  }
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  Object.assign(props.datas.configParamJson, preset.config)
}
</script>

<style lang="scss" scoped>
.CommoditySearchStyle {
  .commodity-search-style {
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

  .hotwords-management {
    .hotwords-header {
      margin-bottom: 12px;
    }

    .hotwords-list {
      .hotword-item {
        margin-bottom: 8px;
        padding: 12px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #f9f9f9;

        .hotword-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .drag-handle {
            cursor: move;
            color: #999;
            padding: 4px;
          }
        }
      }
    }
  }
}
</style>
