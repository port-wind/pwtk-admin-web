<template>
  <div class="scrollable-tags-container">
    <!-- Delete button - always visible on the left -->
    <div class="delete-button-wrapper">
      <el-popover
        placement="top-start"
        trigger="hover"
        :width="100"
        content="关闭所有标签"
        popper-style="font-size: 12px; color: #909399;min-width: 80px;padding: 10px;"
        v-if="tagview.tagslist.length > 1"
      >
        <template #reference>
          <el-button type="danger" :icon="Delete" circle style="width: 24px; height: 24px" @click="closeAll" />
        </template>
      </el-popover>
    </div>

    <!-- Left scroll button - only show when needed -->
    <div class="scroll-button-wrapper" v-if="showScrollButtons">
      <el-button
        :icon="ArrowLeft"
        size="small"
        circle
        :disabled="!canScrollLeft"
        @click="scrollLeft"
        class="scroll-button"
      />
    </div>

    <!-- Tags wrapper -->
    <div class="tags-wrapper" ref="tagsWrapper">
      <div class="tagbox" ref="tagsList" :style="{ transform: `translateX(${currentTranslate}px)` }">
        <el-tag
          @click="changePage(tag.path)"
          :type="route.path === tag.path ? undefined : 'info'"
          v-for="(tag, index) in tagview.tagslist"
          :key="index"
          :closable="tagview.tagslist.length === 1 ? false : true"
          @close.stop="closePage(tag.path, index)"
          class="tag"
        >
          {{ tag.title }}
        </el-tag>
      </div>
    </div>

    <!-- Right scroll button - only show when needed -->
    <div class="scroll-button-wrapper" v-if="showScrollButtons">
      <el-button
        :icon="ArrowRight"
        size="small"
        circle
        :disabled="!canScrollRight"
        @click="scrollRight"
        class="scroll-button"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Delete, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import i18n from '@/locales'
import { useTagViewStore } from '@/stores/tagview'

const { t } = i18n.global as any

const route = useRoute()
const router = useRouter()
const tagview = useTagViewStore()

// Scroll related refs
const tagsWrapper = ref<HTMLElement>()
const tagsList = ref<HTMLElement>()
const currentTranslate = ref(0)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const showScrollButtons = ref(false) // Only show when overflow occurs
const scrollAmount = 200 // pixels to scroll per click

// Watch route changes
watch(route, () => {
  addTags()
})

// Check if content overflows and update scroll state
const updateScrollButtons = () => {
  if (!tagsWrapper.value || !tagsList.value) return

  const wrapperWidth = tagsWrapper.value.offsetWidth
  const listWidth = tagsList.value.scrollWidth
  const maxScroll = Math.max(0, listWidth - wrapperWidth)

  // Show scroll buttons only when content overflows
  showScrollButtons.value = maxScroll > 0

  if (showScrollButtons.value) {
    canScrollLeft.value = currentTranslate.value < 0
    canScrollRight.value = -currentTranslate.value < maxScroll

    // Adjust current translate if needed (e.g., after window resize)
    if (-currentTranslate.value > maxScroll) {
      currentTranslate.value = -maxScroll
    }
  } else {
    // Reset scroll position when no overflow
    currentTranslate.value = 0
    canScrollLeft.value = false
    canScrollRight.value = false
  }
}

const scrollLeft = () => {
  const maxScroll = 0
  currentTranslate.value = Math.min(currentTranslate.value + scrollAmount, maxScroll)
  nextTick(() => updateScrollButtons())
}

const scrollRight = () => {
  if (!tagsWrapper.value || !tagsList.value) return

  const wrapperWidth = tagsWrapper.value.offsetWidth
  const listWidth = tagsList.value.scrollWidth
  const maxScroll = Math.max(0, listWidth - wrapperWidth)

  currentTranslate.value = Math.max(currentTranslate.value - scrollAmount, -maxScroll)
  nextTick(() => updateScrollButtons())
}

// Scroll to show the newest (rightmost) tag
const scrollToNewestTag = () => {
  nextTick(() => {
    if (!tagsWrapper.value || !tagsList.value || !showScrollButtons.value) return

    const wrapperWidth = tagsWrapper.value.offsetWidth
    const listWidth = tagsList.value.scrollWidth
    const maxScroll = Math.max(0, listWidth - wrapperWidth)

    // Scroll to the end to show the newest tag
    currentTranslate.value = -maxScroll
    updateScrollButtons()
  })
}

