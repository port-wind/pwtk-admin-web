<script setup lang="ts" name="LotteryRiddleSolutionStyle">
import { ref, watch, computed, defineProps } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import type { FormInstance } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/LotteryRiddleSolution/type'
import { useStore } from '@nanostores/vue'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import type { ILinkItem } from '@/views/WebVision/components/componentsbiz/LotteryRiddleSolution/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameType = ref(gameStoreData.value.gameType)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)
const forum = computed(() => gameStoreData.value.forum)

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 监听游戏类型变化
watch(gameType, (newVal) => {
  if (newVal) {
    props.datas.configParamJson.gameType = newVal
  }
})

watch(forum, (newVal) => {
  if (newVal) {
    props.datas.configParamJson.forumId = newVal.forumId
    props.datas.configParamJson.mainboardId = newVal.mainboardId
    props.datas.configParamJson.forumName = newVal.forumName
    props.datas.configParamJson.mainboardName = newVal.mainboardName
    props.datas.configParamJson.forumIcon = newVal.forumIcon
    props.datas.configParamJson.forumStatus = newVal.forumStatus
  }
})

// 预设配置
const presetConfigs = [
  {
    name: '经典绿色',
    config: {
      headerBackgroundColor: '#4caf50',
      headerTextColor: '#ffffff',
      itemBackgroundColor: '#ffffff',
      itemTextColor: '#333333',
      itemBorderColor: '#e0e0e0',
      riddleTextColor: '#2e7d32',
      answerTextColor: '#1976d2',
      resultTextColor: '#f44336'
    }
  },
  {
    name: '蓝色主题',
    config: {
      headerBackgroundColor: '#2196f3',
      headerTextColor: '#ffffff',
      itemBackgroundColor: '#ffffff',
      itemTextColor: '#333333',
      itemBorderColor: '#e3f2fd',
      riddleTextColor: '#1976d2',
      answerTextColor: '#0d47a1',
      resultTextColor: '#f44336'
    }
  },
  {
    name: '红色主题',
    config: {
      headerBackgroundColor: '#f44336',
      headerTextColor: '#ffffff',
      itemBackgroundColor: '#ffffff',
      itemTextColor: '#333333',
      itemBorderColor: '#ffebee',
      riddleTextColor: '#d32f2f',
      answerTextColor: '#b71c1c',
      resultTextColor: '#ff5722'
    }
  }
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  Object.assign(props.datas.configParamJson.listStyleJSON, preset.config)
}

const resetDefaultLink = (item: ILinkItem) => {
  props.datas.configParamJson.links.forEach((link) => {
    if (link.postId === item.postId) {
      link.link = '/detail/' + item.postUserId
      link.title = item._title
    }
  })
}
</script>

<template>
  <div class="lottery-riddle-solution-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />

      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />
      <ForumList :datas="datas" />

      <el-form-item label="获取期数数量" prop="getIssueNumber">
        <el-input-number v-model="datas.configParamJson.size" :min="1" :max="20" placeholder="请输入获取期数数量" />
      </el-form-item>

      <el-form-item label="年份" prop="year">
        <el-input-number v-model="datas.configParamJson.year" :min="2020" :max="2030" placeholder="请输入年份" />
      </el-form-item>

      <!-- <el-form-item label="是否显示">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item> -->
    </el-form>

    <el-divider content-position="left">链接列表管理</el-divider>

    <!-- 链接列表管理 -->
    <div class="links-management">
      <div class="links-header"></div>
      <div
        v-if="datas.configParamJson.links.length > 0"
        v-for="(link, linkIndex) in datas.configParamJson.links"
        :key="link.postIssue"
        class="link-item"
      >
        <div class="link-row">
          <el-input v-model="link.title" placeholder="链接文字" style="flex: 2; margin-right: 8px" />
          <el-input v-model="link.link" placeholder="链接地址" style="flex: 2; margin-right: 8px" />
          <!-- <el-switch v-model="link.enabled" style="margin-right: 8px" /> -->
          <el-button type="primary" size="small" @click="resetDefaultLink(link)">
            <el-icon><Refresh /></el-icon>
          </el-button>
          <!-- <el-button type="danger" size="small" @click="removeLinkItem(linkIndex)">
            <el-icon><Delete /></el-icon>
          </el-button> -->
        </div>
      </div>
      <div v-else>
        <h3 class="no-data">暂无数据</h3>
      </div>
    </div>

    <el-divider content-position="left">列表样式设置</el-divider>
    <!-- 预设配置 -->
    <div class="preset-configs">
      <el-row :gutter="10">
        <el-col :span="8" v-for="preset in presetConfigs" :key="preset.name">
          <el-button @click="applyPresetConfig(preset)" type="primary" plain size="small" class="preset-btn">
            {{ preset.name }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 样式设置 -->
    <el-form label-width="auto" label-position="top" class="style-form">
      <!-- 容器样式 -->
      <h4>容器样式</h4>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="容器内边距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.containerPadding" :min="0" :max="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目间距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemSpacing" :min="0" :max="50" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 项目样式 -->
      <h4>项目样式</h4>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="项目内边距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemPadding" :min="5" :max="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目圆角">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderRadius" :min="0" :max="20" />
          </el-form-item>
        </el-col>
      </el-row>

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
          <!-- <el-form-item label="边框宽度">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderWidth" :min="0" :max="5" />
          </el-form-item> -->
        </el-col>
      </el-row>

      <!-- 文字颜色 -->
      <h4>内容颜色</h4>
      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="谜语文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.riddleTextColor" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="答案文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.answerTextColor" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结果文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.resultTextColor" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.lottery-riddle-solution-style {
  padding: 0;

  .preset-configs {
    margin: 10px;

    .preset-btn {
      width: 100%;
    }
  }

  .links-management {
    margin: 10px 0;
  }

  .links-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-weight: bold;
  }

  .link-item {
    margin-bottom: 12px;
  }

  .link-row {
    display: flex;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
  }

  h4 {
    margin: 16px 0 8px 0;
    color: #606266;
    font-size: 14px;
    font-weight: bold;
  }

  .no-data {
    color: red;
    text-align: center;
  }
}

.style-form {
  padding: 0 10px;
}
</style>
