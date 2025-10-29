<script setup lang="ts">
interface IStateInfo {
  statsCodeInit?: string
  statsCodeJsUrl?: string
  statsCodeInit2?: string
  statsCodeInit3?: string
  statsCodeInit4?: string
  statsCodeJsUrl2?: string
  statsCodeJsUrl3?: string
  statsCodeJsUrl4?: string
}
export interface IExpose {
  open: (value: IStateInfo) => void
}

const activeTab = ref('first')
const visiable = ref(false)
const initStateInfo = (): IStateInfo => ({
  statsCodeInit: '',
  statsCodeJsUrl: '',
  statsCodeInit2: '',
  statsCodeJsUrl2: '',
  statsCodeInit3: '',
  statsCodeJsUrl3: '',
  statsCodeInit4: '',
  statsCodeJsUrl4: ''
})
const queryForm = reactive<IStateInfo>(initStateInfo())

const open = (value: IStateInfo) => {
  Object.assign(queryForm, value)
  visiable.value = true
}
defineExpose<IExpose>({
  open
})
</script>

<template>
  <el-dialog destroy-on-close v-model="visiable" websiteTitle="统计代码" class="tabs-dialog">
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="统计代码" name="first" class="m_tabs_pane">
        <el-scrollbar>
          <el-form label-width="auto" :model="queryForm">
            <el-form-item label="初始化代码1:" v-if="queryForm.statsCodeInit">
              <pre style="overflow: auto">{{ queryForm.statsCodeInit }}</pre>
              <copy :content="queryForm.statsCodeInit"></copy>
            </el-form-item>
            <el-form-item label="初始化代码2:" v-if="queryForm.statsCodeInit2">
              <pre style="overflow: auto">{{ queryForm.statsCodeInit2 }}</pre>
              <copy :content="queryForm.statsCodeInit2"></copy>
            </el-form-item>
            <el-form-item label="初始化代码3:" v-if="queryForm.statsCodeInit3">
              <pre style="overflow: auto">{{ queryForm.statsCodeInit3 }}</pre>
              <copy :content="queryForm.statsCodeInit3"></copy>
            </el-form-item>
            <el-form-item label="初始化代码4:" v-if="queryForm.statsCodeInit4">
              <pre style="overflow: auto">{{ queryForm.statsCodeInit4 }}</pre>
              <copy :content="queryForm.statsCodeInit4"></copy>
            </el-form-item>
            <el-form-item label="统计代码URL1:" v-if="queryForm.statsCodeJsUrl">
              <pre style="overflow: auto">{{ queryForm.statsCodeJsUrl }}</pre>
              <copy :content="queryForm.statsCodeJsUrl"></copy>
            </el-form-item>
            <el-form-item label="统计代码URL2:" v-if="queryForm.statsCodeJsUrl2">
              <pre style="overflow: auto">{{ queryForm.statsCodeJsUrl2 }}</pre>
              <copy :content="queryForm.statsCodeJsUrl2"></copy>
            </el-form-item>
            <el-form-item label="统计代码URL3:" v-if="queryForm.statsCodeJsUrl3">
              <pre style="overflow: auto">{{ queryForm.statsCodeJsUrl3 }}</pre>
              <copy :content="queryForm.statsCodeJsUrl3"></copy>
            </el-form-item>
            <el-form-item label="统计代码URL4:" v-if="queryForm.statsCodeJsUrl4">
              <pre style="overflow: auto">{{ queryForm.statsCodeJsUrl4 }}</pre>
              <copy :content="queryForm.statsCodeJsUrl4"></copy>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style lang="less" scoped></style>
