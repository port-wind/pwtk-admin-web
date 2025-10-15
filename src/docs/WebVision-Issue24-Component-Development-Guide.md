# WebVision Issue24 Component Development Guide

## 🎯 Overview

This guide provides a systematic methodology for developing Issue24 lottery prediction components. It emphasizes **intelligent pattern detection**, **data-driven development**, and **visual-first design** to create robust, maintainable components without hard-coding.

## 🏗️ Development Methodology

### Core Principles

1. **Visual-First Design**: Always start with the visual requirements from provided images
2. **Data-Driven Logic**: Analyze API data structure to determine component behavior
3. **Pattern Recognition**: Use intelligent detection instead of hard-coded values
4. **Flexible Architecture**: Build components that adapt to different data variations
5. **Professional Standards**: Follow Vue 3 + TypeScript best practices

## 📋 Standard Component Architecture

### Dynamic Component Base Template

**Note**: Issue24 components are **Dynamic Components** that heavily rely on gameType store integration.

```vue
<script setup lang="ts" name="Issue24Component">
import { defineProps, watch, computed, reactive, onMounted } from 'vue'
import { useStore } from '@nanostores/vue'
import type { IDatas } from './type'
import { useIssueList } from '../../hooks/issueList'
import { gameStore } from '../../store'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

// 🎮 CRITICAL: gameType Store Integration
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)
const currentGameName = computed(() => currentGame.value?.name || '未知游戏')

// 🔄 Dynamic Parameters Based on Game Type
const issueParams = reactive({
  gameType: gameType.value,
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})

const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)

// 🎯 Monitor Game Type Changes
watch(
  gameType,
  (newGameType) => {
    if (newGameType) {
      issueParams.gameType = newGameType
      console.log(`🎮 Game Type Changed: ${newGameType}`)
      // Component will automatically react to new game data
    }
  },
  { immediate: true }
)

// 📊 Monitor Configuration Changes
watch(
  () => [props.datas.configParamJson.size, props.datas.configParamJson.forumId, gameType.value],
  ([newSize, newForumId, newGameType]) => {
    issueParams.size = Number(newSize)
    issueParams.forumId = String(newForumId)
    issueParams.gameType = newGameType
  }
)

// 🔍 STEP 1: Intelligent Pattern Detection
const getPredictionData = (issue: any) => {
  // Implementation based on API analysis
  // Must handle different game types dynamically
}

// 🎯 STEP 2: Hit Detection Logic
const isHit = (issue: any) => {
  // Implementation based on business rules
  // Must consider game-specific hit detection
}

// 📊 STEP 3: Data Processing
const processDisplayData = (issue: any) => {
  // Implementation based on visual requirements
  // Must adapt to different game types
}

// 🎨 STEP 4: Visual Data Preparation
const getDisplayElements = (issue: any) => {
  // Implementation based on image analysis
  // Must support dynamic game name display
}

// 🎮 Game-Specific Display Title
const getComponentTitle = (issue: any) => {
  // Dynamic component title based on game type
  return `${currentGameName.value}${props.datas.configParamJson.title || '预测'}`
}

onMounted(() => {
  // Initialize with current game type
  if (gameType.value) {
    console.log(`🎮 Component initialized with game type: ${gameType.value}`)
  }
})
</script>

<template>
  <div
    class="issue-list"
    v-if="datas.configParamJson.enable"
  >
    <!-- Game Type Indicator (Optional) -->
    <div
      v-if="datas.configParamJson.showGameType"
      class="game-type-header"
    >
      <span class="game-name">{{ currentGameName }}</span>
    </div>

    <div
      v-for="(issue, issueIndex) in processedIssueList"
      :key="issue.postId"
      class="issue-item"
    >
      <div class="component-display">
        <!-- Dynamic content based on game type -->
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">{{ getComponentTitle(issue) }}</span>
        <span class="prediction-content">
          {{ formatPredictionDisplay(issue) }}
        </span>
        <span class="result">开:{{ getLotteryResult(issue) }}</span>
        <span class="status">准</span>
      </div>
    </div>

    <!-- Empty State for Dynamic Components -->
    <div
      v-if="!processedIssueList?.length"
      class="empty-state"
    >
      <span>暂无{{ currentGameName }}数据</span>
    </div>
  </div>

  <!-- Required slot for delete button -->
  <slot name="deles" />
</template>

<style lang="scss" scoped>
.issue-list {
  padding: 0;
  background-color: #ffffff;

  .game-type-header {
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e8eaed;

    .game-name {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
  }

  .issue-item {
    padding: 8px 12px;
    border-bottom: 1px solid #e8eaed;
    background-color: #ffffff;

    &:last-child {
      border-bottom: none;
    }
  }

  .component-display {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    justify-content: center;
    text-align: center;
    padding: 4px 0;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }

  // Responsive design
  @media (max-width: 768px) {
    .component-display {
      font-size: 12px;
      gap: 1px;
    }

    .issue-item {
      padding: 6px 8px;
    }
  }
}
</style>
```

