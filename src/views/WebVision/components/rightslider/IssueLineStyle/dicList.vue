<template>
  <div class="h-full">
    <el-table :data="tableData" style="width: 100%" class="flex-1" border height="100%">
      <!-- <el-table-column type="expand">
        <template #default="{ row }">
          <div class="p-3">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="变量类型">
                <el-tag :type="getTagType(row.type)">{{ getTypeLabel(row.type) }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="变量说明">
                {{ getTypeDescription(row.type) }}
              </el-descriptions-item>
              <el-descriptions-item label="使用示例">
                <pre class="code-block">{{ getUsageExample(row) }}</pre>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="subCategory" label="分类" width="80">
        <template #default="{ row }">
          <el-tag size="small" :type="getSubCategoryColor(row.subCategory)" class="subcategory-tag">
            {{ getSubCategoryLabel(row.subCategory) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="keys" label="变量名称" min-width="160">
        <template #default="{ row }">
          <el-tag size="small" :type="getTagType(row.type)" class="mr-2">{{ row.keys }}</el-tag>
          <copy :content="row.keys" class="copy-icon" />
        </template>
      </el-table-column>
      <el-table-column prop="value" label="变量值" min-width="200">
        <template #default="{ row }">
          <span :title="row.value">
            <!-- {{ row.value }} -->
            <div v-html="row.value"></div>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="65">
        <template #default="{ row }">
          <el-tag size="small" :type="getTagType(row.type)">
            {{ getTypeLabel(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '@nanostores/vue'
import { editorStore } from '@/views/WebVision/components/componentsbiz/store'
import _ from 'lodash-es'

interface IProps {
  componentKey: string
}

const props = defineProps<IProps>()

const editorStoreData = useStore(editorStore)
console.log('🚀 ~ editorStoreData:', editorStoreData)

// 子分类显示配置
const subCategoryConfig = {
  predict: { label: '预测', color: 'warning' },
  title: { label: '标题', color: 'success' },
  code: { label: '代码', color: 'info' },
  hitDetail: { label: '详情', color: 'danger' },
  options: { label: '选项', color: 'primary' },
  default: { label: '默认', color: 'info' }
}

// 获取子分类显示标签
const getSubCategoryLabel = (subCategory: string): string => {
  return subCategoryConfig[subCategory]?.label || subCategory
}

// 获取子分类颜色
const getSubCategoryColor = (subCategory: string): string => {
  return subCategoryConfig[subCategory]?.color || 'primary'
}

// 变量类型配置
const typeConfig = {
  title: {
    label: '标题',
    tag: 'success',
    description: '标题分词后的变量，按空格分割',
    example: (row) => `标题分词: ${row.value}`
  },
  predict: {
    label: '预测',
    tag: 'warning',
    description: '预测相关的变量，包含预测值和结果',
    example: (row) => `预测结果: ${row.value}`
  },
  code: {
    label: '代码',
    tag: 'info',
    description: '预测代码相关的变量',
    example: (row) => `代码: ${row.value}`
  },
  hitDetail: {
    label: '命中详情',
    tag: 'danger',
    description: '预测命中的详细信息',
    example: (row) => `命中详情: ${row.value}`
  },
  options: {
    label: '选项',
    tag: 'info',
    description: '预测的可选项配置',
    example: (row) => `选项配置: ${row.value}`
  },
  other: {
    label: '其他',
    tag: 'info',
    description: '其他类型的变量',
    example: (row) => `${row.keys} = ${row.value}`
  }
}

// 获取变量类型（结合子分类和键名）
const getVariableType = (key: string, subCategory?: string): string => {
  // 优先根据子分类判断
  if (subCategory) {
    if (subCategory === 'predict') return 'predict'
    if (subCategory === 'title') return 'title'
    if (subCategory === 'code') return 'code'
    if (subCategory === 'hitDetail') return 'hitDetail'
    if (subCategory === 'options') return 'options'
  }

  // 然后根据键名判断
  if (key.startsWith('{{title')) return 'title'
  if (key.includes('predict')) return 'predict'
  if (key.includes('code')) return 'code'
  if (key.includes('hitDetail')) return 'hitDetail'
  if (key.includes('options')) return 'options'
  if (key.includes('shengxiao')) return 'shengxiao'
  return 'other'
}

// 获取标签类型
const getTagType = (type: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' => {
  return typeConfig[type]?.tag || 'info'
}

// 获取类型标签
const getTypeLabel = (type: string): string => {
  return typeConfig[type]?.label || '其他'
}

// 获取类型描述
const getTypeDescription = (type: string): string => {
  return typeConfig[type]?.description || ''
}

// 获取使用示例
const getUsageExample = (row: any): string => {
  return typeConfig[row.type]?.example(row) || ''
}

// 将 componentMap 转换为表格数据
const tableData = computed(() => {
  const componentData = editorStoreData.value.componentMap[props.componentKey] || {}
  const result = []

  // 遍历所有子分类
  _.forEach(componentData, (subCategoryData, subCategoryKey) => {
    if (_.isObject(subCategoryData) && !_.isArray(subCategoryData)) {
      // 遍历子分类下的所有键值对
      _.forEach(subCategoryData, (value, key) => {
        result.push({
          keys: key,
          value: _.isObject(value) ? JSON.stringify(value) : String(value),
          type: getVariableType(key, subCategoryKey),
          subCategory: subCategoryKey // 添加子分类信息
        })
      })
    } else {
      // 兼容旧数据结构（如果直接是值而不是对象）
      result.push({
        keys: subCategoryKey,
        value: _.isObject(subCategoryData) ? JSON.stringify(subCategoryData) : String(subCategoryData),
        type: getVariableType(subCategoryKey, 'default'),
        subCategory: 'default' // 默认分类
      })
    }
  })

  // 按照子分类、变量类型和名称排序
  return _.sortBy(result, ['subCategory', 'type', 'keys'])
})
</script>

<style scoped>
.h-full {
  height: calc(100vh - 271px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mr-2 {
  margin-right: 8px;
}

.subcategory-tag {
  font-size: 10px;
  font-weight: bold;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  display: inline-block;
}

.code-block {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  margin: 0;
  font-family: monospace;
}

.p-3 {
  padding: 12px;
}

:deep(.el-table) {
  flex: 1;
  height: 100% !important;
}

:deep(.el-table__inner-wrapper) {
  height: 100%;
}

:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
</style>
