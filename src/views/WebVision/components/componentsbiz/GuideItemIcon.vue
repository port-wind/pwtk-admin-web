<template>
  <div class="guide-item-icons">
    <van-tag class="custom-tag" type="primary" v-if="isRecommended" size="medium">荐</van-tag>
    <van-tag class="custom-tag" type="success" v-if="isSelected" size="medium">精</van-tag>
    <van-tag class="custom-tag" type="danger" v-if="isHot" size="medium">热</van-tag>
    <van-tag class="custom-tag" type="warning" v-if="isTop" size="medium">置</van-tag>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IBizTkWebsiteListPageModel } from './type'
import { Tag as VanTag } from 'vant'
interface Props {
  item: IBizTkWebsiteListPageModel
}
const props: Props = defineProps<Props>()
const isRecommended = computed(() => props.item.isRecommended === 'y')
const isHot = computed(() => props.item.isHot === 'y')
const isSelected = computed(() => props.item.isSelected === 'y')
const isTop = computed(() => props.item.isTop === 'y')
</script>

<style lang="less" scoped>
.guide-item-icons {
  display: flex;
  column-gap: 2px;
}
.custom-tag {
  font-size: 12px;
  padding: 0 4px;
}
</style>
