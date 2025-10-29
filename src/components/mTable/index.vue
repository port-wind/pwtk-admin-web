<template>
  <!-- 表格组件 -->
  <el-table
    :data="props.data"
    v-loading="isLoading"
    :element-loading-text="elementLoadingText"
    :element-loading-spinner="elementLoadingSpinner"
    :element-loading-background="elementLoadingBackground"
    :element-loading-svg="elementLoadingSvg"
    :element-loading-svg-view-box="elementLoadingSvgViewBox"
    :height="tableHeight"
    @row-click="handleRowClick"
    v-dragable="tableDragableOptions"
    :style="{ width: '100%', height: tableHeight ? 'initial' : '100%' }"
    v-bind="$attrs"
  >
    <!-- Multi-select checkbox column -->
    <el-table-column v-if="multiSelect" width="40" fixed="left">
      <template #header>
        <el-checkbox
          :model-value="multiSelectLogic?.isAllSelected.value"
          :indeterminate="multiSelectLogic?.isIndeterminate.value"
          @click="multiSelectLogic?.handleSelectAll(props.data)(!multiSelectLogic?.isAllSelected.value)"
        />
      </template>
      <template #default="{ row }">
        <el-checkbox
          v-model="row.checked"
          :disabled="multiSelectLogic?.checkableStrategy?.(row) || false"
          @change="(val) => multiSelectLogic?.handleCheckboxChange(props.data)(row, !!val)"
        />
      </template>
    </el-table-column>

    <!-- 渲染一般列和自定义插槽列 -->
    <template v-for="(item, index) in tableOption" :key="index">
      <!-- 表格列 -->
      <el-table-column
        v-if="item.prop && !item.action"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :min-width="item.minWidth"
        :max-width="item.maxWidth"
        :align="item.align"
        :fixed="item.fixed"
        :type="item.type"
        v-bind="{
          ...(item.showOmission ? { 'show-overflow-tooltip': { disabled: true } } : {}),
          ...item.columAttr
        }"
      >
        <template #default="scope">
          <!-- 自定义插槽 -->
          <slot v-if="item.slot" :name="item.slot" :scope="scope"></slot>

          <!-- 日期格式化 -->
          <template v-else-if="item.dateName">
            {{
              item.dateName
                ? unitFormatDate(
                    typeof scope.row[item.dateName] === 'string'
                      ? Number(scope.row[item.dateName])
                      : scope.row[item.dateName],
                    item.formatStr || 'yyyy-MM-dd'
                  )
                : null
            }}
          </template>

          <!-- 图片数据  -->
          <template v-else-if="item.cellType === 'image'">
            <el-image v-if="item.image" class="m_image" :src="item.image.src" />
          </template>

          <!-- JSON数据显示  只要在JSON中配置了选项就可以在这里遍历显示-->
          <template v-else-if="item.json">
            {{ jsonOptions[item.json.sourceName][scope.row[item.json.keyName]] }}
          </template>

          <!-- 可复制文本 -->
          <template v-else-if="item.isCopyText">
            <span>{{ scope.row[item.prop!] }}</span>
            <copy :content="scope.row[item.prop!]" />
          </template>
          <template v-else-if="item.truncateText">
            <span>{{ truncateText(scope.row[item.prop!], item.truncateTextLength) }}</span>
          </template>
          <!-- 普通文本 -->
          <span v-else>{{ scope.row[item.prop!] }}</span>
        </template>
      </el-table-column>
    </template>

    <!-- 渲染操作列 -->
    <el-table-column
      v-if="actionOption"
      :label="actionOption.label"
      :width="actionOption.width"
      :align="actionOption.align"
      fixed="right"
    >
      <template #default="scope">
        <slot name="action" :scope="scope"></slot>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页组件 -->
  <div v-if="pagination && !isLoading" class="pagination" :style="{ justifyContent }">
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>
<script lang="ts" setup>
import { type PropType, computed, ref, watch } from 'vue'
import { vDragable } from 'element-plus-table-dragable'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { truncateText } from '@/utils/dataFormat'
import jsonOptions from '@/const/options.json'
import type { TableOptions } from './types'
import type { MultiSelectLogic } from '@/composables/useMultiSelectLogic'

