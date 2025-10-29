<script setup lang="ts">
import { computed } from 'vue'
import type { IListPlayTypeData } from '@/api/expert/sale-list/type'

interface IOptions {
  value: string
  label: string
  active: boolean
}
interface IDefineProps {
  modelValue: IListPlayTypeData
}
const props = defineProps<IDefineProps>()
const emits = defineEmits(['onSelect'])
const gameList = ref<IOptions[]>([])
const rule = computed(() => {
  const { maxCount, minCount } = props.modelValue
  return {
    maxCount,
    minCount
  }
})

const refreshGameList = () => {
  gameList.value = props.modelValue.optionList
}

watch(
  () => props.modelValue,
  () => {
    refreshGameList()
  },
  {
    deep: true
  }
)

onMounted(() => {
  refreshGameList()
})

const style = computed(() => {
  const arr = ['合', '头', '段', '左', '右', '家禽', '兽禽', '天肖', '地肖', '尾']
  function containsJudgmentValue(optionList: IOptions[], array: string[]) {
    return optionList.some((zodiac) => array.some((judgment) => zodiac.label.includes(judgment)))
  }
  const result = containsJudgmentValue(props.modelValue.optionList, arr)
  return result ? 'pure_text' : ''
})

const onClick = (item: IOptions) => {
  const currSelectNumber = gameList.value.filter((i) => i.active).length
  if (currSelectNumber === rule.value.maxCount && item.active === false) {
    ElMessage({
      type: 'error',
      message: '已经超过最大值'
    })
    return
  }

  item.active = !item.active
  emits(
    'onSelect',
    gameList.value.filter((i) => i.active)
  )
}
</script>

<template>
  <ul class="game_list">
    <li :class="{ style, active: item.active }" v-for="(item, index) in gameList" :key="index" @click="onClick(item)">
      {{ item.label }}
    </li>
  </ul>
</template>

<style lang="less" scoped>
.game_list {
  padding-left: 0;
  padding-top: 10px;
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  gap: 20px;
  > li {
    background-color: #919399;
    cursor: pointer;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    display: inline-block;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    color: white;
    &.pure_text {
      padding: 5px;
      border-radius: 10px;
      height: initial;
      width: initial;
      line-height: initial;
    }

    &.active {
      background-color: green;
    }
  }
}
</style>
