<template>
  <div class="web-ad-more-box">
    <div class="ad-more-container">
      <div v-if="datas.configParamJson?.title" class="ad-title">
        {{ datas.configParamJson.title }}
      </div>
      <div class="ad-grid">
        <div v-for="(item, index) in mockAds" :key="index" class="ad-item">
          <img :src="item.image" :alt="item.title" draggable="false" />
          <div class="ad-item-title">{{ item.title }}</div>
        </div>
      </div>
      <div v-if="datas.configParamJson?.showPagination" class="pagination">
        <button class="page-btn">上一页</button>
        <span class="page-info">1 / 3</span>
        <button class="page-btn">下一页</button>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  datas: {
    componentName: string
    componentType: string
    configParamJson: {
      model?: string
      title?: string
      pageSize?: number
      showPagination?: boolean
      adType?: string
    }
  }
  pageModel?: 'websiteMode' | 'templateMode' | 'componentMode'
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

// 模拟广告数据
const mockAds = computed(() => {
  const size = props.datas.configParamJson?.pageSize || 6
  return Array.from({ length: size }, (_, index) => ({
    title: `广告标题 ${index + 1}`
    // image: '@/assets/images/imgs.png',
  }))
})
</script>

<style lang="scss" scoped>
.web-ad-more-box {
  position: relative;
  padding: 16px;
  background: #fff;

  .ad-more-container {
    .ad-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
      text-align: center;
    }

    .ad-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 16px;

      .ad-item {
        text-align: center;
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .ad-item-title {
          padding: 8px;
          font-size: 14px;
          color: #333;
          background: #f9f9f9;
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;

      .page-btn {
        padding: 8px 16px;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #f5f5f5;
        }
      }

      .page-info {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