### Dynamic Component Integration Points

#### 🎮 Game Type Store Integration

```typescript
// Essential gameType store integration
const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)

// Auto-reactive to game type changes
watch(
  gameType,
  (newGameType) => {
    if (newGameType) {
      // Update component parameters
      issueParams.gameType = newGameType
      // Component automatically fetches new data
    }
  },
  { immediate: true }
)
```

#### 🔄 Dynamic Data Binding

```typescript
// Parameters that change with game type
const issueParams = reactive({
  gameType: gameType.value, // Critical: Always use current game type
  size: Number(props.datas.configParamJson.size),
  forumId: String(props.datas.configParamJson.forumId)
})

// Hook automatically re-fetches when gameType changes
const { extractIssueNumber, processedIssueList } = useIssueList(issueParams)
```

#### 🎯 Game-Specific Processing

```typescript
// Processing must consider game type
const processGameSpecificData = (issue: any) => {
  switch (gameType.value) {
    case 'hk6plus1':
      return processHK6Plus1Data(issue)
    case 'ssc':
      return processSSCData(issue)
    case 'pk10':
      return processPK10Data(issue)
    default:
      return processDefaultData(issue)
  }
}
```

## 🔬 Systematic Development Process

### Phase 1: Requirements Analysis

#### 1.1 Visual Requirements Analysis

- **Extract Layout**: Analyze provided image for display format
- **Identify Elements**: Period, title, prediction content, result, status
- **Note Highlighting**: Determine what elements need yellow highlighting
- **Consider Responsive**: Plan for mobile optimization

#### 1.2 API Data Structure Analysis

```typescript
// Create comprehensive data structure documentation
interface APIAnalysis {
  dataFormat: 'array' | 'string' | 'object'
  predictionStructure: 'single' | 'multiple' | 'complex'
  hitDetectionMethod: 'boolean' | 'detailed' | 'calculated'
  resultFormat: 'simple' | 'complex' | 'nested'
}
```

#### 1.3 Component Type Classification

```typescript
type ComponentType =
  | 'binary-classification' // 单双、大小、天地
  | 'multi-selection' // 多选预测
  | 'sequence-prediction' // 数字序列
  | 'kill-prediction' // 杀码类型
  | 'range-prediction' // 区间预测
  | 'animal-prediction' // 生肖预测
  | 'complex-combination' // 复杂组合
```

### Phase 2: Pattern Detection Development

#### 2.1 Smart Detection Framework

```typescript
// Generic pattern detection framework
const detectPredictionPattern = (prediction: any): PatternType => {
  const detectors = [
    detectBinaryPattern,
    detectSequencePattern,
    detectAnimalPattern,
    detectRangePattern,
    detectKillPattern,
    detectComplexPattern
  ]

  for (const detector of detectors) {
    const result = detector(prediction)
    if (result.isMatch) {
      return result.pattern
    }
  }

  return 'unknown'
}
```

#### 2.2 Pattern Detection Libraries

