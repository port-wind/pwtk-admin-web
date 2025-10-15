<script setup lang="ts" name="shareBuildComponent">
import type { ISetStyle } from '../../componentsbiz/componentProperties'

interface IProps {
  datas: ISetStyle<any>
}

const props = defineProps<IProps>()

const rules = ref({
  componentType: [{ required: true, message: '请输入组件类型', trigger: 'blur' }],
  componentName: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
  sketchCode: [{ required: false, message: '请输入草图代码', trigger: 'blur' }],
  isView: [{ required: false, message: '请输入可见', trigger: 'blur' }],
  pageCode: [{ required: false, message: '请输入页面编码', trigger: 'blur' }]
})
</script>

<template>
  <div>
    <el-form label-width="80px" ref="ruleFormRef" :model="datas" :rules="rules">
      <!-- <el-input v-model="datas.componentId" hidden /> -->
      <el-form-item label="组件类型" prop="componentType">
        <el-input v-model="datas.componentType" disabled />
      </el-form-item>
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="datas.componentName" disabled />
      </el-form-item>
      <el-form-item label="草图代码" prop="sketchCode">
        <el-input v-model="datas.sketchCodeList" disabled />
      </el-form-item>
      <el-form-item label="可见" prop="isView">
        <el-switch v-model="datas.isView" active-value="y" inactive-value="n" disabled />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="datas.status" active-value="y" inactive-value="n" disabled />
      </el-form-item>
      <el-form-item label="页面编码" prop="pageCode">
        <el-input v-model="datas.pageCode" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="memo">
        <el-input v-model="datas.memo" disabled />
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped></style>
