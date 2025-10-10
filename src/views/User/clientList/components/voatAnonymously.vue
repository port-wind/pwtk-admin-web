<template>
  <!-- 匿名投票 -->
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane
      v-for="game in gameList"
      :lazy="true"
      :key="game.gameTypeName"
      :label="game.gameTypeName"
      :name="game.gameType"
    >
      <SubVoat :reqType="game.gameType" :account-info="props.accountInfo"></SubVoat>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
import SubVoat from './subComponet/subVoat.vue'
import { getGameTypePlatformList } from '@/api/global'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})

const initPageObj = () => ({
  page: 1,
  size: 15
})

const pageObj = ref(initPageObj())
const gameList = ref<any>([])
const activeName = computed(() => (gameList.value.length > 0 ? gameList.value[0]?.gameType : ''))

//获取游戏类型列表
const reqGameTypeList = async () => {
  try {
    let res = await getGameTypePlatformList({ sortName: '', sortOrder: 'DESC', ...pageObj.value })
    if (res.success) {
      gameList.value = res.data.list
    } else {
      showErrorMessage(res)
    }
  } catch (err) {}
}

onMounted(() => {
  reqGameTypeList()
})
</script>
