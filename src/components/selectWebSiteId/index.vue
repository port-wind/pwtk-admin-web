<template>
  <el-select
    v-model="state"
    filterable
    remote
    clearable
    reserve-keyword
    placeholder="站点ID"
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 140px"
    v-bind="$attrs"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script lang="ts" setup>
import { selectIdAndName } from '@/api/user'
import { onMounted, ref } from 'vue'

interface IProps {
  modelValue: string
}
const props = defineProps<IProps>()
interface ListItem {
  value: string
  label: string
}

const options = ref<ListItem[]>([])
const defaultOptions = ref<ListItem[]>([])
const state = ref<string>(props.modelValue)

const loading = ref(false)

onMounted(async () => {
  // list.value = states.map((item) => {
  //   return { value: `value:${item}`, label: `label:${item}` }
  // })
  await querySearchWebsiteId('')
})

const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    try {
      const response = await selectIdAndName({
        websiteId: query.trim()
      })
      if (response.success && response.data) {
        const results = response.data.map((item: any) => ({
          value: item,
          label: item
        }))

        options.value = results.filter((item) => {
          return item.label.toLowerCase().includes(query.toLowerCase())
        })
        loading.value = false
      }
    } catch (error) {
      console.error('Error fetching domain suggestions:', error)
      ElMessage.error('获取用户id时出错')
    } finally {
      loading.value = false
    }
    // setTimeout(() => {
    //   loading.value = false
    //   options.value = list.value.filter((item) => {
    //     return item.label.toLowerCase().includes(query.toLowerCase())
    //   })
    // }, 200)
  } else {
    options.value = defaultOptions.value
  }
}

const onChange = (value) => {
  console.log('🚀 ~ onBlur ~ value:', value)
  state.value = value
}

const querySearchWebsiteId = async (queryString?: string) => {
  try {
    const response = await selectIdAndName({
      websiteId: queryString
    })
    console.log('🚀 ~ querySearchWebsiteId ~ response:', response)
    if (response.success && response.data) {
      const results = response.data.slice(0, 100).map((item) => ({
        value: item,
        label: item
      }))

      options.value = results
      defaultOptions.value = results
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
  }
}
</script>
