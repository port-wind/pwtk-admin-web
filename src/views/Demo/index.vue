<template>
  <div class="demo">
    <h1>Demo</h1>
    <TinyEditor v-model="content" :height="500" :placeholder="'请输入内容...'" :menubar="true" :toolbar="toolbar" />
    <div class="preview" v-html="content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TinyEditor from '@/components/TinyEditor/index.vue'

const content = ref('<p>Hello TinyMCE!</p>')

const toolbar = [
  'undo redo',
  'formatselect',
  'bold italic underline strikethrough',
  'forecolor backcolor',
  'alignleft aligncenter alignright alignjustify',
  'bullist numlist outdent indent',
  'removeformat',
  'link image media table',
  'fullscreen',
  'code'
]
</script>

<style scoped lang="less">
.demo {
  width: 100%;
  height: 100%;
  padding: 20px;

  .preview {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
  }
}
</style>