```typescript
// Binary Classification Detection
const detectBinaryPattern = (pred: any) => {
  if (!pred.rule?.options) return { isMatch: false }

  const optionKeys = Object.keys(pred.rule.options)
  const isBinary = optionKeys.length === 2
  const isOpposite = checkOppositePattern(optionKeys)

  return {
    isMatch: isBinary && isOpposite,
    pattern: 'binary-classification',
    categories: optionKeys
  }
}

// Sequence Pattern Detection
const detectSequencePattern = (pred: any) => {
  if (!pred.predict?.length) return { isMatch: false }

  const prediction = pred.predict[0]
  const patterns = [
    /^\d{1,2}-\d{1,2}$/, // Range: "17-41"
    /^[\d-]+$/, // Multi-number: "6-1-7-0-8-5-4-9"
    /^\d+$/ // Single number
  ]

  return {
    isMatch: patterns.some((p) => p.test(prediction)),
    pattern: 'sequence-prediction',
    format: determineSequenceFormat(prediction)
  }
}

// Animal Pattern Detection
const detectAnimalPattern = (pred: any) => {
  const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

  if (!pred.predict?.length) return { isMatch: false }

  const hasAnimals = pred.predict.some((p: string) => zodiacAnimals.some((animal) => p.includes(animal)))

  return {
    isMatch: hasAnimals,
    pattern: 'animal-prediction',
    animals: extractAnimals(pred.predict)
  }
}
```

### Phase 3: Data Processing Framework

#### 3.1 Flexible Data Structure Handling

```typescript
// Universal lottery result processor
const getLotteryResult = (issue: any) => {
  const processors = [processArrayFormat, processStringFormat, processObjectFormat, processNestedFormat]

  for (const processor of processors) {
    const result = processor(issue.numInfo)
    if (result.isValid) {
      return result.value
    }
  }

  return '?'
}

// Array format processor
const processArrayFormat = (numInfo: any) => {
  if (!Array.isArray(numInfo)) return { isValid: false }

  const specialNum = numInfo.find((num) => num.index === 7) || numInfo[numInfo.length - 1]

  if (specialNum) {
    return {
      isValid: true,
      value: `${specialNum.shengxiao}${specialNum.num.toString().padStart(2, '0')}`,
      allNumbers: numInfo.map((n) => n.num.toString())
    }
  }

  return { isValid: false }
}

// String format processor
const processStringFormat = (numInfo: any) => {
  if (typeof numInfo !== 'string' || !numInfo.includes(',')) {
    return { isValid: false }
  }

  const numArray = numInfo.split(',').map((n) => n.trim())

  return {
    isValid: true,
    value: numArray.length >= 8 ? numArray[7] : numArray[numArray.length - 1],
    allNumbers: numArray
  }
}
```

#### 3.2 Hit Detection Framework

```typescript
// Universal hit detection
const detectHit = (issue: any, pattern: PatternType) => {
  const strategies = {
    'binary-classification': detectBinaryHit,
    'sequence-prediction': detectSequenceHit,
    'animal-prediction': detectAnimalHit,
    'kill-prediction': detectKillHit,
    'range-prediction': detectRangeHit
  }

  return strategies[pattern]?.(issue) || false
}

// Position-based hit detection (for detailed hit info)
const detectPositionalHit = (hitDetail: string, position: number) => {
  if (!hitDetail || hitDetail.length <= position) return false
  return hitDetail[position] === '1'
}

// Category-based hit detection
const detectCategoryHit = (prediction: any, lotteryResult: any) => {
  const { categories, predicted } = prediction
  const resultCategory = determineCategoryMembership(lotteryResult, categories)
  return resultCategory === predicted
}
```

### Phase 4: Visual Implementation

#### 4.1 Display Format Templates

