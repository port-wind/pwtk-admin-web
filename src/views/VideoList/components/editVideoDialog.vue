<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    :model-value="true"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs :model-value="showingTab" class="m_tabs">
      <el-tab-pane class="m_tabs_pane" label="视频详情" name="mainTab" :stretch="true">
        <EditVideo :video-data="videoData" @refresh="emit('refresh')" @close="closeTabs" />
      </el-tab-pane>
      <el-tab-pane class="m_tabs_pane" label="浏览列表" name="browseTab" :stretch="true" lazy>
        <VideoBrowseTab :video-data="videoData" />
      </el-tab-pane>
      <el-tab-pane class="m_tabs_pane" label="点赞列表" name="likeTab" :stretch="true" lazy>
        <VideoLikeTab :video-data="videoData" />
      </el-tab-pane>
      <el-tab-pane class="m_tabs_pane" label="收藏列表" name="favoriteTab" :stretch="true" lazy>
        <VideoFavoriteTab :video-data="videoData" />
      </el-tab-pane>
      <el-tab-pane class="m_tabs_pane" label="评论列表" name="commentTab" :stretch="true" lazy>
        <VideoCommentTab :video-data="videoData" />
      </el-tab-pane>
      <el-tab-pane class="m_tabs_pane" label="分享列表" name="shareTab" :stretch="true" lazy>
        <VideoShareTab :video-data="videoData" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EditVideo from './editVideo/index.vue'

const emit = defineEmits(['update:modelValue', 'refresh', 'close'])

defineProps<{
  modelValue: boolean
  videoData?: any
}>()

const showingTab = ref('mainTab')
const closeTabs = () => {
  emit('close')
  emit('update:modelValue', false)
}

onMounted(() => {})
</script>
<style scoped lang="less"></style>
