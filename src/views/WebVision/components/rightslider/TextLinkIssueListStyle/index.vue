<script setup lang="ts" name="TextLinkIssueListStyle">
import { ref, watch, computed, defineProps } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import type { FormInstance } from 'element-plus'
import { Delete, Refresh } from '@element-plus/icons-vue'
import type { IDatas, ILinkItem } from '@/views/WebVision/components/componentsbiz/TextLinkIssueList/type'
import { useStore } from '@nanostores/vue'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'

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

// // 生成唯一ID
// const generateId = () => {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2)
// }

// // 添加新链接项
// const addLinkItem = () => {
//   const newItem: LinkItem = {
//     id: generateId(),
//     text: '新链接',
//     link: '',
//     enabled: true,
//     textColor: '#333333',
//     backgroundColor: '#f5f5f5'
//   }
//   props.datas.configParamJson.links.push(newItem)
// }

const resetDefaultLink = (item: ILinkItem) => {
  props.datas.configParamJson.links.forEach((link) => {
    if (link.postId === item.postId) {
      link.link = '/detail/' + item.postUserId
      link.title = item._title
    }
  })
}

// // 删除链接项
// const removeLinkItem = (index: number) => {
//   if (props.datas.configParamJson.links.length <= 1) {
//     ElMessage.warning('至少保留一个链接项')
//     return
//   }
//   props.datas.configParamJson.links.splice(index, 1)
// }

// 预设的常用配置

// 应用预设配置
// const applyPresetConfig = (preset: any) => {
//   props.datas.configParamJson.listStyleJSON.columnsPerRow = preset.columnsPerRow
// }
</script>

<template>
  <div class="text-link-list-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />
      <ForumList :datas="datas" />

      <el-form-item label="开奖期数量" prop="size">
        <el-input-number v-model="datas.configParamJson.size" placeholder="请输入开奖期数量" />
      </el-form-item>

      <!-- <el-form-item label="组件标题">
        <el-input v-model="datas.configParamJson.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="datas.configParamJson.description" type="textarea" :rows="2" placeholder="请输入描述" />
      </el-form-item> -->

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

    <!-- 样式设置 -->
    <el-form label-width="auto" label-position="top" class="style-form">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="标题背景色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerBackgroundColor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题文字颜色">
            <el-color-picker v-model="datas.configParamJson.listStyleJSON.headerTextColor" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="22">
          <el-form-item label="每行显示数量">
            <el-slider
              v-model="datas.configParamJson.listStyleJSON.itemsPerRow"
              :min="1"
              :max="6"
              show-stops
              :marks="{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' }"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="项目间距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemSpacing" :min="0" :max="50" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目内边距">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemPadding" :min="5" :max="30" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="项目圆角">
        <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderRadius" :min="0" :max="20" />
      </el-form-item>

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
          <el-form-item label="边框宽度">
            <el-input-number v-model="datas.configParamJson.listStyleJSON.itemBorderWidth" :min="0" :max="5" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="悬停颜色">
        <el-color-picker v-model="datas.configParamJson.listStyleJSON.itemHoverColor" />
      </el-form-item>

      <el-form-item label="容器内边距">
        <el-input-number v-model="datas.configParamJson.listStyleJSON.containerPadding" :min="0" :max="50" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.text-link-list-style {
  padding: 0;

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
}
.style-form {
  padding: 0 10px;
}

.no-data {
  color: red;
  text-align: center;
}
</style>
