<script setup lang="ts" name="visionPost"></script>

<template>
  <div class="visionPost">
    <div class="visionPost-content">
      <span>标题</span>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.visionPost {
  position: relative;
}
</style>
