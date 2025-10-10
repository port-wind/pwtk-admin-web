<script setup lang="ts" name="IssueLine">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import type { ICustomJumpUrl, IDatas } from './type'
import { useStore } from '@nanostores/vue'
import { useIssueList, type IUseIssueListParams } from '../hooks/issueList'
import { gameStore, setGameType } from '../store'
import { getGameName } from '../store/gameStore'
import type { IForumPost } from '../types/forum'
import { setComponentMapValue } from '../store/editorStore'

interface IProps {
  datas: IDatas
}

// Props定义
const props = defineProps<IProps>()
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 🎮 游戏类型集成
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.gameTypeLongName || '未知游戏')

// 🔄 动态参数
const issueParams = reactive<IUseIssueListParams>({
  page: props.datas.configParamJson.page || 1,
  size: Number(props.datas.configParamJson.size) || 10,
  gameType: gameType.value,
  forumId: String(props.datas.configParamJson.forumId),
  isAll: props.datas.configParamJson.isAll,
  issueGroup: props.datas.configParamJson.issueGroup || 1
})

const { getIssueNumber, getIssueResult, getLotteryPredictions, issueListItem } = useIssueList(issueParams)

// 容器样式
const containerStyle = computed(() => {
  return {
    borderTopLeftRadius: `${styleHeader.value?.borderRadius || 0}px`,
    borderTopRightRadius: `${styleHeader.value?.borderRadius || 0}px`,
    padding: `${styleHeader.value?.padding || 0}px`,
    backgroundColor: styleMain.value?.backgroundColor || '#f1f1f1',
    overflow: 'hidden'
  }
})

// 标题背景样式
const headerTitleBgStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2'
  }
})

// 标题文字样式
const headerTitleTextStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333'
  }
})

// 副标题样式
const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333'
  }
})

// 样式配置
const styleConfig = computed(() => ({
  listSpacing: styleMain.value?.listSpacing || 0,
  numberSpacing: styleMain.value?.itemSpacing || 0,
  flexDirection: styleMain.value?.flexDirection || 'row',
  borderRadius: styleMain.value?.borderRadius || 0,
  borderWidth: styleMain.value?.borderWidth || 0,
  borderStyle: styleMain.value?.borderStyle || 'solid',
  borderColor: styleMain.value?.borderColor || '#e9ecef',
  contentPaddingLeftRight: styleMain.value?.contentPaddingLeftRight || 0,
  contentPaddingTopBottom: styleMain.value?.contentPaddingTopBottom || 0,
  paddingLeftRight: styleMain.value?.paddingLeftRight || 0,
  paddingTopBottom: styleMain.value?.paddingTopBottom || 0,
  backgroundColor: styleMain.value?.backgroundColor || '#f1f1f1',
  itemBackgroundColor: styleMain.value?.itemBackgroundColor || '#f1f1f1',
  boxShadow: styleMain.value?.boxShadow || '0 0 10px 0 rgba(0, 0, 0, 0.1)',
  layout: styleMain.value?.layout || 'start',
  columnCount: styleMain.value?.columnCount || 1
}))

const issueInfo = (issueListItem: IForumPost[]) => {
  const currentPredictions = getLotteryPredictions(issueListItem[0])

  const currentKeys = currentPredictions?.[0]?.predict
  const currentResult = currentKeys
    .map((key, index) => {
      return currentPredictions?.[0]?.rule?.options?.[key]?.[0]
    })
    .join('')

  const currentHitIndex = currentPredictions[0].hitDetail.split('').findIndex((item) => item === '1')
  const currentResultKey = currentPredictions[0].predict[currentHitIndex]

  if (!currentResultKey) {
    return [currentResult, null]
  } else {
    const currentHitResult =
      currentPredictions?.[0]?.rule?.options && currentPredictions?.[0]?.rule?.options?.[currentResultKey]?.[0]
    // 开奖生肖信息， 和中了的生肖。
    return [currentResult, currentHitResult]
  }
}

// 获取当前期数和往期期数
const getCurrentPreviousIssue = (issueListItem: IForumPost[]) => {
  const currentPredictions = getLotteryPredictions(issueListItem[0])
  const currentHitIndex = currentPredictions[0].hitDetail.split('').findIndex((item) => item === '1')
  const currentResultKey = currentPredictions[0].predict[currentHitIndex]
  const currentHitResult = currentPredictions[0].rule.options[currentResultKey][0]
  const currentKeys = currentPredictions[0].predict
  const currentResult = currentKeys
    .map((key, index) => {
      return currentPredictions[0].rule.options[key][0]
    })
    .join('')

  if (issueListItem?.length < 2) {
    return {
      currentIssue: currentResult,
      currentHitResult: currentHitResult,
      previousIssues: '',
      preHitResult: ''
    }
  }

  const predictions = getLotteryPredictions(issueListItem[1])
  const preHitIndex = predictions[0].hitDetail.split('').findIndex((item) => item === '1')
  const preResultKey = predictions[0].predict[preHitIndex]
  const preHitResult = predictions[0].rule.options[preResultKey][0]
  const preKeys = predictions[0].predict

  const preResult = preKeys
    .map((key, index) => {
      return predictions[0].rule.options[key][0]
    })
    .join('')

  return {
    currentIssue: currentResult,
    currentHitResult: currentHitResult,
    previousIssues: preResult,
    preHitResult: preHitResult
  }
}