// 移动数组元素的函数
function moveArrayItem(arr, fromIndex, toIndex) {
  // 创建数组副本
  const newData = [...arr]

  // 确保索引有效
  if (fromIndex < 0 || fromIndex >= newData.length || toIndex < 0 || toIndex >= newData.length) {
    console.log('无效的索引')
    return newData
  }

  // 移除并插入元素
  const [movedItem] = newData.splice(fromIndex, 1)
  newData.splice(toIndex, 0, movedItem)

  return newData
}

// 定义props
const props = defineProps({
  // 表格配置选项
  options: {
    type: Array as PropType<TableOptions[]>,
    required: true
  },
  // 表格数据
  data: {
    type: Array as () => any[],
    required: true
  },
  // 加载文案
  elementLoadingText: {
    type: String
  },
  // 加载图标名
  elementLoadingSpinner: {
    type: String
  },
  // 加载背景颜色
  elementLoadingBackground: {
    type: String
  },
  // 加载图标是svg
  elementLoadingSvg: {
    type: String
  },
  // 加载图标是svg的配置
  elementLoadingSvgViewBox: {
    type: String
  },
  // 是否显示分页
  pagination: {
    type: Boolean,
    default: false
  },
  // 显示分页的对齐方式
  paginationAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  // 当前是第几页
  currentPage: {
    type: Number,
    default: 1
  },
  // 当前一页多少条数据
  pageSize: {
    type: Number,
    default: 15
  },
  // 显示分页数据多少条的选项
  pageSizes: {
    type: Array<number>,
    default: () => [15, 30, 50, 100]
  },
  // 数据总条数
  total: {
    type: Number,
    default: 0
  },
  //表格高度
  tableHeight: {
    type: String
  },
  isLoading: {
    type: Boolean
  },
  defaultOptions: {
    type: Array,
    default: () => []
  },
  isDragable: {
    type: Boolean,
    default: false
  },
  dragableTableOptions: {
    type: Array<any>,
    default: () => []
  },
  // 是否启用多选功能
  multiSelect: {
    type: Boolean,
    default: false
  },
  // Multi-select logic from external composable
  multiSelectLogic: {
    type: Object as PropType<MultiSelectLogic>,
    default: null
  }
})

// 定义emits
const emits = defineEmits(['size-change', 'current-change', 'row-click', 'on-drag'])

// 分页的每一页数据变化
const handleSizeChange = (val: number) => {
  emits('size-change', val)
}

// 分页页数改变
const handleCurrentChange = (val: number) => {
  emits('current-change', val)
}

// 行点击事件处理函数
const handleRowClick = (row: any, _column: any, _event: Event) => {
  emits('row-click', row)
}

// 过滤操作项之后的配置
const tableOption = computed(() => props.options.filter((item) => !item.action))

// 操作项
const actionOption = computed(() => props.options.find((item) => item.action))

// 表格分页的排列方式
const justifyContent = computed(() => {
  if (props.paginationAlign === 'left') return 'flex-start'
  if (props.paginationAlign === 'right') return 'flex-end'
  return 'center'
})

const defaultDragableOptions = [
  {
    selector: 'tbody',
    option: {
      animation: 150,
      onEnd: (evt) => {
        const newData = moveArrayItem(props.data, evt.oldIndex, evt.newIndex)
        emits('on-drag', newData)
      }
    }
  }
]

const tableDragableOptions = ref<boolean | Array<any>>([])

if (props.isDragable) {
  if (props.dragableTableOptions.length > 0) {
    tableDragableOptions.value = props.dragableTableOptions
  } else {
    tableDragableOptions.value = defaultDragableOptions
  }
} else {
  tableDragableOptions.value = false
}

// Initialize multi-select data when data changes
watch(
  () => props.data,
  (newData) => {
    if (props.multiSelect && props.multiSelectLogic && newData) {
      props.multiSelectLogic.initializeData(newData)
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="css" scoped>
.m_image {
  width: 48px;
  height: 48px;
}
</style>
