<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { IReqSixKingGalleryData, IReqSixKingGalleryQueryParams } from '@/api/user/type'
import { storeToRefs } from 'pinia'
import type { TableOptions } from '@/components/mTable/types'
import { dataSemantics } from '@/utils/dataSemantics'
import showErrorMessage from '@/utils/showErrorMessage'
import { useModalsStore } from '@/stores/modalStore'
import { useBettingStore } from '@/stores/bettingStore'
import { reqSixKingGallery } from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const modalsStore = useModalsStore()
const bettingStore = useBettingStore()
const { userInfoModal } = storeToRefs(modalsStore)

interface IProps {
  // commentsFlag: CommentsFlag
}

const props = defineProps<IProps>()

// @ts-ignore
const userId = userInfoModal?.value?.modalData?.userId

//default initQueryForm
const initQueryForm = (): IReqSixKingGalleryQueryParams => ({
  sortName: 'create_time',
  sortOrder: 'DESC',
  page: 1,
  size: 5,
  userId: userId,
  issueId: ''
})

const tableData = ref<IReqSixKingGalleryData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IReqSixKingGalleryQueryParams>(initQueryForm())
const isLoading = ref(false)

const options: TableOptions[] = [
  {
    prop: 'issueId',
    label: '报纸ID',
    slot: 'issueId'
  },
  {
    prop: 'postYear',
    label: '年份',
    columAttr: { width: 60 }
  },
  {
    prop: 'issueId',
    label: '期数',
    slot: 'issueDTO_issue'
  },
  {
    prop: 'issueDTO',
    label: '报纸名称',
    slot: 'issueDTO_newspaperName'
  },
  {
    prop: 'postContent',
    label: '评论内容',
    slot: 'postContent'
  },
  {
    prop: 'postGametypeRef',
    label: '彩种',
    slot: 'postGametypeRef',
    columAttr: { width: 60 }
  },
  {
    prop: 'postTime',
    label: '发布时间',
    columAttr: { width: 110 },
    dateName: 'postTime'
  }
]

const handleSizeChange = (val: number) => {
  queryForm.size = val
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const query: IReqSixKingGalleryQueryParams = {
      ...queryForm
    }
    let res = await reqSixKingGallery(query)
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

const getGameNameByCode = (gameTypeCode: string) => {
  const currentGame = bettingStore.gameType.find((item) => {
    return item.gameType == gameTypeCode
  })
  return currentGame?.gameTypeName
}

const jumpToNewsPaperIssue = (row: IReqSixKingGalleryData) => {
  console.log('🚀 ~ jumpToNewsPaperIssue ~ row:', row)
  const params = router.resolve({ name: 'newsPaperIssue', query: { newspaperCode: row?.issueDTO?.newspaperCode } })
  window.open(params.href)
}

onMounted(() => {
  fetchData()

  if (bettingStore.gameType.length === 0) {
    bettingStore.getGameType()
  }
})

watch(
  () => [queryForm.size, queryForm.page],
  (newVal) => {
    fetchData()
  }
)
</script>

<template>
  <div class="form-table">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input v-model="queryForm.issueId" maxlength="64" placeholder="报纸ID" clearable />
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
        :pageSizes="[5, 15, 30, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #issueId="{ scope }">
          <div class="g-text-nowrap-ellipsis">
            <el-link @click="jumpToNewsPaperIssue(scope.row)" class="like-a">
              {{ scope?.row?.issueId }}
            </el-link>
          </div>
        </template>
        <template #userDisplay="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.targetId }}
            </span>
            <copy v-if="scope.row.targetId != ''" :content="scope.row.targetId"></copy>
          </p>
        </template>
        <template #issueDTO_newspaperName="{ scope }">
          <p class="g-text-nowrap-ellipsis">{{ scope.row.issueDTO.newspaperName }}</p>
        </template>
        <template #issueDTO_issue="{ scope }">
          <p>{{ scope.row.issueDTO.issue }}</p>
        </template>
        <template #userFavoriteRef="{ scope }">
          <p>
            {{ scope.row.targetRef }}
          </p>
        </template>
        <template #postContent="{ scope }">
          <div class="g-text-nowrap-ellipsis" v-html="scope.row.postContent"></div>
        </template>
        <template #postGametypeRef="{ scope }">
          <p>{{ getGameNameByCode(scope.row.postGametypeRef) }}</p>
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