const handleIssueClick = (issue: IForumPost, customJumpUrl?: ICustomJumpUrl) => {
  const codes = issue?.lotteryPredictions.map((item) => item.code).join(',')

  if (issue.url || customJumpUrl?.url) {
    window.open(issue.url || customJumpUrl?.url, '_blank')
  } else {
    window.open(`/postDetail/${issue.postId}?playTypeCode=${codes}`, '_blank')
  }
}

// 解析模板
const parseTemplate = (issue: IForumPost, issueListItem: IForumPost[]) => {
  const componentKey = 'IssueLine'
  const [currentIssue, currentHitResult] = issueInfo(issueListItem)
  const [previousIssues, preHitResult] = issueListItem.length > 1 ? issueInfo(issueListItem.slice(1, 2)) : ['', '']

  let template = props.datas.configParamJson.dynamicTemplate || ''

  const predictions = getLotteryPredictions(issue)

  // CSS变量
  const cssVars = `
    <style>
      .IssueLine-content[data-id="${props.datas.componentId}"] {
        --active-bg: ${props.datas.configParamJson.dynamicActiveBg || '#ffeb3b'};
        --active-text:${props.datas.configParamJson.dynamicActiveText || '#000'};
        --active-text-align: ${props.datas.configParamJson.dynamicActiveTextAlign || 'center'};
        --active-font-size: ${props.datas.configParamJson.dynamicActiveFontSize || '1.4rem'};
        --active-font-weight: ${props.datas.configParamJson.dynamicActiveFontWeight || '600'};
        --noresult: ${props.datas.configParamJson.dynamicNoResult || '#00F'};
      }
    </style>
  `

  // 获取期数
  const issueNumber = getIssueNumber(issue)
  template = template.replace(new RegExp(`{{issueNumber}}`, 'g'), issueNumber)
  setComponentMapValue(componentKey, 'other', `issueNumber`, issueNumber)

  Object.keys(issue).forEach((key) => {
    if (typeof issue[key] !== 'object') {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), issue[key])
      setComponentMapValue(componentKey, 'other', `${key}`, issue[key])
    }
  })

  // 获取结果
  const result = getIssueResult(issue)
  template = template.replace(
    new RegExp(`{{shengxiao}}`, 'g'),
    result.shengxiao ? result.shengxiao : '<span style="color: var(--noresult);">?00</span>'
  )
  setComponentMapValue(
    componentKey,
    'other',
    `shengxiao`,
    result.shengxiao ? result.shengxiao : '<span style="color: var(--noresult);">?00</span>'
  )

  template = template.replace(new RegExp(`{{num}}`, 'g'), result?.num?.toString() ? result?.num?.toString() : '?00')
  setComponentMapValue(componentKey, 'other', `num`, result?.num?.toString() ? result?.num?.toString() : '?00')
  if (result.size) {
    template = template.replace(new RegExp(`{{size}}`, 'g'), result.size ?? '?00')
    setComponentMapValue(componentKey, 'other', `size`, result.size ?? '?00')
  }

  // predicton 是一个对象， 我门要存key 和 vlaue
  predictions.forEach((prediction, mainIndex) => {
    if (prediction.isHit === 'y') {
      const hitIndex = prediction.hitDetail.split('').findIndex((item) => item === '1')
      prediction.predict.forEach((predict, index) => {
        if (hitIndex === index) {
          template = template.replace(
            new RegExp(`{{${mainIndex}_predict${index}}}`, 'g'),
            `<span style="color: var(--active-text);">${predict}</span>`
          )
          setComponentMapValue(componentKey, 'predict', `${mainIndex}_predict${index}`, predict)
        } else {
          template = template.replace(/{{${mainIndex}_predict${index}}}/g, predict)
          setComponentMapValue(componentKey, 'predict', `${mainIndex}_predict${index}`, predict)
        }
      })
    } else {
      Object.keys(prediction).forEach((key, index) => {
        if (key === 'rule') {
          return
        }
        if (key === 'predict') {
          prediction[key].forEach((predict, index) => {
            template = template.replace(/{{${mainIndex}_predict${index}}}/g, predict)
            setComponentMapValue(componentKey, 'predict', `${mainIndex}_predict${index}`, predict)
          })
        } else {
          template = template.replace(/{{${mainIndex}_${key}}}/g, prediction[key])
          setComponentMapValue(componentKey, 'other', `${mainIndex}_${key}`, prediction[key])
        }
      })
    }
  })

  issue.title.split(' ').forEach((item, index) => {
    template = template.replace(new RegExp(`{{title${index}}}`, 'g'), item)
    setComponentMapValue(componentKey, 'other', `title${index}`, item)
  })

  template = template.replace(new RegExp(`{{currentIssue}}`, 'g'), currentIssue ?? '')
  setComponentMapValue(componentKey, 'other', `currentIssue`, currentIssue ?? '')
  template = template.replace(new RegExp(`{{currentHitResult}}`, 'g'), currentHitResult ?? '')
  setComponentMapValue(componentKey, 'other', `currentHitResult`, currentHitResult ?? '')
  template = template.replace(new RegExp(`{{previousIssues}}`, 'g'), previousIssues ?? '')
  setComponentMapValue(componentKey, 'other', `previousIssues`, previousIssues ?? '')
  template = template.replace(new RegExp(`{{preHitResult}}`, 'g'), preHitResult ?? '')
  setComponentMapValue(componentKey, 'other', `preHitResult`, preHitResult ?? '')

  // 去掉前后p标签，包括带属性的p标签
  template = template.replace(new RegExp(`<p[^>]*>(.*?)<\/p>`, 'g'), '$1')
  return cssVars + template
}

