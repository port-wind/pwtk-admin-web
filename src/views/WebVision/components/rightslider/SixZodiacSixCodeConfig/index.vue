<script setup lang="ts" name="SixZodiacSixCodeConfig">
import { ref, computed, watch, reactive } from 'vue'
import { useStore } from '@nanostores/vue'
import { Check, Close } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type {
  IDatas,
  SixZodiacRowType,
  SixZodiacRowConfig,
  SixZodiacIssueConfig
} from '@/views/WebVision/components/componentsbiz/Issue24/type'
import { useIssueList } from '@/views/WebVision/components/componentsbiz/hooks/issueList'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'

// 组件 props
interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 使用本地响应式引用而不是直接修改 props
const datas = ref(props.datas)

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

// Form validation
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 六肖六码行类型定义
const rowTypes: { key: SixZodiacRowType; label: string }[] = [
  { key: '六肖', label: '六肖行' },
  { key: '五肖', label: '五肖行' },
  { key: '四肖', label: '四肖行' },
  { key: '三肖', label: '三肖行' },
  { key: '二肖', label: '二肖行' },
  { key: '一肖', label: '一肖行' },
  { key: '内幕消息', label: '内幕消息行' },
  { key: '②码中特', label: '②码中特行' },
  { key: '③码中特', label: '③码中特行' },
  { key: '⑤码中特', label: '⑤码中特行' },
  { key: '⑥码中特', label: '⑥码中特行' }
]

// 创建响应式参数对象获取期数列表
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(datas.value.configParamJson.size),
  forumId: String(datas.value.configParamJson.forumId)
})

const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)

// 监听配置变化并更新参数
watch(
  () => [datas.value.configParamJson.size, datas.value.configParamJson.forumId, gameType.value],
  ([newSize, newForumId, newGameType]) => {
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = String(newGameType)
  }
)

// 当前选中的期数
const selectedIssueId = ref<string>('')
const selectedRowType = ref<SixZodiacRowType>('六肖')

// 初始化配置结构
const initializeConfig = () => {
  if (!datas.value.configParamJson.sixZodiacSixCodeConfig) {
    datas.value.configParamJson.sixZodiacSixCodeConfig = {
      itemBackgroundColor: '#f0f0f0',
      issueConfigs: {}
    }
  }
}

// 获取当前选中期数的配置
const getCurrentIssueConfig = (): SixZodiacIssueConfig => {
  initializeConfig()
  const issueConfigs = datas.value.configParamJson.sixZodiacSixCodeConfig!.issueConfigs!

  if (!issueConfigs[selectedIssueId.value]) {
    issueConfigs[selectedIssueId.value] = { rowConfigs: {} }
  }

  return issueConfigs[selectedIssueId.value]
}

// 获取当前选中行的配置
const getCurrentRowConfig = (): SixZodiacRowConfig => {
  const issueConfig = getCurrentIssueConfig()

  if (!issueConfig.rowConfigs![selectedRowType.value]) {
    issueConfig.rowConfigs![selectedRowType.value] = {
      advertisementContent: '',
      advertisementTextColor: '#333333',
      advertisementFontSize: 14
    }
  }

  return issueConfig.rowConfigs![selectedRowType.value]!
}

// 期数列表
const issueList = computed(() => {
  return processedIssueList.value.map((issue) => ({
    id: String(issue.postId),
    label: `${extractIssueNumber(issue.postIssue)}期`,
    issue
  }))
})

// 监听期数变化，自动选择第一个期数
watch(
  issueList,
  (newList) => {
    if (newList.length > 0 && !selectedIssueId.value) {
      selectedIssueId.value = newList[0].id
    }
  },
  { immediate: true }
)

// 监听gameType变化，重置选择状态
watch(gameType, () => {
  selectedIssueId.value = ''
  selectedRowType.value = '六肖'
})

// 监听共享的活跃tab状态，自动同步配置面板
watch(
  () => gameStoreData.value.activeTabIndex,
  (newTabIndex) => {
    if (issueList.value && issueList.value[newTabIndex]) {
      selectedIssueId.value = issueList.value[newTabIndex].id
    }
  }
)

// 当前行配置
const currentRowConfig = computed(() => {
  if (!selectedIssueId.value || !selectedRowType.value) {
    return {
      advertisementContent: '',
      advertisementTextColor: '#333333',
      advertisementFontSize: 14
    }
  }
  return getCurrentRowConfig()
})

// 更新配置
const updateRowConfig = (key: keyof SixZodiacRowConfig, value: any) => {
  const config = getCurrentRowConfig()
  config[key] = value
}

// 全局背景色
const globalItemBackgroundColor = computed({
  get: () => datas.value.configParamJson.sixZodiacSixCodeConfig?.itemBackgroundColor || '#f0f0f0',
  set: (value: string) => {
    initializeConfig()
    datas.value.configParamJson.sixZodiacSixCodeConfig!.itemBackgroundColor = value
  }
})

