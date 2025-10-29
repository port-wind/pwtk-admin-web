<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1 })"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="" prop="componentId">
          <el-input v-model.trim="queryForm.componentId" maxlength="64" placeholder="组件ID" style="width: 160px" />
        </el-form-item>
        <el-form-item label="" prop="componentType">
          <el-select v-model="queryForm.componentType" placeholder="组件类型" style="width: 130px">
            <el-option label="全部" value="L" />
            <el-option
              v-for="item in optionsAllCompType"
              :key="item.componentId"
              :label="item.componentType"
              :value="item.componentType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="componentName">
          <el-input v-model.trim="queryForm.componentName" maxlength="64" placeholder="组件名称" style="width: 160px" />
        </el-form-item>
        <el-form-item label="" prop="sketchCodeList">
          <SelectSketchCode v-model="queryForm.sketchCodeList" :clearable="false" style="min-width: 160px" />
        </el-form-item>

        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="状态" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="有效" value="y" />
            <el-option label="无效" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="isView">
          <el-select v-model="queryForm.isView" placeholder="可见" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="是" value="y" />
            <el-option label="否" value="n" />
          </el-select>
        </el-form-item>
        <!-- <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection> -->
        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1 })" :loading="isLoading" :icon="Search">查询</el-button>
          <el-button type="primary" @click="resetButton" plain :icon="Refresh">重置</el-button>
          <el-button type="success" :icon="Plus" @click="() => openDialogAddNewComponent()">新增</el-button>
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
        <template #componentName="{ scope }">
          <el-link type="primary" :underline="false" @click="() => openDialogAddNewComponent(scope.row)">
            <el-text class="w-200px like-a" truncated>
              {{ scope.row.componentName }}
            </el-text>
          </el-link>
        </template>
        <template #button="{ scope }">
          <el-text type="primary">
            <el-link type="primary" class="like-a" @click="viewButton(scope.row)">查看</el-link>
          </el-text>
        </template>
        <template #pageCode="{ scope }">
          {{ scope.row.pageCode }}
        </template>
        <template #sketchCode="{ scope }">
          {{ scope.row.sketchCodeList }}
        </template>
        <template #status="{ scope }">
          <p v-if="scope.row.status == 'y'">有效</p>
          <p v-else>无效</p>
        </template>
        <template #isView="{ scope }">
          <p v-if="scope.row.isView == 'y'">是</p>
          <p v-else>否</p>
        </template>
        <!-- <template #deleteItem="{ scope }">
          <el-popconfirm class="box-item" @confirm="handleDelete(scope.row)" title="确定要删除吗" placement="top">
            <template #reference>
              <el-button type="danger" size="small" :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template> -->
        <template #memo="{ scope }">
          <SimplePopover v-if="scope.row.memo" v-model="scope.row.memo" />
        </template>
      </m-table>
    </section>
    <AddPageComponentDialog ref="AddPageComponentDialogRef" @onClose="handleClose" />
  </section>
</template>
<script setup lang="ts">
import { reqSysCompList, reqGetAllCompType } from '@/api/site/sysComponent/index'
import { reqGetALLSketchList } from '@/api/site/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { options } from '@/views/Site/componentBase/data'
import ExpandableSection from '@/components/expandIcon/index.vue'
import { Search, Refresh, Plus, Delete } from '@element-plus/icons-vue'
import _Options from '@/const/options.json'
import { useRouter } from 'vue-router'
import { isArray } from 'lodash-es'
import type { TableData } from '@/api/webgw/sysCompent/types'
import { deleteSysComp } from '@/api/site/sysComponent'
import type {
  IReqGetAllCompTypeData,
  IReqSysCompListData,
  IReqSysCompListQueryParams
} from '@/api/site/sysComponent/type'
import type { IReqGetALLSketchListData } from '@/api/site/type'
import type { FormRules } from 'element-plus'
import AddPageComponentDialog from '@/views/Site/componentBase/addPageComponentDialog.vue'

const router = useRouter()
const AddPageComponentDialogRef = ref<InstanceType<typeof AddPageComponentDialog>>()
const openDialogAddNewComponent = (row?: IReqSysCompListData) => {
  if (AddPageComponentDialogRef.value) {
    AddPageComponentDialogRef.value.open(row)
  }
}

const initQueryForm = (): IReqSysCompListQueryParams => ({
  page: 1,
  size: 15,
  componentId: '',
  componentName: '',
  componentType: 'L',
  sketchCodeList: '',
  configParamJsonOff: '',
  status: 'L',
  isView: 'L',
  pageCode: '',
  sortName: 'component_id',
  sortOrder: 'DESC'
})

const tableData = ref<IReqSysCompListData[]>([])
const total = ref<number>(0)
const isLoading = ref(false)
const queryRef = ref()
// const isExpanded = ref(false)
const queryForm = reactive<IReqSysCompListQueryParams>(initQueryForm())
const optionsAllSketch = ref<IReqGetALLSketchListData[]>()
const optionsAllCompType = ref<IReqGetAllCompTypeData[]>()

const rules = reactive<FormRules>({})

const handleDelete = (row) => {
  deleteSysComp({ componentId: row.componentId })
    .then((res) => {
      if (res.success) {
        ElMessage.success('删除成功')
        fetchData()
      }
    })
    .catch((err) => {
      console.error('err', err)
    })
}

//搜索
async function fetchData(vals?: Partial<IReqSysCompListQueryParams>) {
  isLoading.value = true
  try {
    const query: IReqSysCompListQueryParams = {
      ...queryForm,
      ...vals
    }

    if (vals) {
      Object.assign(queryForm, vals)
    }

    if (query.componentType === 'L') {
      delete query.componentType
    }
    if (query.status === 'L') {
      delete query.status
    }
    if (query.isView === 'L') {
      delete query.isView
    }

    const res = await reqSysCompList(query)
    if (res.success) {
      tableData.value = res.data.list
      total.value = parseInt(res.data.total)
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}

function openInNewTab(route: string, params: Record<string, string>) {
  // router.push({
  //   path: route,
  //   query: params
  // })

  // 打开网页
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}

const viewButton = (row: TableData) => {
  const componentId = row.componentId
  openInNewTab('/webVisionBuilder', { componentId })
}

const openComponent = (row: TableData) => {
  console.log('🚀 ~ openComponent ~ row:', row)
  openInNewTab('/webVisionTest', { componentId: row.componentId })
}

const handleSizeChange = (val) => {
  queryForm.size = val
  fetchData({ page: 1 })
}
const handleCurrentChange = (val) => {
  queryForm.page = val
  fetchData()
}

function transformString(originalStr) {
  // 获取前三位和后四位
  let prefix = originalStr.slice(0, 3)
  let suffix = originalStr.slice(-4)

  // 中间用三个星号替代
  let transformedStr = `${prefix}***${suffix}`

  return transformedStr
}

const handleClose = () => {
  fetchData()
}

onMounted(() => {
  getAllSketchList()
  getAllCompTypeList()
  fetchData()
})

//获取所有的骨架code列表
const getAllSketchList = async () => {
  let res = await reqGetALLSketchList()
  if (res.success) {
    optionsAllSketch.value = res.data
  }
}
//获取所有的骨架code列表
const getAllCompTypeList = async () => {
  let res = await reqGetAllCompType({ page: 1, size: 200 })
  if (res.success) {
    optionsAllCompType.value = res.data.list
  }
}
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
</style>
