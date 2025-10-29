<script setup lang="ts" name="GameResultBox">
import { ref, onMounted, computed } from 'vue'
import { defineEmits } from 'vue'
import { Sticky } from 'vant'
import GameResultModel1 from './GameResultModel1.vue'
import GameResultModel2 from './GameResultModel2.vue'
import GameResultModel3 from './GameResultModel3.vue'
import GameResultModel4 from './GameResultModel4.vue'
import GameResultModel5 from './GameResultModel5.vue'
import type { IDatas } from './type'
import service from '../service/index'
import { gameStore } from '../store/index'
import { useStore } from '@nanostores/vue'

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)

export interface GameResultType {
  isLongName: boolean
  isIcon: boolean
  model: 's1' | 's2' | 's3' | 's4' | 's5'
  isNextIssue: boolean
  isHistory: boolean
  isIssue: boolean
  isGifAd: boolean
  showArray: string[]
  noTab: boolean
}

interface IProps {
  datas: IDatas
  tabsData: Record<string, any>
}

const props = defineProps<IProps>()
const emits = defineEmits(['update-issue'])

const rawTabsData = ref([])

onMounted(async () => {
  // let tabsData = []
  try {
    const response = await service.kv().getGamePlatform().do()
    let instance = service.kv()
    if (response[0].data) {
      response[0].data.forEach((item: { gameTypeCode: string }) => {
        instance = instance.getGameIssueCurrent(item.gameTypeCode)
      })
    }
    const res = await instance.do()

    rawTabsData.value = response[0].data.map((item: any, index: number) => ({
      ...item,
      ...res[index]
    }))
  } catch (error) {
    console.error('请求失败:', error)
  }
})
</script>

<template>
  <div class="gameresultbox">
    <div class="gameresultbox-content">
      <Sticky :offset-top="44">
        <div class="game-result" data-id="game-result">
          <!-- Model 1 的渲染内容 -->
          <GameResultModel1
            v-if="props.datas.configParamJson.model === 's1'"
            :tabsData="rawTabsData"
            :datas="props.datas"
          />

          <!-- Model 2 的渲染内容 -->
          <GameResultModel2
            v-else-if="props.datas.configParamJson.model === 's2'"
            :tabsData="rawTabsData"
            :datas="props.datas"
          />

          <!-- Model 3 的渲染内容 -->
          <GameResultModel3
            v-if="props.datas.configParamJson.model === 's3'"
            :tabsData="rawTabsData"
            :datas="props.datas"
          />

          <!-- Model 3 的渲染内容 -->
          <GameResultModel4
            v-if="props.datas.configParamJson.model === 's4'"
            :tabsData="rawTabsData"
            :datas="props.datas"
          />

          <!-- Model 3 的渲染内容 -->
          <GameResultModel5
            v-if="props.datas.configParamJson.model === 's5'"
            :tabsData="rawTabsData"
            :datas="props.datas"
          />
        </div>
      </Sticky>
    </div>
    <slot name="deles" />
  </div>
</template>

<style lang="scss" scoped>
.gameresultbox {
  position: relative;
  --theme-color: #5e9525;
}

.gameresultbox-content {
  min-height: 50px;
}

.game-result {
  margin: 1px 0;
}
</style>
