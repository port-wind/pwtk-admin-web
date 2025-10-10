<template>
  <div class="PostDetailsBox">
    <div class="post-details-box-container">
      <StateManager :loading="isLoading" :error="isError">
        <div v-if="datas.configParamJson.model === 's1'">
          <!-- s3 模式的内容 -->
          <ModelThree v-if="bbs_content" :bbs_content="bbs_content" :data="datas.configParamJson" />
        </div>
        <div v-else-if="datas.configParamJson.model === 's2'">
          <!-- s2 模式的内容 -->
          <ModelFour v-if="bbs_content" :bbs_content="bbs_content" :data="datas.configParamJson" />
        </div>
        <div v-else-if="datas.configParamJson.model === 's3'">
          <!-- s2 模式的内容 -->
          <ModelFive v-if="bbs_content" :bbs_content="bbs_content" :data="datas.configParamJson" />
        </div>
        <div v-else>
          <p>{{ datas.configParamJson.model }}此模式尚未开发</p>
        </div>
      </StateManager>
      <div v-if="!bbs_content" class="post-details-box-container-empty">
        <p>暂无帖子信息</p>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<script setup lang="ts" name="PostDetailsBox">
import { onMounted, ref, watch } from 'vue'
import StateManager from '../StateManager.vue'
import ModelThree from './PostBox/ModelThree.vue'
import ModelFour from './PostBox/ModelFour.vue'
import ModelFive from './PostBox/ModelFive.vue'
import service from '@/service'

const PUBLIC_DISPLAY = import.meta.env.PUBLIC_DISPLAY
console.log('🚀 ~ PUBLIC_DISPLAY:', PUBLIC_DISPLAY)

interface IConfigParamJson {
  jsonData: any[]
  postIdData: any[]
  model: string
  title: string
  text: string
  postId: string
  align: 'center'
  titleBgImg: string
  titleBg: string
}

interface IDatas {
  configParamJson: IConfigParamJson
}

const props = defineProps<{ datas: IDatas }>()

const isLoading = ref(false)
const isError = ref(false)
const postId = ref(props.datas.configParamJson.postId)
// const data = ref<any>(props.datas.configParamJson)

const bbs_content = ref()

const getBBSDetail = async (_postId?: string) => {
  const postList = props.datas.configParamJson.postIdData

  const firstPostId = postList[0].postId

  const tempPostId = _postId || postId.value || firstPostId

  if (tempPostId) {
    try {
      isLoading.value = true
      const response = await service.bbs.getDetailPost({
        postId: tempPostId //实际这里用的是postId也就是帖子ID
      })
      if (response.data.success) {
        bbs_content.value = response.data.data
        if (_postId) {
          console.log('🚀 ~ getBBSDetail ~ _postId:', _postId)
          props.datas.configParamJson.title = bbs_content.value.title
        }
      } else {
        isError.value = true
      }
    } catch (error) {
      isError.value = true
    } finally {
      isLoading.value = false
    }
  }
}

watch(
  () => props.datas.configParamJson.postId,
  (newVal, oldVal) => {
    if (newVal) {
      getBBSDetail(newVal)
    }
  }
)

onMounted(async () => {
  await getBBSDetail()
})
</script>

<style scoped lang="less">
.PostDetailsBox {
  position: relative;
}

.post-details-box-container-empty {
  height: 120px;
  text-align: center;
  line-height: 120px;
  font-size: 16px;
  color: #999;
}

:deep(.post-details-box-container) {
  --theme-color: #f39800;
}
</style>