// 全局内容区域背景色
const globalContentAreaBackgroundColor = computed({
  get: () => datas.value.configParamJson.sixZodiacSixCodeConfig?.contentAreaBackgroundColor || '#000000',
  set: (value: string) => {
    initializeConfig()
    datas.value.configParamJson.sixZodiacSixCodeConfig!.contentAreaBackgroundColor = value
  }
})

// 当前广告内容
const currentAdvertisementContent = computed({
  get: () => {
    if (!selectedIssueId.value || !selectedRowType.value) return ''
    return currentRowConfig.value.advertisementContent || ''
  },
  set: (value: string) => {
    if (selectedIssueId.value && selectedRowType.value) {
      updateRowConfig('advertisementContent', value)
    }
  }
})

// 当前广告文字颜色
const currentAdvertisementTextColor = computed({
  get: () => {
    if (!selectedIssueId.value || !selectedRowType.value) return '#333333'
    return currentRowConfig.value.advertisementTextColor || '#333333'
  },
  set: (value: string) => {
    if (selectedIssueId.value && selectedRowType.value) {
      updateRowConfig('advertisementTextColor', value)
    }
  }
})

// 当前广告字体大小
const currentAdvertisementFontSize = computed({
  get: () => {
    if (!selectedIssueId.value || !selectedRowType.value) return 14
    return currentRowConfig.value.advertisementFontSize || 14
  },
  set: (value: number) => {
    if (selectedIssueId.value && selectedRowType.value) {
      updateRowConfig('advertisementFontSize', value)
    }
  }
})

// 获取行配置状态
const getRowConfigStatus = (issueId: string, rowType: SixZodiacRowType) => {
  const issueConfig = datas.value.configParamJson.sixZodiacSixCodeConfig?.issueConfigs?.[issueId]
  const rowConfig = issueConfig?.rowConfigs?.[rowType]

  if (!rowConfig?.advertisementContent) {
    return 'empty'
  }

  return 'configured'
}

// 批量操作
const batchFillAllRows = () => {
  if (!selectedIssueId.value || !selectedRowType.value) return

  const issueConfig = getCurrentIssueConfig()

  // 使用当前用户输入的值，而不是默认值
  const currentContent = currentAdvertisementContent.value || '兴云播雨隐苍穹'
  const currentTextColor = currentAdvertisementTextColor.value || '#333333'
  const currentFontSize = currentAdvertisementFontSize.value || 14

  rowTypes.forEach((rowType) => {
    if (!issueConfig.rowConfigs![rowType.key]) {
      issueConfig.rowConfigs![rowType.key] = {}
    }

    issueConfig.rowConfigs![rowType.key]!.advertisementContent = currentContent
    issueConfig.rowConfigs![rowType.key]!.advertisementTextColor = currentTextColor
    issueConfig.rowConfigs![rowType.key]!.advertisementFontSize = currentFontSize
  })
}
</script>

