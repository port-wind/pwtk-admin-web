<template>
  <div id="system_account" class="leaderboard-container">
    <ShowLeaderBoard></ShowLeaderBoard>

    <div class="leaderboard-content" ref="wrapper">
      <el-tabs tab-position="left" v-model="activeTab" v-loading="isLoading">
        <!-- <el-tab-pane
          label="综合总榜"
          name="Overall"
        >
          <section :style="{ height: tableHeight + 'px' }"><Overall></Overall></section>
        </el-tab-pane> -->
        <el-tab-pane label="人气总榜" name="Popularity">
          <section :style="{ height: tableHeight + 'px' }">
            <Popularity></Popularity>
          </section>
        </el-tab-pane>

        <el-tab-pane label="粉丝总榜" name="Fans">
          <section :style="{ height: tableHeight + 'px' }">
            <Fans></Fans>
          </section>
        </el-tab-pane>
        <el-tab-pane label="积分总榜" name="Points">
          <section :style="{ height: tableHeight + 'px' }">
            <LeaderPoints></LeaderPoints>
          </section>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ShowLeaderBoard from './showLeaderBoard/index.vue'
import Overall from './overall/index.vue'
import Popularity from './popularity/index.vue'
import LeaderPoints from './leaderPoints/index.vue'
import Fans from './fans/index.vue'

const activeTab = ref<string>('Popularity')
const isLoading = ref<boolean>(false)
const tableHeight = ref<any>(null)
const wrapper = ref<any>(null)
onMounted(() => {
  tableHeight.value = (wrapper.value as any).getBoundingClientRect().height - 20
  console.log(tableHeight.value)
})
</script>

<style scoped lang="less">
.leaderboard-container {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;

  .leaderboard-content {
    flex: 1;
    margin-top: 10px;
    :deep(.el-tabs) {
      height: 100%;
      display: flex;
      .el-tabs__content {
        flex: 1;
        overflow: auto;
      }
    }
  }
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
