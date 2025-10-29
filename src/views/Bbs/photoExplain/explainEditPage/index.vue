<template>
  <el-dialog :model-value="true" class="tabs-dialog" draggable overflow destroy-on-close @close="returnTo">
    <el-tabs v-model="activeEditTab" class="article-tabs m_tabs" v-if="!!explainInfo.postId">
      <el-tab-pane label="图解信息" name="edit" class="article-content m_tabs_pane">
        <EditExplain :explainInfo="explainInfo" @returnTo="returnTo"></EditExplain>
      </el-tab-pane>
      <!-- style="display: flex; justify-content: space-around;" -->
      <el-tab-pane
        label="评论内容"
        name="photoGroup"
        class="m_tabs_pane"
        style="flex-direction: row; justify-content: space-around"
      >
        <CommentExplain :selectedRow="explainInfo"></CommentExplain>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { getExplainDetailByPostId } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['returnTo'])
const activeEditTab = ref('edit')
const explainInfo = ref<any>({})
const getExplainDetail = async (postId) => {
  console.log(postId)

  try {
    const response = await getExplainDetailByPostId({ postId })
    if (response.success) {
      const { data } = response
      explainInfo.value = data
      return data
    }
    showErrorMessage(response)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}
const returnTo = () => {
  emit('returnTo')
}
onMounted(async () => {
  await getExplainDetail(props.postId)
})
</script>
