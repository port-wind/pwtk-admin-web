<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        @keyup.enter="fetchData({ page: 1 })"
      >
        <el-form-item prop="siteName">
          <AutoComplete
            v-model.trim="queryForm.siteName"
            :httpFunc="reqAdvertisementlistBlurSiteName"
            keyword="siteName"
            placeholder="站点名称"
            :displayFields="['siteName']"
            :trigger-on-focus="true"
            :isPage="false"
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="siteId">
          <AutoComplete
            v-model.trim="queryForm.siteId"
            :httpFunc="reqAdvertisementlistBlurSiteId"
            keyword="siteId"
            placeholder="站点ID"
            :displayFields="['siteId']"
            :trigger-on-focus="true"
            :isPage="false"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="focusGameType">
          <GameTypeList
            v-model="queryForm.focusGameType"
            multiple
            allGame
            style="width: 160px"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1 })" :loading="isLoading">
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
          <el-button type="success" @click="openAddAdvertisementDailog()">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        class="m_table_image"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #imageInfo="{ scope }">
          <div
            v-if="scope.row.siteLogo.length"
            class="image_wrapper"
            @click="openAddAdvertisementDailog(scope.row.siteId)"
          >
            <AsyncImage class="image" fit="cover" :src="getImageUrl(scope.row.siteLogo[0])" />
          </div>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #siteInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="openAddAdvertisementDailog(scope.row.siteId)">
            {{ truncateText(scope.row.siteName, 5) }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <el-popover
            :content="currentGameTypeList(scope.row)"
            placement="top"
            width="250"
            v-if="currentGameTypeList(scope.row)"
          >
            <template #reference>
              {{ truncateText(currentGameTypeList(scope.row), 8) }}
            </template>
          </el-popover>
        </template>
        <template #tags="{ scope }">
          <el-popover :content="getTagLabels(scope)" placement="top" width="250" v-if="getTagLabels(scope)">
            <template #reference>
              {{ truncateText(getTagLabels(scope), 5) }}
            </template>
          </el-popover>
        </template>
        <template #isSwitch="{ scope }">
          <el-tag class="mx-1" type="danger" style="cursor: pointer" @click="statusChanged(scope.row)">删除</el-tag>
        </template>
      </m-table>
    </section>
  </section>
  <!-- 创建新的 -->
  <AddAdvertisementDailog ref="AddAdvertisementDailogRef" v-if="unMountAddAdvertisementDailog" @onClose="onClose" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import i18n from '@/locales'
import type { TableOptions } from '@/components/mTable/types'
import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import {
  reqAdvertisementList,
  reqAdvertisementDelete,
  reqAdvertisementlistBlurSiteId,
  reqAdvertisementlistBlurSiteName
} from '@/api/photoSys/advertisement'
import type { IReqAdvertisementListData, IReqAdvertisementListQueryParams } from '@/api/photoSys/advertisement/type'
import AddAdvertisementDailog from './components/addAdvertisementDailog.vue'
import { useBettingStore } from '@/stores/bettingStore'
import getImageUrl from '@/utils/getImageUrl'
import { truncateText } from '@/utils/dataFormat'

const { t } = i18n.global as any
const tableRef = ref()
const queryRef = ref()
const AddAdvertisementDailogRef = ref()
const bettingStore = useBettingStore()
const unMountAddAdvertisementDailog = ref(false)
const openAddAdvertisementDailog = (siteId?: string) => {
  unMountAddAdvertisementDailog.value = true
  nextTick(() => {
    AddAdvertisementDailogRef.value.openDailog(siteId)
  })
}
const onClose = () => {
  fetchData()
}
const tableData = ref<IReqAdvertisementListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)
const initQueryForm = (): IReqAdvertisementListQueryParams => ({
  page: 1,
  size: 15,
  siteName: '',
  siteId: '',
  focusGameType: [],
  sortOrder: 'DESC',
  sortName: 'create_time'
})

const queryForm = reactive<IReqAdvertisementListQueryParams>(initQueryForm())
const gameTypeList = ref<any[]>()
const currentGameTypeList = (row: any) => {
  return row.focusGameType
    .map((type) => gameTypeList?.value?.find((item) => item.value === type)?.label)
    .filter(Boolean)
    .join(', ')
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'siteLogo',
    label: '图标',
    slot: 'imageInfo',
    width: 56
  },
  {
    prop: 'siteName',
    label: '站点名称',
    slot: 'siteInfo',
    width: 80
  },
  {
    prop: 'sortNum',
    label: '排序编号',
    align: 'right',
    width: 80
  },
  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    width: 120
  },
  {
    prop: 'siteDesc',
    label: '站点描述',
    minWidth: 200
  },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    width: 120
  },
  {
    prop: 'memo',
    label: '备注',
    minWidth: 160
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    minWidth: 150
  },
  {
    prop: 'isSwitch',
    label: '操作',
    slot: 'isSwitch',
    minWidth: 80
  }
]

//翻页功能 前一页
const handleSizeChange = (val: number) => {
  queryForm.size = val
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

/**
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const statusChanged = (row) => {
  return ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      updateStatus(row)
    })
    .catch(() => {})
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  const { siteId } = row
  try {
    const response = await reqAdvertisementDelete({ siteId })
    if (response.success) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      fetchData()
      return Promise.resolve()
    }
    showErrorMessage(response)
  } catch (error) {
    ElMessage({
      showClose: true,
      message: '操作数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
}

//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IReqAdvertisementListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqAdvertisementListQueryParams = {
      ...queryForm,
      ..._queryForm
    }
    const response = await reqAdvertisementList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
      if (total.value < (queryForm.page - 1) * queryForm.size) {
        queryForm.page = 1
        fetchData()
      }
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}

//table标签的展示
const getTagLabels = (scope: any) => {
  const labels: string[] = []
  if (scope.row.isRecommended === 'y') labels.push('推荐')
  if (scope.row.isHot === 'y') labels.push('热门')
  if (scope.row.isSelected === 'y') labels.push('精选')
  if (scope.row.isTop === 'y') labels.push('置顶')
  if (scope.row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

onMounted(async () => {
  await bettingStore.getGameType()
  gameTypeList.value = bettingStore.gameType.map((item) => ({
    label: item.gameTypeName,
    value: item.gameType
  }))
  fetchData()
})

watch(
  () => [queryForm.page, queryForm.size],
  (newVal) => {
    fetchData()
  }
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
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}
.image {
  width: 100%;
}

.image_wrapper {
  width: 48px;
  height: 48px;
  cursor: pointer;
}
</style>
