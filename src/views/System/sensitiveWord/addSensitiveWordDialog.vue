<template>
  <el-dialog v-model="dialogVisible" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane label="敏感词" name="content" class="article-content m_tabs_pane">
        <div class="list-wrapper">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="item">追加词库</div>
            </el-col>
            <el-col :span="8">
              <div class="list-item-wrapper">
                <div v-for="(item, index) in inputList" :key="index" class="input-row">
                  <el-input v-model="item.value" placeholder="请输入词库内容" style="width: 300px" />
                  <el-button type="danger" @click="deleteRow(index)" style="margin-left: 10px">删除</el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="addRow">添加</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="button-row">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { reqBatchAddSensitiveWordList } from '@/api/system/sensitiveWord'
import type { IReqAddSensitiveWordListQueryParams } from '@/api/system/sensitiveWord/type'

interface IProps {}
const props = defineProps<IProps>()

const emit = defineEmits(['onClose'])
const open = () => {
  dialogVisible.value = true
}
defineExpose({
  open
})

const resetForm = () => {
  inputList.value = [{ value: '' }]
}

// State
const activeTab = ref('content')
const dialogVisible = ref(false)
const isLoading = ref(false)

const handleCancel = () => {
  emit('onClose')
  dialogVisible.value = false
}

// 定义输入框数据（响应式数组）
const inputList = ref([
  { value: '' } // 初始一行输入框
])

// 添加行
const addRow = () => {
  inputList.value.push({ value: '' }) // 添加一个新输入框
}

// 删除行
const deleteRow = (index) => {
  if (inputList.value.length > 1) {
    // 至少保留一行
    inputList.value.splice(index, 1)
  } else {
    ElMessage.warning('至少保留一行输入框！')
  }
}

const handleSave = async () => {
  try {
    isLoading.value = true
    // dialogVisible.value = true

    const query: IReqAddSensitiveWordListQueryParams[] = inputList.value.map((item) => {
      let obj: IReqAddSensitiveWordListQueryParams = {
        word: item.value,
        status: 1
      }
      return obj
    })

    const res = await reqBatchAddSensitiveWordList(query)

    if (res.success) {
      ElMessage({
        type: 'success',
        message: '更新成功'
      })
      isLoading.value = false
      resetForm()
      setTimeout(() => {
        dialogVisible.value = false
        emit('onClose')
      }, 300)
    }
  } catch (error) {
    throw new Error('系统错误，无法添加')
  } finally {
    isLoading.value = false
  }
  //   const success
  //   if (success) {
  //     emit('save')
  //     emit('refresh')
  //   }
}
</script>

<style scoped lang="less">
.list-wrapper {
  flex: 1;
}

.item {
  text-align: right;
  height: 30px;
  line-height: 30px;
}
.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.button-row {
  display: flex;
  justify-content: end;
}

.list-item-wrapper {
  overflow: auto;
  height: calc(100vh - 250px);
}
</style>
