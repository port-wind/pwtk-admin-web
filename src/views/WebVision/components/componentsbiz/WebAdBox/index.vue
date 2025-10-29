<!-- https://a6tk59.com/#/ -->
<template>
  <div class="web-ad-box">
    <div class="web-ad-box-content">
      <div class="mbox web-guide" v-if="datas.configParamJson.tabsData.length > 0 && isError === false">
        <StateManager :loading="isLoading" :error="isError" @refresh="fetchWebGuideList()">
          <van-tabs color="var(--theme-color)" v-model:active="tabIndex" type="card" @change="onTabChange">
            <van-tab
              v-for="(item, index) in datas.configParamJson.tabsData"
              :key="index"
              :title="item.gameTypeShortName"
              :name="index"
            ></van-tab>
          </van-tabs>
          <div class="web-container">
            <template v-if="listData.length > 0">
              <WebSiteGridLayout :listData="listData" />
              <van-button
                type="success"
                v-if="!isWebExpand"
                size="small"
                class="guide-button"
                color="var(--theme-color)"
                plain
                round
                @click="handleClickButton"
              >
                点击查看更多网址
                <van-icon name="arrow-down" />
              </van-button>
              <van-button
                color="var(--theme-color)"
                type="success"
                v-else
                size="small"
                class="guide-button"
                plain
                @click="handleClickClose"
              >
                收起
              </van-button>
            </template>
          </div>
        </StateManager>
      </div>
    </div>
    <slot name="deles" />
  </div>
</template>
<script lang="ts" setup name="WebAdBox">
import { onMounted, ref } from 'vue'
import { Button as VanButton, Icon as VanIcon, Tab as VanTab, Tabs as VanTabs } from 'vant'
import service from '@/service'
import type { IBizTkWebsiteListPageModel, GAME_DATA } from './type'
import StateManager from '../StateManager.vue'
import WebSiteGridLayout from './WebSiteGridLayout.vue'
import utils from '@/utils'
import constants from '@/constants'

const isLoading = ref(false)
const isError = ref(false)

const listData = ref<IBizTkWebsiteListPageModel[]>([])

const page = ref(1)
const size = 12

interface IData {
  configParamJson: {
    model: 's1' | 's2' | 's3'
    // itemData: ColorBarType[]
    title?: string
    align?: string
    titleBg?: string
    tabsData: GAME_DATA[]
  }
}

const props = defineProps<{ datas: IData }>()

console.log('prop webadbox', props.datas)

const isWebExpand = ref<boolean>(false)

// console.log("tabsData", webADTabs);
// console.log("tabsData", props);

const onTabChange = (index: number) => {
  // console.log('active1', gameType)
  resetPagination()
  tabIndex.value = index
  gameTypeCode.value = props.datas.configParamJson.tabsData[index].gameTypeCode
  fetchWebGuideList(index)
}

const resetPagination = () => {
  page.value = 1
  // listData.value = [];
  isWebExpand.value = false
}

const handleClickClose = () => {
  // console.log('handleClickClose')
  listData.value = []
  resetPagination()
  fetchWebGuideList()
}

// console.log(props);

// 监听 index 变化
// 注入 tabIndex，提供默认值
// const tabIndex = inject('tabIndex', ref(0)); // 注入 tabIndex，提供默认值
const gameTypeCode = ref(props.datas.configParamJson.tabsData[0].gameTypeCode)
const tabIndex = ref(0)
// const gameTypeCode = ref(webADTabs.value.[0].gameTypeCode);

const fetchWebGuideList = async (index?: number) => {
  console.log('🚀 ~ fetchWebGuideList ~ gameTypeCode:', gameTypeCode)
  if (isWebExpand.value || !gameTypeCode.value) return
  try {
    isLoading.value = true
    const res = await service.website.getPageWebsiteList({
      focusGameType: [gameTypeCode.value],
      page: page.value,
      size
    })
    console.log('🚀 ~ 999999fetchWebGuideList8889999999 ~ res:', res)
    // console.log('fetchWebGuideList', res)
    // console.log('fetchWebGuideList', index, page.value);
    if (res.data.success) {
      if (index !== undefined) {
        const { list } = res.data.data
        listData.value = list
      } else {
        const { list, total } = res.data.data
        listData.value.push(...list)
        isWebExpand.value = list.length < size || listData.value.length >= total
      }
      if (!isWebExpand.value) {
        page.value++
      }
    } else {
      isError.value = true
    }
  } catch (error) {
    console.error(error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleClickButton = () => {
  fetchWebGuideList()
}

onMounted(async () => {
  const GAME_DATA = JSON.parse(utils.getSession(constants.sessionStorageKeys.GAME_DATA) || '[]')
  console.log('🚀 ~ onMounted ~ GAME_DATA:', GAME_DATA)
  // gameType: string;
  // gameTypeCode: string;
  // gameTypeName: string;
  // sortNum: string;
  // gameTypeShortName: string;

  // webADTabs.value = GAME_DATA
  // console.log('onMounted', tabsData.value)
  await fetchWebGuideList()
})
</script>

<style scoped lang="less">
.web-ad-box {
  position: relative;
}

.web-ad-box-content {
  min-height: 50px;
}

.web-guide {
  :deep(.van-tabs--card) {
    .van-tabs__nav--card {
      width: 100%;
      margin: 0;
    }
  }
}
.web-container {
  min-height: 10rem;
}

.guide-button {
  width: 100%;
}
</style>
