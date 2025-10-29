<template>
  <el-form :inline="true" class="custom-el-form no-rule" :model="queryForm" label-width="0">
    <el-form-item label="" prop="userId">
      <AutoChoseLoginId v-model="queryForm.searchId" />
    </el-form-item>

    <el-form-item label="" prop="nickname">
      <UserDeleteAutocomplete
        placeholder="用户昵称"
        @keyup.enter="fetchData()"
        name="nickname"
        v-model:remoteId="queryForm.nickname"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
        <el-icon style="margin: 0 5px 0 0">
          <Search />
        </el-icon>
        查询
      </el-button>
      <el-button @click="handleReset">
        <el-icon style="margin: 0 5px 0 0">
          <Refresh />
        </el-icon>
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import UserTwoAutocomplete from '@/components/userTwoAutocomplete/index.vue'
import UserDeleteAutocomplete from '@/components/userDeleteAutocomplete/index.vue'

interface QueryForm {
  searchId: string
  remoteValue: string
  nickname: string
}

const isLoading = ref(false)

const emit = defineEmits(['search', 'reset'])

const initQueryFormValue = () => {
  return {
    searchId: '',
    remoteValue: '',
    nickname: ''
  }
}

const queryForm = reactive<QueryForm>(initQueryFormValue())

const fetchData = async () => {
  isLoading.value = true
  try {
    // API call will be implemented here
    emit('search', queryForm)
    console.log('Fetching data with:', queryForm)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  emit('reset')
}
</script>

<style scoped lang="less"></style>
