<template>
  <div class="NewsPaperCategoryList">
    <div class="newspaper-category-list" v-if="datas.configParamJson.enable">
      <!-- 标题区域 -->
      <div
        class="newspaper-category-list__header"
        :style="{
          backgroundColor: datas.configParamJson.listStyleJSON.headerBackgroundColor,
          color: datas.configParamJson.listStyleJSON.headerTextColor,
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`
        }"
      >
        <h2 class="newspaper-category-list__title">{{ datas.configParamJson.title }}</h2>
      </div>

      <!-- 标签页区域 -->
      <div class="newspaper-category-list__tabs">
        <div
          v-for="(category, index) in enabledCategories"
          :key="category.id"
          class="newspaper-category-list__tab"
          :class="{ 'newspaper-category-list__tab--active': activeTabIndex === index }"
          :style="{
            backgroundColor:
              activeTabIndex === index
                ? datas.configParamJson.listStyleJSON.activeTabColor
                : datas.configParamJson.listStyleJSON.inactiveTabColor,
            border: `1px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`
          }"
          @click="activeTabIndex = index"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- 内容区域 -->
      <div
        class="newspaper-category-list__content"
        :style="{
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`
        }"
      >
        <div
          v-if="activeCategory"
          class="newspaper-category-list__items"
          :style="{
            gap: `${datas.configParamJson.listStyleJSON.itemSpacing}px`,
            gridTemplateColumns: `repeat(${datas.configParamJson.listStyleJSON.itemsPerRow}, 1fr)`
          }"
        >
          <div
            v-for="item in enabledItems"
            :key="item.id"
            class="newspaper-category-list__item"
            :style="{
              backgroundColor: item.isMoreButton
                ? datas.configParamJson.listStyleJSON.moreButtonColor
                : datas.configParamJson.listStyleJSON.itemBackgroundColor,
              color: item.isMoreButton
                ? datas.configParamJson.listStyleJSON.moreButtonTextColor
                : datas.configParamJson.listStyleJSON.itemTextColor,
              padding: `${datas.configParamJson.listStyleJSON.itemPadding}px`,
              borderRadius: `${datas.configParamJson.listStyleJSON.itemBorderRadius}px`,
              border: `${datas.configParamJson.listStyleJSON.itemBorderWidth}px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`
            }"
            @click="handleItemClick(item)"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { IDatas } from './type'

interface Props {
  datas: IDatas
  pageModel?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageModel: 'websiteMode'
})

// 当前激活的标签页索引
const activeTabIndex = ref(0)

// 启用的分类标签页
const enabledCategories = computed(() => {
  return props.datas.configParamJson.categories?.filter((category) => category.enabled) || []
})

// 当前激活的分类
const activeCategory = computed(() => {
  return enabledCategories.value[activeTabIndex.value] || null
})

// 当前分类下启用的项目
const enabledItems = computed(() => {
  if (!activeCategory.value) return []
  return activeCategory.value.items?.filter((item) => item.enabled) || []
})

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

// 初始化激活标签页
onMounted(() => {
  if (
    props.datas.configParamJson.defaultActiveTab !== undefined &&
    props.datas.configParamJson.defaultActiveTab < enabledCategories.value.length
  ) {
    activeTabIndex.value = props.datas.configParamJson.defaultActiveTab
  }
})
</script>

<style lang="scss" scoped>
.newspaper-category-list {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &__header {
    text-align: center;
    border-bottom: 1px solid #e6e6e6;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  &__tabs {
    display: flex;
    // background: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
  }

  &__tab {
    flex: 1;
    padding: 12px 16px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    border-right: 1px solid #e6e6e6;
    color: #3ebc40;

    &:last-child {
      border-right: none;
    }

    &:hover {
      opacity: 0.8;
    }

    &--active {
      font-weight: bold;
      color: #fff;
    }
  }

  &__content {
    background: #fff;
    min-height: 200px;
  }

  &__items {
    display: grid;
    width: 100%;
  }

  &__item {
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    border: 1px solid #d9d9d9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .newspaper-category-list {
    &__items {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    &__item {
      font-size: 12px;
    }

    &__tab {
      padding: 10px 8px;
      font-size: 12px;
      color: #3ebc40;
    }
  }
}

@media (max-width: 480px) {
  .newspaper-category-list {
    &__items {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
}
</style>
