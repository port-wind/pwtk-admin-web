<template>
  <div class="NavBarBox">
    <div class="navbar-box">
      <!-- 模式1: 标准选项卡模式 -->
      <section v-if="datas.configParamJson.model === 's1'" class="navbar-box__mode-standard">
        <van-sticky
          v-if="datas.configParamJson.tabsAttr.sticky"
          :offset-top="datas.configParamJson.tabsAttr.offsetTop || 0"
        >
          <van-tabs
            v-bind="computedTabsAttr"
            v-model="activeTab"
            @click-tab="handleTabClick"
            :class="['navbar-box__tabs', `navbar-box__tabs--${datas.configParamJson.model}`]"
          >
            <van-tab v-for="tab in validTabs" :name="tab.id" :key="tab.id" :title="tab.name" :disabled="tab.disabled" />
          </van-tabs>
        </van-sticky>
        <div v-else>
          <van-tabs
            v-bind="computedTabsAttr"
            v-model="activeTab"
            @click-tab="handleTabClick"
            :class="['navbar-box__tabs', `navbar-box__tabs--${datas.configParamJson.model}`]"
          >
            <van-tab v-for="tab in validTabs" :name="tab.id" :key="tab.id" :title="tab.name" :disabled="tab.disabled" />
          </van-tabs>
        </div>
      </section>

      <!-- 模式2: 胶囊式选项卡模式 -->
      <section v-else-if="datas.configParamJson.model === 's2'" class="navbar-box__mode-capsule">
        <van-sticky
          v-if="datas.configParamJson.tabsAttr.sticky"
          :offset-top="datas.configParamJson.tabsAttr.offsetTop || 0"
        >
          <div class="navbar-box__capsule-wrapper">
            <div
              v-for="tab in validTabs"
              :key="tab.id"
              :class="[
                'navbar-box__capsule-item',
                { 'navbar-box__capsule-item--active': activeTab === tab.id },
                { 'navbar-box__capsule-item--disabled': tab.disabled }
              ]"
              @click="handleCapsuleClick(tab)"
            >
              {{ tab.name }}
            </div>
          </div>
        </van-sticky>
        <div v-else class="navbar-box__capsule-wrapper">
          <div
            v-for="tab in validTabs"
            :key="tab.id"
            :class="[
              'navbar-box__capsule-item',
              { 'navbar-box__capsule-item--active': activeTab === tab.id },
              { 'navbar-box__capsule-item--disabled': tab.disabled }
            ]"
            @click="handleCapsuleClick(tab)"
          >
            {{ tab.name }}
          </div>
        </div>
      </section>

      <!-- 模式3: 按钮组模式 -->
      <section v-else-if="datas.configParamJson.model === 's3'" class="navbar-box__mode-button">
        <van-sticky
          v-if="datas.configParamJson.tabsAttr.sticky"
          :offset-top="datas.configParamJson.tabsAttr.offsetTop || 0"
        >
          <div class="navbar-box__button-wrapper">
            <div
              v-for="tab in validTabs"
              :key="tab.id"
              :class="[
                'navbar-box__button-item',
                { 'navbar-box__button-item--active': activeTab === tab.id },
                { 'navbar-box__button-item--disabled': tab.disabled }
              ]"
              @click="handleButtonClick(tab)"
            >
              {{ tab.name }}
            </div>
          </div>
        </van-sticky>
        <div v-else class="navbar-box__button-wrapper">
          <div
            v-for="tab in validTabs"
            :key="tab.id"
            :class="[
              'navbar-box__button-item',
              { 'navbar-box__button-item--active': activeTab === tab.id },
              { 'navbar-box__button-item--disabled': tab.disabled }
            ]"
            @click="handleButtonClick(tab)"
          >
            {{ tab.name }}
          </div>
        </div>
      </section>

      <!-- 未知模式处理 -->
      <section v-else class="navbar-box__mode-unknown">
        <div class="navbar-box__error">不支持的导航栏模式: {{ datas.configParamJson.model }}</div>
      </section>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="NavBarBox">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Tabs as VanTabs, Tab as VanTab, Sticky as VanSticky } from 'vant'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}

const props = defineProps<IProps>()

// 响应式状态
const activeTab = ref('')
const isScrolling = ref(false)

// 计算属性
const validTabs = computed(() => {
  console.log(props.datas.configParamJson.itemData, '-------导航项数据')
  return props.datas.configParamJson.itemData?.filter((tab) => tab.id && tab.name && !tab.disabled) || []
})

const computedTabsAttr = computed(() => {
  const defaultAttrs = {
    animated: true,
    swipeable: false,
    scrollspy: false,
    color: '#155bd4',
    background: 'transparent',
    duration: 0.3,
    lineWidth: 20,
    lineHeight: 3
  }

  return {
    ...defaultAttrs,
    ...props.datas.configParamJson.tabsAttr
  }
})

