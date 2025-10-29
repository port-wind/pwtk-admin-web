<template>
  <section id="system_account" class="main_container">
    <section>
      <SixKingRankBoard></SixKingRankBoard>
    </section>
    <section class="tab-left" v-loading="isLoading">
      <section class="right">
        <Switcher v-if="isMounted" />
      </section>
    </section>
  </section>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import SixKingRankBoard from '@/views/ExpertManagement/sixKingList/SixKingRankBoard/index.vue'
import { useSixKingListPageStore } from '@/views/ExpertManagement/sixKingList/store/sixKing'
import Switcher from '@/views/ExpertManagement/sixKingList/Switcher.vue'

const SixKingListPageStore = useSixKingListPageStore()

const isLoading = ref(false)
const isMounted = ref(false)

onMounted(async () => {
  isLoading.value = true
  // 需要预加载3个接口
  SixKingListPageStore.initSixKingListPage(() => {
    isLoading.value = false
    isMounted.value = true
  })
})
</script>

<style scoped lang="less">
.outside-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tab-left {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  margin-top: 10px;
}

.right {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.demo-tabs {
  height: 100%;
}
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
