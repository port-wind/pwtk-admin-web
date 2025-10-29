<template>
  <div class="lottery-ball-selector">
    <div class="selector-container">
      <div class="selector-header">
        <label style="flex: 1">已选内容:</label>
        <el-button v-if="!props.viewMode" type="primary" @click="handleReset">重置</el-button>
        <el-button v-if="!props.viewMode" type="danger" @click="handleDelete">删除</el-button>
      </div>
      <section>
        <div class="ball-list">
          <span
            v-for="(ball, index) in props.result"
            :key="index"
            class="ball-item"
            :class="{ selected: true }"
            :style="{ cursor: 'not-allowed', fontSize: getFontSize(ball) }"
          >
            {{ ball }}
          </span>
        </div>
      </section>
      <div class="selector-header">
        <label>{{ props.viewMode ? '' : `请选择 ${props.max}个` }} {{ props.title }}</label>
      </div>
      <div class="ball-list">
        <span
          v-for="(ball, index) in ballList"
          :key="index"
          class="ball-item"
          :class="{ selected: props.result.includes(ball) }"
          :style="{
            cursor: getCursorStyle(),
            fontSize: getFontSize(ball)
          }"
          @click="toggleBallSelection(ball)"
        >
          {{ ball }}
        </span>
      </div>
    </div>
    <div v-if="props.viewMode" class="status-indicator">
      <img :src="getStatusImageSrc()" :alt="getStatusAlt()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

export interface BallOption {
  value: string
  selected: boolean
}

// Props with proper TypeScript typing
const props = withDefaults(
  defineProps<{
    options?: string[]
    result: string[]
    title: string
    max: number
    min: number
    viewMode?: boolean
    isHit?: string
    editable?: boolean
  }>(),
  {
    viewMode: false,
    editable: true
  }
)
const ballList = computed<string[]>(() => props.options ?? [])
const stateResult = ref<string[]>([])
const emit = defineEmits<{
  (_: 'reset'): void
  (_: 'update:result', __: string[]): void
  (_: 'delete'): void
}>()

// Methods
function getCursorStyle(): string {
  if (props.viewMode) return 'default'
  return props.editable ? 'pointer' : 'not-allowed'
}

function getFontSize(ball: string): string {
  return ball.length > 1 && Number.isNaN(Number(ball)) ? '12px' : '16px'
}

function getStatusImageSrc(): string {
  switch (props.isHit) {
    case 'i':
      return new URL('@/assets/images/prediction/waiting.png', import.meta.url).href
    case 'y':
      return new URL('@/assets/images/prediction/hitted.png', import.meta.url).href
    case 'n':
      return new URL('@/assets/images/prediction/miss.png', import.meta.url).href
    default:
      return ''
  }
}

function getStatusAlt(): string {
  switch (props.isHit) {
    case 'i':
      return 'waiting'
    case 'y':
      return 'hitted'
    case 'n':
      return 'miss'
    default:
      return ''
  }
}
function resetSelections(): void {
  stateResult.value = []
  emit('update:result', stateResult.value)
}

async function toggleBallSelection(ball: string): Promise<void> {
  if (props.viewMode || !props.editable) {
    return
  }
  const selectedFlag = props.result.includes(ball)
  console.log('toggleBallSelection', ball, selectedFlag)
  // Deselect if already selected
  if (selectedFlag) {
    stateResult.value = stateResult.value.filter((b) => b !== ball)
    emit('update:result', stateResult.value)
    return
  }

  const selectedCount = stateResult.value.length

  // Single selection mode
  if (props.max === 1 && selectedCount === 1) {
    resetSelections()
    await nextTick()
    stateResult.value.push(ball)
    emit('update:result', stateResult.value)
    return
  }

  // Check maximum selection limit
  if (selectedCount >= props.max) {
    ElMessage.warning(`最多只能选择 ${props.max} 个 ${props.title}`)
    return
  }

  stateResult.value.push(ball)
  emit('update:result', stateResult.value)
}

function handleReset(): void {
  resetSelections()
  emit('reset')
}
function handleDelete(): void {
  resetSelections()
  emit('delete')
}
onMounted(() => {
  console.log('ballList', ballList.value)
  stateResult.value = props.result.map((ball) => ball)
})
</script>

<style scoped lang="less">
.lottery-ball-selector {
  display: flex;
  width: 100%;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  min-width: 220px;
  margin: 3px 0;
  background-color: #fafafa;
}

.selector-container {
  display: flex;
  flex: 1;
  flex-direction: column;

  .selector-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    label {
      font-weight: bold;
      display: block;
    }
  }
}

.ball-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.ball-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #a0a0a0;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #fff;

  &.selected {
    background-color: #28a745;
    color: #fff;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
}
</style>
