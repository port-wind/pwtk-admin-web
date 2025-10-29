<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="modalsStore.createRoomModal.isVisible"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs v-model="modalsStore.createRoomModal.activeTab" class="m_tabs">
      <el-tab-pane class="m_tabs_pane" label="创建房间" name="tab1" :stretch="true">
        <el-tabs v-model="activeRoomTab" class="m_tabs_sub">
          <el-tab-pane
            label="直播房"
            name="roomTab0"
            :stretch="true"
            :disabled="modalsStore.createRoomModal.modalData?.activeRoomTab !== 'roomTab0'"
          >
            <template #label>
              <div class="m_tabs_label">
                <img style="width: 80px" :src="activeRoomTab === 'roomTab0' ? IconLiveActive : IconLive" alt="" />
                <span>直播房</span>
                <i>✓</i>
              </div>
            </template>
            <CreateLiveRoom />
          </el-tab-pane>
          <el-tab-pane
            label="聊天室"
            name="roomTab1"
            :stretch="true"
            :disabled="modalsStore.createRoomModal.modalData?.activeRoomTab !== 'roomTab1'"
          >
            <template #label>
              <div class="m_tabs_label">
                <img style="width: 80px" :src="activeRoomTab === 'roomTab1' ? IconChatActive : IconChat" alt="" />
                <span>聊天室</span>
                <i>✓</i>
              </div>
            </template>
            <CreateChatRoom @refresh="emit('refresh')" />
          </el-tab-pane>
          <el-tab-pane
            label="语音房"
            name="roomTab2"
            :stretch="true"
            :disabled="modalsStore.createRoomModal.modalData?.activeRoomTab !== 'roomTab2'"
          >
            <template #label>
              <div class="m_tabs_label">
                <img style="width: 80px" :src="activeRoomTab === 'roomTab2' ? IconVoiceActive : IconVoice" alt="" />
                <span>语音房</span>
                <i>✓</i>
              </div>
            </template>
            <CreateVoiceRoom @refresh="emit('refresh')" />
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { useModalsStore } from '@/stores/modalStore'
import CreateLiveRoom from '@/views/ChatroomSystem/chatroomList/components/createLiveRoom.vue'
import CreateChatRoom from '@/views/ChatroomSystem/chatroomList/components/createChatRoom.vue'
import CreateVoiceRoom from '@/views/ChatroomSystem/chatroomList/components/createVoiceRoom.vue'
import IconLive from '@/assets/images/room/icon_live.svg'
import IconLiveActive from '@/assets/images/room/icon_live_active.svg'
import IconChat from '@/assets/images/room/icon_chat.svg'
import IconChatActive from '@/assets/images/room/icon_chat_active.svg'
import IconVoice from '@/assets/images/room/icon_voice.svg'
import IconVoiceActive from '@/assets/images/room/icon_voice_active.svg'

interface Props {}
defineProps<Props>()

const emit = defineEmits<{
  (_: 'refresh'): void
}>()

const modalsStore = useModalsStore()
const activeRoomTab = ref('')

const closeTabs = () => {
  modalsStore.hideModal('createRoomModal')
  modalsStore.setModalData('createRoomModal', {})
}

watchEffect(() => {
  if (!modalsStore.createRoomModal.modalData) return
  activeRoomTab.value = modalsStore.createRoomModal.modalData.activeRoomTab
})

onMounted(() => {})
</script>
<style scoped lang="scss">
.m_tabs_sub {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  :deep(.el-tabs__item) {
    height: auto;
  }
  :deep(.el-tabs__nav-wrap) {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    &:after {
      display: none;
    }
    .el-tabs__nav {
      display: flex;
      gap: 8px;
    }
    .el-tabs__item {
      .m_tabs_label {
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        display: flex;
        align-items: center;
        font-size: 24px;
        gap: 10px;
        padding: 8px 20px;

        i {
          display: none;
        }
      }
      &:hover {
        color: var(--el-text-color-primary);
        border-color: var(--el-color-primary);
      }
      &.is-active {
        .m_tabs_label {
          position: relative;
          border-color: var(--el-color-primary);
          color: var(--el-color-primary);
          i {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 36px;
            display: block;
            padding-right: 4px;
            background-color: #409eff;
            color: #fff;
            text-align: right;
            line-height: 20px;
            font-size: 20px;
            clip-path: polygon(100% 0, 0 0, 100% 100%);
          }
        }
      }
      &.is-disabled {
        color: #c0c4cc;
        .m_tabs_label img {
          opacity: 0.2;
        }
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
  }
  :deep(.el-tabs__content) {
    height: 100%;
  }
}
</style>
