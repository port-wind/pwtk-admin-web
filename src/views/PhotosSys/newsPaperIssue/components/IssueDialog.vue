<template>
  <el-dialog v-model="dialogVisible" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane label="期刊信息" name="content" class="article-content m_tabs_pane">
        <IssueForm :rxState="rxState" :isEditMode="isEditMode">
          <template #imageUploader>
            <IssueImageUploader :rxState="rxState" />
          </template>
        </IssueForm>

        <div class="button-row">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="评论内容" name="comments" v-if="isEditMode" class="m_tabs_pane">
        <CommentTab
          :rxState="rxState"
          :issueId="issueData?.issueId?.toString() || ''"
          :year="issueData?.year?.toString() || ''"
          :issue="issueData?.issue.toString() || ''"
        />
      </el-tab-pane>

      <el-tab-pane label="图解小组" name="photoGroup" v-if="isEditMode" class="m_tabs_pane">
        <ChooseExplain
          :selected-row="{
            postYear: issueData?.year || '',
            postIssue: issueData?.issue || '',
            issueId: issueData?.issueId || '',
            gameType: issueData?.gameType || ''
          }"
        />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, defineEmits, watch, onMounted } from 'vue'
import { type DialogMode, initEditForm, useIssueForm } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import type { EnhancedUploadFile } from '@/views/PhotosSys/newsPaperIssue/composables/useImageUpload'

const props = defineProps({
  issueId: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String as () => DialogMode,
    default: 'edit'
  }
})

const emit = defineEmits(['update:visible', 'cancel', 'save', 'refresh'])

// State
const activeTab = ref('content')
const dialogVisible = ref(false)

// Setup reactive state for form and file handling
const rxState = reactive({
  formState: initEditForm(),
  formRef: null,
  fileList: [] as EnhancedUploadFile[],
  isLoading: false,
  dialogMode: props.mode as DialogMode
})
const issueData = computed(() => rxState.formState)

// Use the existing composable
const { isLoading, isEditMode, resetForm, setupForEdit, handleSave: saveIssue } = useIssueForm(rxState)

// Initial data loading logic moved to onMounted

// Methods
const loadIssueData = async (id: string) => {
  if (!id) return

  try {
    await setupForEdit(id)
    // After loading data, you might want to fetch additional issue details
    // and set them to issueData.value
    // For now, we'll assume setupForEdit populates everything needed
  } catch (error) {
    console.error('Failed to load issue data:', error)
  }
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleSave = async () => {
  const success = await saveIssue()
  if (success) {
    emit('save')
    emit('refresh')
    dialogVisible.value = false
  }
}
// Watch for visibility changes
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
  }
)

// Watch for dialog visibility to emit updates to parent
watch(
  () => dialogVisible.value,
  (newVal) => {
    emit('update:visible', newVal)
    if (!newVal) {
      handleCancel()
    }
  }
)
// Lifecycle hooks
onMounted(async () => {
  if (props.issueId && props.mode === 'edit') {
    await loadIssueData(props.issueId)
  } else if (props.mode === 'add') {
    resetForm()
    rxState.dialogMode = 'add'
  } else {
    console.error('No props.mode && props.issueId provided')
  }
  dialogVisible.value = props.visible
})
</script>

<style scoped lang="less">
.tabs-dialog {
  .button-row {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    gap: 12px;
  }
}
</style>
