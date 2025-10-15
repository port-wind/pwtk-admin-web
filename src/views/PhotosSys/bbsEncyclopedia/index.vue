<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        @keyup.enter="fetchData({ page: 1 })"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
      >
        <el-form-item prop="siteName">
          <AutoComplete
            v-model.trim="queryForm.siteName"
            :httpFunc="getListBlurSiteName"
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
            :httpFunc="getListBlurSiteId"
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
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton()" plain>重置</el-button>
          <el-button type="success" @click="handleAddButton" :icon="Plus">新增</el-button>
          <el-button
            v-if="isShowCheckboxTable"
            type="success"
            :icon="Connection"
            plain
            @click="() => handleSpecialClick('bbs')"
          >
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #imageInfo="{ scope }">
          <el-image
            v-if="scope.row.siteLogo"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.siteLogo"
          ></el-image>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #siteInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleTableEdit(scope)">
            {{ scope.row.siteName }}
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
    <!-- 网站大全弹出框 -->
    <section class="dialogAdd">
      <el-dialog v-model="addDialogVisible" draggable overflow destroy-on-close class="tabs-dialog">
        <el-tabs class="m_tabs" v-model="activeTab">
          <el-tab-pane label="网站" name="web_tab" class="m_tabs_pane">
            <m-form
              class="dialog-form"
              ref="dialogFormRef"
              :file-list="fileList"
              :modelForm="lineFormData"
              :options="formMode === 'add' ? addDialogOptions : editDialogOptions"
              :rules="rulesAdd"
              :uploadData="uploadData"
              :rowAttrs="rowAttrs"
              :commonSpan="10"
              label-width="100px"
              @on-success="handleSuccess"
              @on-exceed="handleExceed"
              @on-remove="handleRemove"
            >
              <template #uploadArea>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
              <template #focusGameType="scope">
                <GameTypeList v-model="scope.form.focusGameType" :multiple="true" :all-game="formMode !== 'add'" />
              </template>
              <template #action="scope">
                <section class="button-row">
                  <el-button @click="closeDialog">取消</el-button>
                  <el-button type="primary" @click="handleSubmit(scope)">提交</el-button>
                </section>
              </template>
            </m-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </section>
    <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Picture as IconPicture, Search, Refresh, Plus, Connection } from '@element-plus/icons-vue'
import type { UploadUserFile } from 'element-plus'
import i18n from '@/locales'
import {
  list,
  create,
  edit,
  del,
  existSiteName,
  getListBlurSiteId,
  getListBlurSiteName
} from '@/api/photoSys/bbsEncyclopedia/index'
import type { TableOptions } from '@/components/mTable/types'

import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'

//上传相关
import { createUrlValidator } from '@/utils/validators'
import { dialogOptions } from './data'
import { useModalsStore } from '@/stores/modalStore'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { getGameTypePlatformList } from '@/api/global'
import type { InternalRuleItem } from '@/components/mForm/rule'
import type { IBbsListData, IBbsListQueryParams } from '@/api/photoSys/bbsEncyclopedia/type'
import { truncateText } from '@/utils/dataFormat'

const { VITE_CDN_URL } = webConfigApi
const { VITE_DEPLOY_CONFIG } = import.meta.env

const modalsStore = useModalsStore()
const { t } = i18n.global as any

const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})
const tableRef = ref()
const queryRef = ref()

const rowAttrs = {
  gutter: '0',
  justify: 'center'
}
const uploadData = {
  fileType: 'img',
  uploadFrom: 'bbs/mainboard/icon',
  storageStyle: 6
}

const tableData = ref<IBbsListData[]>([])

const total = ref<number>(0)

const activeTab = ref('web_tab') //tab切换第一条

//新增弹窗
const addDialogVisible = ref(false)
//编辑弹窗

//loading 按钮
const isLoading = ref(false)
//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

const dialogFormRef = ref()

const initQueryForm = (): IBbsListQueryParams => {
  return {
    page: 1,
    size: 15,
    siteName: '',
    focusGameType: [],
    sortName: 'sort_num',
    sortOrder: 'ASC',
    siteId: '',
    isRecommended: undefined,
    isTop: undefined,
    isBloom: undefined
  }
}

