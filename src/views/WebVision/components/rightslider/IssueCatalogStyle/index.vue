<script setup lang="ts" name="Issue24Style">
import { ref, watch, computed, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'
import { useStore } from '@nanostores/vue'
import { type IDatas } from '@/views/WebVision/components/componentsbiz/IssueCatalog/type'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import { useIssueList } from '@/views/WebVision/components/componentsbiz/hooks/issueList'
import RichTextDialog from './richTextDialog.vue'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size) || 10,
  forumId: String(props.datas.configParamJson.forumId) || '10',
  page: Number(props.datas.configParamJson.page) || 1,
  isAll: String(props.datas.configParamJson.isAll) || 'n',
  issueGroup: Number(props.datas.configParamJson.issueGroup) || 7
})

const { refreshData, issueListItem } = useIssueList(issueParams)

const forum = computed(() => gameStoreData.value.forum)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

const dialogVisible = ref(false)
const tempText = ref('')

const richTextDialogRef = ref()

const openDynamicTemplateList = (postIssue: string, index: number) => {
  richTextDialogRef.value.openRichTextDynamicList('issueListTemplate', postIssue, index)
}

const deleteIssueListTemplate = (postIssue: string) => {
  props.datas.configParamJson.issueListTemplate = props.datas.configParamJson.issueListTemplate.filter(
    (item) => item.postIssue !== postIssue
  )
}

const openDynamicTemplate = (postIssue?: string) => {
  richTextDialogRef.value.openRichText('dynamicTemplate', postIssue || '')
}

const openFrontExtend_Content = () => {
  richTextDialogRef.value.openRichText('frontExtend_Content')
}

const openBackExtend_Content = () => {
  richTextDialogRef.value.openRichText('backendextend_Content')
}
</script>

<template>
  <div class="Issue24Style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />

      <!-- 论坛列表数据 -->
      <ForumList :datas="datas" />

      <el-form-item label="玩法风格" prop="playGameCode">
        <SelectPlayTypeCodeList v-model="datas.configParamJson.playGameCode" />
      </el-form-item>

      <!-- <el-form-item label="玩法风格" prop="size">
        <el-select v-model="datas.configParamJson.playGameCode" placeholder="请选择玩法风格" filterable>
          <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="开奖期数量" prop="size">
        <el-input-number v-model="datas.configParamJson.size" :min="1" placeholder="请输入开奖期数量" />
      </el-form-item>

      <el-form-item label="按照期数配置模版" prop="size">
        <el-switch v-model="datas.configParamJson.enableTemplateByPostIssue" />
      </el-form-item>
      <template v-for="(item, index) in datas.configParamJson.issueListTemplate" :key="item.postIssue">
        <el-form-item :label="`${item.postIssue}期`" prop="size">
          <el-button type="primary" @click="openDynamicTemplateList(item.postIssue, index)">配置</el-button>

          <!-- <el-button type="danger" @click="deleteIssueListTemplate(item.postIssue)">删除</el-button> -->
          <!-- <el-tooltip content="当前期数跟读取的期数不一致，删除后该期数将不再显示，谨慎操作" placement="top">
            <el-button type="danger" @click="deleteIssueListTemplate(item.postIssue)">删除</el-button>
          </el-tooltip> -->
        </el-form-item>
      </template>

      <el-form-item label="全局配置动态模版" prop="size">
        <el-button type="primary" @click="openDynamicTemplate('')">配置</el-button>
      </el-form-item>
      <el-form-item label="配置背景色" prop="size">
        背景色
        <el-color-picker v-model="datas.configParamJson.dynamicActiveBg" />
        背景对照文字颜色
        <el-color-picker v-model="datas.configParamJson.dynamicActiveBgText" />
        全局字体大小
        <el-input-number v-model="datas.configParamJson.dynamicFontSize" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="配置动态激活" prop="size">
        中奖文字颜色
        <el-color-picker v-model="datas.configParamJson.dynamicActiveText" />
        未开奖
        <el-color-picker v-model="datas.configParamJson.dynamicNoResult" />
      </el-form-item>

      <!-- 预览 -->
      <el-form-item label="配置前置扩展" prop="size">
        是否开启
        <el-switch v-model="datas.configParamJson.frontExtend_Enable" />
        <el-button type="primary" @click="openFrontExtend_Content">配置前置扩展</el-button>
      </el-form-item>

      <!-- 样式设置 -->
      <el-form-item label="配置后置扩展" prop="size">
        是否开启
        <el-switch v-model="datas.configParamJson.backendextend_Enable" />
        <el-button type="primary" @click="openBackExtend_Content">配置后置扩展</el-button>
      </el-form-item>

      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="主背景色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" />
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number v-model="datas.configParamJson.styleMain.borderRadius" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="外边框左右" prop="contentPaddingLeftRight">
        <el-input-number v-model="datas.configParamJson.styleMain.contentPaddingLeftRight" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
      <el-form-item label="外边框上下" prop="contentPaddingTopBottom">
        <el-input-number v-model="datas.configParamJson.styleMain.contentPaddingTopBottom" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="内边距左右" prop="paddingLeftRight">
        <el-input-number v-model="datas.configParamJson.styleMain.paddingLeftRight" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
      <el-form-item label="内边距上下" prop="paddingTopBottom">
        <el-input-number v-model="datas.configParamJson.styleMain.paddingTopBottom" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="期数背景色" prop="itemBackgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.itemBackgroundColor" />
      </el-form-item>

      <el-form-item label="列数" prop="columnCount">
        <el-input-number v-model="datas.configParamJson.styleMain.columnCount" :min="1" />
      </el-form-item>

      <el-form-item label="号码间距" prop="numberSpacing">
        <el-input-number v-model="datas.configParamJson.styleMain.itemSpacing" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="排版方向" prop="borderRadius">
        <el-select v-model="datas.configParamJson.styleMain.layout" placeholder="请选择排版方向" style="width: 120px">
          <el-option label="左侧" value="left" />
          <el-option label="居中" value="center" />
          <el-option label="右侧" value="right" />
          <el-option label="两端对齐" value="space-around" />
          <el-option label="两端对齐" value="space-between" />
          <el-option label="两端对齐" value="space-evenly" />
        </el-select>
      </el-form-item>

      <el-form-item label="期数间距" prop="listSpacing">
        <el-input-number v-model="datas.configParamJson.styleMain.listSpacing" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
    <!-- <RichTextDialog1 :datas="datas" ref="richTextDialogRef" /> -->

    <RichTextDialog :datas="datas" ref="richTextDialogRef" />
    <!-- 编辑器弹出框
    <el-dialog
      v-model="dialogVisible"
      title="编辑文本内容"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <WangEditor v-model="tempText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog> -->
  </div>
</template>

<style lang="scss" scoped>
.Issue24Style {
  .issue-items-list {
    max-height: 500px;
    overflow-y: auto;
  }

  .issue-item-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    margin-bottom: 16px;
    background: #fafafa;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
      border-radius: 8px 8px 0 0;

      span {
        font-weight: 500;
        color: #303133;
      }

      .item-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .item-content {
      padding: 16px;
    }
  }

  .numbers-management {
    .numbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .number-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background: #fff;
    }
  }
}
</style>
