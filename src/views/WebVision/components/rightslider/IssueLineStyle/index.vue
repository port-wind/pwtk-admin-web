<script setup lang="ts" name="IssueLineStyle">
import { ref, watch, computed, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'
import { useStore } from '@nanostores/vue'
import { type IDatas } from '@/views/WebVision/components/componentsbiz/IssueLine/type'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import { useIssueList, type IUseIssueListParams } from '../../componentsbiz/hooks/issueList'
import RichTextDialog1 from './richTextDialog1.vue'
import { EditPen } from '@element-plus/icons-vue'

interface Props {
  datas: IDatas
}

const props = defineProps<Props>()
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

const issueParams = reactive<IUseIssueListParams>({
  page: Number(props.datas.configParamJson.page) || 1,
  size: Number(props.datas.configParamJson.size) || 10,
  gameType: gameType.value,
  forumId: String(props.datas.configParamJson.forumId),
  isAll: props.datas.configParamJson.isAll || 'y',
  issueGroup: props.datas.configParamJson.issueGroup || 1
})

const { refreshData, issueListItem } = useIssueList(issueParams)

const forum = computed(() => gameStoreData.value.forum)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

const dialogVisible = ref(false)
const tempText = ref('')

const richTextDialogRef = ref()

const openDynamicTemplate = (postIssue?: string) => {
  richTextDialogRef.value.openRichText('dynamicTemplate', postIssue || '')
}

const openDynamicTemplateList = (index: number) => {
  console.log('🚀 ~ openDynamicTemplateList ~ index:', index)
  richTextDialogRef.value.openRichTextDynamicList('customJumpUrl', index)
}

const openFrontExtend_Content = () => {
  richTextDialogRef.value.openRichText('frontExtend_Content')
}

const openBackExtend_Content = () => {
  richTextDialogRef.value.openRichText('backendextend_Content')
}

const handleSizeChange = () => {
  props.datas.configParamJson.customJumpUrl = []
}

const addCustomJumpUrl = () => {
  if (props.datas.configParamJson.customJumpUrl.length >= Number(props.datas.configParamJson.size)) {
    ElMessage.error('自定义跳转链接数量不能超过期数数量')
    return
  }

  props.datas.configParamJson.customJumpUrl.push({
    index: props.datas.configParamJson.customJumpUrl.length + 1,
    name: '',
    url: ''
  })
}
const deleteCustomJumpUrl = (index: number) => {
  props.datas.configParamJson.customJumpUrl.splice(index, 1)
  props.datas.configParamJson.customJumpUrl.forEach((item, index) => {
    item.index = index + 1
  })
}
</script>

<template>
  <div class="IssueLineStyle">
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

      <el-form-item label="帖子页数" prop="size">
        <el-input-number v-model="datas.configParamJson.page" :min="1" placeholder="请输入帖子页数" />
      </el-form-item>

      <el-form-item label="开奖期数量" prop="size">
        <el-input-number
          v-model="datas.configParamJson.size"
          @change="handleSizeChange"
          :min="1"
          placeholder="请输入开奖期数量"
        />
        <el-tooltip content="修改期数会重置自定义跳转链接" placement="top">
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="只显示当前期数" prop="size">
        <el-switch v-model="datas.configParamJson.onlyShowCurrentIssue" />
      </el-form-item>

      <el-form-item label="查询全部帖子" prop="size">
        <el-switch v-model="datas.configParamJson.isAll" />
      </el-form-item>

      <el-form-item label="模版配置" prop="size">
        <el-button type="primary" @click="openDynamicTemplate('')">打开模版</el-button>
      </el-form-item>
      <!-- 自定义跳转链接 -->
      <el-form-item label="自定义跳转链接" prop="size">
        <el-button type="primary" @click="addCustomJumpUrl">添加</el-button>
      </el-form-item>
      <div
        v-for="(item, index) in datas.configParamJson.customJumpUrl"
        :key="'data_' + index"
        placeholder="请选择自定义跳转链接"
        class="custom-jump-url-item"
      >
        <el-select v-model="item.index" style="width: 120px" disabled>
          <el-option v-for="item in datas.configParamJson.size" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" plain :icon="EditPen" @click="openDynamicTemplateList(index)">编辑内容</el-button>
        <el-input v-model="item.url" placeholder="请输入跳转链接" clearable />
        <el-button size="small" type="danger" @click="deleteCustomJumpUrl(index)" icon="Delete"></el-button>
      </div>

      <el-divider content-position="left">前置扩展</el-divider>
      <!-- 前置扩展 -->
      是否开启
      <el-switch v-model="datas.configParamJson.frontExtend_Enable" />
      <el-button type="primary" @click="openFrontExtend_Content">配置前置扩展</el-button>
      样式是否一致
      <el-switch v-model="datas.configParamJson.frontExtend_StyleEnable" />

      <el-divider content-position="left">后置扩展</el-divider>
      是否开启
      <el-switch v-model="datas.configParamJson.backendextend_Enable" />
      <el-button type="primary" @click="openBackExtend_Content">配置后置扩展</el-button>
      样式是否一致
      <el-switch v-model="datas.configParamJson.backendextend_StyleEnable" />

      <!-- 样式配置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="主背景色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" />
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number v-model="datas.configParamJson.styleMain.borderRadius" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="阴影" prop="boxShadow">
        <el-input v-model="datas.configParamJson.styleMain.boxShadow" placeholder="请输入阴影" />
      </el-form-item>

      <el-form-item label="边框宽度" prop="borderWidth">
        <el-input-number v-model="datas.configParamJson.styleMain.borderWidth" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="边框样式" prop="borderStyle">
        <el-select
          v-model="datas.configParamJson.styleMain.borderStyle"
          placeholder="请选择边框样式"
          style="width: 120px"
        >
          <el-option label="实线" value="solid" />
          <el-option label="虚线" value="dashed" />
        </el-select>
      </el-form-item>

      <el-form-item label="边框颜色" prop="borderColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.borderColor" />
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

      <el-form-item label="行内内容间距" prop="numberSpacing">
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

      <el-form-item label="排版方向" prop="flexDirection">
        <el-select
          v-model="datas.configParamJson.styleMain.flexDirection"
          placeholder="请选择排版方向"
          style="width: 120px"
        >
          <el-option label="行" value="row" />
          <el-option label="列" value="column" />
        </el-select>
      </el-form-item>

      <el-form-item label="期数间距" prop="listSpacing">
        <el-input-number v-model="datas.configParamJson.styleMain.listSpacing" :min="0" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>

    <RichTextDialog1 :datas="datas" ref="richTextDialogRef" />
  </div>
</template>

<style lang="scss" scoped>
.IssueLineStyle {
}

.custom-jump-url-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
