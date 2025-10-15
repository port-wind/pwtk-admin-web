<template>
  <el-dialog
    v-model="rulesDialogVisible"
    class="tabs-dialog"
    v-bind="$attrs"
    overflow
    destroy-on-close
    @close="onClose"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" model-value="basic">
      <el-tab-pane label="推广详情" name="basic" class="m_tabs_pane" v-loading="isLoading">
        <section class="section-wrapper">
          <section class="header-inside-dialog">
            <h3>邀请码:{{ currentRow?.promotionCode }} 层级表示(</h3>
            <el-breadcrumb v-if="rulesDialogVisible" :separator-icon="ArrowRight" style="display: flex">
              <el-breadcrumb-item :key="item" v-for="(item, index) in parentPath">
                <span class="like-a" @click="checkParentData(item, index)">
                  {{ item.nickname + '|' + item.userId }}
                </span>
              </el-breadcrumb-item>
            </el-breadcrumb>
            <h3>)</h3>
          </section>
          <section class="section-custom-table">
            <m-table
              :options="options"
              :data="tableData"
              :isLoading="isLoading"
              pagination
              stripe
              :total="total"
              :currentPage="queryForm.page"
              :pageSize="queryForm.size"
              :pageSizes="[5, 15, 30, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
              <template #userId="{ scope }">
                <el-link
                  v-if="parentPath.length <= 1"
                  class="like-a g-text-nowrap-ellipsis"
                  @click="checkChildData(scope.row)"
                >
                  {{ truncateText(scope.row.loginId, 20) + '｜' + truncateText(scope.row.nickname, 20) }}
                </el-link>
                <el-text v-else class="g-text-nowrap-ellipsis">
                  {{ truncateText(scope.row.loginId, 20) + '｜' + truncateText(scope.row.nickname, 20) }}
                </el-text>
              </template>
              <template #userStatus="{ scope }">
                <el-tag type="success" v-if="scope.row.userStatus === 'y'">启用</el-tag>
                <el-tag type="info" v-else>禁用</el-tag>
              </template>
              <template #promotionCodeList="{ scope }">
                <el-tag type="success" v-for="(item, index) in scope.row.promotionCodeList" :key="index">
                  {{ item }}
                </el-tag>
              </template>
            </m-table>
          </section>
        </section>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { reqDetailList } from '@/api/user/prommot'
import { IReqDetailListData, IReqDetailListQueryParams, IReqPromoteListData } from '@/api/user/prommot/type'
import { TableOptions } from '@/components/mTable/types'
import { truncateText } from '@/utils/dataFormat'

const isLoading = ref(false)
const currentRow = ref<IReqPromoteListData>()
const parentPath = reactive<
  {
    userId: string
    nickname?: string
    promotionCode?: string
  }[]
>([])
const tableData = ref<IReqDetailListData[]>()
const rulesDialogVisible = ref<Boolean>(false)
const total = ref<number>()
const queryForm = reactive<IReqDetailListQueryParams>({
  page: 1,
  size: 5,
  promotionCode: ''
})

// userId: number // int64
//   loginId: string
//   nickname: string
//   userStatus: string
//   promotionCodeList: string[] // array of strings
//   cnt: number // int32
//   regTime: string // format: yyyy-MM-dd HH:mm:ss
// 被邀请人帐号|昵称 被邀请人状态 邀请码 邀请人数 注册时间

const options: TableOptions[] = [
  { prop: 'userId', label: '被邀请人帐号｜昵称', slot: 'userId' },
  { prop: 'userStatus', label: '被邀请人状态', slot: 'userStatus', columAttr: { width: 120 } },
  {
    prop: 'promotionCodeList',
    label: '邀请码',
    slot: 'promotionCodeList',
    columAttr: { width: 120 }
  },
  { prop: 'cnt', label: '邀请人数', columAttr: { width: 120, align: 'right' } },
  {
    prop: 'regTime',
    label: '注册时间',
    dateName: 'regTime',
    columAttr: { width: 130, align: 'left' }
  }
  // { prop: 'userId', label: '邀请人帐号｜昵称' },
  // { prop: 'loginId', label: '邀请人帐号｜昵称' },
]
const onClose = () => {
  parentPath.length = 0
}

const handleSizeChange = (val: number) => {
  queryForm.size = val
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const checkParentData = (parentPathItem, index) => {
  parentPath.length = index + 1
  fetchData(parentPathItem.promotionCode)
}

const checkChildData = (row: IReqDetailListData) => {
  parentPath.push({
    nickname: row.nickname,
    promotionCode: row.promotionCodeList[0],
    userId: row.userId
  })
  fetchData(row.promotionCodeList[0])
}

const fetchData = async (promotionCode?: string) => {
  isLoading.value = true
  try {
    const query: IReqDetailListQueryParams = {
      ...queryForm,
      promotionCode: currentRow.value!.promotionCode
    }
    if (promotionCode) {
      query.promotionCode = promotionCode
    }

    const res = await reqDetailList(query)
    if (res.success) {
      tableData.value = res.data.list
      total.value = Number(res?.data?.total) || 0
    } else {
      ElMessage({
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const openDailog = (row: IReqPromoteListData) => {
  rulesDialogVisible.value = true
  currentRow.value = row
  parentPath.push({
    nickname: row.nickname,
    promotionCode: row.promotionCode,
    userId: row.userId
  })
  fetchData()
}
export interface IExpose {
  openDailog: (row: IReqPromoteListData) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})
</script>
<style lang="scss" scoped>
.section-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.section-custom-table {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.custom-table {
}
</style>
