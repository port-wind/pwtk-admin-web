<template>
  <div class="newspaper-category-list-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="组件标题">
        <el-input v-model="datas.configParamJson.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="datas.configParamJson.description" type="textarea" :rows="2" placeholder="请输入描述" />
      </el-form-item>

      <el-form-item label="默认激活标签">
        <el-select v-model="datas.configParamJson.defaultActiveTab" placeholder="选择默认激活的标签页">
          <el-option
            v-for="(category, index) in datas.configParamJson.categories"
            :key="category.id"
            :label="category.name"
            :value="index"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="是否显示">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>
    </el-form>

    <el-divider content-position="left">标签页管理</el-divider>

    <!-- 标签页管理 -->
    <div class="category-management">
      <div class="category-header">
        <span>标签页列表</span>
        <el-button type="primary" size="small" @click="addCategory">
          <el-icon>
            <Plus />
          </el-icon>
          添加标签页
        </el-button>
      </div>

      <div
        v-for="(category, categoryIndex) in datas.configParamJson.categories"
        :key="category.id"
        class="category-item"
      >
        <el-card shadow="hover" class="category-card">
          <template #header>
            <div class="category-header-content">
              <el-input v-model="category.name" placeholder="标签页名称" style="flex: 1; margin-right: 10px" />
              <el-switch v-model="category.enabled" />
              <el-button type="danger" size="small" @click="removeCategory(categoryIndex)" style="margin-left: 10px">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </template>

          <!-- 标签页项目管理 -->
          <div class="items-management">
            <div class="items-header">
              <span>项目列表</span>
              <el-button type="success" size="small" @click="addItem(categoryIndex)">
                <el-icon>
                  <Plus />
                </el-icon>
                添加项目
              </el-button>
            </div>

            <div v-for="(item, itemIndex) in category.items" :key="item.id" class="item-row">
              <el-input v-model="item.text" placeholder="项目名称" style="flex: 2; margin-right: 8px" />
              <el-input v-model="item.link" placeholder="链接地址" style="flex: 2; margin-right: 8px" />
              <el-switch v-model="item.isMoreButton" active-text="更多" style="margin-right: 8px" />
              <el-switch v-model="item.enabled" style="margin-right: 8px" />
              <el-button type="danger" size="small" @click="removeItem(categoryIndex, itemIndex)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-divider content-position="left">样式设置</el-divider>

    <!-- 样式设置 -->
    <el-form label-width="120px" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerBackgroundColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerTextColor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="激活标签颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.activeTabColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="非激活标签颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.inactiveTabColor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="标签文字颜色">
        <el-color-picker v-model="datas.configParamJson.listStyleJSON.tabTextColor" />
      </el-form-item>

      <el-form-item label="每行显示数量">
        <el-slider
          v-model="datas.configParamJson.listStyleJSON.itemsPerRow"
          :min="1"
          :max="6"
          show-stops
          :marks="{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' }"
        />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="项目间距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemSpacing" :min="0" :max="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目内边距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemPadding" :min="5" :max="30" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="项目圆角">
        <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderRadius" :min="0" :max="20" />
      </el-form-item>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="项目背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemBackgroundColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemTextColor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="项目边框颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemBorderColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边框宽度">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderWidth" :min="0" :max="5" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="更多按钮颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.moreButtonColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="更多按钮文字">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.moreButtonTextColor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="容器内边距">
        <el-input-number v-model="datas.configParamJson.listStyleJSON.containerPadding" :min="0" :max="50" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import type {
  CategoryItem,
  CategoryTab,
  IDatas
} from '@/views/WebVision/components/componentsbiz/NewsPaperCategoryList/type'

interface Props {
  datas: IDatas
}

const props = defineProps<Props>()

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// 添加标签页
const addCategory = () => {
  const newCategory: CategoryTab = {
    id: generateId(),
    name: '新标签页',
    enabled: true,
    items: []
  }
  props.datas.categories.push(newCategory)
}

// 删除标签页
const removeCategory = (index: number) => {
  props.datas.categories.splice(index, 1)
}

// 添加项目
const addItem = (categoryIndex: number) => {
  const newItem: CategoryItem = {
    id: generateId(),
    text: '新项目',
    link: '',
    enabled: true,
    isMoreButton: false,
    buttonColor: '#f5f5f5',
    textColor: '#333333'
  }
  props.datas.categories[categoryIndex].items.push(newItem)
}

// 删除项目
const removeItem = (categoryIndex: number, itemIndex: number) => {
  props.datas.categories[categoryIndex].items.splice(itemIndex, 1)
}
</script>

<style lang="scss" scoped>
.newspaper-category-list-style {
  padding: 20px;

  .category-management {
    margin: 20px 0;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .category-item {
    margin-bottom: 20px;
  }

  .category-card {
    .category-header-content {
      display: flex;
      align-items: center;
    }
  }

  .items-management {
    margin-top: 15px;
  }

  .items-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .item-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.el-card__header) {
    padding: 15px 20px;
  }

  :deep(.el-card__body) {
    padding: 15px 20px;
  }
}
</style>
