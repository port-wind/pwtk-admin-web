<script setup lang="ts" name="IssueCatalog">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import type { IDatas } from './type'
import { useStore } from '@nanostores/vue'
import { useIssueList } from '../hooks/issueList'
import { gameStore } from '../store'
import { getGameName } from '../store/gameStore'
import type { IForumPost } from '../types/forum'
import {
  setComponentMapValue,
  setCustomMergeTags,
  addMergeTagToCategory,
  getCustomMergeTags,
  loadMergeTagsTemplate,
} from '../store/editorStore'

interface IProps {
  datas: IDatas
}

// Props定义
const props = defineProps<IProps>()
const styleHeader = computed(() => props.datas.configParamJson.styleHeader)
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 🎮 CRITICAL: gameType Store Integration
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.gameTypeLongName || '未知游戏')

// 🔄 Dynamic Parameters Based on Game Type
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size) || 10,
  forumId: String(props.datas.configParamJson.forumId) || '10',
  page: Number(props.datas.configParamJson.page) || 1,
  isAll: props.datas.configParamJson.isAll || 'n',
  issueGroup: Number(props.datas.configParamJson.issueGroup) || 1,
})

const { getIssueNumber, getIssueResult, getLotteryPredictions, issueListItem } = useIssueList(issueParams)

// style 样式
const containerStyle = computed(() => {
  return {
    borderRadius: `${styleHeader.value?.borderRadius || 0}px`,
    padding: `${styleHeader.value?.padding || 0}px`,
    backgroundColor: styleMain.value?.backgroundColor || '#f1f1f1',
  }
})

const headerTitleBgStyle = computed(() => {
  if (styleHeader.value.isGradient) {
    return {
      background: `linear-gradient(to right,  ${styleHeader.value.headerBg}, ${styleHeader.value.headerBg2})`,
    }
  }
  return {
    backgroundColor: styleHeader.value?.headerBgColor || '#4a90e2',
  }
})

const headerTitleTextStyle = computed(() => {
  return {
    color: styleHeader.value?.titleColor || '#333333',
  }
})

const subTitleStyle = computed(() => {
  return {
    color: styleHeader.value?.subTitleColor || '#333333',
  }
})

// 🎨 Style Configuration from Right Panel
const styleConfig = computed(() => ({
  listSpacing: props.datas.configParamJson.styleMain?.listSpacing || 0,
  numberSpacing: props.datas.configParamJson.styleMain?.itemSpacing || 0,
  borderRadius: props.datas.configParamJson.styleMain?.borderRadius || 0,
  contentPaddingLeftRight: props.datas.configParamJson.styleMain?.contentPaddingLeftRight || 0,
  contentPaddingTopBottom: props.datas.configParamJson.styleMain?.contentPaddingTopBottom || 0,
  paddingLeftRight: props.datas.configParamJson.styleMain?.paddingLeftRight || 0,
  paddingTopBottom: props.datas.configParamJson.styleMain?.paddingTopBottom || 0,
  backgroundColor: props.datas.configParamJson.styleMain?.backgroundColor || '#f1f1f1',
  itemBackgroundColor: props.datas.configParamJson.styleMain?.itemBackgroundColor || '#f1f1f1',
  layout: props.datas.configParamJson.styleMain?.layout || 'start',
  columnCount: props.datas.configParamJson.styleMain?.columnCount || 1,
}))

