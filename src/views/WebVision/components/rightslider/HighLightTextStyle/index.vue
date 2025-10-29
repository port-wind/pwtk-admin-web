<!-- HighLightText 配置面板 -->
<template>
  <div class="highlight-text-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <shareComponent :datas="datas" />
      <componentHeadTitle :datas="datas" title="高亮文本设置" />
      <StoreGameTypeList :datas="datas" />
      <!-- 论坛列表数据 -->
      <ForumList :datas="datas" />
      <el-form-item label="page" prop="size">
        <el-input-number v-model="datas.configParamJson.page" :min="1" placeholder="请输入帖子页数" />
      </el-form-item>
      <el-form-item label="size" prop="size">
        <el-input-number v-model="datas.configParamJson.size" :min="1" placeholder="请输入帖子页数" />
      </el-form-item>
      <el-form-item label="是否查询全部帖子" prop="isAll">
        <el-radio-group v-model="datas.configParamJson.isAll">
          <el-radio-button label="y">是</el-radio-button>
          <el-radio-button label="n">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="期数分组" prop="issueGroup">
        <el-input-number v-model="datas.configParamJson.issueGroup" :min="1" placeholder="请输入期数分组" />
      </el-form-item>
      <!-- 文本内容 -->
      <el-form-item label="文本内容">
        <div class="text-preview">
          <div v-html="datas.configParamJson.text" class="preview-content"></div>
          <el-button type="primary" @click="openEditor">编辑内容</el-button>
        </div>
      </el-form-item>

      <!-- 高亮样式 -->
      <!-- <el-form-item label="高亮样式">
        <el-select v-model="datas.configParamJson.highlightType" class="w-full">
          <el-option label="背景高亮" value="background" />
          <el-option label="下划线" value="underline" />
          <el-option label="记号笔" value="marker" />
          <el-option label="渐变文字" value="gradient" />
        </el-select>
      </el-form-item> -->

      <!-- 字体设置 -->
      <!-- <el-form-item label="字体大小">
        <el-input-number v-model="datas.configParamJson.fontSize" :min="12" :max="72" class="w-full" />
      </el-form-item>

      <el-form-item label="字体粗细">
        <el-select v-model="datas.configParamJson.fontWeight" class="w-full">
          <el-option label="正常" :value="400" />
          <el-option label="加粗" :value="500" />
          <el-option label="特粗" :value="600" />
        </el-select>
      </el-form-item> -->

      <!-- 颜色设置 -->
      <!-- <el-form-item label="文本颜色">
        <el-color-picker v-model="datas.configParamJson.textColor" show-alpha />
      </el-form-item>

      <el-form-item label="高亮颜色">
        <el-color-picker v-model="datas.configParamJson.highlightColor" show-alpha />
      </el-form-item> -->

      <!-- 渐变色设置 -->
      <!-- <template v-if="datas.configParamJson.highlightType === 'gradient'">
        <el-form-item label="渐变起始色">
          <el-color-picker v-model="datas.configParamJson.gradientColors!.from" show-alpha />
        </el-form-item>
        <el-form-item label="渐变结束色">
          <el-color-picker v-model="datas.configParamJson.gradientColors!.to" show-alpha />
        </el-form-item>
      </template> -->

      <!-- 动画效果 -->
      <!-- <el-form-item label="动画效果">
        <el-select v-model="datas.configParamJson.animation" class="w-full">
          <el-option label="无" value="none" />
          <el-option label="闪烁" value="flash" />
          <el-option label="脉冲" value="pulse" />
        </el-select>
      </el-form-item> -->

      <!-- 对齐方式 -->
      <!-- <el-form-item label="对齐方式">
        <el-radio-group v-model="datas.configParamJson.textAlign" class="w-full">
          <el-radio-button label="left">左对齐</el-radio-button>
          <el-radio-button label="center">居中</el-radio-button>
          <el-radio-button label="right">右对齐</el-radio-button>
        </el-radio-group>
      </el-form-item> -->

      <!-- 行高 -->
      <!-- <el-form-item label="行高">
        <el-input-number v-model="datas.configParamJson.lineHeight" :min="1" :max="3" :step="0.1" class="w-full" />
      </el-form-item> -->

      <!-- 内边距 -->
      <!-- <el-form-item label="内边距">
        <div class="grid grid-cols-2 gap-4">
          <el-input-number v-model="datas.configParamJson.padding.top" :min="0" :max="100" placeholder="上" />
          <el-input-number v-model="datas.configParamJson.padding.right" :min="0" :max="100" placeholder="右" />
          <el-input-number v-model="datas.configParamJson.padding.bottom" :min="0" :max="100" placeholder="下" />
          <el-input-number v-model="datas.configParamJson.padding.left" :min="0" :max="100" placeholder="左" />
        </div>
      </el-form-item> -->
    </el-form>

    <!-- 编辑器弹出框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑文本内容"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <!-- <WangEditor v-model="tempText" /> -->
      <!-- 使用 TinyEditor 并传入合并标签数据 -->
      <TinyEditor v-model="tempText" :height="600" :mergetags-list="mergetagsList" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'
import { useStore } from '@nanostores/vue'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import shareComponent from '../shareComponent/index.vue'
import componentHeadTitle from '../componentHeadTitle/index.vue'
// import TextEditor from '@/components/TextEditor/index.vue'
import WangEditor from '@/components/WangEditor/index.vue'
import TinyEditor from '@/components/TinyEditor/index.vue'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/HighLightText/type'
import { useIssueList, type IUseIssueListParams } from '@/views/WebVision/components/componentsbiz/hooks/issueList'

interface Props {
  datas: IDatas
}

const props = defineProps<Props>()
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

const issueParams = reactive<IUseIssueListParams>({
  page: Number(props.datas.configParamJson.page) || 1,
  size: Number(props.datas.configParamJson.size) || 10,
  gameType: gameType.value ?? '',
  forumId: String(props.datas.configParamJson.forumId) ?? '',
  isAll: props.datas.configParamJson.isAll || 'y',
  issueGroup: props.datas.configParamJson.issueGroup || 1
})

const { refreshData, issueListItem } = useIssueList(issueParams)

const dialogVisible = ref(false)
const tempText = ref('')
const rules = ref({})

// 定义合并标签数据（可选）
const mergetagsList = ref([])

watch(
  () => props.datas.configParamJson,
  (newVal) => {
    console.log('🚀 ~ newVal:', newVal.gameType, newVal.forumId)
    if (newVal.gameType && newVal.forumId) {
      refreshData({
        page: Number(newVal.page) || 1,
        size: Number(newVal.size) || 10,
        gameType: gameType.value,
        forumId: String(newVal.forumId),
        isAll: newVal.isAll || 'y',
        issueGroup: newVal.issueGroup || 1
      })
    }
  },
  { deep: true }
)

// 打开编辑器
const openEditor = () => {
  tempText.value = props.datas.configParamJson.text
  dialogVisible.value = true
}

// 保存内容
const handleSave = () => {
  props.datas.configParamJson.text = tempText.value
  dialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.highlight-text-style {
  padding: 0 16px;

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  .w-full {
    width: 100%;
  }

  .grid {
    display: grid;
    gap: 1rem;

    &-cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .text-preview {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 12px;
    margin-bottom: 10px;
    width: 100%;

    .preview-content {
      min-height: 100px;
      max-height: 200px;
      overflow-y: auto;
      margin-bottom: 10px;
      padding: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;
    }
  }
}

.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
