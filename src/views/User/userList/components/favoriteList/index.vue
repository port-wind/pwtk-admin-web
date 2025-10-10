<script setup lang="ts">
import { ref } from 'vue'
import FavoriteTable from './comps/favorite_table.vue'
import { FavoriteFlag } from '@/api/user/type'

const activeName = ref(FavoriteFlag.BBS)
</script>

<template>
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs" lazy="true">
    <el-tab-pane label="BBS" name="b">
      <FavoriteTable v-if="activeName === FavoriteFlag.BBS" :favroite-flag="activeName" />
    </el-tab-pane>
    <el-tab-pane label="论坛" name="f">
      <FavoriteTable v-if="activeName === FavoriteFlag.FORUM" :favroite-flag="activeName" />
    </el-tab-pane>
    <el-tab-pane label="主板" name="m">
      <FavoriteTable v-if="activeName === FavoriteFlag.MAINBOARD" :favroite-flag="activeName" />
    </el-tab-pane>
    <el-tab-pane label="帖子" name="p">
      <FavoriteTable v-if="activeName === FavoriteFlag.POST" :favroite-flag="activeName" />
    </el-tab-pane>
    <el-tab-pane label="图库" name="t">
      <FavoriteTable v-if="activeName === FavoriteFlag.GALLERY" :favroite-flag="activeName" />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less" scoped></style>
