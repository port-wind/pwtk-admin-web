<script setup lang="ts" name="shareComponent">
import type { ISetStyle } from '@/views/WebVision/components/componentsbiz/componentProperties'
import shareBuildComponent from './shareBuildComponent.vue'
import shareBuildTemplate from './shareBuildTemplate.vue'
import shareBuildWebsite from './shareBuildWebsite.vue'

interface IProps {
  datas: ISetStyle<any>
}
const props = defineProps<IProps>()
const route = useRoute()
</script>

<template>
  <div>
    <!-- webVisionBuilder?componentId=1382289202497978705 组件编辑 -->
    <shareBuildComponent :datas="datas" v-if="route.path === '/webVisionBuilder'" />
    <shareBuildTemplate :datas="datas" v-if="route.path === '/webVisionBuilderTemplate'" />
    <shareBuildWebsite :datas="datas" v-if="route.path === '/webVisionBuilderWebsite'" />
  </div>
</template>

<style lang="scss" scoped></style>
