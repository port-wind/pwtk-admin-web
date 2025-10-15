<script setup lang="ts">
import { defineProps, watch, computed, reactive } from 'vue'
import { useStore } from '@nanostores/vue'

import type { IDatas, SixZodiacRowType } from '../type'
import { useIssueList } from '../../hooks/issueList'
import { gameStore, setActiveTabIndex } from '../../store'
import { useGameTypeFields } from '../../composables/useGameTypeFields'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 🎮 使用 GameType Fields Composable 处理per-gameType show/hide
const datas = computed(() => props.datas)
// const { show } = useGameTypeFields(datas.value)

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)

// 创建响应式参数对象
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})

const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)

// 使用共享的活跃tab状态
const activeTab = computed(() => gameStoreData.value.activeTabIndex)

// 生肖映射 (removed as not used in current implementation)

watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId], [_oldSize, _oldForumId]) => {
    console.log('🚀 ~ 参数变化:', [newSize, newForumId])
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = gameType.value
  }
)

// 获取六肖六码预测数据
const getSixZodiacSixCodeData = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) {
    return { zodiacs: [], codes: [] }
  }

  // 获取特肖预测 (生肖)
  const zodiacPrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8002' && pred.name === '特肖' && pred.predict?.length === 6
  )

  const zodiacs = zodiacPrediction
    ? zodiacPrediction.predict.map((zodiac: string, index: number) => ({
        zodiac,
        isHighlight: zodiacPrediction.hitDetail?.[index] === '1'
      }))
    : []

  // 获取特码预测 (码) - 使用6码预测
  const codePrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8001' && pred.name === '特码' && pred.predict?.length === 6
  )

  const codes = codePrediction
    ? codePrediction.predict.map((code: string, index: number) => ({
        code,
        isHighlight: codePrediction.hitDetail?.[index] === '1'
      }))
    : []

  return { zodiacs, codes }
}

// 获取指定长度的特码预测
const getCodePredictionByLength = (issue: any, length: number) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) {
    return []
  }

  const codePrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8001' && pred.name === '特码' && pred.predict?.length === length
  )

  return codePrediction
    ? codePrediction.predict.map((code: string, index: number) => ({
        code,
        isHighlight: codePrediction.hitDetail?.[index] === '1'
      }))
    : []
}

// 获取中奖数量
const getHitCount = (issue: any) => {
  if (!issue.lotteryPredictions || issue.lotteryPredictions.length === 0) return 0

  // 检查特肖是否中奖
  const zodiacPrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8002' && pred.name === '特肖' && pred.isHit === 'y'
  )

  // 检查特码是否中奖
  const codePrediction = issue.lotteryPredictions.find(
    (pred: any) => pred.code === '8001' && pred.name === '特码' && pred.isHit === 'y'
  )

  let hitCount = 0

  if (zodiacPrediction && zodiacPrediction.hitDetail) {
    hitCount += zodiacPrediction.hitDetail.split('').filter((hit: string) => hit === '1').length
  }

  if (codePrediction && codePrediction.hitDetail) {
    hitCount += codePrediction.hitDetail.split('').filter((hit: string) => hit === '1').length
  }

  return hitCount
}

// 检查是否全部未中奖
const isAllMissed = (issue: any) => {
  const hitCount = getHitCount(issue)
  return hitCount === 0
}

// 获取标签页标题
const getTabTitle = (issue: any) => {
  const issueNum = extractIssueNumber(issue.postIssue)
  return `${issueNum}期`
}

// 获取活跃期数的数据
const activeIssueData = computed(() => {
  if (!processedIssueList.value || processedIssueList.value.length === 0) return null
  return processedIssueList.value[activeTab.value]
})

// 获取指定行的配置
const getRowConfig = (issue: any, rowType: SixZodiacRowType) => {
  const { sixZodiacSixCodeConfig: config } = props.datas.configParamJson
  const issueConfig = config?.issueConfigs?.[issue.postId]
  const rowConfig = issueConfig?.rowConfigs?.[rowType]

  return {
    advertisementContent: rowConfig?.advertisementContent || '兴云播雨隐苍穹',
    advertisementTextColor: rowConfig?.advertisementTextColor || '#333333',
    advertisementFontSize: rowConfig?.advertisementFontSize || 14
  }
}

// 格式化广告内容
const formatAdvertisement = (issue: any, rowType: SixZodiacRowType) => {
  const config = getRowConfig(issue, rowType)
  return config.advertisementContent
}

// 样式主配置
const styleMain = computed(() => props.datas.configParamJson.styleMain)

// 内容项间距
const contentItemsGap = computed(() => {
  return `${styleMain.value?.numberSpacing || 8}px`
})
</script>

