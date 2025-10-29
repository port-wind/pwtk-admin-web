<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { computed, ref, defineProps, watch } from 'vue'
import type { ISetStyle } from '@/views/WebVision/components/componentsbiz/componentProperties/index'
import { changeGameType, gameStore } from '@/views/WebVision/components/componentsbiz/store'
import { useGameTypeFields } from '@/views/WebVision/components/componentsbiz/composables/useGameTypeFields'

interface IProps {
  datas: ISetStyle<any>
}
const props = defineProps<IProps>()

const gameStoreData = useStore(gameStore)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)

const vGameType = ref(gameStoreData.value.gameType)
const configParamJson = computed(() => props.datas.configParamJson)

// 🔧 FIX: Use the composable for reactive show management
const datas = computed(() => props.datas)
// const { show } = useGameTypeFields(datas.value) // Note: still using .value here

const handleGameTypeChange = (_gameType) => {
  const gameType = gameTypeList.value.find((item) => item.gameType === _gameType)
  if (gameType) {
    changeGameType(gameType)
  }
}

watch(
  () => gameStoreData.value.gameType,
  (newVal: string) => {
    if (newVal) {
      vGameType.value = newVal
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <el-divider content-position="left">彩票切换</el-divider>
  <el-form-item label="彩票切换" prop="gameType">
    <el-radio-group v-model="vGameType" @change="(e) => handleGameTypeChange(e)" style="margin-bottom: 10px">
      <el-radio v-for="item in gameTypeList" :key="item.gameTypeCode" :value="item.gameType">
        {{ item.gameTypeShortName }}
      </el-radio>
    </el-radio-group>
  </el-form-item>

  <!-- <el-form-item label="是否启用" prop="show" v-if="configParamJson[vGameType] && configParamJson[vGameType].customData">
    <el-switch v-model="show" />
  </el-form-item> -->
</template>

<style lang="scss" scoped></style>
