<script setup lang="ts">
import { ref } from 'vue'
import { reqListUserFavorite } from '@/api/user/index'
import { FavoriteFlag, IFavoriteBodyParameter, IFavoriteData } from '@/api/user/type'
import { storeToRefs } from 'pinia'
import { TableOptions } from '@/components/mTable/types'
import { dataSemantics } from '@/utils/dataSemantics'
import showErrorMessage from '@/utils/showErrorMessage'
import { useModalsStore } from '@/stores/modalStore'

const modalsStore = useModalsStore()
const { userInfoModal } = storeToRefs(modalsStore)

const props = defineProps<{
  favroiteFlag: FavoriteFlag
}>()

// @ts-ignore
const userId = userInfoModal?.value?.modalData?.userId

const initQueryForm = (): IFavoriteBodyParameter => ({
  userId: userId,
  userIdPrecise: true,
  targetId: '',
  favoriteFlag: props.favroiteFlag,
  sortName: 'create_time',
  sortOrder: 'DESC',
  page: 1,
  size: 15
})

const tableData = ref<IFavoriteData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IFavoriteBodyParameter>(initQueryForm())
const isLoading = ref(false)
const options: TableOptions[] = [
  {
    prop: ' targetId',
    label: '收藏对象ID',
    slot: 'userDisplay'
  },
  {
    prop: 'targetName',
    label: '收藏对象',
    slot: 'userFavoriteRef'
  },
  {
    prop: 'createTime',
    label: '收藏时间',
    slot: 'time'
  }
]

const handleSizeChange = (val) => {
  queryForm.size = val
}

const handleCurrentChange = (val) => {
  queryForm.page = val
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const query: IFavoriteBodyParameter = {
      ...queryForm,
      userId: userId
    }
    let res = await reqListUserFavorite(query)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

onMounted(() => {
  fetchData()
})

watch(
  () => [queryForm.size, queryForm.page],
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  }
)
</script>

<template>
  <div class="form-table">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input v-model="queryForm.targetId" maxlength="64" placeholder="收藏对象ID" clearable />
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
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        :pageSizes="[15, 30, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #userDisplay="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.targetId }}
            </span>
            <copy v-if="scope.row.targetId != ''" :content="scope.row.targetId"></copy>
          </p>
        </template>
        <template #userFavoriteRef="{ scope }">
          <p>
            {{ scope.row.targetRef }}
          </p>
        </template>
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.createTime) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>

<style lang="less" scoped>
.form-table {
  height: 100%;
  padding: 0 0px 10px 0px;
  display: flex;
  flex-direction: column;
  .search_left {
    > div {
      margin: 0 10px 10px 0;
    }
    .el-select {
      .el-select__wrapper {
        width: 6.25rem;
      }
    }
    .el-input__wrapper {
      width: 9rem;
    }
  }
  .mDialog {
    .el-input {
      width: 21.25rem;
    }
    .el-textarea {
      width: 21.25rem;
    }
    .el-select {
      width: 21.25rem;
    }
    .el-date-picker {
      width: 21.25rem;
    }
  }
  .el-upload--picture-card {
    height: 4rem;
    width: 4rem;
  }
  .el-upload-list--picture-card {
    .el-upload-list__item {
      height: 4rem;
      width: 4rem;
    }
  }
  .m_form {
    .el-input__wrapper {
      max-width: 100%;
    }
    .el-form-item__content {
      .form_action {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .el-input {
        width: auto;
        flex-grow: 1;
      }
      .el-select {
        width: auto;
        flex-grow: 1;
      }
      .el-autocomplete {
        .el-input {
          width: auto;
          display: flex;
          flex-grow: 1;
        }
      }
    }
  }
  .account-table {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
}
</style>
