<script setup lang="ts">
import { computed, ref, defineProps } from 'vue'
import type { ISetStyle } from '@/views/WebVision/components/componentsbiz/componentProperties/index'
import SelectMainboardID from '@/components/selectMainboardID/index.vue'
import SelectForumIDByMainBoardID from '@/components/selectForumIDByMainBoardID/index.vue'
import { useStore } from '@nanostores/vue'
import { gameStore, updateForum } from '@/views/WebVision/components/componentsbiz/store'
interface IProps {
  datas: ISetStyle<any>
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)

const propsMainboardId = computed(() => props.datas.configParamJson.mainboardId)
const propsForumId = computed(() => props.datas.configParamJson.forumId)

const mainID = ref('')
const forumID = ref('')

const handleForumIdChange = (val) => {
  props.datas.configParamJson.forumId = val.forumId
  props.datas.configParamJson.forumName = val.forumName
  props.datas.configParamJson.forumIcon = val.forumIcon
  props.datas.configParamJson.forumStatus = val.forumStatus
  props.datas.configParamJson.mainboardName = val.mainboardName
  props.datas.configParamJson.forumCategory = val.forumCategory

  updateForum(val)
}

const handleMainboardIdChange = (val) => {
  props.datas.configParamJson.mainboardId = val
  updateForum({ mainboardId: val })
}

watch(
  propsMainboardId,
  (newVal) => {
    mainID.value = newVal
  },
  { immediate: true }
)

watch(
  propsForumId,
  (newVal) => {
    forumID.value = newVal
  },
  { immediate: true }
)

const handleMainboardIdClear = () => {
  forumID.value = ''
}
</script>

<template>
  <el-divider content-position="left">论坛列表</el-divider>
  <el-form-item label="主板ID" prop="mainboardId">
    <SelectMainboardID v-model="mainID" @onClear="handleMainboardIdClear" @onSelect="handleMainboardIdChange" />
  </el-form-item>

  <el-form-item label="论坛ID" prop="forumId">
    <SelectForumIDByMainBoardID v-if="mainID" v-model="forumID" :mainboardId="mainID" @onSelect="handleForumIdChange" />
    <el-input v-else disabled v-model="forumID" />
  </el-form-item>
  <el-form-item label="page" prop="page">
    <el-input-number v-model="props.datas.configParamJson.page" :min="1" placeholder="请输入帖子页数" />
  </el-form-item>
  <el-form-item label="size" prop="size">
    <el-input-number v-model="props.datas.configParamJson.size" :min="1" placeholder="请输入帖子页数" />
  </el-form-item>
  <el-form-item label="是否查询全部帖子" prop="isAll">
    <el-radio-group v-model="props.datas.configParamJson.isAll">
      <el-radio-button label="y">是</el-radio-button>
      <el-radio-button label="n">否</el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="期数分组" prop="issueGroup">
    <el-input-number v-model="props.datas.configParamJson.issueGroup" :min="1" placeholder="请输入期数分组" />
  </el-form-item>
</template>

<style lang="scss" scoped></style>