const queryForm = reactive<IBbsListQueryParams>(initQueryForm())
const gameTypeList = ref<any[]>()
const currentSiteName = ref<string | undefined>('')
const initEditForm = () => {
  return {
    siteLogo: '',
    siteName: '',
    isRecommended: 'n',
    isHot: 'n',
    isSelected: 'n',
    isTop: 'n',
    isBloom: 'n',
    focusGameType: [],
    siteUrl1: '',
    siteUrl2: '',
    siteUrl3: '',
    siteUrl4: '',
    siteUrl5: '',
    siteDesc: '',
    memo: '',
    createTime: '',
    sortNum: 0
  }
}

// add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref(initEditForm())
const forGameTypeList = computed(() => {
  return gameTypeList.value?.map((item: any) => {
    return {
      ...item,
      type: 'option'
    }
  })
})
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
    width: 73
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
    minWidth: 200
  },
  {
    prop: 'createTime',
    label: '申请时间',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    dateName: 'createTime',
    columAttr: { minWidth: 170 }
  },
  {
    prop: 'isSwitch',
    label: '操作',
    slot: 'isSwitch',
    minWidth: 80
  }
]
const gameTypeOptions = {
  prop: 'focusGameType',
  label: '彩种:',
  type: 'slot'
}

const gameTypeOptions1 = {
  prop: 'focusGameType',
  label: '彩种:',
  type: 'slot',
  columnSpan: 10
}
const initAddDialogOptions = () => {
  return [
    dialogOptions.siteLogo,
    gameTypeOptions1,
    dialogOptions.isRecommended,
    dialogOptions.siteNameInput,
    dialogOptions.sortNum,
    dialogOptions.isHot,
    dialogOptions.siteUrl1,
    dialogOptions.isTop,
    dialogOptions.siteUrl2,
    dialogOptions.isSelected,
    dialogOptions.siteUrl3,
    dialogOptions.isBloom,
    dialogOptions.siteUrl4,
    dialogOptions.siteDesc,
    dialogOptions.siteUrl5,
    dialogOptions.memo
  ]
}

const initEditDialogOptions = () => {
  return [
    dialogOptions.siteLogo,
    dialogOptions.siteIdText,
    dialogOptions.isRecommended,
    dialogOptions.siteNameInput,
    dialogOptions.sortNum,
    dialogOptions.isHot,
    gameTypeOptions,
    dialogOptions.isTop,
    dialogOptions.siteUrl1,
    dialogOptions.isSelected,
    dialogOptions.siteUrl2,
    dialogOptions.isBloom,
    dialogOptions.siteUrl3,
    dialogOptions.createTime,
    dialogOptions.siteUrl4,
    dialogOptions.siteDesc,
    dialogOptions.siteUrl5,
    dialogOptions.memo
  ]
}
//新增时候需要的数据
const addDialogOptions = reactive(initAddDialogOptions())
const editDialogOptions = reactive(initEditDialogOptions())

const checkIsSiteName = (rule: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
  if (currentSiteName.value === value) {
    callback()
    return
  }
  checkSiteNameExists(value).then((res) => {
    if (res) {
      callback(new Error('网站名称已经存在'))
    } else {
      callback()
    }
  })
}

const handleSizeChange = (val: number) => {
  queryForm.size = val
  queryForm.page = 1
  fetchData()
}
const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

