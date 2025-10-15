<template>
  <div class="ad-bar-style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="80px">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <div v-for="(item, index) in datas.configParamJson.adData" :key="index" class="ad-item">
        <div class="ad-item-header">
          <span>广告 {{ index + 1 }}</span>
          <el-button type="danger" size="small" @click="removeAd(index)" :icon="Delete">删除</el-button>
        </div>

        <el-form-item label="图片链接">
          <el-input v-model="item.img" placeholder="请输入图片URL" clearable />
        </el-form-item>

        <el-form-item label="跳转链接">
          <el-input v-model="item.link" placeholder="请输入跳转链接" clearable />
        </el-form-item>

        <el-form-item label="广告名称">
          <el-input v-model="item.name" placeholder="请输入广告名称" clearable />
        </el-form-item>

        <el-divider />
      </div>

      <div class="add-button">
        <el-button type="primary" @click="addNewAd" :icon="Plus">添加广告</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="AdBarStyle">
import { Delete, Plus } from '@element-plus/icons-vue'
import type { IDatas } from '../../componentsbiz/AdBar/type'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
interface Props {
  datas: IDatas
}

const props = defineProps<Props>()

// 添加新广告
const addNewAd = () => {
  props.datas.configParamJson.adData.push({
    index: props.datas.configParamJson.adData.length + 1,
    img: '',
    link: '',
    name: ''
  })
}

// 删除广告
const removeAd = (index: number) => {
  props.datas.configParamJson.adData.splice(index, 1)
}
</script>

<style scoped lang="less">
.ad-bar-style {
  padding: 20px;

  .ad-item {
    margin-bottom: 20px;

    .ad-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }

  .add-button {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  :deep(.el-divider) {
    margin: 20px 0;
  }
}
</style>
