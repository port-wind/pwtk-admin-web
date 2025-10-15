<script setup lang="ts">
import { ref } from 'vue'
import type { IDatas } from '../../componentsbiz/IssueLine/type'
import { editorStore } from '@/views/WebVision/components/componentsbiz/store'
import { getCustomMergeTags } from '../../componentsbiz/store/editorStore'
import { useStore } from '@nanostores/vue'
import DicList from './dicList.vue'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const dialogVisible = ref(false)
const tempText = ref('')
const key = ref('')
const dynamicListIndex = ref(-1)
const tempPostIssue = ref<string>('')
const editorStoreData = useStore(editorStore)

const openRichText = (valueKey: string, postIssue: string) => {
  console.log('🚀 ~ editorStoreData:', editorStoreData.value.listKeys)

  key.value = valueKey
  tempText.value = props.datas.configParamJson[key.value]
  dialogVisible.value = true
}

const handleSave = () => {
  // 如果动态列表索引为-1，则直接赋值
  if (dynamicListIndex.value === -1) {
    props.datas.configParamJson[key.value] = tempText.value
  } else {
    // 如果动态列表索引不为-1，则赋值给动态列表的name
    props.datas.configParamJson[key.value][dynamicListIndex.value].name = tempText.value
  }

  // reset all value
  dialogVisible.value = false
  tempText.value = ''
  key.value = ''
  tempPostIssue.value = ''
  dynamicListIndex.value = -1
}

const openRichTextDynamicList = (valueKey: string, _index: number) => {
  key.value = valueKey
  dynamicListIndex.value = _index
  props.datas.configParamJson[key.value].forEach((item: any, index: number) => {
    if (index === dynamicListIndex.value) {
      tempText.value = item.name
    }
  })
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  tempText.value = ''
  key.value = ''
  tempPostIssue.value = ''
  dynamicListIndex.value = -1
}

const handleClearContent = () => {
  // console.log('richTextDialog1 handleClearContent')
  if (dynamicListIndex.value === -1) {
    props.datas.configParamJson[key.value] = ''
  } else {
    // 如果动态列表索引不为-1，则赋值给动态列表的name
    props.datas.configParamJson[key.value][dynamicListIndex.value].name = ''
  }
  handleClose()
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
    @close="handleClose"
  >
    <div class="rich-text-dialog-content">
      <div class="rich-text-dialog-content-left">
        <!-- <WangEditor v-model="tempText" @clearContent="handleClearContent" /> -->
        <TinyEditor v-model="tempText" :height="600" :mergetags-list="getCustomMergeTags()" />
      </div>
      <div class="rich-text-dialog-content-right">
        <DicList componentKey="IssueLine" />
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
