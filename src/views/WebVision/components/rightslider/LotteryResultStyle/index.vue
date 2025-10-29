<script setup lang="ts" name="LotteryResultStyle">
import { ref, computed } from 'vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import type { FormInstance } from 'element-plus'
import type { IDatas, LotteryInfo } from '@/views/WebVision/components/componentsbiz/LotteryResult/type'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

// 使用计算属性来处理 JSON 字符串和对象之间的转换
const lotteriesJson = computed({
  get: () => {
    try {
      return JSON.stringify(props.datas.configParamJson.lotteries, null, 2)
    } catch (e) {
      return '[]'
    }
  },
  set: (val) => {
    try {
      props.datas.configParamJson.lotteries = JSON.parse(val)
    } catch (e) {
      // 解析失败则不更新
      console.error('Invalid JSON format for lotteries:', e)
    }
  }
})
</script>
<template>
  <div class="LotteryResultStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />

      <el-form-item label="API 地址" prop="configParamJson.apiEndpoint">
        <el-input v-model="datas.configParamJson.apiEndpoint" placeholder="请输入数据接口地址" />
      </el-form-item>

      <el-form-item label="默认选中Tab" prop="configParamJson.defaultTabId">
        <el-select v-model="datas.configParamJson.defaultTabId" placeholder="请选择默认Tab" clearable>
          <el-option
            v-for="item in datas.configParamJson.lotteries"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="彩种数据(JSON)" prop="lotteriesJson">
        <el-alert title="请在此处编辑彩种的JSON数据，注意格式正确。" type="info" show-icon :closable="false" />
        <el-input v-model="lotteriesJson" type="textarea" :rows="15" placeholder="请输入彩种的JSON数据" />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.LotteryResultStyle {
  :deep(.el-alert) {
    margin-bottom: 10px;
  }
}
</style>
