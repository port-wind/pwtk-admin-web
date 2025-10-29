<!-- 
 src/views/WebVision/components/componentsbiz/CustomBarAdBox/index.vue
-->

<template>
  <div class="CustomBarAdBoxStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas.configParamJson" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="标题" prop="componentName">
        <el-input v-model="datas.configParamJson.title" />
      </el-form-item>
      <el-form-item label="模版选择" prop="model">
        <el-select v-model="datas.configParamJson.model" placeholder="请选择模版">
          <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <div class="form-item-list" v-if="datas.configParamJson.model === 's1' || datas.configParamJson.model === 's3'">
        <div v-for="(item, index) in datas.configParamJson.itemData" :key="index" class="form-item-list-item">
          <el-form-item label-width="auto" label="文本内容:" :prop="'itemData.' + index + '.text'">
            <el-input v-model="item.text"></el-input>
          </el-form-item>

          <el-form-item label-width="auto" label="超链接:" :prop="'itemData.' + index + '.link'">
            <el-input v-model="item.link" placeholder="请输入超链接"></el-input>
          </el-form-item>
          <el-button type="danger" :icon="Delete" @click="removeItem(index)"></el-button>
        </div>
        <el-button type="primary" :icon="Plus" circle @click="addItem"></el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup name="CustomBarAdBoxStyle">
import { ref } from 'vue'
import shareComponent from '../shareComponent/index.vue'
import componentHeadTitle from '../componentHeadTitle/index.vue'
import type { IDatas } from '@/views/WebVision/components/componentsbiz/CustomBarAdBox/type'
import { Delete, Plus } from '@element-plus/icons-vue'

// 定义 props
const props = defineProps<{
  datas: IDatas
}>()

const modelOptions = ref([
  { label: '模式 1', value: 's1' },
  { label: '模式 2', value: 's2' },
  { label: '模式 3', value: 's3' }
])

const rules = ref({
  componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }]
})

// Method to add a new item
const addItem = () => {
  props.datas.configParamJson.itemData.push({ text: '', link: '' })
}

// Method to remove an item
const removeItem = (index) => {
  props.datas.configParamJson.itemData.splice(index, 1)
}

// 引用表单
const ruleFormRef = ref()
</script>

<style scoped lang="less">
.CustomBarAdBoxStyle {
  width: 100%;
  height: 80vh;
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
    // height: 12rem;
    overflow-y: auto;
    padding: 12px;
    margin-bottom: 18px;
    text-align: center;
    border: 1px solid #9da0a3;

    .form-item-list-item {
      display: flex;
      justify-content: space-between;
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
  gap: 20px;
  /* 控制元素之间的间距 */
}

.el-form-item {
  flex: 1 1 200px;
  /* 控制每个元素的宽度 */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