<template>
  <div class="six-zodiac-six-code-config">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 全局设置 -->
      <el-divider content-position="left">六肖六码配置</el-divider>

      <div class="global-settings">
        <el-form-item label="项目背景色（全局）" prop="itemBackgroundColor">
          <el-color-picker v-model="globalItemBackgroundColor" />
        </el-form-item>
        <el-form-item label="内容区域背景色（全局）" prop="contentAreaBackgroundColor">
          <el-color-picker v-model="globalContentAreaBackgroundColor" />
        </el-form-item>
      </div>

      <!-- 期数和行选择 -->
      <div class="selection-area">
        <div class="selection-row">
          <el-form-item class="form-item-inline">
            <el-select v-model="selectedIssueId" placeholder="请选择期数" style="width: 150px">
              <el-option v-for="item in issueList" :key="item.id" :label="item.label" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item class="form-item-inline">
            <el-select v-model="selectedRowType" placeholder="请选择行类型" style="width: 150px">
              <el-option v-for="rowType in rowTypes" :key="rowType.key" :label="rowType.label" :value="rowType.key" />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- 当前选中配置 -->
      <div class="current-config" v-if="selectedIssueId && selectedRowType">
        <div class="config-header">
          <span class="config-title">
            当前配置: {{ issueList.find((i) => i.id === selectedIssueId)?.label }} -
            {{ rowTypes.find((r) => r.key === selectedRowType)?.label }}
          </span>
        </div>

        <el-form-item label="广告内容" prop="advertisementContent">
          <el-input v-model="currentAdvertisementContent" placeholder="请输入广告内容" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="广告文字颜色" prop="advertisementTextColor">
          <el-color-picker v-model="currentAdvertisementTextColor" />
        </el-form-item>

        <el-form-item label="广告字体大小" prop="advertisementFontSize">
          <el-input-number v-model="currentAdvertisementFontSize" :min="12" :max="20" />
          <span style="margin-left: 8px">px</span>
        </el-form-item>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions">
        <el-button @click="batchFillAllRows" size="small">批量填充当前期数所有行</el-button>
      </div>
    </el-form>

    <!-- 配置状态概览 -->
    <div class="config-overview">
      <div class="overview-header">
        <span>配置状态概览</span>
      </div>
      <div class="overview-table-container">
        <table class="overview-table">
          <thead>
            <tr>
              <th class="issue-header">期数/行</th>
              <th v-for="rowType in rowTypes" :key="rowType.key" class="row-header">
                {{ rowType.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="issue in issueList" :key="issue.id" class="issue-row">
              <td class="issue-cell">{{ issue.label }}</td>
              <td
                v-for="rowType in rowTypes"
                :key="rowType.key"
                class="status-cell"
                :class="getRowConfigStatus(issue.id, rowType.key)"
                @click="
                  () => {
                    selectedIssueId = issue.id
                    selectedRowType = rowType.key
                  }
                "
              >
                <el-icon v-if="getRowConfigStatus(issue.id, rowType.key) === 'configured'" class="status-icon">
                  <Check />
                </el-icon>
                <el-icon v-else class="status-icon">
                  <Close />
                </el-icon>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.six-zodiac-six-code-config {
  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  .global-settings {
    margin-bottom: 20px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
  }

  .selection-area {
    margin-bottom: 20px;

    .selection-row {
      display: flex;
      align-items: center;
      gap: 10px;
      .form-item-inline {
        margin-bottom: 0;
      }
    }
  }

  .current-config {
    margin-bottom: 20px;
    padding: 16px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background: #fafbfc;

    .config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .config-title {
        font-weight: 500;
        color: #303133;
      }

      .config-actions {
        display: flex;
        gap: 8px;
      }
    }
  }

  .batch-actions {
    margin-bottom: 20px;
    text-align: center;
  }

  .config-overview {
    .overview-header {
      margin-bottom: 12px;
      font-weight: 500;
      color: #303133;
    }

    .overview-table-container {
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      overflow-x: auto;
      overflow-y: visible;
      max-width: 100%;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      /* 自定义滚动条 */
      &::-webkit-scrollbar {
        height: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;

        &:hover {
          background: #a8a8a8;
        }
      }

      .overview-table {
        width: 100%;
        min-width: 800px; /* 确保表格有足够的最小宽度 */
        border-collapse: collapse;
        font-size: 13px;
        table-layout: auto;

        thead {
          position: sticky;
          top: 0;
          z-index: 2;
          background: #f5f7fa;

          th {
            background: #f5f7fa;
            font-weight: 500;
            color: #303133;
            padding: 12px 8px;
            text-align: center;
            border-bottom: 2px solid #e4e7ed;
            border-right: 1px solid #e4e7ed;
            white-space: nowrap;
            font-size: 12px;
            line-height: 1.4;
            min-width: 60px;

            &:last-child {
              border-right: none;
            }

            &.issue-header {
              background: #f5f7fa;
              position: sticky;
              left: 0;
              z-index: 3;
              min-width: 70px;
              width: 70px;
              box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
            }
          }
        }

        tbody {
          tr {
            border-bottom: 1px solid #e4e7ed;

            &:last-child {
              border-bottom: none;
            }

            &:hover {
              background: #fafafa;
            }

            td {
              padding: 10px 8px;
              text-align: center;
              border-right: 1px solid #e4e7ed;
              vertical-align: middle;
              min-width: 60px;

              &:last-child {
                border-right: none;
              }

              &.issue-cell {
                background: #fafafa;
                font-weight: 500;
                font-size: 12px;
                position: sticky;
                left: 0;
                z-index: 2;
                min-width: 70px;
                width: 70px;
                box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
              }

              &.status-cell {
                cursor: pointer;
                transition: all 0.2s;
                min-width: 60px;
                width: 60px;

                &:hover {
                  background: #f0f9ff;
                  transform: scale(1.05);
                }

                &.configured {
                  background: #f0f9ff;
                  color: #1890ff;
                  border: 1px solid #d4edda;
                }

                &.empty {
                  background: #fff2f0;
                  color: #ff4d4f;
                  border: 1px solid #f5c6cb;
                }

                .status-icon {
                  font-size: 16px;
                  transition: transform 0.2s;
                }

                &:hover .status-icon {
                  transform: scale(1.2);
                }
              }
            }
          }
        }
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .config-overview {
      .overview-table-container {
        .overview-table {
          min-width: 600px;
          font-size: 11px;

          thead th {
            padding: 8px 4px;
            font-size: 10px;

            &.issue-header {
              min-width: 50px;
              width: 50px;
            }
          }

          tbody td {
            padding: 6px 4px;

            &.issue-cell {
              min-width: 50px;
              width: 50px;
              font-size: 10px;
            }

            &.status-cell {
              min-width: 40px;
              width: 40px;

              .status-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .config-overview {
      .overview-table-container {
        .overview-table {
          min-width: 500px;
          font-size: 10px;

          thead th {
            padding: 6px 2px;
            font-size: 9px;
          }

          tbody td {
            padding: 4px 2px;

            &.status-cell .status-icon {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
