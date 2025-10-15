<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import BBsTable from './comps/bbs_table.vue'
import { CommentsFlag } from '@/api/user/type'
import SixKing_table from './comps/sixKing_table.vue'

const activeName = ref(CommentsFlag.MYFORUM)
</script>

<template>
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs" lazy="true">
    <el-tab-pane label="发现" name="myForum">
      <BBsTable v-if="activeName === CommentsFlag.MYFORUM" :comments-flag="activeName" :key="CommentsFlag.MYFORUM" />
    </el-tab-pane>
    <el-tab-pane label="幽默猜测" name="guess">
      <BBsTable v-if="activeName === CommentsFlag.GUESS" :comments-flag="activeName" :key="CommentsFlag.GUESS" />
    </el-tab-pane>
    <el-tab-pane label="高手论坛" name="userPublic">
      <BBsTable
        v-if="activeName === CommentsFlag.USERPUBLIC"
        :comments-flag="activeName"
        :key="CommentsFlag.USERPUBLIC"
      />
    </el-tab-pane>
    <el-tab-pane label="资料大全" name="corpus">
      <BBsTable v-if="activeName === CommentsFlag.CORPUS" :comments-flag="activeName" :key="CommentsFlag.CORPUS" />
    </el-tab-pane>
    <el-tab-pane label="六合图库" name="t">
      <SixKing_table />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less" scoped></style>
