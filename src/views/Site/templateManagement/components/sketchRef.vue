<template>
  <el-form
    v-if="sketchInfo"
    label-position="left"
    class="dialog-form search_left"
    :inline="true"
    label-width="70px"
    :style="{ justifyContent: 'center' }"
  >
    <el-row class="form-row" :gutter="20" justify="center">
      <el-col class="left" :span="6">模板草图名称 | 代码:</el-col>
      <el-col :span="18">
        {{ sketchInfo.sketchName }} | {{ sketchInfo.sketchCode }}
        <copy v-if="sketchInfo.sketchCode" :content="sketchInfo.sketchCode" />
      </el-col>
    </el-row>
    <el-row :gutter="20" justify="center" class="form-row">
      <el-col class="left" :span="6">草图类型:</el-col>
      <el-col :span="18">
        {{ optionsSketch.find((item) => item.value === sketchInfo.sketchType)?.label || sketchInfo.sketchType }}
      </el-col>
    </el-row>
    <el-row :gutter="20" justify="center" class="form-row">
      <el-col class="left" :span="6">语言:</el-col>
      <el-col :span="18">{{ getLanguageLabels(sketchInfo.langCodes, optionsLang) }}</el-col>
    </el-row>
    <el-row :gutter="20" justify="center" class="form-row">
      <el-col class="left" :span="6">地区:</el-col>
      <el-col :span="18">{{ getLanguageLabels(sketchInfo.areaCodes, optionsArea) }}</el-col>
    </el-row>
    <el-row :gutter="20" justify="center" class="form-row">
      <el-col class="left" :span="6">备注:</el-col>
      <el-col :span="18">{{ sketchInfo.memo }}</el-col>
    </el-row>
  </el-form>
  <div v-else>
    <el-empty description="暂无数据"></el-empty>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, defineProps, defineExpose } from 'vue'
import { optionsLang, optionsArea } from '@/const/options'
import { getLanguageLabels } from '@/views/Site/Domain/type'
import { reqSketchInfoBySketchCode } from '@/api/site'
import { optionsSketch, textAreaLimit, websiteStatus } from '@/const/options'
// import { useModalsStore } from '@/stores/modalStore'

interface IProps {
  sketchCode: string | undefined
}
const props = defineProps<IProps>()
const sketchInfo = ref()
const reqSketchInfo = async (sketchCode) => {
  const res = await reqSketchInfoBySketchCode({ sketchCode: sketchCode })
  if (res.success) {
    sketchInfo.value = res.data
  }
}

watch(
  () => props.sketchCode,
  (newVal) => {
    if (newVal) {
      reqSketchInfo(newVal)
    }
  }
)
</script>
<style scoped>
.left {
  text-align: right;
}
.form-row {
  margin-bottom: 20px !important;
}
.search_left {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
