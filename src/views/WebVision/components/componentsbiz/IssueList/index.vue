<script setup lang="ts" name="IssueList">
import { computed, onMounted } from 'vue'
import type { IDatas } from './type'
import { getWebSitePost } from '../api'
import { setListKeys, clearListKeys, editorStore, gameStore } from '../store'
import { useStore } from '@nanostores/vue'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()
const editorStoreData = useStore(editorStore)

// 获取启用且限制数量的列表项
const displayItems = computed(() => {
  if (!props.datas.configParamJson.enable) return []

  const enabledItems = props.datas.configParamJson.issueItems?.filter((item) => item.enabled) || []
  const maxCount = props.datas.configParamJson.maxDisplayCount || 30

  return enabledItems.slice(0, maxCount)
})

// getWebSitePost

const getWebSitePostData = async () => {
  const res = await getWebSitePost({
    page: 1,
    size: 100,
    forumId: 'haocai001',
    gameType: '2032',
    isAll: 'y'
  })
}

// 处理项目点击
const handleItemClick = (item: any) => {
  if (item.link) {
    // 判断是否为外部链接
    if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
      window.open(item.link, '_blank')
    } else {
      // 内部路由跳转
      window.location.href = item.link
    }
  }
}

// 格式化显示文本
const formatItemText = (item: any) => {
  return `${item.period} ${item.title} 【${item.subtitle}】${item.status}！`
}

onMounted(() => {
  getWebSitePostData()
})
</script>

<template>
  <div class="IssueList">
    <div class="issue-list" v-if="datas.configParamJson.enable">
      <!-- 标题区域 -->
      <div
        class="issue-list__header"
        :style="{
          padding: `${datas.configParamJson.listStyleJSON.headerPadding}px`,
          borderRadius: `${datas.configParamJson.listStyleJSON.borderRadius}px ${datas.configParamJson.listStyleJSON.borderRadius}px 0 0`,
          backgroundColor: datas.configParamJson.listStyleJSON.headerBackgroundColor
        }"
      >
        <h2 class="issue-list__title" :style="{ color: datas.configParamJson.listStyleJSON.headerTextColor }">
          {{ datas.configParamJson.title }}
        </h2>
      </div>

      <!-- 列表区域 -->
      <div
        class="issue-list__content"
        :style="{
          backgroundColor: datas.configParamJson.listStyleJSON.listBackgroundColor,
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`,
          borderRadius: `0 0 ${datas.configParamJson.listStyleJSON.borderRadius}px ${datas.configParamJson.listStyleJSON.borderRadius}px`
        }"
      >
        <div class="issue-list__items">
          <div
            v-for="(item, index) in displayItems"
            :key="item.id"
            class="issue-list__item"
            :style="{
              padding: `${datas.configParamJson.listStyleJSON.itemPadding}px`,
              marginBottom:
                index < displayItems.length - 1 ? `${datas.configParamJson.listStyleJSON.itemSpacing}px` : '0',
              borderBottom:
                index < displayItems.length - 1
                  ? `${datas.configParamJson.listStyleJSON.itemBorderWidth}px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`
                  : 'none'
            }"
            @click="handleItemClick(item)"
          >
            <span class="issue-list__period" :style="{ color: datas.configParamJson.listStyleJSON.periodTextColor }">
              {{ item.period }}
            </span>
            <span class="issue-list__title-text" :style="{ color: datas.configParamJson.listStyleJSON.titleTextColor }">
              {{ item.title }}
            </span>
            <span
              class="issue-list__subtitle"
              :style="{ color: datas.configParamJson.listStyleJSON.subtitleTextColor }"
            >
              【{{ item.subtitle }}】
            </span>
            <span class="issue-list__status" :style="{ color: datas.configParamJson.listStyleJSON.statusTextColor }">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.IssueList {
  position: relative;
}

.issue-list {
  position: relative;
  width: 100%;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &__header {
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  &__content {
    min-height: 120px;
  }

  &__items {
    width: 100%;
  }

  &__item {
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    user-select: none;
    display: flex;
    align-items: center;
    line-height: 1.5;
    justify-content: center;

    &:hover {
      background-color: #f8f9fa !important;
    }

    &:active {
      background-color: #e9ecef !important;
    }
  }

  &__period {
    margin-right: 8px;
    font-weight: 500;
    white-space: nowrap;
  }

  &__title-text {
    margin-right: 8px;
    font-weight: 500;
    white-space: nowrap;
  }

  &__subtitle {
    margin-right: 8px;
    white-space: nowrap;
  }

  &__status {
    font-weight: 500;
    white-space: nowrap;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .issue-list {
    &__item {
      font-size: 12px;
      flex-wrap: wrap;
    }

    &__title {
      font-size: 16px;
    }
  }
}

@media (max-width: 480px) {
  .issue-list {
    &__item {
      font-size: 11px;
    }

    &__title {
      font-size: 14px;
    }
  }
}
</style>
