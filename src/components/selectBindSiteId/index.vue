<template>
  <el-select v-model="model" v-bind="$attrs" filterable placeholder="请搜索站点ID 或 站点名称" clearable>
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { type IReqSetWebSiteListIdQueryParams, reqSetWebSiteListId } from '@/api/site'

interface IProps {
  modelValue: string | undefined
  ownerUserId: string | undefined
}

const props = defineProps<IProps>()

const model = defineModel<string | undefined>('modelValue')

interface IEmit {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()

const loadAll = ref<IAllData[]>([])
const loading = ref(false)

interface IAllData {
  value: string
  label: string
}

const fetchData = async () => {
  try {
    if (props.ownerUserId) {
      const query: IReqSetWebSiteListIdQueryParams = {
        ownerUserId: props.ownerUserId
      }
      const res = await reqSetWebSiteListId(query)
      if (res.success) {
        loadAll.value =
          res.data?.map((item) => {
            return {
              value: item.websiteId,
              label: item.websiteInnerName + ' - ' + item.websiteId
            }
          }) || []
      }
    }
  } catch (error) {
    ElMessage.error('获取站点id时出错')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.ownerUserId,
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  },
  {
    immediate: true
  }
)
</script>

<style scoped>
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