```typescript
// Standard display format: {期数}期:{组件名称}《{预测内容}》开:{开奖结果} 准
const formatDisplay = (issue: any, componentName: string) => {
  return {
    period: `${extractIssueNumber(issue.postIssue)}期:`,
    title: componentName,
    prediction: formatPredictionContent(issue),
    result: `开:${getLotteryResult(issue)}`,
    status: '准'
  }
}

// Flexible prediction content formatting
const formatPredictionContent = (issue: any) => {
  const pattern = detectPredictionPattern(issue.lotteryPredictions[0])

  const formatters = {
    'binary-classification': (pred: any) => `《${pred.predict[0]}》`,
    'sequence-prediction': (pred: any) => formatSequenceDisplay(pred),
    'animal-prediction': (pred: any) => formatAnimalDisplay(pred),
    'kill-prediction': (pred: any) => formatKillDisplay(pred)
  }

  return formatters[pattern]?.(getPredictionData(issue)) || '《未知》'
}
```

#### 4.2 Highlighting Framework

```typescript
// Universal highlighting system
const getHighlightStatus = (element: any, issue: any) => {
  const highlightStrategies = {
    prediction: () => isPredictionHit(issue),
    'individual-number': (num: string, index: number) => isNumberHit(num, index, issue),
    category: (category: string) => isCategoryHit(category, issue),
    position: (position: number) => isPositionHit(position, issue)
  }

  return highlightStrategies[element.type]?.(element.value, element.index) || false
}
```

#### 4.3 CSS Standards

```scss
// Standard component styling
.issue-list {
  padding: 0;
  background-color: #ffffff;
}

.issue-item {
  padding: 8px 12px;
  border-bottom: 1px solid #e8eaed;
  background-color: #ffffff;

  &:last-child {
    border-bottom: none;
  }
}

.component-display {
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  justify-content: center;
  text-align: center;
  padding: 4px 0;
}

// Universal element styles
.period,
.title,
.result,
.status {
  color: #333;
  font-weight: 500;
}

.prediction-content {
  color: #e74c3c;
  font-weight: 500;
  margin: 0 1px;
}

// Universal hit highlighting
.hit-highlight {
  background-color: #ffeb3b !important;
  color: #333 !important;
  border-radius: 2px !important;
  padding: 0 2px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

// Responsive design
@media (max-width: 768px) {
  .component-display {
    font-size: 12px;
    gap: 1px;
  }

  .issue-item {
    padding: 6px 8px;
  }
}
```

## 🔧 Development Workflow

### Step 1: Initialize Component Structure

```bash
# Create component following the base template
# Add necessary imports and basic structure
```

### Step 2: API Data Analysis

```typescript
// 1. Log and analyze API structure
console.log('🔍 API Analysis:', issue)
console.log('📊 Predictions:', issue.lotteryPredictions)
console.log('🎯 NumInfo:', issue.numInfo)

// 2. Document data patterns
const analyzeAPIStructure = (data: any) => {
  return {
    predictionFormat: typeof data.lotteryPredictions[0].predict,
    hitDetectionMethod: data.lotteryPredictions[0].hitDetail ? 'detailed' : 'boolean',
    resultFormat: Array.isArray(data.numInfo) ? 'array' : 'string'
  }
}
```

### Step 3: Pattern Detection Implementation

```typescript
// Implement intelligent pattern detection
const getPredictionData = (issue: any) => {
  if (!issue.lotteryPredictions?.length) return null

  const prediction = issue.lotteryPredictions.find((pred) => {
    // Smart detection logic based on API analysis
    return detectPattern(pred)
  })

  return prediction ? processRediction(prediction) : null
}
```

### Step 4: Visual Implementation

```vue
<template>
  <div
    class="issue-list"
    v-if="datas.configParamJson.enable"
  >
    <div
      v-for="(issue, issueIndex) in processedIssueList"
      :key="issue.postId"
      class="issue-item"
    >
      <div class="component-display">
        <span class="period">{{ extractIssueNumber(issue.postIssue) }}期:</span>
        <span class="title">{{ getComponentTitle(issue) }}</span>
        <span class="prediction-content">
          {{ formatPredictionDisplay(issue) }}
        </span>
        <span class="result">开:{{ getLotteryResult(issue) }}</span>
        <span class="status">准</span>
      </div>
    </div>
  </div>
</template>
```

### Step 5: Testing & Validation

