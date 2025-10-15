<template>
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="custom-el-form no-rule" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="sketchCode">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.sketchCode"
            maxlength="10"
            placeholder="草图代码"
          />
        </el-form-item>
        <el-form-item label="" prop="sketchName">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.sketchName"
            maxlength="20"
            placeholder="草图名称"
          />
        </el-form-item>
        <el-form-item label="" prop="sketchType">
          <el-select v-model="queryForm.sketchType" placeholder="类型" style="width: 165px">
            <el-option v-for="item in optionsSketch" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="langCodes">
          <el-select
            v-model="queryForm.langCodes"
            multiple
            placeholder="语言"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
            style="width: 165px"
          >
            <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="areaCodes">
          <el-select
            v-model="queryForm.areaCodes"
            multiple
            placeholder="地区"
            :max-collapse-tags="1"
            collapse-tags
            collapse-tags-tooltip
            style="width: 140px"
          >
            <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="searchButton({ ...queryForm, ...pageObj })" :loading="isLoading">
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
          <el-button type="success" @click="addButton">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <div class="account-table">
      <el-table
        v-loading="isLoading"
        stripe
        highlight-current-row
        :data="tableList"
        style="width: 100%"
        :height="count(queryRef)"
      >
        <el-table-column fixed label="草图名称 | 代码" align="left" width="300" key="" prop="">
          <template #default="{ row }">
            <div class="like-a text-ellipsis" @click="handleEdit(row)">{{ row.sketchName }} | {{ row.sketchCode }}</div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120" align="left" key="" prop="">
          <template #default="{ row }">
            <div class="text-ellipsis">
              {{ formatSketch(row.sketchType) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="语言"
          width="200"
          :show-overflow-tooltip="{ disabled: true }"
          align="left"
          key="langCodes"
          prop="langCodes"
        >
          <template #default="{ row }">
            <div class="text-ellipsis">{{ formatLanguageData(row.langCodes) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="地区"
          width="200"
          :show-overflow-tooltip="{ disabled: true }"
          align="left"
          key="areaCodes"
          prop="areaCodes"
        >
          <template #default="{ row }">
            <div class="text-ellipsis">{{ formatAreaData(row.areaCodes) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          align="left"
          :show-overflow-tooltip="{ disabled: true }"
          key="registermemoCount"
          prop="memo"
        >
          <template #default="{ row }">
            <div class="text-ellipsis">{{ row.memo }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width="100" key="sketchStatus" prop="sketchStatus">
          <template #default="scope">
            <template v-if="scope.row.sketchStatus == 'n'">
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">关闭</span>
                <el-switch
                  v-model="scope.row.sketchStatus"
                  active-value="y"
                  inactive-value="n"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
            <template v-else>
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">启用</span>
                <el-switch
                  v-model="scope.row.sketchStatus"
                  :active-value="'y'"
                  :inactive-value="'n'"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column width="120px" label="创建时间" align="left" key="createTime" prop="createTime">
          <template #default="{ row }">
            <div class="text-ellipsis">
              {{ unitFormatDate(row.createTime) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageObj.page"
        v-model:page-size="pageObj.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      draggable
      overflow
      destroy-on-close
      v-model="isForm"
      class="tabs-dialog"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-tabs class="demo-tabs m_tabs" v-model="activeName" @tab-click="handleTabClick">
        <SketchInfo
          :is-edit="distinguish"
          :formInfo="addForm"
          @cancel="closeButton(true)"
          @close-button="closeButton"
          :sketch-code="sketchCode"
          :sketch-name="sketchName"
          @update:active-name="updateActiveName"
          :is-display-handle-button="true"
        ></SketchInfo>
        <SketchPath
          v-if="modalsStore.templateInfoModal.modalData?.isSketchPathVisible"
          :is-edit="distinguish"
          :formInfo="addForm"
          @cancel="closeButton"
          @close-button="closeButton"
          :sketch-code="sketchCode"
          :sketch-name="sketchName"
          @update:active-name="updateActiveName"
        ></SketchPath>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import i18n from '@/locales'
import { firstTabName } from './components/data'
import SketchPath from '@/views/Site/sketchManagement/components/sketchPath.vue'
import { reqSketchList, reqSketchCodeDelete } from '@/api/site/index'
import count from '@/utils/tableHeight'
import { useOptions, optionsLang, optionsArea, optionsSketch } from '@/const/options'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import SketchInfo from './components/sketchInfo.vue'
import { useModalsStore } from '@/stores/modalStore'

const { t } = i18n.global as any

const { formatData: formatLanguageData } = useOptions(optionsLang)
const activeName = ref('sketch')
const updateActiveName = (newName: string) => {
  activeName.value = newName
}
let sketchCode = ''
let sketchName = ''
const { formatData: formatAreaData } = useOptions(optionsArea)
const { formatSketch } = useOptions(optionsSketch)
const initQueryForm = () => ({
  sketchCode: '',
  sketchType: '',
  sketchName: '',
  langCodes: [],
  areaCodes: [],
  sortOrder: 'DESC',
  sortName: 'create_time'
})
const initAddForm = () => ({
  sketchCode: '',
  sketchName: '',
  memo: '',
  langCodes: [],
  areaCodes: [],
  sketchStatus: 'y',
  sketchType: 'nav'
})
const initPageObj = () => ({
  page: 1,
  size: 15
})
const distinguish = ref(false)
const pageObj = ref(initPageObj())
const isForm = ref(false)
const isLoading = ref(false)
const total = ref(0)
const tableList: any = ref([])
const addForm = ref(initAddForm())
const queryForm = ref(initQueryForm())
const queryRef = ref()
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  isLoading.value = true
  try {
    const res = await reqSketchList(vals)
    tableList.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (err) {
  } finally {
    isLoading.value = false
  }
}
const resetButton = () => {
  Object.assign(queryForm.value, initQueryForm())
  searchButton({
    ...Object.assign(queryForm.value, initQueryForm()),
    ...Object.assign(pageObj.value, initPageObj())
  })
}
const isAddDialog = ref(false)
const addButton = () => {
  isAddDialog.value = true
  distinguish.value = false
  isForm.value = true
  activeName.value = 'sketch'
}
const modalsStore = useModalsStore()
const handleEdit = (row) => {
  sketchCode = row.sketchCode
  sketchName = row.sketchName
  isAddDialog.value = false
  distinguish.value = true
  isForm.value = true
  const { createTime, ...rest } = row
  modalsStore.setModalData('templateInfoModal', {
    sketchCode: row.sketchCode,
    sketchName: row.sketchName,
    isSketchPathVisible: true,
    isVisible: true
  })
  updateActiveName(firstTabName)
  isForm.value = true
  distinguish.value = true
  Object.assign(addForm.value, { createTime, ...rest })
}
const handleSizeChange = (val) => {
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}
const switchChange = (event, row, index) => {
  if (row.sketchStatus == 'y') {
    tableList.value[index].sketchStatus = 'n'
  } else {
    tableList.value[index].sketchStatus = 'y'
  }
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      reqSketchCodeDelete({
        sketchCode: row.sketchCode,
        sketchStatus: row.sketchStatus == 'n' ? 'y' : 'n'
      }).then((res) => {
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          searchButton({ ...queryForm.value, ...pageObj.value })
        } else {
          showErrorMessage(res)
        }
      })
    })
    .catch((err) => {
      console.error('err', err)
    })
}
const closeDialog = () => {
  modalsStore.hideModal('templateInfoModal')
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  modalsStore.setModalData('templateInfoModal', {
    ...modalsStore.templateInfoModal.modalData,
    isSketchPathVisible: false,
    isVisible: false
  })
  isForm.value = false
  distinguish.value = false
  Object.assign(addForm.value, initAddForm())
}
const closeButton = (isEdit: boolean) => {
  console.log(isEdit)

  isForm.value = false
  distinguish.value = false
  Object.assign(addForm.value, initAddForm())
  if (!isEdit) {
    pageObj.value.page = 1
    pageObj.value.size = 15
  }
  searchButton({
    ...Object.assign(queryForm.value, initQueryForm()),
    ...pageObj.value
  })
}
const handleTabClick = (tab, e) => {
  if (tab.props.name == 'sketchPath') {
    if (sketchCode) {
      modalsStore.setModalData('templateInfoModal', {
        sketchCode,
        isSketchPathVisible: true,
        isVisible: true
      })
    }
    if (sketchName) {
      modalsStore.setModalData('templateInfoModal', {
        ...modalsStore.templateInfoModal.modalData,
        sketchName
      })
    }
  }
}
onMounted(() => {
  searchButton()
})
</script>

<style scoped lang="less">
.account-table {
  .account-role {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.secret-key {
  display: flex;

  .one {
    .onee {
      width: 200px;
      margin-right: 20px;
    }
  }
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
:deep(.el-pagination) {
  margin-bottom: 10px;
}
</style>
