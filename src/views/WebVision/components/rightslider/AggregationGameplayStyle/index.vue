<script setup lang="ts" name="AggregationGameplayStyle">
import { useStore } from '@nanostores/vue'

import type { FormInstance } from 'element-plus'

import { ref, defineProps } from 'vue'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'

import type { IDatas } from '@/views/WebVision/components/componentsbiz/AggregationGameplay/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const gameStoreData = useStore(gameStore)
const datas = computed(() => props.datas)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()
const forum = computed(() => gameStoreData.value.forum)
watch(forum, (newVal) => {
  if (newVal) {
    datas.value.configParamJson.forumId = newVal.forumId
    datas.value.configParamJson.mainboardId = newVal.mainboardId
    datas.value.configParamJson.forumName = newVal.forumName
    datas.value.configParamJson.mainboardName = newVal.mainboardName
    datas.value.configParamJson.forumIcon = newVal.forumIcon
    datas.value.configParamJson.forumStatus = newVal.forumStatus
  }
})
const textAlignOptions = ref([
  {
    label: '左对齐',
    value: 'left'
  },
  {
    label: '居中',
    value: 'center'
  },
  {
    label: '右对齐',
    value: 'right'
  }
])
</script>

<template>
  <div class="AggregationGameplayStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />
      <ForumList :datas="datas" />
      <el-form-item label="开奖期数量" prop="size">
        <el-input-number v-model="datas.configParamJson.size" placeholder="请输入开奖期数量" />
      </el-form-item>
      <el-form-item label="底部标题" prop="bottomTitle">
        <el-input v-model="datas.configParamJson.bottomTitle" placeholder="请输入底部标题" />
      </el-form-item>
      <el-form-item label="底部标题字体颜色" prop="bottomTitleFontColor">
        <el-color-picker v-model="datas.configParamJson.bottomTitleFontColor" />
      </el-form-item>
      <el-form-item label="底部标题字体大小" prop="bottomTitleFontSize">
        <el-input-number v-model="datas.configParamJson.bottomTitleFontSize" :min="12" :max="24" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
      <el-form-item label="底部标题字体粗细" prop="bottomTitleFontWeight">
        <el-input-number v-model="datas.configParamJson.bottomTitleFontWeight" :min="100" :max="900" :step="100" />
      </el-form-item>
      <el-form-item label="底部标题背景颜色" prop="bottomTitleBackgroundColor">
        <el-color-picker v-model="datas.configParamJson.bottomTitleBackgroundColor" />
      </el-form-item>

      <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item>

      <!-- 样式设置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.backgroundColor" />
      </el-form-item>

      <el-form-item label="文字颜色" prop="textColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.textColor" />
      </el-form-item>

      <el-form-item label="文字大小" prop="fontSize">
        <el-input-number v-model="datas.configParamJson.styleMain.fontSize" :min="12" :max="24" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="文字粗细" prop="fontWeight">
        <el-input-number v-model="datas.configParamJson.styleMain.fontWeight" :min="100" :max="900" :step="100" />
      </el-form-item>

      <el-form-item label="文字对齐" prop="textAlign">
        <el-select v-model="datas.configParamJson.styleMain.textAlign" placeholder="请选择文字对齐方式">
          <el-option v-for="item in textAlignOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number v-model="datas.configParamJson.styleMain.borderRadius" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="内边距" prop="padding">
        <el-input-number v-model="datas.configParamJson.styleMain.padding" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.AggregationGameplayStyle {
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
