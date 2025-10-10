<template>
  <el-select
    v-model="state"
    v-bind="$attrs"
    value-key="id"
    class="my-select"
    filterable
    remote
    placeholder="请输入模版ID..."
    clearable
    @change="onchange"
    :remote-method="querySearch"
    :loading="loading"
  >
    <el-option v-for="item in loadAll" :key="item.id" :label="`${item.label}`" :value="`${item.id}`">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqUserList } from '@/api/user'
import type { IReqUserListQueryParams } from '@/api/user/type'
import { listBlurTemplateWithUserInfo } from '@/api/site'
import type { IListBlurTemplateWithUserInfoQueryParams } from '@/api/site/type'

interface IProps {
  modelValue: string
  ownerUserId?: string | undefined
  id: 'templateId' | 'sketchCode'
  default?: number
  group?: string[]
}
const props = defineProps<IProps>()
const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref(props.modelValue) // 组件内部的 v-model 绑定
const emits = defineEmits(['update:modelValue'])
interface IAllData {
  id: string
  value: string
  label: string
}

const fetchData = async (querySearch: string) => {
  loading.value = true
  try {
    const query: IListBlurTemplateWithUserInfoQueryParams = {
      templateId: querySearch,
      ownerUserId: props?.ownerUserId
    }
    const res = await listBlurTemplateWithUserInfo(query)
    if (res.success && res?.data) {
      loadAll.value = res.data.map((item) => {
        let tempItem: IAllData = {
          id: '',
          value: '',
          label: ''
        }

        if (props.group && props?.group?.length !== 0) {
          switch (props.id) {
            case 'templateId':
              tempItem = {
                id: item.templateId,
                value: item.templateId,
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
            case 'sketchCode':
              tempItem = {
                id: item.sketchCode,
                value: item.sketchCode,
                label: item[props.group[0]] + ' - ' + item[props.group[1]]
              }
              break
          }
          return tempItem
        }
        switch (props.id) {
          case 'templateId':
            tempItem = {
              id: item.templateId,
              value: item.templateId,
              label: item.templateId
            }
            break
          case 'sketchCode':
            tempItem = {
              id: item.sketchCode,
              value: item.sketchCode,
              label: item.sketchCode + ' - ' + item.templateName
            }
            break
        }
        return tempItem
      })
      // 默认选择第一个
      if (props.default && !props.modelValue) {
        state.value = loadAll.value[props.default - 1].id
        emits('update:modelValue', state.value)
      }

      loading.value = false
      return Promise.resolve(loadAll.value)
    } else {
      loadAll.value = []
      return Promise.resolve([])
    }
  } catch (error) {
    ElMessage.error('获取用户ID时出错')
  } finally {
    loading.value = false
  }
}

const querySearch = async (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    await fetchData(queryString)
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData('') // 如果搜索框为空，重新加载完整数据
  }
}

onMounted(async () => {
  fetchData('')
})

const onchange = (val) => {
  emits('update:modelValue', val ?? '')
}

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    state.value = newVal
  }
)
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