```typescript
// Debug logging
const debugComponent = computed(() => {
  console.log('📋 Processed Issues:', processedIssueList.value)
  console.log(
    '🎯 Pattern Detection:',
    processedIssueList.value?.map((issue) => ({
      issue: issue.postIssue,
      pattern: detectPredictionPattern(issue.lotteryPredictions[0]),
      hit: detectHit(issue)
    }))
  )
  return processedIssueList.value
})
```

## 📚 Common Patterns & Solutions

### Pattern 1: Binary Classification

```typescript
// Examples: 单双、大小、天地生肖
const detectBinaryClassification = (pred: any) => {
  return pred.rule?.options && Object.keys(pred.rule.options).length === 2 && pred.predict?.length === 1
}
```

### Pattern 2: Multi-Number Sequence

```typescript
// Examples: 无敌八尾、杀码组合
const detectMultiNumberSequence = (pred: any) => {
  return Array.isArray(pred.predict) && pred.predict.every((p: string) => /^\d{1,2}$/.test(p))
}
```

### Pattern 3: Range Prediction

```typescript
// Examples: 中特码段
const detectRangePrediction = (pred: any) => {
  return pred.predict?.length === 1 && /^\d{1,2}-\d{1,2}$/.test(pred.predict[0])
}
```

### Pattern 4: Kill Prediction

```typescript
// Examples: 杀肖、杀波、杀行
const detectKillPrediction = (pred: any) => {
  return pred.name?.includes('杀') || pred.code?.startsWith('815') // Common kill codes
}
```

## 🚀 Best Practices

### 1. **Never Hard-Code**

❌ **Wrong:**

```typescript
pred.name.includes('合单双') || pred.code === '8016'
```

✅ **Correct:**

```typescript
detectBinaryClassification(pred) || detectSpecificPattern(pred)
```

### 2. **Always Handle Multiple Data Formats**

```typescript
const processData = (data: any) => {
  const processors = [processArrayFormat, processStringFormat, processObjectFormat]
  return processors.find((p) => p(data).isValid)?.process(data) || defaultValue
}
```

### 3. **Use Position-Based Hit Detection When Available**

```typescript
const isHit = (index: number, hitDetail: string) => {
  return hitDetail?.[index] === '1' || fallbackHitDetection(index)
}
```

### 4. **Implement Comprehensive Error Handling**

```typescript
const safeProcess = (data: any) => {
  try {
    return processData(data)
  } catch (error) {
    console.error('Processing error:', error)
    return defaultValue
  }
}
```

### 5. **Follow Visual Requirements Exactly**

- Match image layout precisely
- Implement exact highlighting behavior
- Ensure responsive design
- Use consistent spacing and typography

## 🎯 Component Quality Checklist

### Before Development

- [ ] Analyze image requirements thoroughly
- [ ] Document API data structure completely
- [ ] Identify prediction pattern type
- [ ] Plan hit detection strategy

### During Development

- [ ] Use intelligent pattern detection
- [ ] Handle multiple data formats
- [ ] Implement comprehensive null checks
- [ ] Add proper TypeScript typing
- [ ] Follow visual requirements exactly

### After Development

- [ ] Test with provided API data
- [ ] Verify hit highlighting works
- [ ] Check responsive behavior
- [ ] Validate all edge cases
- [ ] Remove debug logging

## 📖 Quick Reference

### Component Types

- **Binary**: Single prediction with two options
- **Multi-Sequence**: Array of numbers/digits
- **Range**: Number range predictions
- **Kill**: Exclusion predictions
- **Animal**: Zodiac-based predictions
- **Complex**: Combination predictions

### Hit Detection Methods

- **Boolean**: `isHit: "y"` field
- **Detailed**: `hitDetail: "10001000"` position-based
- **Calculated**: Based on lottery result analysis

### Display Formats

- **Standard**: `{期数}期:{组件名称}《{预测内容}》开:{开奖结果} 准`
- **Multi-Element**: Separate highlighting for each element
- **Position-Based**: Individual element highlighting

---

**Remember**: This guide emphasizes **intelligence over hard-coding**, **flexibility over rigidity**, and **visual accuracy over shortcuts**. Every component should be a perfect implementation of the provided requirements without compromising on code quality or maintainability.