// 监听参数变化
watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId, newGameType]) => {
    issueParams.size = Number(newSize) || 10
    issueParams.forumId = String(newForumId) || '10'
    issueParams.gameType = String(newGameType)
  }
)

watch(
  () => props.datas.configParamJson.gameType,
  (newGameType) => {
    if (newGameType) {
      setGameType(newGameType)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="IssueLine">
    <div :data-id="datas.componentId" class="IssueLine-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="headerTitleBgStyle">
        <h2 class="main-title" :style="headerTitleTextStyle">
          {{ datas.configParamJson.titlePrefix }}
          {{ getGameName(gameStoreData.gameType) }}
          {{ datas.configParamJson.title }}
        </h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>

      <!-- 前置扩展 -->
      <div class="issue-list-extend" v-if="datas.configParamJson.frontExtend_Enable">
        <div
          class="issue-list"
          v-if="datas.configParamJson.enable"
          :style="{
            backgroundColor: styleConfig.backgroundColor || 'currentColor',
            padding: `${styleConfig.contentPaddingTopBottom}px ${styleConfig.contentPaddingLeftRight}px`
          }"
        >
          <div
            class="issue-item-content"
            :style="{
              gap: styleConfig.listSpacing + 'px',
              gridTemplateColumns: `repeat(${styleConfig.columnCount}, 1fr)`
            }"
          >
            <div
              class="issue-item"
              :style="
                datas.configParamJson.frontExtend_StyleEnable
                  ? {
                      borderWidth: styleConfig.borderWidth + 'px',
                      borderStyle: styleConfig.borderStyle,
                      borderColor: styleConfig.borderColor,
                      borderRadius: Math.max(0, styleConfig.borderRadius) + 'px',
                      padding: `${styleConfig.paddingTopBottom}px ${styleConfig.paddingLeftRight}px`,
                      backgroundColor: styleConfig.itemBackgroundColor || '#f1f1f1',
                      boxShadow: `${styleConfig.boxShadow}` || '0 0 10px 0 rgba(0, 0, 0, 0.1)'
                    }
                  : {}
              "
              v-html="datas.configParamJson.frontExtend_Content"
            ></div>
          </div>
        </div>
      </div>

      <!-- 期数列表 -->
      <div
        class="issue-list"
        v-if="datas.configParamJson.enable"
        :style="{
          backgroundColor: styleConfig.backgroundColor || 'currentColor',
          padding: `${styleConfig.contentPaddingTopBottom}px ${styleConfig.contentPaddingLeftRight}px`
        }"
      >
        <!-- Issue list -->
        <div
          class="issue-item-content"
          :style="{
            gap: styleConfig.listSpacing + 'px',
            gridTemplateColumns: `repeat(${styleConfig.columnCount}, 1fr)`
          }"
        >
          <div
            v-for="(issue, issueIndex) in datas.configParamJson.onlyShowCurrentIssue
              ? [issueListItem[0]]
              : issueListItem"
            :key="issue.postId"
            class="issue-item"
            :style="{
              borderWidth: styleConfig.borderWidth + 'px',
              borderStyle: styleConfig.borderStyle,
              borderColor: styleConfig.borderColor,
              borderRadius: Math.max(0, styleConfig.borderRadius) + 'px',
              padding: `${styleConfig.paddingTopBottom}px ${styleConfig.paddingLeftRight}px`,
              backgroundColor: styleConfig.itemBackgroundColor || '#f1f1f1',
              boxShadow: `${styleConfig.boxShadow}` || '0 0 10px 0 rgba(0, 0, 0, 0.1)'
            }"
            @click="handleIssueClick(issue, datas.configParamJson.customJumpUrl[issueIndex])"
          >
            <div class="issue-display">
              <div
                class="issue-display-content"
                v-if="
                  datas.configParamJson.customJumpUrl.length > 0 &&
                  datas.configParamJson.customJumpUrl[issueIndex] &&
                  datas.configParamJson.customJumpUrl[issueIndex].index === issueIndex + 1
                "
                :style="{
                  gap: styleConfig.numberSpacing + 'px',
                  justifyContent: styleConfig.layout || 'flex-start',
                  display: 'flex',
                  flexDirection: styleConfig.flexDirection || 'row'
                }"
              >
                <a
                  v-if="
                    datas.configParamJson.customJumpUrl[issueIndex].name &&
                    datas.configParamJson.customJumpUrl[issueIndex].url
                  "
                  :href="datas.configParamJson.customJumpUrl[issueIndex].url"
                  target="_blank"
                >
                  <div v-html="datas.configParamJson.customJumpUrl[issueIndex].name"></div>
                </a>
                <div
                  v-else-if="
                    datas.configParamJson.customJumpUrl[issueIndex].name &&
                    !datas.configParamJson.customJumpUrl[issueIndex].url
                  "
                >
                  <div v-html="datas.configParamJson.customJumpUrl[issueIndex].name"></div>
                </div>
                <a
                  v-else-if="
                    !datas.configParamJson.customJumpUrl[issueIndex].name &&
                    datas.configParamJson.customJumpUrl[issueIndex].url
                  "
                  :href="datas.configParamJson.customJumpUrl[issueIndex].url"
                  target="_blank"
                >
                  <div v-html="parseTemplate(issue, issueListItem)"></div>
                </a>
                <div v-else>
                  <div v-html="parseTemplate(issue, issueListItem)"></div>
                </div>
              </div>
              <div
                v-else
                class="issue-display-content"
                :style="{
                  gap: styleConfig.numberSpacing + 'px',
                  justifyContent: styleConfig.layout || 'flex-start',
                  display: 'flex',
                  flexDirection: styleConfig.flexDirection || 'row'
                }"
                v-html="parseTemplate(issue, issueListItem)"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!issueListItem?.length" class="empty-state">
          <span>暂无{{ currentGameName }}数据</span>
        </div>
      </div>

      <!-- 后置扩展 -->
      <div class="issue-list-extend" v-if="datas.configParamJson.backendextend_Enable">
        <div
          class="issue-list"
          v-if="datas.configParamJson.enable"
          :style="{
            backgroundColor: styleConfig.backgroundColor || 'currentColor',
            padding: `${styleConfig.contentPaddingTopBottom}px ${styleConfig.contentPaddingLeftRight}px`
          }"
        >
          <div
            class="issue-item-content"
            :style="{
              gap: styleConfig.listSpacing + 'px',
              gridTemplateColumns: `repeat(${styleConfig.columnCount}, 1fr)`
            }"
          >
            <div
              class="issue-item"
              :style="
                datas.configParamJson.backendextend_StyleEnable
                  ? {
                      borderWidth: styleConfig.borderWidth + 'px',
                      borderStyle: styleConfig.borderStyle,
                      borderColor: styleConfig.borderColor,
                      borderRadius: Math.max(0, styleConfig.borderRadius) + 'px',
                      padding: `${styleConfig.paddingTopBottom}px ${styleConfig.paddingLeftRight}px`,
                      backgroundColor: styleConfig.itemBackgroundColor || '#f1f1f1',
                      boxShadow: `${styleConfig.boxShadow}` || '0 0 10px 0 rgba(0, 0, 0, 0.1)'
                    }
                  : {}
              "
              v-html="datas.configParamJson.backendextend_Content"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.IssueLine {
  position: relative;

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

  .issue-list {
    .issue-item-content {
      display: grid;
      width: 100%;
      font-variant: tabular-nums;
    }

    .issue-item {
      border-bottom: 1px solid #e9ecef;
      background-color: white;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      .issue-display {
        display: flex;
        align-items: center;
        line-height: 1.5;
        color: #333;
        min-height: 1.5em;

        .issue-display-content {
          width: 100%;
        }
      }
    }
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
    background-color: #f8f9fa;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .IssueLine {
    .issue-list .issue-item {
      padding: 6px 12px !important;

      .issue-display {
        gap: 2px !important;
        min-height: 1.2em;
      }
    }
  }
}
</style>
