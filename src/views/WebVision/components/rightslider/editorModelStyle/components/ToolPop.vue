<template>
  <el-dialog title="文本处理工具" :visible.sync="dialogVisible" width="30%">
    <el-form>
      <el-form-item label="输入文本">
        <el-input type="textarea" v-model="inputText" placeholder="请输入文本或HTML" rows="10"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="processText">处理文本</el-button>
      </el-form-item>
      <el-form-item label="处理结果">
        <el-input type="textarea" :value="outputText" readonly rows="10"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const dialogVisible = ref(props.dialogVisible)

const inputText = ref('')
const outputText = ref('')

const processText = () => {
  try {
    // 去除空格并压缩文本
    const compressedText = inputText.value.replace(/\s+/g, ' ').trim()
    // 转换为 JSON 字符串
    outputText.value = JSON.stringify(compressedText)
  } catch (error) {
    outputText.value = '处理文本时出错，请检查输入。'
  }
}
</script>

<style scoped lang="less">
.el-dialog {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
