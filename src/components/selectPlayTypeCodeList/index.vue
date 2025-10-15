<template>
  <el-select v-model="model" v-bind="$attrs" class="my-select" filterable placeholder="玩法列表" clearable>
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="label">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/service'

const model = defineModel<number>('modelValue')

const loadAll = ref<IAllData[]>([])
const loading = ref(false)

interface IAllData {
  value: string
  label: string
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = (await service.kv().getPlayRules().do()) as any
    if (res[0]?.playTypes) {
      const result = res[0].playTypes.map((item) => {
        return {
          value: item.code,
          label: item.name + '(' + item.code + ')'
        }
      })
      loadAll.value = result
    } else {
      loadAll.value = []
    }
  } catch (error) {
    ElMessage.error('获取玩法列表时出错')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.my-select {
  width: 100%;
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
