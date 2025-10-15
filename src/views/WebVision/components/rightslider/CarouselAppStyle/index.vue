<template>
  <div class="CarouselAppStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentName }}</h2>

    <!-- 基础配置 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <!-- Tab列表 -->
      <div class="tab-list">
        <div v-for="(tab, index) in datas.configParamJson.tabs" :key="index" class="tab-item-config">
          <div class="tab-header" @click="toggleCollapse(index)">
            <div class="header-left">
              <el-icon class="collapse-icon" :class="{ collapsed: collapsedTabs[index] }">
                <ArrowDown />
              </el-icon>
              <h3>Tab {{ index + 1 }}: {{ tab.title || '未命名' }}</h3>
            </div>
            <el-button
              type="danger"
              size="small"
              @click.stop="removeTab(index)"
              :disabled="datas.configParamJson.tabs.length <= 1"
            >
              删除
            </el-button>
          </div>
          <div class="tab-config-content" v-show="!collapsedTabs[index]">
            <!-- Tab标题 -->
            <el-form-item label="Tab标题">
              <el-input v-model="tab.title" placeholder="输入tab标题" />
            </el-form-item>

            <!-- 推广横幅配置 -->
            <h4>推广横幅</h4>
            <el-form-item label="推广文字">
              <el-input v-model="tab.promoText" placeholder="例如：特码点击在线" />
            </el-form-item>
            <el-form-item label="金额显示">
              <el-input v-model="tab.amount" placeholder="例如：首充送988元" />
            </el-form-item>
            <el-form-item label="横幅颜色">
              <el-color-picker v-model="tab.bannerColor" />
            </el-form-item>

            <el-form-item label="横幅图片">
              <el-input v-model="tab.banner" placeholder="输入横幅图片URL或路径" />
              <FileImageUpload v-model="tab.banner" type="info" :upload-from="EUploadFrom.BBS_MAINBOARD_ICON" />
            </el-form-item>

            <!-- 应用信息配置 -->
            <h4>应用信息</h4>
            <el-form-item label="应用名称">
              <el-input v-model="tab.appName" placeholder="例如：tk6图库 APP" />
            </el-form-item>
            <el-form-item label="应用图标">
              <el-input v-model="tab.appIcon" placeholder="输入图标URL或路径" />
              <FileImageUpload v-model="tab.appIcon" type="info" :upload-from="EUploadFrom.BBS_MAINBOARD_ICON" />
            </el-form-item>
            <el-form-item label="应用大小">
              <el-input v-model="tab.appSize" placeholder="例如：60.28MB" />
            </el-form-item>
            <el-form-item label="应用分类">
              <el-input v-model="tab.category" placeholder="例如：图库软件" />
            </el-form-item>
            <el-form-item label="下载次数">
              <el-input v-model="tab.downloads" placeholder="例如：已有本站评分9999万，请放心下载！" />
            </el-form-item>
            <el-form-item label="评分">
              <el-input v-model="tab.rating" placeholder="例如：9.9" />
            </el-form-item>

            <!-- 应用截图 -->
            <el-form-item label="应用截图">
              <el-input v-model="tab.screenshot" placeholder="输入截图URL或路径" />
            </el-form-item>

            <!-- 下载链接配置 -->
            <h4>下载链接</h4>
            <el-form-item label="Android下载">
              <el-input v-model="tab.androidDownload" placeholder="Android应用下载链接" />
            </el-form-item>
            <el-form-item label="iOS下载">
              <el-input v-model="tab.iosDownload" placeholder="iOS应用下载链接" />
            </el-form-item>
            <el-form-item label="官网链接">
              <el-input v-model="tab.webUrl" placeholder="官网访问链接" />
            </el-form-item>

            <!-- 状态文字 -->
            <el-form-item label="状态文字">
              <el-input v-model="tab.statusText" placeholder="例如：已有本站评分9999万，请放心下载！" />
            </el-form-item>
          </div>
        </div>
      </div>

      <!-- 添加Tab按钮 -->
      <div class="add-tab-btn">
        <el-button type="primary" @click="addTab">添加新Tab</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="CarouselAppStyle">
import { ref, reactive, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import type { FormRules } from 'element-plus'
import type { IDatas, TabItem } from '@/views/WebVision/components/componentsbiz/CarouselApp/type'
import { EUploadFrom } from '@/components/uploadImage/type'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()

const rules = ref<FormRules>({
  // componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
  // pageCode: [{ required: true, message: '请输入页面编码', trigger: 'blur' }]
})

const ruleFormRef = ref()

// 折叠状态管理
const collapsedTabs = reactive<Record<number, boolean>>({})

// 初始化折叠状态
const initCollapsedState = () => {
  props.datas.configParamJson.tabs.forEach((_, index) => {
    if (!(index in collapsedTabs)) {
      collapsedTabs[index] = false // 默认展开
    }
  })
}

// 监听tabs变化，更新折叠状态
watch(
  () => props.datas.configParamJson.tabs.length,
  () => {
    initCollapsedState()
  },
  { immediate: true }
)

// 切换折叠状态
const toggleCollapse = (index: number) => {
  collapsedTabs[index] = !collapsedTabs[index]
}

// 添加新Tab
const addTab = () => {
  const newTab: TabItem = {
    title: `新Tab ${props.datas.configParamJson.tabs.length + 1}`,
    promoText: '特码点击在线',
    amount: '首充送988元',
    bannerColor: '#ff6b6b',
    appIcon: '',
    appName: '新应用',
    appSize: '50MB',
    banner: '',
    category: '应用软件',
    downloads: '已有本站评分1000万',
    rating: '9.5',
    screenshot: '',
    androidDownload: '',
    iosDownload: '',
    webUrl: '',
    statusText: '已有本站评分1000万，请放心下载！'
  }
  props.datas.configParamJson.tabs.push(newTab)
}

// 删除Tab
const removeTab = (index: number) => {
  if (props.datas.configParamJson.tabs.length > 1) {
    props.datas.configParamJson.tabs.splice(index, 1)
  }
}
</script>

<style scoped lang="scss">
.form-container {
  :deep(.el-form-item__label) {
    text-align: left;
  }
}

.tab-list {
  // max-height: 70vh;
  // overflow-y: auto;
  // margin-bottom: 16px;
}

.tab-item-config {
  // border: 1px solid #e4e7ed;
  // border-radius: 8px;
  margin-bottom: 10px;
  background: #fafafa;

  .tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f5f7fa;
    // border-bottom: 1px solid #e4e7ed;
    // border-radius: 8px 8px 0 0;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background: #eaeef3;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
      }
    }

    .collapse-icon {
      transition: transform 0.3s;
      color: #666;

      &.collapsed {
        transform: rotate(-90deg);
      }
    }
  }

  .tab-config-content {
    padding: 16px;
    transition: all 0.3s;
  }
}

.add-tab-btn {
  // text-align: center;
  // border-top: 1px solid #e4e7ed;
  // background: #f9f9f9;
  // border-radius: 8px;
}

:deep(.el-color-picker) {
  width: 100%;
}

:deep(.el-input) {
  width: 100%;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}
</style>