// 解析模板并替换变量
const parseTemplate = (issue: IForumPost, _template?: string) => {
  let template = _template || props.datas.configParamJson.dynamicTemplate || ''

  const componentKey = 'IssueCatalog'

  const predictions = getLotteryPredictions(issue)

  // 定义CSS变量
  const cssVars = `
    <style>
      .IssueCatalog-content[data-id="${props.datas.componentId}"] {
        --active-bg: ${props.datas.configParamJson.dynamicActiveBg || '#ffeb3b'};
        --active-bg-text:${props.datas.configParamJson.dynamicActiveBgText || '#000'};
        --dynamic-font-size: ${props.datas.configParamJson.dynamicFontSize}rem;
        --active-text:${props.datas.configParamJson.dynamicActiveText || '#000'};
        --active-text-align: ${props.datas.configParamJson.dynamicActiveTextAlign || 'center'};
        --active-font-size: ${props.datas.configParamJson.dynamicActiveFontSize || '1rem'};
        --active-font-weight: ${props.datas.configParamJson.dynamicActiveFontWeight || '600'};
        --noresult: ${props.datas.configParamJson.dynamicNoResult || '#00F'};
      }
    </style>
  `

  // 获取当前期数
  const issueNumber = getIssueNumber(issue)
  template = template.replace(new RegExp(`{{issueNumber}}`, 'g'), issueNumber)
  setComponentMapValue(componentKey, 'other', `issueNumber`, issueNumber)
  // 获取当前期数的结果
  const result = getIssueResult(issue)

  // predicton 是一个对象， 我门要存key 和 vlaue
  predictions.forEach((prediction, mainIndex) => {
    if (prediction.isHit === 'y') {
      const hitIndex = prediction.hitDetail.split('').findIndex(item => item === '1')
      prediction.predict.forEach((predict, index) => {
        if (hitIndex === index) {
          template = template.replace(
            new RegExp(`{{${mainIndex}_predict${index}}}`, 'g'),
            `<span style="color: var(--active-text);">${predict}</span>`
          )
          setComponentMapValue(componentKey, 'predict', `${mainIndex}_predict${index}`, predict)
        } else {
          template = template.replace(new RegExp(`{{${mainIndex}_predict${index}}}`, 'g'), predict)
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
            template = template.replace(new RegExp(`{{${mainIndex}_predict${index}}}`, 'g'), predict)
            setComponentMapValue(componentKey, 'predict', `${mainIndex}_predict${index}`, predict)
          })
        } else {
          template = template.replace(new RegExp(`{{${mainIndex}_${key}}}`, 'g'), prediction[key])
          setComponentMapValue(componentKey, 'other', `${mainIndex}_${key}`, prediction[key])
        }
      })
    }
  })

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

  // 动态替换竞猜预测数据
  if (issue?.lotteryPredictions?.length) {
    // 遍历所有竞猜预测组
    issue.lotteryPredictions.forEach((prediction, lpIndex) => {
      let index = -1
      if (prediction.isHit && prediction.hitDetail) {
        const hitDetail = prediction.hitDetail
        index = hitDetail.split('').findIndex(item => item === '1')
      }

      // 遍历每个预测组中的预测项
      if (prediction.predict?.length) {
        prediction.predict.forEach((predictItem, pIndex) => {
          if (index !== -1) {
            if (index === pIndex) {
              predictItem = `<span style="background-color: var(--active-bg); color: var(--active-text);">${predictItem}</span>`
            }
          }

          const placeholder = `{{issue_lp${String(lpIndex).padStart(2, '0')}_p${String(pIndex).padStart(2, '0')}}}`
          template = template.replace(new RegExp(placeholder, 'g'), `<span>${predictItem}</span>` || '')
          setComponentMapValue(
            componentKey,
            'issue',
            `issue_lp${String(lpIndex).padStart(2, '0')}_p${String(pIndex).padStart(2, '0')}`,
            `<span>${predictItem}</span>` || ''
          )
        })
      }
    })
  }

  // template 去掉前后p标签 中间的p标签保留
  template = template.replace(new RegExp(`<p[^>]*>(.*?)<\/p>`, 'g'), '$1')

  return cssVars + template
}

