<script setup lang="ts" name="FixedButtonGroupRBStyle">
import { ref, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'

import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'

import type { IDatas } from '@/views/WebVision/components/componentsbiz/FixedButtonGroupRB/type'

interface IProps {
  datas: IDatas
}
defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// const textAlignOptions = ref([
//   {
//     label: '左对齐',
//     value: 'left'
//   },
//   {
//     label: '居中',
//     value: 'center'
//   },
//   {
//     label: '右对齐',
//     value: 'right'
//   }
// ])

// Add computed property for alignPosition
// const alignPosition = computed({
//   get: () => props.datas.configParamJson.alignPosition || 'right',
//   set: (value) => {
//     // Use Object.assign to avoid direct prop mutation
//     Object.assign(props.datas.configParamJson, { alignPosition: value })
//   }
// })
</script>

<template>
  <div class="FixedButtonGroupRBStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" show-alpha />
      </el-form-item>
      <el-form-item label="文字颜色" prop="textColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.textColor" show-alpha />
      </el-form-item>
      <!-- <el-form-item label="位置" prop="alignPosition" label-width="80px">
        <el-radio-group v-model="alignPosition">
          <el-radio v-for="item in textAlignOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.FixedButtonGroupRBStyle {
  .content-preview {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 16px;
    margin-top: 12px;
    background: #fafafa;

    .preview-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
    }

    .preview-content {
      border: 1px dashed #d3d3d3;
      padding: 20px;
      border-radius: 4px;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
    }
  }
}
</style>
