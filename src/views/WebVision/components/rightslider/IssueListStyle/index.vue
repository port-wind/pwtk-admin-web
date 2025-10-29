<script setup lang="ts">
import { ref, inject } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/IssueList/type'

// 定义props
interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 注入父组件方法
const saveTemRend = inject<() => void>('saveTemRend')!

// 添加开奖信息项
const addIssueItem = () => {
  const newItem = {
    id: `item_${Date.now()}`,
    period: '167期',
    title: '新开奖信息',
    subtitle: '待配置',
    status: '已嗮幸',
    link: '',
    enabled: true
  }

  props.datas.configParamJson.issueItems.push(newItem)
  saveTemRend()
}

// 删除开奖信息项
const removeIssueItem = (index: number) => {
  props.datas.configParamJson.issueItems.splice(index, 1)
  saveTemRend()
}
</script>

<template>
  <div class="issue-list-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <!-- 基础设置 -->
      <!-- 基本信息 -->
      <div class="config-section">
        <h4 class="section-title">基本信息</h4>

        <el-form-item label="标题">
          <el-input v-model="datas.configParamJson.title" placeholder="请输入标题" @input="saveTemRend" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="datas.configParamJson.description" placeholder="请输入描述" @input="saveTemRend" />
        </el-form-item>

        <el-form-item label="启用状态">
          <el-switch v-model="datas.configParamJson.enable" @change="saveTemRend" />
        </el-form-item>

        <el-form-item label="最大显示数量">
          <el-input-number v-model="datas.configParamJson.maxDisplayCount" :min="1" :max="100" @change="saveTemRend" />
        </el-form-item>
      </div>

      <!-- 头部样式设置 -->
      <div class="config-section">
        <h4 class="section-title">头部样式</h4>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerBackgroundColor" @change="saveTemRend" />
        </el-form-item>

        <el-form-item label="文字颜色">
          <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerTextColor" @change="saveTemRend" />
        </el-form-item>

        <el-form-item label="内边距">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.headerPadding"
            :min="0"
            :max="50"
            @change="saveTemRend"
          />
        </el-form-item>
      </div>

      <!-- 列表样式设置 -->
      <div class="config-section">
        <h4 class="section-title">列表样式</h4>
        <el-form-item label="列表背景色">
          <el-color-picker v-model="datas.configParamJson.listStyleJSON.listBackgroundColor" @change="saveTemRend" />
        </el-form-item>

        <el-form-item label="项目内边距">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.itemPadding"
            :min="0"
            :max="30"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="项目间距">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.itemSpacing"
            :min="0"
            :max="20"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="边框颜色">
          <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemBorderColor" @change="saveTemRend" />
        </el-form-item>

        <el-form-item label="边框宽度">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.itemBorderWidth"
            :min="0"
            :max="5"
            @change="saveTemRend"
          />
        </el-form-item>
      </div>

      <!-- 文本颜色设置 -->
      <div class="config-section">
        <h4 class="section-title">文本颜色</h4>

        <el-form-item label="期数颜色">
          <el-color-picker
            :style="{ width: '32px' }"
            v-model="datas.configParamJson.listStyleJSON.periodTextColor"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="标题颜色">
          <el-color-picker
            :style="{ width: '32px' }"
            v-model="datas.configParamJson.listStyleJSON.titleTextColor"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="副标题颜色">
          <el-color-picker
            :style="{ width: '32px' }"
            v-model="datas.configParamJson.listStyleJSON.subtitleTextColor"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="状态颜色">
          <el-color-picker
            :style="{ width: '32px' }"
            v-model="datas.configParamJson.listStyleJSON.statusTextColor"
            @change="saveTemRend"
          />
        </el-form-item>
      </div>

      <!-- 容器样式设置 -->
      <div class="config-section">
        <h4 class="section-title">容器样式</h4>

        <el-form-item label="容器内边距">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.containerPadding"
            :min="0"
            :max="30"
            @change="saveTemRend"
          />
        </el-form-item>

        <el-form-item label="圆角大小">
          <el-input-number
            v-model="datas.configParamJson.listStyleJSON.borderRadius"
            :min="0"
            :max="20"
            @change="saveTemRend"
          />
        </el-form-item>
      </div>

      <!-- 开奖信息管理 -->
      <div class="config-section">
        <h4 class="section-title">开奖信息管理</h4>

        <el-button type="primary" size="small" @click="addIssueItem" style="margin-bottom: 10px">
          添加开奖信息
        </el-button>

        <div class="issue-items-list">
          <div v-for="(item, index) in datas.configParamJson.issueItems" :key="item.id" class="issue-item-card">
            <div class="item-header">
              <span>开奖信息 {{ index + 1 }}</span>
              <div class="item-actions">
                <el-switch v-model="item.enabled" size="small" @change="saveTemRend" />
                <el-button type="danger" size="small" link @click="removeIssueItem(index)">删除</el-button>
              </div>
            </div>

            <el-form-item label="期数" label-width="60px">
              <el-input v-model="item.period" size="small" @input="saveTemRend" />
            </el-form-item>

            <el-form-item label="标题" label-width="60px">
              <el-input v-model="item.title" size="small" @input="saveTemRend" />
            </el-form-item>

            <el-form-item label="副标题" label-width="60px">
              <el-input v-model="item.subtitle" size="small" @input="saveTemRend" />
            </el-form-item>

            <el-form-item label="状态" label-width="60px">
              <el-input v-model="item.status" size="small" @input="saveTemRend" />
            </el-form-item>

            <el-form-item label="链接" label-width="60px">
              <el-input v-model="item.link" size="small" placeholder="可选" @input="saveTemRend" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.issue-list-style {
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  .config-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .section-title {
    margin: 0 0 15px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    border-left: 3px solid #409eff;
    padding-left: 10px;
  }

  .issue-items-list {
    // max-height: 400px;
    // overflow-y: auto;
  }

  .issue-item-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 15px;
    margin-bottom: 10px;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      span {
        font-weight: 500;
        color: #333;
      }

      .item-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-form-item__label) {
  font-size: 13px;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-color-picker) {
  .el-color-picker__trigger {
    width: 100%;
    height: 32px;
  }
}
</style>
