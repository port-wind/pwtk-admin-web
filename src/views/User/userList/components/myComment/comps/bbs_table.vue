<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { CommentsFlag } from '@/api/user/type'
import { storeToRefs } from 'pinia'
import type { TableOptions } from '@/components/mTable/types'
import { dataSemantics } from '@/utils/dataSemantics'
import showErrorMessage from '@/utils/showErrorMessage'
import { useModalsStore } from '@/stores/modalStore'
import { reqCommentsList } from '@/api/bss/postContentManagement'
import { useRouter } from 'vue-router'
import type { IReqCommentsListData, IReqCommentsListQueryParams } from '@/api/bss/postContentManagement/types'
import { useBettingStore } from '@/stores/bettingStore'

const router = useRouter()
const modalsStore = useModalsStore()
const bettingStore = useBettingStore()
const { userInfoModal } = storeToRefs(modalsStore)

const props = defineProps<{
  commentsFlag: CommentsFlag
}>()

// @ts-ignore
const userId = userInfoModal?.value?.modalData?.userId
console.log('🚀 ~ userId:', userId)

//default initQueryForm
const initQueryForm = (): IReqCommentsListQueryParams => ({
  sortName: 'create_time',
  sortOrder: 'DESC',
  page: 1,
  size: 5,
  userId: userId
})

const switchInitQueryForm = (
  initQueryForm: IReqCommentsListQueryParams,
  commentsFlag: CommentsFlag
): IReqCommentsListQueryParams => {
  switch (commentsFlag) {
    case CommentsFlag.MYFORUM:
      initQueryForm.bbsId = 'myForum'
      break
    case CommentsFlag.GUESS:
      initQueryForm.mainBoardId = 'guess'
      break
    case CommentsFlag.USERPUBLIC:
      initQueryForm.forumId = 'userPublic'
      break
    case CommentsFlag.CORPUS:
      initQueryForm.bbsId = 'corpus'
      break
    default:
      initQueryForm.bbsId = 'myForum'
  }

  return initQueryForm
}

const tableData = ref<IReqCommentsListData[]>([])
const total = ref<number>(0)
const queryForm = reactive<IReqCommentsListQueryParams>(switchInitQueryForm(initQueryForm(), props.commentsFlag))
const isLoading = ref(false)

const options: TableOptions[] = [
  {
    prop: 'mainPostId',
    label: '帖子ID',
    slot: 'mainPostId'
  },
  {
    prop: 'mainPostTitle',
    label: '帖子标题',
    slot: 'mainPostTitle'
  },
  {
    prop: 'postContent',
    label: '评论内容'
  },
  {
    prop: 'gameTypeCode',
    label: '彩种',
    slot: 'gameTypeCode'
  },
  {
    prop: 'postTime',
    label: '发布时间',
    columAttr: { minWidth: 130 },
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
    //bbsId: "myForum" page: 1 size: 10
    const query: IReqCommentsListQueryParams = {
      ...queryForm
    }
    let res = await reqCommentsList(query)
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
  Object.assign(queryForm, switchInitQueryForm(initQueryForm(), props.commentsFlag))
}

const getGameNameByCode = (gameTypeCode: string) => {
  const currentGame = bettingStore.gameType.find((item) => item.gameType === gameTypeCode)
  return currentGame?.gameTypeName
}

onMounted(() => {
  fetchData()

  if (bettingStore.gameType.length === 0) {
    bettingStore.getGameType()
  }
})

const openPostWithId = (row: IReqCommentsListData) => {
  const url = router.resolve({
    name: 'bbsPostContentManagement',
    query: {
      mainPostId: row.mainPostId
    }
  }).href

  window.open(url, '_blank') // 打开新的标签页
}

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
          <el-input v-model="queryForm.postId" maxlength="64" placeholder="帖子ID" clearable />
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
        <template #mainPostId="{ scope }">
          <el-link class="like-a" @click="openPostWithId(scope.row)">
            {{ scope.row.mainPostId }}
          </el-link>
        </template>
        <template #mainPostTitle="{ scope }">
          <div class="g-text-nowrap-ellipsis">{{ scope.row.mainPostTitle }}</div>
        </template>
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
        <template #gameTypeCode="{ scope }">
          <p class="g-text-nowrap-ellipsis">{{ getGameNameByCode(scope.row.gameTypeCode) }}</p>
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
