<template>
  <div id="sys_roles">
    <div class="search" ref="tableRef">
      <el-form :inline="true" :model="queryForm" class="search_left" @keyup.enter="fetchData">
        <el-form-item label="操作人" prop="username">
          <el-input
            style="width: 120px; margin-right: 10px"
            v-model="queryForm.username"
            :placeholder="t('table.operator')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            @change="changeDate"
            v-model="queryForm.dateRange"
            range-separator="-"
            type="datetimerange"
            unlink-panels
            :disabled-date="disabledDate"
            :start-placeholder="t('input.timeon')"
            :end-placeholder="t('input.EndTime')"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">
            {{ t('button.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableList" border style="width: 100%" stripe highlight-current-row :height="count(tableRef)">
        <el-table-column label="操作人" align="left" #default="scope">
          <div>
            {{ scope.row.accountName }}
            <copy :content="scope.row.accountName" title="操作人" />
          </div>
        </el-table-column>
        <el-table-column prop="path" :label="t('table.operationPath')" align="left"></el-table-column>
        <el-table-column
          prop="params"
          :label="t('table.operationParameter')"
          align="left"
          min-width="400"
        ></el-table-column>
        <el-table-column prop="interfaceDesc" :label="t('table.operationInstructions')" align="left"></el-table-column>
        <el-table-column prop="ip" label="IP" align="left"></el-table-column>
        <el-table-column width="160px" prop="createTime" :label="t('table.TIME')" align="left"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="changeSize"
        @current-change="changeCurrent"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import i18n from '@/locales'
const { t } = i18n.global as any
import { operationLogList } from '@/api/system/index'
import timezone from '@/utils/timezone'
// 计算表格高度
import count from '@/utils/tableHeight'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
import { IOperationLogListData, IOperationLogListQueryParams } from '@/api/system/type'
const tableRef = ref(null)

interface IListExtend extends IOperationLogListQueryParams {
  dateRange: number[] | string[]
}
interface IListData extends IOperationLogListData {
  number: number
}

const initQueryForm = (): IListExtend => ({
  //分页参数
  dateRange: [],
  username: '',
  beginTime: undefined,
  endTime: undefined,
  size: 15,
  page: 1
})

const queryForm = reactive(initQueryForm())
const total = ref(0)

// 切换每页展示条数
const changeSize = (data) => {
  queryForm.size = data
}
// 切换页面
const changeCurrent = (data) => {
  queryForm.page = data
}
//日期禁用
const disabledDate = (time) => {
  return time.getTime() > Date.now()
}

const tableList = ref<IListData[]>([]) // 操作日志数据
// 获取操作日志
const fetchData = () => {
  let beginTime: any = ''
  let endTime: any = ''

  if (queryForm.dateRange && queryForm.dateRange.length > 0) {
    beginTime = new Date(timezone(queryForm.dateRange[0] as number, 'Asia/Shanghai')).getTime()
    endTime = new Date(timezone(queryForm.dateRange[1] as number, 'Asia/Shanghai')).getTime()
  }
  let params: any = {
    username: queryForm.username,
    page: queryForm.page,
    size: queryForm.size
  }
  if (beginTime) {
    params.beginTime = beginTime
    params.endTime = endTime
  }
  // console.log(params);
  operationLogList(params).then((res) => {
    if (res.success && res.data) {
      total.value = parseInt(res.data.total)
      if (res.data.list) {
        // console.log(res.data.list)
        tableList.value = (res.data.list as IListData[]).map((item, index) => {
          item.number = queryForm.size * (queryForm.page - 1) + index + 1
          item.createTime = unitFormatDate(item.createTime, 'yyyy-MM-dd HH:mm:ss')!
          return item
        })
      } else {
        tableList.value = []
      }
    }
  })
}

// 切换日期
const changeDate = (data) => {
  if (data) {
    queryForm.dateRange = [
      //@ts-ignore
      unitFormatDate(data[0], 'yyyy-MM-dd HH:mm:ss'),
      //@ts-ignore
      unitFormatDate(data[1], 'yyyy-MM-dd HH:mm:ss')
    ]
  } else {
    queryForm.dateRange = []
  }
  console.log('🚀 ~ changeDate ~ data:1111222121212', queryForm.dateRange)
  fetchData()
}

onMounted(() => {
  fetchData() //获取操作日志列表
})

watch(
  () => [queryForm.page, queryForm.size, queryForm.beginTime, queryForm.endTime],
  (newVal, oldVal) => {
    fetchData()
  }
)
</script>
<style lang="less" scoped>
#sys_roles {
  .search {
    margin-bottom: 10px;

    > div {
      margin-right: 10px;
    }

    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