const activeIssueListTemplate = ref(props.datas.configParamJson?.issueListTemplate?.[0]?.postIssue || '')
watch(
  () => issueListItem.value,
  newTemplates => {
    if (newTemplates && newTemplates.length > 0) {
      console.log('🚀 ~ watch ~ newTemplates:', newTemplates)
      const postIssueList = newTemplates.map(item => item.postIssue)
      if (!postIssueList.includes(activeIssueListTemplate.value)) {
        // eslint-disable-next-line prefer-destructuring
        activeIssueListTemplate.value = postIssueList[0]
      }
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => [
    props.datas.configParamJson.size,
    props.datas.configParamJson.forumId,
    gameType.value,
    props.datas.configParamJson.page,
    props.datas.configParamJson.isAll,
    props.datas.configParamJson.issueGroup,
  ],
  ([newSize, newForumId, newGameType, newPage, newIsAll, newIssueGroup]) => {
    issueParams.size = Number(newSize) || 10
    issueParams.forumId = String(newForumId) || '10'
    issueParams.gameType = String(newGameType)
    issueParams.page = Number(newPage) || 1
    issueParams.isAll = String(newIsAll) || 'n'
    issueParams.issueGroup = Number(newIssueGroup) || 1
  }
)

watch(
  () => issueListItem.value,
  newIssueListItem => {
    console.log('🚀 ~ watch ~ newIssueListItem:', newIssueListItem)

    // Always recreate issueListTemplate from newIssueListItem
    // eslint-disable-next-line vue/no-mutating-props
    props.datas.configParamJson.issueListTemplate = newIssueListItem.map(item => ({
      postIssue: item.postIssue,
      dynamicTemplate: '',
    }))
  }
)
</script>

<template>
  <div class="IssueCatalog">
    <div :data-id="props.datas.componentId" class="IssueCatalog-content" :style="containerStyle">
      <!-- 头部标题 -->
      <div class="title-header" :style="headerTitleBgStyle">
        <h2 class="main-title" :style="headerTitleTextStyle">
          {{ datas.configParamJson.titlePrefix }}
          {{ getGameName(gameStoreData.gameType) }}
          {{ datas.configParamJson.title }}
        </h2>
        <span class="sub-title" :style="subTitleStyle">{{ datas.configParamJson.subtitle }}</span>
      </div>
      <div
        :style="headerTitleBgStyle"
        v-if="datas.configParamJson.issueListTemplate?.length > 0 && datas.configParamJson.enableTemplateByPostIssue"
        class="issue-tabs"
      >
        <div
          v-for="item in datas.configParamJson.issueListTemplate"
          :key="item.postIssue"
          :class="`issue-tab ${item.postIssue === activeIssueListTemplate ? 'active' : ''}`"
          @click="activeIssueListTemplate = item.postIssue"
          @mouseover="activeIssueListTemplate = item.postIssue"
        >
          {{ item.postIssue }}期
        </div>
      </div>

      <!-- 前置扩展 -->
      <div class="issue-list-extend" v-if="datas.configParamJson.frontExtend_Enable">
        <div v-html="datas.configParamJson.frontExtend_Content"></div>
      </div>
      <!-- 期数列表 -->
      <div
        class="issue-list"
        v-if="datas.configParamJson.enable && !datas.configParamJson.enableTemplateByPostIssue"
        :style="{
          backgroundColor: styleConfig.backgroundColor || 'currentColor',
          padding: `${styleConfig.contentPaddingTopBottom}px ${styleConfig.contentPaddingLeftRight}px`,
        }"
      >
        <!-- Issue list -->
        <div
          class="issue-item-content"
          :style="{
            gap: styleConfig.listSpacing + 'px',
            gridTemplateColumns: `repeat(${styleConfig.columnCount}, 1fr)`,
          }"
        >
          <div
            v-for="(issue, issueIndex) in issueListItem"
            :key="issue.postId"
            class="issue-item"
            :style="{
              borderRadius: Math.max(0, styleConfig.borderRadius) + 'px',
              padding: `${styleConfig.paddingTopBottom}px ${styleConfig.paddingLeftRight}px`,
              backgroundColor: styleConfig.itemBackgroundColor || '#f1f1f1',
            }"
          >
            <div class="issue-display">
              <div
                class="issue-display-content"
                :style="{
                  gap: styleConfig.numberSpacing + 'px',
                  justifyContent: styleConfig.layout || 'flex-start',
                }"
                v-html="parseTemplate(issue)"
              ></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!issueListItem?.length" class="empty-state">
          <span>暂无{{ currentGameName }}数据</span>
        </div>
      </div>

      <!-- 多期数列表 -->
      <div class="issue-list-multi" v-if="datas.configParamJson.enableTemplateByPostIssue">
        <div v-for="(item, index) in datas.configParamJson.issueListTemplate" :key="item.postIssue">
          <div
            class="issue-list-multi-item"
            v-if="item.postIssue === activeIssueListTemplate"
            v-html="parseTemplate(issueListItem[index], item.dynamicTemplate)"
          ></div>
        </div>
      </div>

      <!-- 后置扩展 -->
      <div class="issue-list-extend" v-if="datas.configParamJson.backendextend_Enable">
        <div v-html="datas.configParamJson.backendextend_Content"></div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.IssueCatalog {
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

.issue-list {
  .issue-item-content {
    display: grid;
    width: 100%;
    font-variant: tabular-nums;
  }

  .issue-item {
    // padding: 8px 16px;
    border-bottom: 1px solid #e9ecef;
    background-color: white;

    // text-align: center;
    // cursor: pointer;
    // font-size: 14px;
    // transition: all 0.3s ease;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // user-select: none;
    // align-items: center;

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
        // display: flex;
      }

      .period {
        color: #333;
        font-weight: 500;
        flex-shrink: 0;
      }

      .prediction-content {
        color: #1976d2;
        font-weight: 600;
        flex-shrink: 0;

        .animal {
          color: inherit;

          &.hit-highlight {
            background-color: #ffeb3b !important;
            color: #333 !important;
            border-radius: 3px !important;
            padding: 1px 2px !important;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
          }
        }
      }

      .result {
        color: #333;
        font-weight: 500;
        margin-left: auto;
        flex-shrink: 0;
      }

      .status {
        color: #4caf50;
        font-weight: bold;
        flex-shrink: 0;
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

.screenshot-container {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
}

.screenshot-effect {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.screenshot-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.issue-tabs {
  display: flex;
  gap: 8px;
  padding: 8px;
}

.issue-tab {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &.active {
    background: #fff;
    color: rgb(74, 144, 226);
  }

  &:hover {
    background: #fff;
    color: rgb(74, 144, 226);
  }
}

// Responsive design
@media (max-width: 768px) {
  .sweep-black-bank {
    .issue-list .issue-item {
      // Reduce padding on mobile
      padding: 6px 12px !important;

      .issue-display {
        // Reduce spacing on mobile
        gap: 2px !important;

        // Note: font-size is controlled by inline styles from styleConfig
        // Mobile responsive sizing should be handled by the configuration
        min-height: 1.2em;
      }
    }
  }
}

.issue-list-multi-item {
  :deep(table) {
    border-collapse: collapse;
    font-size: var(--dynamic-font-size);
    line-height: 1.5;
    font-variant: tabular-nums;
    td {
      // font-size: var(--dynamic-font-size) ;
      border: 1px solid #e9ecef;

      span {
        font-family:
          Microsoft YaHei,
          Helvetica,
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          'Fira Sans' !important;
      }

      strong {
        font-family:
          Microsoft YaHei,
          Helvetica,
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          'Fira Sans' !important;
      }
    }

    // 第一列固定宽度
    td:first-child {
      width: 80px;
    }

    td:last-child {
      width: 80px;
    }

    // border: 1px solid #e9ecef;
    td:nth-child(2) {
      background-color: var(--active-bg);
      color: var(--active-bg-text);
      // text-align: var(--active-text-align);
      // font-size: var(--active-font-size);
      // font-weight: var(--active-font-weight);
    }
  }

  > br:first-of-type,
  > br:last-of-type {
    display: none;
  }
}
</style>
