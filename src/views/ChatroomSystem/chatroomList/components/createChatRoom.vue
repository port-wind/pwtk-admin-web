<template>
  <div class="create-room-form">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="formRules" style="flex: 1">
      <el-row :gutter="16">
        <el-col :span="12">
          <!-- Room Name with Refresh Button -->
          <el-form-item label="聊天室名称:" prop="title">
            <div class="input-with-button">
              <el-input v-model="formData.title" placeholder="请输入聊天室名称" />
              <el-button
                icon="Refresh"
                type="primary"
                :loading="roomNames.isGenerating.value"
                @click="refreshRoomName"
              />
            </div>
          </el-form-item>
          <!-- Creator Selection -->
          <el-form-item label="创建人:" prop="userId">
            <whiteListUserAutocomplete v-model="formData.userId" />
          </el-form-item>
          <!-- Room Description -->
          <el-form-item label="聊天室简介:" prop="note">
            <el-input v-model="formData.note" type="textarea" rows="3" placeholder="请输入聊天室简介" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <!-- Top State Selection -->
          <el-form-item label="置顶:" prop="state">
            <el-radio-group v-model="formData.state">
              <el-radio label="ON_TOP">是</el-radio>
              <el-radio label="CANCEL_ON_TOP">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- Game Type Slot if needed -->
          <slot name="gameTypeSlot"></slot>
        </el-col>
      </el-row>
    </el-form>

    <div class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { batchCreateRoom, onTopRoom, reqChatRoomList } from '@/api/chat'
import { useModalsStore } from '@/stores/modalStore'
import { useWhitelist } from '@/composables/useWhiteList'
import { useRoomNames } from '@/composables/useRoomName'

// Set up store and composables
const modalsStore = useModalsStore()
const whitelist = useWhitelist()
const formRef = ref<FormInstance>()
const isSubmitting = ref(false)
const roomNames = useRoomNames()
// Form data structure
const formData = reactive({
  title: '',
  type: 'CHAT',
  note: '',
  userId: '',
  state: 'CANCEL_ON_TOP',
  manageSetId: ''
})

// Validation rules
const formRules = reactive({
  title: [{ required: true, message: '请输入聊天室名称', trigger: 'change' }],
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }]
})

// Define emits
const emit = defineEmits<{
  (_: 'refresh'): void
}>()

const refreshRoomName = async () => {
  const name = await roomNames.generateRoomName('CHAT')
  if (name) {
    formData.title = name
  }
}

// Close modal
const handleCancel = () => {
  modalsStore.hideModal('createRoomModal')
  modalsStore.setModalData('createRoomModal', {})
}
//页面初始化获取数据
const checkChatRoomExist = async (_queryForm = { userId: '' }): Promise<boolean> => {
  if (!_queryForm.userId) {
    console.error('userId is required')
    return false
  }
  const params = {
    ..._queryForm,
    page: 1,
    size: 1,
    status: '1',
    type: 'CHAT'
  }
  try {
    const response = await reqChatRoomList(params)
    if (response.success) {
      const tempList = response!.data?.list
      return tempList.length > 0
    }
    return false
  } catch (error) {
    console.error('Error fetching data:', error)
    return false
  }
}
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // Prepare submission data
    const submitForm = { ...formData }
    const topState = submitForm.state
    // delete submitForm.state

    const isExist = await checkChatRoomExist({ userId: formData.userId })
    if (isExist) {
      ElMessage.warning('当前用户已创建聊天室，请勿重复创建')
      return
    }

    isSubmitting.value = true

    try {
      const result = await batchCreateRoom({ list: [submitForm] })

      if (result.success && result.data && result.data.length > 0) {
        // Set top state
        await onTopRoom({
          id: result.data[0],
          state: topState
        })

        ElMessage.success('聊天室创建成功')

        // Close modal and refresh parent
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || '创建失败')
      }
    } catch (error) {
      ElMessage.error('创建失败，请稍后重试')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
  }
}

// Initialize component
onMounted(async () => {
  // Load whitelist data
  await whitelist.loadWhitelistData()
})
</script>

<style scoped lang="scss">
.create-room-form {
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .input-with-button {
    display: flex;
    gap: 8px;
    width: 100%;

    .el-input {
      flex: 1;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
}
</style>
