<template>
  <div class="NavBBSListBox">
    <div class="nav-bbs-list-box">
      <div class="bbs-list-container">
        <div v-if="datas.configParamJson?.title" class="bbs-title">
          {{ datas.configParamJson.title }}
        </div>
        <div class="bbs-list">
          <div v-for="(item, index) in mockData" :key="index" class="bbs-item">
            <div class="bbs-item-title">{{ item.title }}</div>
            <div class="bbs-item-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="NavBBSListBox">
import { computed } from 'vue'

interface Props {
  datas: {
    componentName: string
    componentType: string
    configParamJson: {
      model?: string
      pageSize?: number
      title?: string
      bbsId?: string
      forumId?: string
      mainBoardId?: string
      postId?: string
    }
  }
  pageModel?: 'websiteMode' | 'templateMode' | 'componentMode'
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

// 模拟数据
const mockData = computed(() => {
  const size = props.datas?.configParamJson?.pageSize || 5
  return Array.from({ length: size }, (_, index) => ({
    title: `BBS帖子标题 ${index + 1}`,
    time: `2024-01-${String(index + 1).padStart(2, '0')}`
  }))
})
</script>

<style lang="scss" scoped>
.NavBBSListBox {
  position: relative;
}

.nav-bbs-list-box {
  position: relative;
  padding: 16px;
  background: #fff;
  border-radius: 8px;

  .bbs-list-container {
    .bbs-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #eee;
    }

    .bbs-list {
      .bbs-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .bbs-item-title {
          flex: 1;
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .bbs-item-time {
          font-size: 12px;
          color: #999;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
