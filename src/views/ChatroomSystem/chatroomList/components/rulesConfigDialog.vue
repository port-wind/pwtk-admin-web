<template>
  <el-dialog
    @close="cancel"
    v-model="modalsStore.rulesConfigModal.isVisible"
    class="tabs-dialog"
    draggable
    overflow
    destroy-on-close
  >
    <el-tabs v-model="modalsStore.rulesConfigModal.activeTab" class="create-room-tabs">
      <el-tab-pane class="m_tabs_pane" label="规则配置" name="first" :stretch="true">
        <div class="rules-config-content">
          <div class="rules-config-row">
            <div class="rules-config-header">*规则配置</div>
            <el-select
              v-model="selectedUserType"
              :disabled="true"
              placeholder="限定用户类型创建"
              class="user-type-select"
            >
              <el-option label="限定用户类型创建" value="限定用户类型创建" />
              <!-- 这里可以添加更多选项 -->
            </el-select>

            <el-select v-model="enableStatus" :disabled="true" placeholder="启用" class="enable-select">
              <el-option label="启用" value="1" />
              <el-option label="关闭" value="0" />
            </el-select>

            <el-button
              type="success"
              class="add-user-btn"
              :disabled="!selectedUserType || enableStatus === '0'"
              @click="showWhiteConfigDialog"
            >
              追加用户
            </el-button>
          </div>
          <div class="white-user-list">
            <div class="add-user-list" v-if="addUserListValue.length > 0">
              <div class="add-user-list-title">新加白名单的用户</div>
              <div class="add-user-list-content">
                <el-tag v-for="item in addUserListValue" :key="item.userId" type="success">
                  {{ item.nickname || item.userId }}
                </el-tag>
              </div>
            </div>
            <div class="remove-user-list" v-if="removeUserListValue.length > 0">
              <div class="remove-user-list-title">移除白名单的用户</div>
              <div class="remove-user-list-content">
                <el-tag v-for="item in removeUserListValue" :key="item.userId" type="danger">
                  {{ item.nickname || item.userId }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <div class="rules-config-footer">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">提交</el-button>
      </div>
    </el-tabs>
  </el-dialog>
  <whiteConfigDialog
    v-if="modalsStore.rulesConfigModal.isVisible"
    ref="whiteConfigDialogRef"
    @close="closeWhiteConfigDialog"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import whiteConfigDialog from './whiteConfigDialog.vue'

const modalsStore = useModalsStore()
const selectedUserType = ref('限定用户类型创建')
const enableStatus = ref('1')
const whiteConfigDialogRef = ref<InstanceType<typeof whiteConfigDialog> | null>(null)
const removeUserListValue = ref<any[]>([])
const addUserListValue = ref<any[]>([])

const showWhiteConfigDialog = () => {
  whiteConfigDialogRef.value?.openDialog(
    removeUserListValue.value.map((item: any) => item.userId),
    addUserListValue.value.map((item: any) => item.userId)
  )
}

const closeWhiteConfigDialog = async () => {
  const { removeWhiteUserListValue, addWhiteUserListValue } =
    (await whiteConfigDialogRef.value?.splitWhiteUserList()) ?? {}
  removeUserListValue.value = removeWhiteUserListValue ?? []
  addUserListValue.value = addWhiteUserListValue ?? []
}

const cancel = () => {
  modalsStore.hideModal('rulesConfigModal')
}

const save = async () => {
  await whiteConfigDialogRef.value?.saveWhiteUser(removeUserListValue.value, addUserListValue.value)
  modalsStore.hideModal('rulesConfigModal')
}

watch(
  () => modalsStore.rulesConfigModal.isVisible,
  (newVal) => {
    if (!newVal) {
      removeUserListValue.value = []
      addUserListValue.value = []
    }
  }
)
</script>

<style scoped lang="less">
.create-room-tabs {
  :deep(.el-tabs__content) {
    display: flex;
    flex-direction: column;
    padding-bottom: 8px;
  }
  .rules-config-footer {
    display: flex;
    justify-content: flex-end;
  }
}
.rules-config-header {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.rules-config-content {
  padding: 10px 0;

  .rules-config-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-type-select,
  .enable-select {
    width: 240px;
  }

  .add-user-btn {
    padding: 0 20px;
  }
  .white-user-list {
    display: flex;
    gap: 10px;
    flex-direction: column;
    margin-top: 16px;
  }
  .add-user-list,
  .remove-user-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--el-border-color);
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
  }
  .add-user-list-title,
  .remove-user-list-title {
    font-weight: bold;
    position: sticky;
    top: 0;
    background-color: #fff;
    padding: 8px 10px;
  }
  .add-user-list-content,
  .remove-user-list-content {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 10px 10px;
  }
}
</style>
