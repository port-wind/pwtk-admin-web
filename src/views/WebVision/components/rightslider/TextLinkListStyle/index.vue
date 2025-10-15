<script setup lang="ts" name="TextLinkListStyle">
import { ref, defineProps } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import type { FormInstance } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
import type { IDatas, ILinkItem } from '@/views/WebVision/components/componentsbiz/TextLinkList/type'
import { ElMessage } from 'element-plus'

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

// 添加新链接项
const addLinkItem = () => {
  const newItem: ILinkItem = {
    id: generateId(),
    text: '新链接',
    link: '',
    enabled: true,
    textColor: '#333333',
    backgroundColor: '#f5f5f5'
  }
  props.datas.configParamJson.links.push(newItem)
}

// 删除链接项
const removeLinkItem = (index: number) => {
  if (props.datas.configParamJson.links.length <= 1) {
    ElMessage.warning('至少保留一个链接项')
    return
  }
  props.datas.configParamJson.links.splice(index, 1)
}

// 预设的常用配置
const presetConfigs = [
  { name: '2列布局', columnsPerRow: 2 },
  { name: '3列布局', columnsPerRow: 3 },
  { name: '4列布局', columnsPerRow: 4 },
  { name: '单列布局', columnsPerRow: 1 }
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  props.datas.configParamJson.listStyleJSON.itemsPerRow = preset.columnsPerRow
}
</script>

<template>
  <div class="TextLinkListStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form :model="datas.configParamJson" :rules="rules" ref="ruleFormRef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />
      <ForumList :datas="datas" />
      <!-- <el-form-item label="启用状态" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item> -->
    </el-form>

    <!-- 链接管理 -->
    <el-divider content-position="left">链接管理</el-divider>

    <div class="links-management">
      <div class="links-header">
        <el-button type="primary" size="small" @click="addLinkItem">
          <el-icon><Plus /></el-icon>
          添加链接
        </el-button>
      </div>

      <div v-for="(link, linkIndex) in datas.configParamJson.links" :key="link.id" class="link-item">
        <div class="link-row">
          <div class="link-row-left">
            <el-input v-model="link.text" placeholder="链接文字" />
            <el-input v-model="link.link" placeholder="链接" />
            <el-row>
              <el-col :span="12">
                <el-input v-model="link.tag" placeholder="标签" />
              </el-col>
              <el-col :span="12">
                <el-input v-model="link.stag" placeholder="子标签" />
              </el-col>
            </el-row>
          </div>
          <div class="link-row-right">
            <el-switch v-model="link.enabled" inline-prompt active-text="显示" inactive-text="隐藏" />
            <el-button type="danger" size="small" @click="removeLinkItem(linkIndex)">
              删除
              <el-icon class="el-icon--right"><Delete /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- <div class="link-colors" style="margin-top: 8px">
          <el-color-picker v-model="link.textColor" show-alpha size="small" style="margin-right: 8px" />
          <span style="font-size: 12px; margin-right: 8px">文字颜色</span>
          <el-color-picker v-model="link.backgroundColor" show-alpha size="small" style="margin-right: 8px" />
          <span style="font-size: 12px">背景颜色</span>
        </div> -->
      </div>
    </div>

    <el-divider content-position="left">列表样式设置</el-divider>

    <!-- 快速配置 -->
    <div class="preset-configs">
      <el-button-group>
        <el-button v-for="preset in presetConfigs" :key="preset.name" size="small" @click="applyPresetConfig(preset)">
          {{ preset.name }}
        </el-button>
      </el-button-group>
    </div>

    <!-- 样式设置 -->
    <el-form :model="datas.configParamJson.listStyleJSON" label-width="auto">
      <el-form-item label="每行列数">
        <el-slider v-model="datas.configParamJson.listStyleJSON.itemsPerRow" :min="1" :max="6" show-input />
      </el-form-item>

      <el-form-item label="项目间距">
        <el-slider v-model="datas.configParamJson.listStyleJSON.itemSpacing" :min="0" :max="20" show-input />
      </el-form-item>

      <el-form-item label="项目内边距">
        <el-slider v-model="datas.configParamJson.listStyleJSON.itemPadding" :min="0" :max="30" show-input />
      </el-form-item>

      <el-form-item label="圆角大小">
        <el-slider v-model="datas.configParamJson.listStyleJSON.itemBorderRadius" :min="0" :max="20" show-input />
      </el-form-item>

      <el-form-item label="边框宽度">
        <el-slider v-model="datas.configParamJson.listStyleJSON.itemBorderWidth" :min="0" :max="5" show-input />
      </el-form-item>

      <el-form-item label="容器内边距">
        <el-slider v-model="datas.configParamJson.listStyleJSON.containerPadding" :min="0" :max="30" show-input />
      </el-form-item>
    </el-form>

    <!-- 颜色设置 -->
    <el-divider content-position="left">颜色设置</el-divider>

    <el-form :model="datas.configParamJson.listStyleJSON" label-width="auto">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerBackgroundColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题文字色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerTextColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemBackgroundColor" show-alpha />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目边框色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemBorderColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="悬停背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemHoverColor" show-alpha />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.TextLinkListStyle {
}
.links-management {
  .links-header {
    margin-bottom: 12px;
  }

  .link-item {
    margin-bottom: 12px;
    padding: 12px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .link-row {
    display: flex;
    align-items: center;

    .link-row-left {
      flex: 1;
    }

    .link-row-right {
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
}

.preset-configs {
  margin-bottom: 16px;
}
</style>