// Scroll to active tag when route changes (not when adding new tags)
const scrollToActiveTag = () => {
  nextTick(() => {
    if (!tagsWrapper.value || !tagsList.value || !showScrollButtons.value) return

    const activeTag = tagsList.value.querySelector('.el-tag:not(.el-tag--info)')
    if (activeTag) {
      const wrapperRect = tagsWrapper.value.getBoundingClientRect()
      const tagRect = activeTag.getBoundingClientRect()
      const relativeLeft = tagRect.left - wrapperRect.left + currentTranslate.value
      const relativeRight = relativeLeft + tagRect.width

      // If tag is outside visible area, scroll to make it visible
      if (relativeLeft < 0) {
        currentTranslate.value = Math.min(0, currentTranslate.value - relativeLeft + 20)
      } else if (relativeRight > wrapperRect.width) {
        currentTranslate.value = Math.max(
          -(tagsList.value.scrollWidth - wrapperRect.width),
          currentTranslate.value - (relativeRight - wrapperRect.width) - 20
        )
      }
    }
    updateScrollButtons()
  })
}

// Original functions
const addTags = () => {
  const { name } = route
  if (name) {
    if (tagview.tagslist.length > 19) {
      tagview.delTags(0)
    }
    const obj = { path: route.path, title: t(route.meta.title) }
    let canAdd = true
    for (const t of tagview.tagslist) {
      if (t.path === obj.path) {
        canAdd = false
        break
      }
    }
    if (canAdd) {
      tagview.addtags(obj)
      // Scroll to show the newly added tag (scroll to end)
      nextTick(() => {
        updateScrollButtons()
        scrollToNewestTag()
      })
    } else {
      // If tag already exists, just scroll to show it
      nextTick(() => {
        updateScrollButtons()
        scrollToActiveTag()
      })
    }
  }
}

const closePage = (path, i) => {
  if (path === route.path) {
    if (i !== tagview.tagslist.length - 1) {
      const index = tagview.tagslist.length - 1
      router.push(tagview.tagslist[index].path)
      tagview.delTags(i)
    } else {
      const index = tagview.tagslist.length - 2
      router.push(tagview.tagslist[index].path)
      tagview.delTags(i)
    }
  } else {
    tagview.delTags(i)
  }

  // Update scroll state after tag removal
  nextTick(() => updateScrollButtons())
}

const changePage = (path) => {
  router.push(path)
}

const closeAll = () => {
  ElMessageBox.confirm('确认关闭当前以外的所有标签吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(
    async () => {
      tagview.settags(tagview.tagslist.filter((item) => item.path === route.path))
      nextTick(() => {
        currentTranslate.value = 0
        updateScrollButtons()
      })
    },
    () => {
      console.log('cancel')
    }
  )
}

// Handle window resize
const handleResize = () => {
  updateScrollButtons()
}

// Lifecycle
onMounted(() => {
  addTags()
  nextTick(() => updateScrollButtons())
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for tagview changes to update scroll state
watch(
  () => tagview.tagslist.length,
  () => {
    nextTick(() => updateScrollButtons())
  }
)

// Watch route changes for scrolling to active tag
watch(
  () => route.path,
  () => {
    scrollToActiveTag()
  }
)
</script>

<style lang="less" scoped>
.scrollable-tags-container {
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  border-bottom: 1px solid #d8dce5;
}

.delete-button-wrapper {
  flex-shrink: 0;
  padding: 5px 0 5px 15px;
  display: flex;
  align-items: center;
}

.scroll-button-wrapper {
  flex-shrink: 0;
  padding: 0 8px;
  display: flex;
  align-items: center;
}

.scroll-button {
  width: 28px;
  height: 28px;

  &:disabled {
    opacity: 0.3;
  }
}

.tags-wrapper {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.tagbox {
  padding: 5px 0;
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  transition: transform 0.3s ease;
  width: max-content;

  .tag {
    margin-left: 5px;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
  }
}

// Hide Element Plus scrollbar if it's still present
:deep(.el-scrollbar) {
  display: none;
}
</style>
