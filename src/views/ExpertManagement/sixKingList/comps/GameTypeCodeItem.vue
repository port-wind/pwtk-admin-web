<script setup lang="ts">
import { BizFlag } from '@/api/betting/types'
import { useBettingStore } from '@/stores/bettingStore'

interface IProps {
  disableSub?: boolean
  modelValue: string | undefined
}

const props = defineProps<IProps>()

const emits = defineEmits(['update:modelValue'])

const bettingStore = useBettingStore()
const temp1PlayTypeCode = ref('')
const temp2PlayTypeCode = ref('')

const onchange1 = (item) => {
  temp1PlayTypeCode.value = item
  emits('update:modelValue', item)
}

const onchange2 = (item) => {
  temp2PlayTypeCode.value = item
  if (!item) {
    emits('update:modelValue', temp1PlayTypeCode.value)
  } else {
    emits('update:modelValue', temp2PlayTypeCode.value)
  }
}
onMounted(async () => {
  await bettingStore.getListPlayTypeCode(BizFlag.Insight)
  await bettingStore.getlistPlayType()

  temp1PlayTypeCode.value = bettingStore.gameListTypeCode[0].playTypeCode
  emits('update:modelValue', bettingStore.gameListTypeCode[0].playTypeCode)
})

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!newVal) {
      temp1PlayTypeCode.value = ''
      temp2PlayTypeCode.value = ''
    } else {
      const res = bettingStore.gameListTypeCode.find((i) => i.playTypeCode === newVal)
      if (!res) {
        temp2PlayTypeCode.value = newVal
      } else {
        temp1PlayTypeCode.value = newVal
        temp2PlayTypeCode.value = ''
      }
    }
  }
)

watch(
  () => temp1PlayTypeCode.value,
  (newVal) => {
    temp2PlayTypeCode.value = ''
  }
)
</script>

<template>
  <el-form-item label="" prop="playTypeCode">
    <el-select placeholder="游戏类型" v-model="temp1PlayTypeCode" @change="onchange1" clearable style="width: 170px">
      <el-option
        v-for="item in bettingStore.gameListTypeCode"
        :key="item.playTypeCode"
        :label="item.predictionTypeName"
        :value="item.playTypeCode"
      />
    </el-select>
  </el-form-item>
  <el-form-item label="" v-if="!props.disableSub">
    <el-select
      v-model="temp2PlayTypeCode"
      placeholder="玩法种类"
      @change="onchange2"
      :disabled="temp1PlayTypeCode && bettingStore.gameSubList(temp1PlayTypeCode)?.length === 0"
      clearable
      style="width: 100px"
    >
      <el-option
        v-for="item in bettingStore.gameSubList(temp1PlayTypeCode)"
        :key="item.playTypeCode"
        :label="item.predictionTypeName"
        :value="item.playTypeCode"
      />
    </el-select>
  </el-form-item>
</template>

<style lang="less" scoped></style>
