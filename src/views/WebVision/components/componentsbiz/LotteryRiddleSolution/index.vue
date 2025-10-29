<script setup lang="ts" name="LotteryRiddleSolution">
import type { IDatas, ILinkItem, IRiddleItem } from './type'
import { useIssueList, type IProcessedIssueItem } from '../hooks/issueList'
import { onMounted, ref, computed, watch, reactive } from 'vue'
import { useStore } from '@nanostores/vue'
import { gameStore } from '../store/index'
import service from '../service/index'

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
    props.datas.configParamJson.links = newVal as ILinkItem[]
  },
  { immediate: true }
)

const gameTypeCode = computed(() => gameStoreData.value.gameTypeCode)
const year = computed(() => gameStoreData.value.year)

// 样式计算属性
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

const titleHeaderStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right, ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  } else {
    return {
      backgroundColor: styleHeader.value?.headerBgColor || '#4caf50'
    }
  }
})

const mainTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#ffffff'
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#ffffff'
  }
})

const containerStyle = computed(() => {
  return {
    borderRadius: `${styleMain.value?.borderRadius || 0}px`,
    padding: `${styleMain.value?.padding || 0}px`
  }
})

// 辅助函数
const extractIssueShort = (postIssue: string) => {
  // 从 "2025171" 提取 "171"
  return postIssue.slice(-3)
}

const getRiddleContent = (item: any) => {
  // 从 postContent 中提取谜语内容
  return item.postContent || ''
}

const getHitDetail = (item: ILinkItem, zodiac: string, pIndex?: number) => {
  switch (zodiac) {
    case '生肖':
      if (item.lotteryPredictions && item.lotteryPredictions[0] && item.lotteryPredictions[0].isHit === 'y') {
        const index = item.lotteryPredictions[0].hitDetail.split('').findIndex((i: string) => i === '1')
        if (index === pIndex) {
          return true
        }
      } else {
        return false
      }
    case '大小数':
      if (item.lotteryPredictions && item.lotteryPredictions[1] && item.lotteryPredictions[1].isHit === 'y') {
        return true
      } else {
        return false
      }
    default:
      return false
  }
}

const getSpecialZodiacPrediction = (item: ILinkItem) => {
  return (item.lotteryPredictions && item.lotteryPredictions[0] && item.lotteryPredictions[0].predict) || []
}

const getSizePrediction = (item: any) => {
  return (item.lotteryPredictions && item.lotteryPredictions[1] && item.lotteryPredictions[1].predict?.[0]) || ''
}

const getOpenResult = (item: any) => {
  // 获取开奖结果
  if (item.resultInfo) {
    return {
      zodiac: item.resultInfo.shengxiao,
      number: item.resultInfo.teNum
    }
  }
  return null
}

const isNextIssue = (item: any) => {
  // 判断是否是下一期（未开奖）
  return !item.resultInfo || !item.resultInfo.teNum
}
</script>

<template>
  <div class="LotteryRiddleSolution">
    <div class="lottery-riddle-solution" :style="containerStyle">
      <!-- 标题区域 -->
      <div class="title-header" :style="titleHeaderStyle">
        <h2 class="main-title" :style="mainTitleStyle">
          {{ datas.configParamJson.title }}
        </h2>
        <span class="sub-title" :style="subTitleStyle">
          {{ datas.configParamJson.subtitle }}
        </span>
      </div>
      <!-- 内容区域 -->
      <div
        class="lottery-riddle-solution__content"
        :style="{
          padding: `${datas.configParamJson.listStyleJSON.containerPadding}px`
        }"
      >
        <div class="lottery-riddle-solution__items">
          <div
            v-for="(item, index) in props.datas.configParamJson.links"
            :key="item.postId || index"
            class="lottery-riddle-solution__item"
            :style="{
              backgroundColor: datas.configParamJson.listStyleJSON.itemBackgroundColor,
              color: datas.configParamJson.listStyleJSON.itemTextColor,
              padding: `${datas.configParamJson.listStyleJSON.itemPadding}px`,
              borderRadius: `${datas.configParamJson.listStyleJSON.itemBorderRadius}px`,
              // border: `${datas.configParamJson.listStyleJSON.itemBorderWidth}px solid ${datas.configParamJson.listStyleJSON.itemBorderColor}`,
              marginBottom: `${datas.configParamJson.listStyleJSON.itemSpacing}px`
            }"
          >
            <div class="item-header">
              <span>{{ extractIssueShort(item.postIssue) }}期: {{ item.title }}</span>
              <span v-if="isNextIssue(item)" class="result-text">
                开
                <span class="result-number" :style="{ color: datas.configParamJson.listStyleJSON.resultTextColor }">
                  ? 00
                </span>
                准
              </span>
              <span v-else-if="getOpenResult(item)" class="result-text">
                开
                <span class="result-number" :style="{ color: datas.configParamJson.listStyleJSON.resultTextColor }">
                  {{ getOpenResult(item)?.zodiac }}{{ getOpenResult(item)?.number }}
                </span>
                准
              </span>
            </div>
            <div class="riddle-text" :style="{ color: datas.configParamJson.listStyleJSON.riddleTextColor }">
              {{ getRiddleContent(item) }}
            </div>
            <div class="answer-text" :style="{ color: datas.configParamJson.listStyleJSON.answerTextColor }">
              <div class="special-zodiac-prediction">
                本期谜底:（
                <span
                  :class="{ active: getHitDetail(item, '生肖', pIndex) }"
                  v-for="(i, pIndex) in getSpecialZodiacPrediction(item)"
                  :key="pIndex"
                >
                  {{ i }}
                </span>
                ）
              </div>
              <div class="size-prediction">
                送:
                <span :class="{ active: getHitDetail(item, '大小数') }">{{ getSizePrediction(item) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.LotteryRiddleSolution {
  position: relative;
}

.lottery-riddle-solution {
  overflow: hidden;
  font-family: 'SimSun', '宋体', sans-serif;
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

.lottery-riddle-solution__content {
  background: #fff;
  min-height: 20px;
}

.lottery-riddle-solution__items {
  width: 100%;
  display: flex;
  flex-direction: column;

  > div {
    border-bottom: 1px solid #e0e0e0;
  }

  > div:last-child {
    border-bottom: none;
  }
}

.lottery-riddle-solution__item {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 8px;

    .result-text {
      font-weight: bold;

      .result-number {
        font-weight: bold;
      }
    }
  }

  .riddle-text {
    font-size: 16px;
    margin-bottom: 6px;
    line-height: 1.4;
    font-weight: bold;
  }

  .answer-text {
    font-size: 16px;
    line-height: 1.4;
    font-weight: bold;
    display: flex;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .lottery-riddle-solution__item {
    .item-header {
      font-size: 14px;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .riddle-text,
    .answer-text {
      font-size: 14px;
    }
  }
}

@media (max-width: 480px) {
  .title-header {
    padding: 8px 12px;

    .main-title {
      font-size: 16px;
    }

    .sub-title {
      font-size: 12px;
    }
  }

  .lottery-riddle-solution__item {
    .item-header {
      font-size: 13px;
    }

    .riddle-text,
    .answer-text {
      font-size: 13px;
    }
  }
}

.special-zodiac-prediction {
  span {
    &.active {
      background-color: yellow;
    }
  }
}

.size-prediction {
  span {
    &.active {
      background-color: yellow;
    }
  }
}
</style>
