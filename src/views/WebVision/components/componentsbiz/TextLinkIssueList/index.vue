<script setup lang="ts" name="TextLinkIssueList">
import { computed, reactive, watch, ref } from 'vue'
import type { IDatas, ILinkItem } from './type'
import { gameStore } from '../store'
import { useStore } from '@nanostores/vue'
import { useIssueList, type IProcessedIssueItem } from '../hooks/issueList'
import type { IForumPost } from '../types/forum'
interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

// 创建响应式参数对象
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})

// 使用 hooks
const { processedIssueList, isLoading, hasError, extractIssueNumber, getHitNumber, getNumberColorClass } =
  useIssueList(issueParams)

// 监听 props 变化，更新响应式参数
watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId], [oldSize, oldForumId]) => {
    console.log('🚀 ~ 参数变化:', [newSize, newForumId])
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = gameType.value
  }
)

watch(
  () => processedIssueList.value,
  (newVal) => {
    const tempLinks = props.datas.configParamJson.links
    if (newVal.length > 0) {
      props.datas.configParamJson.links = newVal.map((item) => {
        const currentLink = tempLinks.find((link) => link.postId === item.postId)
        if (currentLink) {
          return {
            ...item,
            title: currentLink.title,
            _title: item.title,
            link: currentLink.link
          }
        } else {
          return {
            ...item,
            _title: item.title,
            link: '/detail/' + item.postUserId
          }
        }
      })
    }
  },
  { immediate: true }
)

const forum = computed(() => gameStoreData.value.forum)

const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)
// 启用的链接项目
const enabledItems = computed(() => {
  return props.datas.configParamJson.links?.filter((item) => item.enabled) || []
})

const issueListItem = ref<IForumPost[]>([])

// 处理项目点击
const handleItemClick = (item: ILinkItem) => {
  if (!item.link) return
  if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
    window.open(item.link, '_blank')
  } else {
    window.location.href = item.link
  }
}

const handleMouseEnter = (event: Event) => {
  const target = event.target as HTMLElement
  target.style.backgroundColor = props.datas.configParamJson.listStyleJSON.itemHoverColor
}

const handleMouseLeave = (event: Event) => {
  const target = event.target as HTMLElement
  target.style.backgroundColor = props.datas.configParamJson.listStyleJSON.itemBackgroundColor
}

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  } else {
    return {
      backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
    }
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333'
  }
})

const containerStyle = computed(() => {
  return {
    // backgroundColor: styleMain.value?.backgroundColor || '#f8f9fa',
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.padding || 0}px`
  }
})
</script>

<template>
  <div class="TextLinkIssueList">
    <div class="text-link-list" :style="containerStyle">
      <!-- 标题区域 -->
      <!-- 头部标题 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>

      <!-- 链接列表区域 -->
      <div
        class="text-link-list__content"
        :style="{
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`
        }"
      >
        <div
          class="text-link-list__items"
          :style="{
            gap: `${datas.configParamJson.listStyleJSON.itemSpacing}px`,
            gridTemplateColumns: `repeat(${datas.configParamJson.listStyleJSON.itemsPerRow}, 1fr)`
          }"
        >
          <!-- v-for="item in processedIssueList" -->
          <div
            v-for="item in props.datas.configParamJson.links"
            :key="item.postId"
            class="text-link-list__item"
            :style="{
              backgroundColor: datas.configParamJson.listStyleJSON.itemBackgroundColor,
              color: datas.configParamJson.listStyleJSON.itemTextColor,
              padding: `${datas.configParamJson.listStyleJSON.itemPadding}px`,
              borderRadius: `${datas.configParamJson.listStyleJSON.itemBorderRadius}px`,
              border: `${datas.configParamJson.listStyleJSON.itemBorderWidth}px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`
            }"
            @click="handleItemClick(item)"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
          >
            <span class="post-issue">{{ item.postIssue }}</span>
            <span class="post-title">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.TextLinkIssueList {
  position: relative;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .main-title {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
  }

  .sub-title {
    font-size: 14px;
    opacity: 0.9;
  }
}

.text-link-list {
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
    background: #fff;
    min-height: 20px;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;

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
  .text-link-list {
    &__items {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    &__item {
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .text-link-list {
    &__items {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
}
</style>
