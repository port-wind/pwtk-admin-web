<script setup lang="ts">
import { defineProps } from 'vue'

type BackgroundType = '#07c160' | '#349cfc' | '#fc3434'

defineProps<{
  bgColor: BackgroundType
  number: string
  description: string
}>()
</script>

<template>
  <div class="container">
    <div class="ball" :style="{ backgroundColor: bgColor }">
      <span class="number">{{ number }}</span>
    </div>
    <div class="description">{{ description }}</div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 32px;
}

.ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #5e9525;
  display: flex;
  align-items: center;
  justify-content: center;

  .number {
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    line-height: 1;
  }
}

.description {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1;
}
</style>
