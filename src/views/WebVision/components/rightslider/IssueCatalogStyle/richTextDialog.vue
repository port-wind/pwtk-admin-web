<script setup lang="ts">
import { ref } from 'vue'
import type { IDatas } from '../../componentsbiz/IssueCatalog/type'
import DicList from '../IssueLineStyle/dicList.vue'
import TinyEditor from '@/components/TinyEditor/index.vue'
import { getCustomMergeTags } from '../../componentsbiz/store/editorStore'
import { useStore } from '@nanostores/vue'
import { editorStore } from '../../componentsbiz/store/editorStore'

const editorStoreData = useStore(editorStore)

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const dialogVisible = ref(false)
const tempText = ref('')
const key = ref('')
const tempPostIssue = ref<string>('')
const dynamicListIndex = ref(-1)

const openRichText = (valueKey: string, postIssue: string) => {
  key.value = valueKey

  if (postIssue) {
    tempPostIssue.value = postIssue
    tempText.value =
      props.datas.configParamJson.issueListTemplate.find((item) => item.postIssue === postIssue)?.dynamicTemplate || ''
  } else {
    tempText.value = props.datas.configParamJson[key.value]
  }
  dialogVisible.value = true
}

const handleSave = () => {
  if (typeof props.datas.configParamJson[key.value] === 'string') {
    props.datas.configParamJson[key.value] = tempText.value
  } else {
    props.datas.configParamJson[key.value][dynamicListIndex.value].dynamicTemplate = tempText.value
  }
  dialogVisible.value = false
  tempText.value = ''
  key.value = ''
  tempPostIssue.value = ''
}

const openRichTextDynamicList = (valueKey: string, postIssue: string, _index: number) => {
  key.value = valueKey
  dynamicListIndex.value = _index
  props.datas.configParamJson[key.value].forEach((item: any, index: number) => {
    if (item.postIssue === postIssue) {
      tempText.value = item.dynamicTemplate
    }
  })
  dialogVisible.value = true
}

const handleClearContent = () => {
  if (dynamicListIndex.value === -1) {
    props.datas.configParamJson[key.value] = ''
  } else {
    // 如果动态列表索引不为-1，则赋值给动态列表的name
    props.datas.configParamJson[key.value][dynamicListIndex.value].dynamicTemplate = ''
  }
  handleClose()
}

const handleClose = () => {
  dialogVisible.value = false
  tempText.value = ''
  key.value = ''
  tempPostIssue.value = ''
  // dynamicListIndex.value = -1
}

defineExpose({
  openRichText,
  openRichTextDynamicList
})
</script>

<template>
  <!-- 编辑器弹出框 -->
  <el-dialog
    v-model="dialogVisible"
    title="编辑文本内容"
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <!-- <WangEditor v-model="tempText" /> -->
    <div class="rich-text-dialog-content">
      <div class="rich-text-dialog-content-left">
        <!-- <WangEditor v-model="tempText" @clearContent="handleClearContent" /> -->
        <TinyEditor v-model="tempText" :height="600" :mergetags-list="getCustomMergeTags()" />
      </div>
      <div class="rich-text-dialog-content-right">
        <DicList componentKey="IssueCatalog" />
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.rich-text-dialog-content {
  display: flex;
  .rich-text-dialog-content-left {
    flex: 1;
  }
  .rich-text-dialog-content-right {
    flex: none;
    width: 35%;
  }
}
</style>
