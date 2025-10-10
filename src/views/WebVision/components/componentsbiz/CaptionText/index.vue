<template>
  <div class="CaptionText">
    <div class="CaptionText-content" :style="containerStyle" v-if="datas.configParamJson.enable">
      <!-- 标题区域 -->
      <div v-if="datas.configParamJson.title" class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">{{ datas.configParamJson.title }}</h2>
        <span v-if="datas.configParamJson.subtitle" class="sub-title" :style="subTitleStyle">
          {{ datas.configParamJson.subtitle }}
        </span>
      </div>
      <!-- 主要内容区域 -->
      <div class="main-container">
        <div class="content-wrapper" :style="contentWrapperStyle">
          <!-- 标题 -->
          <h2 v-if="datas.configParamJson.name" class="caption-title" :style="captionTitleStyle">
            {{ datas.configParamJson.name }}
          </h2>
          <!-- 描述文字 -->
          <p v-if="datas.configParamJson.description" class="caption-description" :style="captionDescriptionStyle">
            {{ datas.configParamJson.description }}
          </p>
          <!-- 更多按钮 -->
          <div
            v-show="datas.configParamJson.more?.show"
            class="more-button"
            :class="moreButtonClass"
            :style="moreButtonStyle"
            @click="handleMoreClick"
          >
            <span class="more-text">{{ moreText }}</span>
            <span v-if="datas.configParamJson.more?.type !== 0" class="more-icon">></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除按钮插槽 -->
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="CaptionText">
import { computed } from 'vue'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 样式计算属性
const styleHeader = computed(() => props.datas.configParamJson.styleHeader ?? {})
const styleMain = computed(() => props.datas.configParamJson.styleMain ?? {})

// 容器样式（背景色优先级：styleMain.backgroundColor > backColor > 默认）
const containerStyle = computed(() => {
  const bgColor = styleMain.value.backgroundColor || props.datas.configParamJson.backColor || '#ffffff'
  return {
    backgroundColor: props.datas.configParamJson.backColor || '#ffffff',
    borderRadius: `${styleMain.value.borderRadius ?? 0}px`,
    padding: `${styleMain.value.containerPadding ?? 0}px 14px`,
    margin: `${styleMain.value.margin ?? 0}px auto`,
    boxShadow: styleMain.value.boxShadow || 'none',
    minHeight: '20px',
    position: 'relative' as const
  }
})

// 标题头部样式
const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient && styleHeader.value.headerBg && styleHeader.value.headerBg2) {
    return {
      background: `linear-gradient(to right, ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  } else {
    return {
      backgroundColor: styleHeader.value.headerBgColor || '#4a90e2'
    }
  }
})

const mainTitleStyle = computed(() => ({
  color: styleHeader.value.titleColor || '#ffffff'
}))

const subTitleStyle = computed(() => ({
  color: styleHeader.value.subTitleColor || '#ffffff'
}))

// 内容包装器样式
const contentWrapperStyle = computed(() => ({
  padding: '6px 0',
  borderBottom: props.datas.configParamJson.borderBott ? '1px solid #F9F9F9' : '1px solid transparent'
}))

// 标题样式
const captionTitleStyle = computed(() => ({
  fontSize: `${props.datas.configParamJson.wordSize ?? 16}px`,
  fontWeight: Number(props.datas.configParamJson.wordWeight ?? 400),
  color: props.datas.configParamJson.wordColor || '#333',
  textAlign: props.datas.configParamJson.positions || 'left',
  height: `${Number(props.datas.configParamJson.wordHeight ?? 24)}px`,
  lineHeight: `${Number(props.datas.configParamJson.wordHeight ?? 24)}px`,
  paddingRight: !(
    String(props.datas.configParamJson.positions) !== 'center' && Boolean(props.datas.configParamJson.more?.show)
  )
    ? '0'
    : '60px',
  margin: 0,
  wordWrap: 'break-word' as const,
  minHeight: '10px'
}))

// 描述样式
const captionDescriptionStyle = computed(() => ({
  fontSize: `${props.datas.configParamJson.descriptionSize ?? 14}px`,
  fontWeight: Number(props.datas.configParamJson.descriptionWeight ?? 400),
  color: props.datas.configParamJson.descriptionColor || '#666',
  textAlign: props.datas.configParamJson.positions || 'left',
  marginTop: '8px',
  margin: '8px 0 0 0',
  wordWrap: 'break-word' as const,
  minHeight: '10px'
}))

// 更多按钮样式
const moreButtonStyle = computed(() => ({
  color: props.datas.configParamJson.more?.type === 0 ? '#38f' : '#969799',
  top: `${(Number(props.datas.configParamJson.wordHeight ?? 24) - 6) / 2}px`
}))

// 更多按钮类名
const moreButtonClass = computed(() =>
  String(props.datas.configParamJson.positions) !== 'center' ? 'positioned' : 'centered'
)

// 更多按钮文本
const moreText = computed(() =>
  props.datas.configParamJson.more?.type === 2 ? '' : props.datas.configParamJson.more?.text ?? ''
)

// 处理更多按钮点击
const handleMoreClick = () => {
  const moreConfig = props.datas.configParamJson.more
  if (moreConfig?.http && moreConfig?.httpType) {
    const target = String(moreConfig.httpType).toLowerCase() === 'blank' ? '_blank' : '_self'
    window.open(moreConfig.http, target)
  }
}
</script>

<style lang="scss" scoped>
.CaptionText {
  position: relative;
}

.CaptionText-content {
  border: 2px solid transparent;
  box-sizing: border-box;
  width: 100%;
}

.title-header {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

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

.main-container {
  .content-wrapper {
    position: relative;
  }

  .caption-title {
    // 样式通过计算属性动态生成
  }

  .caption-description {
    // 样式通过计算属性动态生成
  }

  .more-button {
    font-size: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;

    &.centered {
      text-align: center;
      margin-top: 8px;
    }

    &.positioned {
      position: absolute;
      right: 0;
      top: 12px;
    }

    &:hover {
      opacity: 0.7;
    }

    .more-text {
      margin-right: 4px;
    }

    .more-icon {
      font-weight: bold;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .CaptionText-content {
    padding: 0 12px;
  }

  .more-button {
    &.positioned {
      right: 12px;
    }
  }
}
</style>
