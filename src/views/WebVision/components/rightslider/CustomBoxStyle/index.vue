<template>
  <div class="navBarStyle">
    <!-- 标题 -->
    <h2>{{ datas.componentName }}</h2>

    <!-- 公告 -->
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件名称 -->
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="datas.componentName" />
      </el-form-item>
      <!-- 组件编码 -->
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.pageCode" />
      </el-form-item>
      <h2>CustomBoxStyle</h2>

      <el-form-item label-width="auto" label="模块标题" prop="navId">
        <el-input v-model="datas.title" placeholder="盒子标题 默认为帖子标题（可选）"></el-input>
      </el-form-item>

      <h2>模块标题</h2>
      <div class="form-item-list">
        <el-form-item label-width="auto" label="模块标题" prop="navId">
          <el-input v-model="datas.configParamJson.title"></el-input>
        </el-form-item>
        <el-form-item label-width="auto" label="内容" prop="content">
          <el-input v-model="datas.configParamJson.content"></el-input>
        </el-form-item>
        <el-form-item label-width="auto" label="图片" prop="img">
          <el-input v-model="datas.configParamJson.img"></el-input>
        </el-form-item>
        <el-form-item label-width="auto" label="文字" prop="text">
          <el-input v-model="datas.configParamJson.text"></el-input>
        </el-form-item>

        <!-- <el-form-item label-width="auto" label="模块标题" prop="navId">
          <el-input v-model="datas.configParamJson.title" placeholder="盒子标题 默认为帖子标题（可选）"></el-input>
        </el-form-item>
        <el-form-item label-width="auto" label="对齐方式" prop="align">
          <el-select v-model="datas.configParamJson.align" placeholder="对齐方式（默认做左对齐）">
            <el-option v-for="item in alignOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
      </div>
    </el-form>

    <!-- 提交按钮 -->
    <!-- <el-button class="sub-btn" type="primary" @click="onSubmit">更新</el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, ref } from 'vue'
import type { FormRules } from 'element-plus'
// 定义 props
const props = defineProps<{
  datas: {
    title: string
    componentName: string
    pageCode: string
    configParamJson: {
      title: string
      content?: string
      img?: string
      text?: string
      align?: string
      titleBg?: string
    }
  }
  // isEditJSON: boolean
}>()

defineComponent({
  name: 'PostDetailsBoxStyle'
})

const emit = defineEmits(['update'])

const alignOptions = ref([
  { label: '居左', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '居右', value: 'right' }
])

const rules = ref<FormRules>({
  componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
})

// 引用表单
const ruleFormRef = ref()
</script>

<style scoped lang="less">
.navBarStyle {
  width: 100%;
  // height: 80vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /* 标题 */
  h2 {
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }

  .lef {
    :deep(.el-form-item__label) {
      text-align: left;
    }
  }

  .picke {
    float: right;
  }
  .sub-btn {
    position: relative;
    left: 0;
    bottom: 0;
  }

  .form-item-list {
    // max-height: 600px;
    overflow-y: auto;
    margin-bottom: 18px;
    text-align: center;
    border: 1px solid #9da0a3;
    // margin-top: 0.2rem;
    // padding: 0.2rem;
    padding: 10px;
    .form-item-list-item {
      display: flex;
      justify-content: flex-start;
      gap: 0.4rem;

      .del-btn {
        cursor: pointer;
        margin-left: 1rem;
      }
    }
  }
}

.form-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* 控制元素之间的间距 */
}

.el-form-item {
  flex: 1 1 200px; /* 控制每个元素的宽度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