<template>
  <div class="six-zodiac-six-code" v-if="datas.configParamJson.enable">
    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <div
        v-for="(issue, index) in processedIssueList"
        :key="issue.postId"
        :class="['tab-item', { active: activeTab === index }]"
        @mouseenter="setActiveTabIndex(index)"
      >
        {{ getTabTitle(issue) }}
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content" v-if="activeIssueData">
      <div class="content-grid">
        <!-- 六肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期六肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs"
                  :key="`zodiac-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '六肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '六肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '六肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 五肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期五肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs.slice(0, 5)"
                  :key="`zodiac-5-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '五肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '五肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '五肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 四肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期四肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs.slice(0, 4)"
                  :key="`zodiac-4-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '四肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '四肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '四肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 三肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期三肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs.slice(0, 3)"
                  :key="`zodiac-3-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '三肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '三肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '三肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 二肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期二肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs.slice(0, 2)"
                  :key="`zodiac-2-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '二肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '二肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '二肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 一肖行 -->
        <div class="zodiac-row">
          <div class="row-label">{{ activeIssueData.postIssue.slice(-3) }}期一肖</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getSixZodiacSixCodeData(activeIssueData).zodiacs.slice(0, 1)"
                  :key="`zodiac-1-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.zodiac }}
                </span>
                <span class="special-text">主博23</span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '一肖').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '一肖').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '一肖') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 内幕消息行 -->
        <div class="zodiac-row">
          <div class="row-label">内幕消息</div>
          <div class="content-area">
            <div class="advertisement-area">
              <span
                class="ad-content ad-special"
                :style="{
                  color: getRowConfig(activeIssueData, '内幕消息').advertisementTextColor,
                  fontSize: getRowConfig(activeIssueData, '内幕消息').advertisementFontSize + 'px'
                }"
              >
                {{ formatAdvertisement(activeIssueData, '内幕消息') }}
              </span>
            </div>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 码中特行 -->
        <div class="code-row">
          <div class="row-label">②码中特</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getCodePredictionByLength(activeIssueData, 2)"
                  :key="`code-2-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.code }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '②码中特').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '②码中特').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '②码中特') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 其他码中特行 -->
        <div class="code-row">
          <div class="row-label">③码中特</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getCodePredictionByLength(activeIssueData, 3)"
                  :key="`code-3-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.code }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '③码中特').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '③码中特').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '③码中特') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 五码中特行 -->
        <div class="code-row">
          <div class="row-label">⑤码中特</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getCodePredictionByLength(activeIssueData, 5)"
                  :key="`code-5-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.code }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '⑤码中特').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '⑤码中特').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '⑤码中特') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>

        <!-- 六码中特行 -->
        <div class="code-row">
          <div class="row-label">⑥码中特</div>
          <div class="content-area">
            <template v-if="!isAllMissed(activeIssueData)">
              <div class="content-items">
                <span
                  v-for="(item, idx) in getCodePredictionByLength(activeIssueData, 6)"
                  :key="`code-6-${idx}`"
                  :class="['item', { highlight: item.isHighlight }]"
                >
                  {{ item.code }}
                </span>
              </div>
            </template>
            <template v-else>
              <div class="advertisement-area">
                <span
                  class="ad-content"
                  :style="{
                    color: getRowConfig(activeIssueData, '⑥码中特').advertisementTextColor,
                    fontSize: getRowConfig(activeIssueData, '⑥码中特').advertisementFontSize + 'px'
                  }"
                >
                  {{ formatAdvertisement(activeIssueData, '⑥码中特') }}
                </span>
              </div>
            </template>
          </div>
          <div class="hit-status">
            开:{{ getHitCount(activeIssueData) > 0 ? getHitCount(activeIssueData) : '?' }} 00
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.six-zodiac-six-code {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.tab-navigation {
  display: flex;
  background: #d32f2f;
  border-radius: 8px 8px 0 0;

  .tab-item {
    flex: 1;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.3);
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    border-radius: 20px;
    margin: 4px 2px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    &.active {
      background: #fff;
      color: #d32f2f;
    }
  }
}

.tab-content {
  padding: 0;
}

.content-grid {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.zodiac-row,
.code-row {
  display: table-row;
}

.row-label {
  display: table-cell;
  width: 100px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.content-area {
  display: table-cell;
  padding: 8px 12px;
  background: v-bind('datas.configParamJson.sixZodiacSixCodeConfig?.contentAreaBackgroundColor || "#000"');
  border: 1px solid #e0e0e0;
  border-left: none;
  vertical-align: middle;
}

.hit-status {
  display: table-cell;
  width: 80px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-left: none;
  font-size: 12px;
  color: #333;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.content-items {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: v-bind('contentItemsGap');
  flex-wrap: wrap;
}

.item {
  display: inline-block;
  padding: v-bind('(styleMain?.padding || 2) + "px"');
  background: v-bind('datas.configParamJson.sixZodiacSixCodeConfig?.itemBackgroundColor || "#333"');
  color: #fff;
  border-radius: v-bind('(styleMain?.borderRadius || 4) + "px"');
  font-size: v-bind('(styleMain?.numberSize || 14) + "px"');
  font-weight: 500;
  text-align: center;
  min-width: 24px;

  &.highlight {
    background: #ffeb3b;
    color: #333;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

.special-text {
  color: #00bcd4;
  font-size: v-bind('(styleMain?.numberSize || 14) + "px"');
  font-weight: 500;
  margin-left: v-bind('contentItemsGap');
}

.advertisement-area {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
}

.ad-content {
  font-weight: 500;
  text-align: center;

  &.ad-special {
    color: #ffeb3b;
  }
}

@media (max-width: 768px) {
  .tab-navigation {
    flex-wrap: wrap;

    .tab-item {
      font-size: 12px;
      padding: 6px 8px;
    }
  }

  .row-label {
    font-size: 11px;
    padding: 6px 8px;
  }

  .content-area {
    padding: 6px 8px;
  }

  .hit-status {
    font-size: 11px;
    padding: 6px 8px;
  }

  .item {
    font-size: v-bind('Math.max((styleMain?.numberSize || 14) - 2, 12) + "px"');
    padding: v-bind('Math.max((styleMain?.padding || 2) - 1, 1) + "px"');
  }

  .ad-content {
    font-size: v-bind('Math.max((styleMain?.numberSize || 14) - 2, 12) + "px"');
  }
}
</style>
