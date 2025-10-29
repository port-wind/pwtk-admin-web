<template>
  <section class="wrapper">
    <section>
      <el-form
        class="custom-el-form no-rule"
        @keyup.enter="fetchData()"
        ref="queryRef"
        :inline="true"
        :model="queryForm"
        label-width="70px"
      >
        <el-form-item label="" prop="countryCode">
          <el-input v-model="queryForm.mobileCountryCode" maxlength="10" placeholder="国家区号" />
        </el-form-item>
        <el-form-item label="" prop="mobile">
          <el-input v-model="queryForm.mobile" maxlength="20" placeholder="手机号" />
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #countryCode="{ scope }">
          <div>{{ scope.row.countryCode }}</div>
        </template>

        <template #mobile="{ scope }">
          <div>{{ scope.row.mobile }}</div>
        </template>

        <template #cid="{ scope }">
          <div>{{ scope.row.cid }}</div>
        </template>
      </m-table>
    </section>
  </section>
</template>

<script setup lang="ts">
import i18n from '@/locales'
const { t } = i18n.global as any
import type { TableOptions } from '@/components/mTable/types'
import { getMobileList } from '@/api/system'
import type { IGetMobileListData, IGetMobileListQueryParams } from '@/api/system/type'

const initQueryForm = (): IGetMobileListQueryParams => ({
  page: 1,
  size: 15,
  sortName: 'createTime',
  sortOrder: 'DESC',
  mobileCountryCode: '',
  mobile: ''
})

const isLoading = ref(false)
const total = ref(0)
const tableData = ref<IGetMobileListData[]>([])
const queryForm = reactive<IGetMobileListQueryParams>(initQueryForm())
const queryRef = ref()

const options: TableOptions[] = [
  {
    prop: 'countryCode',
    label: '国家区号',
    slot: 'countryCode'
  },
  {
    prop: 'mobile',
    label: '电话',
    slot: 'mobile'
  },
  {
    prop: 'cid',
    label: '客户ID',
    slot: 'cid'
  },
  {
    prop: 'authCode',
    label: '验证码'
  },
  {
    prop: 'createTime',
    label: '创建日期',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  }
]
const fetchData = async () => {
  try {
    const query: IGetMobileListQueryParams = {
      ...queryForm
    }
    const res = await getMobileList(query)
    if (res.success) {
      tableData.value = res.data.list
    } else {
      ElMessage.error('获取信息出错')
    }
  } catch (error) {
    console.error(error)
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

onMounted(() => {
  fetchData()
})

watch(
  () => queryForm,
  (newVale) => {
    fetchData()
  },
  { deep: true }
)
</script>

<style scoped lang="less">
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
