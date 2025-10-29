<script setup lang="ts" name="ImageCard">
import { computed } from 'vue'
import type { IDatas } from './type'
import { getFullUrl, PUBLIC_CDN_URL } from '../utils'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()

const styleJSON = computed(() => props.datas.configParamJson.imageStyleJSON)

const imageStyle = computed(() => {
  return {
    height: styleJSON.value?.enableHeight ? `${styleJSON.value.height}px` : 'auto',
    borderRadius: styleJSON.value?.borderRadius ? `${styleJSON.value.borderRadius}px` : '0px',
    overflow: 'hidden'
  }
})

const imgStyle = computed(() => {
  if (styleJSON.value?.enableHeight) {
    return {
      objectFit: 'cover',
      height: '100%'
    }
  } else {
    return {
      objectFit: 'contain',
      height: 'auto'
    }
  }
})

const handleLink = () => {
  const link = props.datas.configParamJson.link
  if (link) {
    window.open(link, '_blank')
  }
}
</script>

<template>
  <div class="ImageCard">
    <div class="ImageCard-content">
      <div class="ImageCard-container" @click="handleLink">
        <div :style="imageStyle">
          <img
            :src="getFullUrl(datas.configParamJson.imageUrl, PUBLIC_CDN_URL)"
            :alt="props.datas.configParamJson.title"
            class="card-image"
            draggable="false"
            :style="imgStyle"
          />
        </div>
        <div class="card-content" v-if="props.datas.configParamJson.enable">
          <h3 class="card-title">{{ props.datas.configParamJson.title }}</h3>
          <p class="card-description">{{ props.datas.configParamJson.description }}</p>
        </div>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>

<style scoped lang="scss">
.ImageCard {
  position: relative;
}

.ImageCard-content {
}

.ImageCard-container {
  overflow: hidden;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.card-image {
  max-width: 100%;
  height: auto;
  border: 0;
  vertical-align: middle;
  border-radius: 0px;
}

.card-content {
  padding: 15px;
  flex-grow: 1;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.card-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>
