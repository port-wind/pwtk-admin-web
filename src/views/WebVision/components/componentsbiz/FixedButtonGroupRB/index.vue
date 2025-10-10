<script setup lang="ts" name="FixedButtonGroupRB">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { IDatas } from './type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const isAstro = import.meta.env.PUBLIC_DISPLAY
// 响应式数据
const isShareModalVisible = ref(false)
const countdown = ref(0)
const countdownTimer = ref<number | null>(null)
const rightFixValue = ref('10px')
// 样式计算
const styleMain = computed(() => props.datas.configParamJson.styleMain)
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)

// 按钮文本
const shareText = computed(() => '分享')
const refreshText = computed(() => '刷新')
const topText = computed(() => 'TOP')

// 弹窗文本
const modalTitle = computed(() => props.datas.configParamJson.title || '分享链接')
const modalMessage = computed(() => props.datas.configParamJson.subtitle || '点击下方按钮复制链接')
const copyButtonText = computed(() => '复制链接')
const closeButtonText = computed(() => '关闭')

// 分享链接
const shareLink = computed(() => window.location.href)

// 方法声明（提前声明避免使用前定义的问题）
const stopCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  countdown.value = 0
}

const hideShareModal = () => {
  isShareModalVisible.value = false
  stopCountdown()
}

const startCountdown = () => {
  countdown.value = 10
  countdownTimer.value = window.setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      hideShareModal()
    }
  }, 1000)
}

const showShareModal = () => {
  isShareModalVisible.value = true
  startCountdown()
}

// 按钮样式
const shareButtonStyle = computed(() => ({
  position: 'fixed' as const,
  right: rightFixValue.value,
  bottom: '140px',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  textAlign: 'center' as const,
  color: styleMain.value?.textColor || '#fff',
  fontSize: `${styleMain.value?.fontSize || 14}px`,
  borderRadius: '40px',
  border: 'solid 4px rgba(255, 255, 255, 0.8)',
  backgroundColor: styleMain.value?.backgroundColor || 'rgba(255, 0, 0, 0.8)',
  zIndex: 999,
  cursor: 'pointer',
  userSelect: 'none' as const
}))

const refreshButtonStyle = computed(() => ({
  position: 'fixed' as const,
  right: rightFixValue.value,
  bottom: '80px',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  textAlign: 'center' as const,
  color: styleMain.value?.textColor || '#fff',
  fontSize: `${styleMain.value?.fontSize || 14}px`,
  borderRadius: '40px',
  border: 'solid 4px rgba(255, 255, 255, 0.8)',
  backgroundColor: styleMain.value?.backgroundColor || 'rgba(255, 0, 0, 0.8)',
  zIndex: 999,
  cursor: 'pointer',
  userSelect: 'none' as const
}))

const topButtonStyle = computed(() => ({
  position: 'fixed' as const,
  right: rightFixValue.value,
  bottom: '20px',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  textAlign: 'center' as const,
  color: styleMain.value?.textColor || '#fff',
  fontSize: `${styleMain.value?.fontSize || 14}px`,
  borderRadius: '40px',
  border: 'solid 4px rgba(255, 255, 255, 0.8)',
  backgroundColor: styleMain.value?.backgroundColor || 'rgba(255, 0, 0, 0.8)',
  zIndex: 999,
  cursor: 'pointer',
  userSelect: 'none' as const
}))

const shareHeaderStyle = computed(() => ({
  background: styleHeader.value?.isGradient
    ? `linear-gradient(90deg, ${styleHeader.value.headerBg || '#9b5de5'}, ${styleHeader.value.headerBg2 || '#f15bb5'})`
    : styleHeader.value?.headerBgColor || '#9b5de5',
  color: styleHeader.value?.titleColor || '#fff'
}))

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    ElMessage.success('链接已复制到剪贴板')
    hideShareModal()
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = shareLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('链接已复制到剪贴板')
    hideShareModal()
  }
}

const refreshPage = () => {
  window.location.reload()
}

const scrollToTop = () => {
  const comContainer = document.getElementById('com-container')
  if (comContainer) {
    comContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

onMounted(async () => {
  if (!isAstro) {
    rightFixValue.value = '460px'
  }
})
</script>

<template>
  <div class="FixedButtonGroupRB">
    <div v-if="!isAstro" style="display: flex; align-items: center; justify-content: center">这是固定按钮组</div>
    <!-- 分享按钮 -->
    <div class="fixed-btn share-btn" :style="shareButtonStyle" @click="showShareModal">
      {{ shareText }}
    </div>

    <!-- 刷新按钮 -->
    <div class="fixed-btn refresh-btn" :style="refreshButtonStyle" @click="refreshPage">
      {{ refreshText }}
    </div>

    <!-- 回到顶部按钮 -->
    <div class="fixed-btn top-btn" :style="topButtonStyle" @click="scrollToTop" title="回顶部">
      {{ topText }}
    </div>

    <!-- 分享弹窗 -->
    <div v-show="isShareModalVisible" class="share-modal" @click="hideShareModal">
      <div class="share-content" @click.stop>
        <div class="share-header" :style="shareHeaderStyle">
          {{ modalTitle }}
        </div>
        <div class="share-message">
          {{ modalMessage }}
        </div>
        <div class="share-link">
          {{ shareLink }}
        </div>
        <div class="share-buttons">
          <button class="share-button copy-button" @click="copyLink">
            {{ copyButtonText }}
          </button>
          <button class="share-button close-button" @click="hideShareModal">
            {{ closeButtonText }}
          </button>
        </div>
        <div v-if="countdown > 0" class="countdown">
          <span>{{ countdown }}</span>
          秒后自动关闭
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.FixedButtonGroupRB {
  position: relative;
}

.fixed-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
}

.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(4px);
}

.share-content {
  width: 80%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

.share-header {
  padding: 20px;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
}

.share-message {
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.share-link {
  font-size: 14px;
  text-align: center;
  border: 1px solid #e0e0e0;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: #f9f9f9;
  word-break: break-all;
  color: #333;
}

.share-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.share-button {
  flex: 1;
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.copy-button {
    background-color: #03ff42;
    color: white;

    &:hover {
      background-color: #02e03a;
      transform: translateY(-1px);
    }
  }

  &.close-button {
    background-color: #95a5a6;
    color: white;

    &:hover {
      background-color: #7f8c8d;
      transform: translateY(-1px);
    }
  }
}

.countdown {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
  color: #666;

  span {
    color: #e74c3c;
    font-weight: 600;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .share-content {
    width: 90%;
    margin: 0 20px;
  }

  .share-buttons {
    flex-direction: column;

    .share-button {
      margin: 5px 0;
    }
  }

  .fixed-btn {
    width: 35px !important;
    height: 35px !important;
    line-height: 35px !important;
    font-size: 12px !important;
  }
}

@media (max-width: 480px) {
  .share-header {
    font-size: 18px;
    padding: 15px;
  }

  .share-message {
    font-size: 14px;
  }

  .fixed-btn {
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
    font-size: 11px !important;
    right: 8px !important;
  }
}
</style>