const backgroundStyle = computed(() => {
  if (props.datas.configParamJson.bgColor) {
    return { background: props.datas.configParamJson.bgColor }
  }
  return {
    background: `linear-gradient(
      var(--gradient-direction, 0deg),
      var(--second-color, #f0f0f0),
      var(--theme-color, #155bd4)
    )`
  }
})

// 当前模式
const currentModel = computed(() => {
  console.log(props.datas.configParamJson.model, '-------当前模式')
  return props.datas.configParamJson.model
})

// 方法定义
const initActiveTab = () => {
  if (validTabs.value.length > 0) {
    const firstValidTab = validTabs.value.find((tab) => !tab.disabled)
    activeTab.value = firstValidTab?.id || validTabs.value[0].id
  }
}

const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element && !isScrolling.value) {
    isScrolling.value = true

    const offset = props.datas.configParamJson.scrollOffset || 0
    const elementTop = element.offsetTop - offset

    window.scrollTo({
      top: elementTop,
      behavior: 'smooth'
    })

    // 重置滚动状态
    setTimeout(() => {
      isScrolling.value = false
    }, 500)
  }
}

const debouncedScrollToElement = debounce(scrollToElement, 100)

// 事件处理器
const handleTabClick = (obj: any) => {
  const tab = validTabs.value.find((t) => t.id === obj.name)
  if (!tab || tab.disabled) return

  activeTab.value = obj.name
  console.log('标准选项卡点击:', tab)

  // 滚动到对应锚点
  debouncedScrollToElement(obj.name)
}

const handleCapsuleClick = (tab: any) => {
  if (tab.disabled) return

  activeTab.value = tab.id
  console.log('胶囊式选项卡点击:', tab)

  debouncedScrollToElement(tab.id)
}

const handleButtonClick = (tab: any) => {
  if (tab.disabled) return

  activeTab.value = tab.id
  console.log('按钮组点击:', tab)

  debouncedScrollToElement(tab.id)
}

// 监听器
watch(
  () => props.datas.configParamJson.itemData,
  () => {
    nextTick(() => {
      initActiveTab()
    })
  },
  { deep: true, immediate: true }
)

watch(currentModel, (newModel) => {
  console.log('模式切换:', newModel)
  nextTick(() => {
    initActiveTab()
  })
})

// 生命周期
onMounted(() => {
  initActiveTab()
})
</script>

<style lang="scss" scoped>
.NavBarBox {
  position: relative;
}

.navbar-box {
  width: 100%;

  &__error {
    padding: 1rem;
    text-align: center;
    color: #999;
    font-size: 0.875rem;
  }

  // 标准选项卡模式样式
  &__mode-standard {
    :deep(.van-tabs__wrap) {
      height: 2rem;

      .van-tabs__nav {
        background: v-bind('backgroundStyle.background');
        margin: 0;
        width: 100%;
      }

      .van-tabs__nav--line.van-tabs__nav--shrink,
      .van-tabs__nav--line.van-tabs__nav--complete {
        padding-left: 0;
        padding-right: 0;
      }

      .van-tab--grow {
        padding: 0 0.75rem;
      }

      .van-tab {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.875rem;
        transition: all 0.3s ease;

        &:hover:not(.van-tab--disabled) {
          color: rgba(255, 255, 255, 0.9);
        }

        &--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .van-tab--active {
        color: #fff;
        font-weight: 500;
      }

      .van-tabs__line {
        background-color: #fff;
        height: 0.125rem;
        border-radius: 0.0625rem;
        transition: all 0.3s ease;
      }
    }
  }

  // 胶囊式选项卡模式样式
  &__mode-capsule {
    .navbar-box__capsule-wrapper {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem;
      background: v-bind('backgroundStyle.background');
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .navbar-box__capsule-item {
      flex-shrink: 0;
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover:not(&--disabled) {
        background: rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.9);
      }

      &--active {
        background: rgba(255, 255, 255, 0.9);
        color: var(--theme-color, #155bd4);
        font-weight: 500;
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // 按钮组模式样式
  &__mode-button {
    .navbar-box__button-wrapper {
      display: flex;
      gap: 0.25rem;
      padding: 0.75rem;
      background: v-bind('backgroundStyle.background');
      overflow-x: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .navbar-box__button-item {
      flex-shrink: 0;
      padding: 0.625rem 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 0.25rem;
      background: transparent;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover:not(&--disabled) {
        border-color: rgba(255, 255, 255, 0.5);
        color: rgba(255, 255, 255, 0.9);
      }

      &--active {
        background: rgba(255, 255, 255, 0.9);
        border-color: rgba(255, 255, 255, 0.9);
        color: var(--theme-color, #155bd4);
        font-weight: 500;
      }

      &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .navbar-box {
    &__mode-capsule .navbar-box__capsule-item,
    &__mode-button .navbar-box__button-item {
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
    }
  }
}
</style>
