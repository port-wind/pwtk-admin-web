<script setup lang="ts">
import { reqTemplateInfoByTemplateId } from '@/api/site'
import showErrorMessage from '@/utils/showErrorMessage'
const stateInfo = ref<{
  statsCodeJsUrl: string
  statsCodeInit: string
}>({
  statsCodeInit: '',
  statsCodeJsUrl: ''
})
const activeName = ref('first')
const isTabs = ref<boolean>(false)

defineExpose({
  openDailog(id: string) {
    fetchData(id)
  }
})

const fetchData = (templateId: string) => {
  isTabs.value = true
  if (templateId) {
    reqTemplateInfoByTemplateId({ templateId: templateId })
      .then((res) => {
        if (res.success) {
          stateInfo.value.statsCodeInit = res.data?.statsCodeInit || ''
          stateInfo.value.statsCodeJsUrl = res.data?.statsCodeJsUrl || ''
        } else {
          showErrorMessage(res)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
}
</script>

<template>
  <el-dialog
    v-model="isTabs"
    draggable
    overflow
    destroy-on-close
    :close-on-click-modal="false"
    class="tabs-dialog"
    :style="{ padding: '0 10px' }"
  >
    <el-tabs v-model="activeName" class="m_tabs">
      <el-tab-pane label="统计代码" name="first" class="m_tabs_pane">
        <el-scrollbar>
          <el-form label-width="auto" style="max-width: 600px">
            <el-form-item label="初始化代码:">
              <pre>{{ stateInfo.statsCodeInit }}</pre>
              拷贝
              <copy :content="stateInfo.statsCodeInit" v-if="stateInfo.statsCodeInit"></copy>
            </el-form-item>

            <el-form-item label="统计代码URL:">
              <pre>{{ stateInfo.statsCodeJsUrl }}</pre>
              拷贝
              <copy :content="stateInfo.statsCodeJsUrl" v-if="stateInfo.statsCodeJsUrl"></copy>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style lang="less" scoped></style>
