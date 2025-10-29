<template>
  <div class="richtext-style">
    <!-- 标题 -->
    <h2>{{ props.datas.text }}</h2>

    <el-form label-width="auto" :model="props.datas">
      <!-- 背景颜色 -->
      <el-form-item label="背景颜色">
        <!-- 背景颜色 -->
        <el-color-picker
          v-model="props.datas.backColor"
          show-alpha
          style="float: right"
          class="picker"
          :predefine="predefineColors"
        ></el-color-picker>
      </el-form-item>
      <div>
        <CKEditor v-model="props.datas.myValue" :placeholder="'请输入内容...'" :height="450" />
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { uploadCOS } from '@/views/WebVision/const/upload'
import CKEditor from '@/components/CKEditor/index.vue'

// 类型定义
interface Props {
  datas: {
    text: string
    backColor: string
    myValue: string
    [key: string]: any
  }
}

// Props定义
const props = defineProps<Props>()

// 预定义颜色
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#409EFF',
  '#909399',
  '#C0C4CC',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]
</script>

<style scoped lang="less">
.richtext-style {
  width: 100%;
  padding: 0 10px 20px;
  box-sizing: border-box;

  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
}

/* 修改富文本样式 */
:deep(.tox) {
  border: 1px solid #ebedf0 !important;

  .tox-tbtn {
    height: 25px !important;
    margin: 0 2px !important;
    width: auto;
    font-size: 13px;
  }

  .tox-tbtn--bespoke .tox-tbtn__select-label {
    width: auto !important;
  }

  .tox-toolbar__group {
    background: #f7f8fa;
  }
}

:deep(.tox) .tox-toolbar,
.tox .tox-toolbar__primary,
.tox .tox-toolbar__overflow {
  background: none !important;
}

:deep(.tox) .tox-tbtn--enabled,
.tox .tox-tbtn--enabled:hover {
  background: none !important;
  :deep(svg) {
    fill: #155bd4 !important;
  }
}

.richtext-style {
  width: 100%;
  padding: 0 10px 20px;
  box-sizing: border-box;
  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
}

/* 修改富文本样式 */
:deep(.tox) {
  border: 1px solid #ebedf0 !important;
  .tox-tbtn {
    height: 25px !important;
    margin: 0 2px !important;
    width: auto;
    font-size: 13px;
  }
  .tox-tbtn--bespoke .tox-tbtn__select-label {
    width: auto !important;
  }
  .tox-toolbar__group {
    background: #f7f8fa;
  }
}

:deep(.tox) .tox-toolbar,
.tox .tox-toolbar__primary,
.tox .tox-toolbar__overflow {
  background: none !important;
}

:deep(.tox) .tox-tbtn--enabled,
.tox .tox-tbtn--enabled:hover {
  background: none !important;
  :deep(svg) {
    fill: #155bd4 !important;
  }
}
</style>
