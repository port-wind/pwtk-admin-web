<script setup lang="ts" name="TwoGameResult">
import { ref, onMounted, computed } from 'vue'
import { defineEmits } from 'vue'
import { Sticky } from 'vant'
import GameResultModel1 from './GameResultModel1.vue'
import { changeGameType, getGameTypeList } from '../store/index'
import type { IDatas } from './type'
import service from '../service/index'
import { gameStore } from '../store/index'
import { useStore } from '@nanostores/vue'

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const currentGame = computed(() => gameStoreData.value.currentGame)

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
  <div class="TwoGameResult">
    <div class="gameresultbox-content">
      <Sticky :offset-top="44">
        <div class="game-result" data-id="game-result">
          <!-- Model 1 的渲染内容 -->
          <GameResultModel1
            v-if="props.datas.configParamJson.model === 's1'"
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
.TwoGameResult {
  position: relative;
}

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
