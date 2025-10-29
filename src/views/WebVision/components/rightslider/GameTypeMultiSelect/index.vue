<script setup lang="ts">
import { useStore } from '@nanostores/vue'
import { computed, defineProps, watch, onMounted } from 'vue'
import type { ISetStyle } from '@/views/WebVision/components/componentsbiz/componentProperties/index'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import { useMultiGameType } from '@/views/WebVision/components/componentsbiz/composables/useMultiGameType'

interface IProps {
  datas: ISetStyle<any>
}
const props = defineProps<IProps>()
const gameStoreData = useStore(gameStore)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)
const { selectedGameTypes, setSelectedGameTypes } = useMultiGameType(props.datas)
const configParamJson = computed(() => props.datas.configParamJson)
const localSelectedGameTypes = ref<string[]>([])

// Helper function to deep clone template object
const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
  if (typeof obj === 'object') {
    const cloned = {} as Record<string, any>
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone((obj as Record<string, any>)[key])
    })
    return cloned as T
  }
  return obj
}

// Helper function to copy template to customData
const copyTemplateToCustomData = (gameType: string, existingCustomData?: any) => {
  const templateObj = configParamJson.value?.templateObj
  if (templateObj && (!existingCustomData || Object.keys(existingCustomData).length === 0)) {
    const clonedTemplate = deepClone(templateObj)
    // Ensure videos array exists in customData
    if (!clonedTemplate.videos) {
      clonedTemplate.videos = []
    }
    return clonedTemplate
  }
  return existingCustomData || { videos: [] }
}

// Initialize selected game types from configParamJson if needed
watch(
  () => selectedGameTypes.value,
  (newVal) => {
    if (newVal && Array.isArray(newVal)) {
      localSelectedGameTypes.value = newVal.map((item) => item.gameType)
    }
  },
  { immediate: true }
)
const handleSelectionChange = (selection: string[]) => {
  localSelectedGameTypes.value = selection

  // Update configParamJson with the selected game types array as objects
  const selectedGameTypeObjects = selection.map((gameType) => {
    // Find existing object to preserve customData and show values
    const existing = selectedGameTypes.value?.find((item) => item.gameType === gameType)
    return {
      gameType,
      customData: copyTemplateToCustomData(gameType, existing?.customData),
      show: existing?.show !== undefined ? existing.show : true,
      active: existing?.active !== undefined ? existing.active : false
    }
  })
  if (configParamJson.value) {
    setSelectedGameTypes(selectedGameTypeObjects)
  } else {
    props.datas.configParamJson = {
      selectedGameTypes: selectedGameTypeObjects
    }
  }
}
// Auto-select first gameType when component is first created and no gameTypes are selected
onMounted(() => {
  const hasSelectedGameTypes = selectedGameTypes.value?.length > 0
  const hasGameTypeList = gameTypeList.value?.length > 0

  if (!hasSelectedGameTypes && hasGameTypeList) {
    // Auto-select the first gameType
    const firstGameType = gameTypeList.value[0].gameType
    handleSelectionChange([firstGameType])
  } else if (hasSelectedGameTypes) {
    // Ensure existing gameTypes have template copied if customData is empty
    const updatedGameTypes = selectedGameTypes.value.map((item: any) => ({
      ...item,
      customData: copyTemplateToCustomData(item.gameType, item.customData)
    }))
    if (configParamJson.value) {
      setSelectedGameTypes(updatedGameTypes)
    }
  }
})
</script>

<template>
  <el-divider content-position="left">彩票类型选择</el-divider>
  <el-form-item label="彩票类型" prop="localSelectedGameTypes">
    <el-select
      v-model="localSelectedGameTypes"
      multiple
      placeholder="请选择彩票类型"
      style="width: 100%; margin-bottom: 10px"
      @change="handleSelectionChange"
    >
      <el-option
        v-for="item in gameTypeList"
        :key="item.gameTypeCode"
        :label="item.gameTypeShortName"
        :value="item.gameType"
      />
    </el-select>
  </el-form-item>
</template>

<style lang="scss" scoped></style>