const checkSiteNameExists = async (siteName: string): Promise<boolean> => {
  let params: { siteName: string; siteId?: string | undefined }
  if (formMode.value === 'add') {
    params = { siteName }
  } else if (formMode.value === 'edit') {
    params = { siteName }
  } else {
    return false
  }
  try {
    const existOrNot = await existSiteName({ ...params })
    if (existOrNot.success) {
      if (existOrNot.data) {
        ElMessage.error('站点名称已存在')
        return true
      }
      return false
    }
    showErrorMessage(existOrNot)
    return true // Assume it exists if there's an error, to prevent proceeding
  } catch (error) {
    console.error('Error checking site ID:', error)
    ElMessage.error('检查站点名称时发生错误')
    return true // Assume it exists if there's an error, to prevent proceeding
  }
}
const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model

      const params = row
      if (imgUrl.value) {
        params.siteLogo = imgUrl.value
      } else if (!fileList.value.length) {
        params.siteLogo = null
      }
      if (formMode.value === 'edit') {
        params.createTime = lineFormData.value.createTime
      }
      if (params.sortNum == '' || !params.sortNum) {
        params.sortNum = '0'
      }
      try {
        // if (formMode.value === 'add') {
        //   const siteNameExists = await checkSiteNameExists(row.siteName)
        //   if (siteNameExists) {
        //     return // Exit if the site ID already exists
        //   }
        // }
        // if (formMode.value === 'edit') {
        //   // const siteNameExists = await checkSiteNameExists(row.siteName)
        //   // if (siteNameExists) {
        //   //   return // Exit if the site ID already exists
        //   // }
        // }

        const response = formMode.value === 'add' ? await create(params) : await edit(params)

        if (response.success) {
          ElMessage.success(formMode.value === 'add' ? '添加成功' : '更新成功')
          fetchData() // 保存成功后重新获取数据
          addDialogVisible.value = false
          fileList.value = []
          imgUrl.value = ''
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

/**
 * 状态变化处理函数，返回一个Promise以满足before-change的要求
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
    const response = await del({ siteId })
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
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '操作数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
}

//弹窗编辑按钮点击
const handleTableEdit = async (scope: any) => {
  formMode.value = 'edit'
  addDialogVisible.value = true
  fileList.value = []
  lineFormData.value = initEditForm()
  await nextTick()
  lineFormData.value = cloneDeep(scope.row)
  currentSiteName.value = lineFormData.value.siteName
  if (lineFormData.value.siteLogo) {
    const parts = lineFormData.value.siteLogo.split('/')
    const lastPart = parts[parts.length - 1]
    fileList.value.length < 1 &&
      fileList.value.push({ name: lastPart, url: VITE_CDN_URL + lineFormData.value.siteLogo })
  }
}

//弹窗添加按钮点击
const handleAddButton = () => {
  fileList.value = []
  formMode.value = 'add'
  addDialogVisible.value = true
  lineFormData.value = initEditForm()
  nextTick(() => {
    dialogFormRef.value.resetFields()
  })
}

//页面初始化获取数据
const fetchData = async (val?: Partial<IBbsListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IBbsListQueryParams = {
      ...queryForm,
      ...val
    }
    if (val) {
      Object.assign(queryForm, val)
    }

    const response = await list(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initQueryForm)
  fetchData()
}

const closeDialog = () => {
  addDialogVisible.value = false
  addDialogVisible.value = false
  fileList.value = []
  imgUrl.value = ''
}

//上传
const handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
}

const handleSuccess = (val: any) => {
  console.log('success')
  console.log(val)
  imgUrl.value = val.response?.path
}

const handleRemove = (val: any) => {
  fileList.value = []
  imgUrl.value = ''
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

//新增的时候的
const rulesAdd = ref({
  siteName: [
    { required: true, message: '站点名称不能为空', trigger: 'blur' },
    { validator: checkIsSiteName, trigger: 'blur', message: '模版名称已经存在' }
  ],
  focusGameType: [{ required: true, message: '彩种不能为空', trigger: 'blur' }],
  siteUrl1: [
    { required: true, message: 'URL1不能为空', trigger: 'blur' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ],
  siteUrl2: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl3: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl4: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl5: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  sortNum: [{ pattern: /^[0-9]\d*$/, message: '排序编号应为整数', trigger: 'blur' }]
})

onMounted(async () => {
  try {
    const response = await getGameTypePlatformList({ page: 1, size: 999 })
    if (response.success) {
      gameTypeList.value =
        response.data?.list?.map((item) => ({
          label: item.gameTypeName,
          value: item.gameType
        })) || []
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching game types:', error)
  }
  fetchData()
})
onBeforeMount(async () => {})
</script>

<style scoped lang="less">
// .dialogAdd {
//   :deep(.el-row) {
//     height: 72vh;
//     overflow: auto;
//   }
// }
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
.post-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  height: 24px;
}
.post-content p {
  // background-color: transparent;
  // width: 100%;
  // display: inline-block;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
  background-color: transparent;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.post-content span {
  background-color: transparent;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.switch-custom .el-switch__label.is-active {
  color: #303133;
}
</style>
