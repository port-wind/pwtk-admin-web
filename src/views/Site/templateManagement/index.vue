<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
        @keyup.enter="fetchData"
      >
        <el-form-item label="" prop="templateId">
          <AutoChoseTemplate v-model="queryForm.templateId" placeholder="模版ID" />
          <!-- <SelectTemplateId
            v-model="queryForm.templateId"
            :owner-user-id="queryForm.ownerUserId"
            id="templateId"
            :group="['templateId', 'templateName']"
            placeholder="模版ID"
            style="width: 160px"
          /> -->
        </el-form-item>
        <el-form-item label="" prop="templateName">
          <el-input v-model.trim="queryForm.templateName" maxlength="35" placeholder="模版名称" />
        </el-form-item>
        <el-form-item label="" prop="sketchCode">
          <OneAutocomplete
            placeholder="模版草图代码"
            :is-two-list="false"
            value-auto="sketchCode"
            name-auto="sketchCode"
            name="sketchCode"
            v-model:remoteName="queryForm.sketchCode"
            :httpFunc="reqSearchSketchCode"
          ></OneAutocomplete>
        </el-form-item>
        <el-form-item label="" prop="ownerUserId">
          <SelectUserIdAndNickname
            v-model="queryForm.ownerUserId!"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
            style="width: 160px"
          />
          <!-- <el-autocomplete
            clearable
            v-model="queryForm.ownerUserId"
            :fetch-suggestions="querySearchUserLogin"
            placeholder="所属用户 | ID"
            @select="handleSelectUserId"
            :trigger-on-focus="false"
          >
            <template #default="{ item }">
              <div class="autocomplete-item">
                <div>{{ item.loginId }}-{{ item.userId }}</div>
              </div>
            </template>
          </el-autocomplete> -->
        </el-form-item>
        <el-form-item label="" prop="isSysTemplate">
          <el-select v-model="queryForm.isSysTemplate" placeholder="系统模版" style="width: 160px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
          <el-button type="success" @click="openAddSiteDailog()">
            <!-- @click="addButton" -->
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <div class="custom-table">
      <el-table
        show-overflow-tooltip
        :data="tableList"
        v-loading="isLoading"
        stripe
        highlight-current-row
        style="width: 100%"
        :height="count(queryRef)"
      >
        <el-table-column fixed label="模版名称 | ID" key="" prop="" align="left" width="210">
          <template #default="{ row }">
            <el-link class="like-a" @click="openAddSiteDailog(row.templateId)" type="primary">
              {{ row.templateName }} | {{ row.templateId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="草图名称" key="" prop="" align="left" width="160">
          <template #default="{ row }">
            <el-link class="like-a" @click="sketchButton(row)" type="primary">
              {{ row.sketchName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="账户名称 | 账户昵称" key="" prop="" align="left" width="160">
          <template #default="{ row }">
            <el-link class="like-a" @click="showUserInfoDialog(row)">
              {{ row.loginId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="状态" key="templateStatus" prop="templateStatus" align="left" width="100">
          <template #default="{ row }">
            <el-dropdown trigger="click" size="small" @command="stateChange">
              <span class="el-dropdown-link">
                <el-tag v-if="row.templateStatus == 'y'" class="mx-1" type="primary">启用</el-tag>
                <el-tag v-else-if="row.templateStatus == 'm'" class="mx-1" type="warning">维护</el-tag>
                <el-tag v-else class="mx-1" type="info">关闭</el-tag>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="mx-1" :command="{ templateId: row.templateId, templateStatus: 'y' }">
                    <el-tag type="primary">启用</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ templateId: row.templateId, templateStatus: 'm' }">
                    <el-tag type="warning">维护</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ templateId: row.templateId, templateStatus: 'n' }">
                    <el-tag type="info">关闭</el-tag>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="页面组件" key="hasStatsCode" prop="hasStatsCode" align="left" width="80">
          <template #default="{ row }">
            <el-text class="mx-1" type="primary">
              <el-link type="primary" @click="viewCompButton(row)">查看</el-link>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="系统模版" width="80" key="isSysTemplate" prop="isSysTemplate" align="left">
          <template #default="{ row }">
            <el-text v-if="row.isSysTemplate == 'y'" class="mx-1" type="info">是</el-text>
            <el-text v-else class="mx-1" type="info">否</el-text>
          </template>
        </el-table-column>
        <el-table-column label="引用模版" key="" prop="" align="left" width="160">
          <template #default="{ row }">
            <template v-if="row.sysTemplateRef != '' && row.isSysTemplate === 'n'">
              <p>
                <span class="like-a" @click="templateButton(row)" type="primary">
                  {{ row.sysTemplateRefName }}
                </span>
              </p>
            </template>
            <template v-else></template>
          </template>
        </el-table-column>
        <el-table-column label="统计代码" key="hasStatsCode" prop="hasStatsCode" align="left" width="80">
          <template #default="{ row }">
            <el-text v-if="row.hasStatsCode == 'y'" class="mx-1" type="primary">
              <el-link @click="openCodeStaticDailog(row)" type="primary">查看</el-link>
            </el-text>
            <el-text v-else class="mx-1" type="info"></el-text>
          </template>
        </el-table-column>
        <el-table-column
          label="在线客服"
          key="onlineServiceCode"
          prop="onlineServiceCode"
          align="left"
          width="140"
        ></el-table-column>
        <el-table-column label="主题" key="theme" prop="theme" align="left" width="140"></el-table-column>
        <el-table-column
          label="登录方式"
          width="80"
          :show-overflow-tooltip="{ disabled: true }"
          key="loginStyle"
          prop="loginStyle"
          align="left"
        >
          <template #default="{ row }">
            {{ selectedSupportLoginLabel(row.loginStyle) }}
          </template>
        </el-table-column>
        <el-table-column
          label="第三方登录方式"
          width="140"
          :show-overflow-tooltip="{ disabled: true }"
          key="thirdLoginStyle"
          prop="thirdLoginStyle"
          align="left"
        >
          <template #default="{ row }">
            {{ selectedThridLoginLabel(row.thirdLoginStyle) }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          :show-overflow-tooltip="{ disabled: true }"
          key="memo"
          prop="memo"
          width="140"
          align="left"
        ></el-table-column>

        <el-table-column width="120px" label="创建时间" key="createTime" prop="createTime" align="left">
          <template #default="{ row }">
            {{ unitFormatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column width="220px" label="操作" key="templateId" prop="templateId" align="left">
          <template #default="{ row }">
            <el-button type="primary" @click="openAddSiteDailog(row.templateId)" size="small">编辑</el-button>
            <el-button type="default" @click="openCopyTemplateToOther(row)" size="small">复制</el-button>

            <el-popconfirm
              class="box-item"
              title="你确定要删除吗？"
              placement="top-start"
              @confirm="deleteTemplate(row.templateId)"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
      class="tabs-dialog"
      v-model="isSketchForm"
      destroy-on-close
      draggable
      overflow
      :close-on-click-modal="false"
      @close="closeDialogView"
    >
      <el-tabs class="demo-tabs m_tabs" v-model="activeName" @tab-click="handleTabClick">
        <SketchInfo
          :is-edit="true"
          :formInfo="addForm"
          @close-button="closeButton"
          :sketch-code="sketchCode"
          :sketch-name="sketchName"
          :is-display-handle-button="false"
        ></SketchInfo>
        <SketchPath
          v-if="modalsStore.templateInfoModal.modalData?.isSketchPathVisible"
          :is-edit="true"
          :formInfo="addForm"
          @close-button="closeButton"
          :sketch-code="sketchCode"
          :sketch-name="sketchName"
        ></SketchPath>
      </el-tabs>
    </el-dialog>

    <!--  统计代码panel -->
    <CodeStaticDailog ref="CodeStaticDailogRef" />
    <!-- 用户信息 panel 弹出层 -->
    <UserListComponent></UserListComponent>
    <!-- new 弹出层 添加模版, 更新模版 -->
    <AddTemplateDailog ref="AddSiteDailogRef" v-if="unMountDialog" @onClose="onClose" />
    <el-dialog v-model="copyDialogVisible" title="复制模版" width="400px" :close-on-click-modal="false">
      <el-form :model="copyForm" :rules="rulesCopyForm" ref="copyFormRef" label-width="auto">
        <el-form-item label="当前模版信息：">
          <div>
            ID：
            <el-text>{{ copyTemplateId }}</el-text>
          </div>
          <div>
            名称：
            <el-text>{{ copyTemplateName }}</el-text>
          </div>
        </el-form-item>
        <el-form-item label="新模版名称" prop="templateName">
          <!-- <el-input v-model="copyTemplateName" placeholder="请输入新模版名称" size="small" /> -->
          <SelectTemplate v-model="targetTemplateId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="copyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCopyTemplate" :disabled="!copyTemplateName">确定</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import i18n from '@/locales'
const { t } = i18n.global
import {
  reqTemplateList,
  reqTemplateUpdateStatus,
  reqGetALLSketchList,
  reqIsTemplateIdExit,
  reqIsTemplateNameExit,
  reqSearchSketchCode,
  reqSketchInfoBySketchCode,
  reqTemplateInfoByTemplateId
} from '@/api/site/index'
import { reqUserListFilter } from '@/api/user/index'
import count from '@/utils/tableHeight'
const activeName = ref('sketch')
import { watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useOptions, optionsSupportLogin, optionsThirdLogin } from '@/const/options'
import SketchPath from '@/views/Site/sketchManagement/components/sketchPath.vue'
import OneAutocomplete from '@/components/oneAutocomplete/index.vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import router from '@/router'
import { sessionCache } from '@/hooks/useSession'
import { useModalsStore } from '@/stores/modalStore'
import { copyTemplateById, delTemplateComponent, getTemplateComponent } from '@/api/webgw/template'

import type { ITemplateListQueryParams, ITemplateListData } from '@/api/site/type'
import AddTemplateDailog from '@/views/Site/templateManagement/components/addTemplateDailog.vue'
import CodeStaticDailog from '@/views/Site/templateManagement/components/codeStaticDailog.vue'
const { formatData: selectedSupportLoginLabel } = useOptions(optionsSupportLogin)
const modalsStore = useModalsStore()
const activeTabTemplateForm = ref<string>('tab1')
const CodeStaticDailogRef = ref()
const unMountDialog = ref<boolean>(false)
const AddSiteDailogRef = ref()
const openAddSiteDailog = (templateId?: string) => {
  unMountDialog.value = true
  nextTick(() => {
    AddSiteDailogRef.value.openDailog(templateId)
  })
}

const openCodeStaticDailog = (row) => {
  CodeStaticDailogRef.value.openDailog(row.templateId)
}

const onClose = () => {
  fetchData()
}

const copyDialogVisible = ref(false)
const copyForm = ref({})
const rulesCopyForm = ref({})
const copyTemplateId = ref('')
const copyTemplateName = ref('')
const targetTemplateId = ref('')

// 打开复制弹窗
const openCopyTemplateToOther = (row) => {
  copyTemplateId.value = row.templateId
  copyTemplateName.value = row.templateName
  copyDialogVisible.value = true
}

// 确认复制（此处仅演示，实际API调用请补充）
const handleCopyTemplate = async () => {
  try {
    isLoading.value = true
    console.log('targetTemplateId', targetTemplateId.value)

    const res = await copyTemplateById({
      templateId: copyTemplateId.value,
      copyToTemplateId: targetTemplateId.value
    })
    if (res.success) {
      ElMessage.success('复制成功')
      copyDialogVisible.value = false
      fetchData()
    } else {
      ElMessage.error(res.errMessage)
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const deleteTemplate = async (templateId) => {
  console.log(templateId)
  // await delTemplateComponent({
  //   templateId: templateId
  // })
  // fetchData()
}
const emit = defineEmits(['closeEvent'])
const handleTabClick = (tab, e) => {
  if (tab.props.name == 'sketchPath') {
    if (sketchCode) {
      modalsStore.setModalData('templateInfoModal', {
        sketchCode: sketchCode,
        isSketchPathVisible: true
      })
    }
    if (sketchName) {
      modalsStore.setModalData('templateInfoModal', {
        ...modalsStore.templateInfoModal.modalData,
        sketchName: sketchName
      })
    }
  }
}
const activeTabCodeStatistics = ref<string>('first')
const canHandleSubmit = computed(() => modalsStore.templateInfoModal.modalData?.canHandleSubmit || false)
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  queryForm.ownerUserId = item.userId
}
const closeTabs = (isNeedRefresh = true) => {
  modalsStore.setModalData('templateInfoModal', {
    ...modalsStore.templateInfoModal.modalData,
    canHandleSubmit: false,
    isSketchPathVisible: false,
    isVisible: false
  })
  modalsStore.hideModal('templateInfoModal')
  distinguish.value = false
  isTabs.value = false
  Object.assign(addForm.value, initForm())
  tempInfo.value = {}
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  if (canHandleSubmit.value) {
    if (isNeedRefresh) {
      pageObj.value.page = 1
    }
  }
  tempInfo.value = null
  emit('closeEvent')
}
const { formatData: selectedThridLoginLabel } = useOptions(optionsThirdLogin)

const initQueryForm = (): ITemplateListQueryParams => ({
  page: 1,
  size: 15,
  ownerName: '',
  templateId: '',
  templateName: '',
  sketchCode: '',
  isSysTemplate: 'L',
  ownerUserId: '',
  sortOrder: 'DESC',
  sortName: 'create_time'
})

const showUserInfoDialog = (row) => {
  userId.value = row.ownerUserId
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: userId.value
  })
  modalsStore.showModal('userInfoModal')
}
const initForm = () => ({
  templateId: '',
  templateName: '',
  sketchCode: '',
  sysTemplateRef: '',
  isSysTemplate: 'L',
  ownerUserId: '',
  onlineServiceCode: '',
  theme: '',
  loginStyle: [],
  thirdLoginStyle: [],
  memo: '',
  templateStatus: 'y',
  hasStatsCode: 'y',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  cdnUrl: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})
const initStateInfo = () => ({
  websiteStatus: '',
  statsCodeInit: '',
  statsCodeJsUrl: ''
})
const options = [
  { value: 'L', label: '全部' },
  { value: 'y', label: '是' },
  { value: 'n', label: '否' }
]
const distinguish = ref(false)
const pageObj = ref(initPageObj())
const isViewForm = ref(false)
const isSketchForm = ref<boolean>(false)
const isTemplateForm = ref<boolean>(false)
const isTabs = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const total = ref<number>(0)
const tableList = ref<ITemplateListData[]>([])
const addForm: any = ref(initForm())
const viewForm = ref({})
const queryForm = reactive<ITemplateListQueryParams>(initQueryForm())
const queryRef = ref()
const optionsAllSketch: any = ref([])
const stateInfo: any = ref(initStateInfo())
const sketchInfo: any = ref({})
const tempInfo = ref<any>()
const openTemplateDetail = ref(false)
const userId = ref<string>('')

const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = /^[A-Za-z0-9-_]+$/
  console.log(',,,', !pwdRegex.test(value))
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}
const checkIsTemplateId = async (rule: any, value: any, callback: any) => {
  if (distinguish.value) {
    callback()
  } else {
    let templateId = addForm.value.templateId
    let res = await reqIsTemplateIdExit({
      templateId
    })
    if (res.data) {
      callback(new Error('模版ID已经存在'))
    } else {
      callback()
    }
  }
}

const checkIsTemplateName = async (rule: any, value: any, callback: any) => {
  let templateId = ''
  let templateName = ''
  if (distinguish.value) {
    templateId = addForm.value.templateId
    templateName = addForm.value.templateName
  } else {
    templateId = ''
    templateName = addForm.value.templateName
  }
  let res = await reqIsTemplateNameExit({
    templateId,
    templateName
  })

  if (res.data.length != 0) {
    callback(new Error('模版名称已经存在'))
  } else {
    callback()
  }
}
const rulesAddFrom = ref({
  templateId: [
    { required: true, message: '请输入草图编码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur', message: '请输入英文,数字,符号-,符号_组成的值' },
    { validator: checkIsTemplateId, trigger: 'blur' }
  ],
  sketchCode: [{ required: true, message: '请选择草图代码', trigger: 'blur' }],
  templateName: [
    { required: true, message: '请输入模版名称', trigger: 'blur' },
    { validator: checkIsTemplateName, trigger: 'blur' }
  ]
})
let backUpOwnerUserIdList: string[] = []
const initDefaultPageObj = () => ({ size: 100, page: 1 })
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response = await reqUserListFilter({
      userId: queryString,
      filterType: 't',
      ...initDefaultPageObj()
    })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId,
        loginId: item.loginId,
        userId: item.userId
      }))
      backUpOwnerUserIdList = response.data.list.map((item: any) => item.userId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
async function fetchData() {
  try {
    const query: ITemplateListQueryParams = {
      ...queryForm
    }
    let res = await reqTemplateList(query)
    tableList.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (err) {
  } finally {
    isLoading.value = false
  }
}
const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}
const addButton = () => {
  tempInfo.value = {}
  modalsStore.setModalData('templateInfoModal', {
    templateId: '',
    showOtherTabs: false,
    templateName: '',
    canHandleSubmit: true
  })
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  modalsStore.showModal('templateInfoModal')
}
const handleEdit = (row) => {
  modalsStore.setModalData('templateInfoModal', {
    ...modalsStore.templateInfoModal.modalData,
    ...row
  })
  tempInfo.value = row
  openTemplateDetail.value = true
}

const stateChange = (row) => {
  let { templateId, templateStatus } = row
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  }).then(() => {
    editStateInfo({ templateId, templateStatus })
  })
}

const editStateInfo = async (data) => {
  try {
    let res = await reqTemplateUpdateStatus({ ...data })
    if (res.success) {
      ElMessage({
        showClose: true,
        message: t('table.controls') + t('errorCode.0'),
        type: 'success'
      })
      fetchData()
    } else {
      ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
  }
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

//获取所有的骨架code列表
const getAllSketchList = async () => {
  try {
    const res = await reqGetALLSketchList()
    optionsAllSketch.value = res.data
  } catch (err) {
    console.log(err)
  }
}
let sketchCode = ''
let sketchName = ''
const sketchButton = (row) => {
  sketchCode = row.sketchCode
  sketchName = row.sketchName
  isSketchForm.value = true
}

const templateButton = async (row) => {
  modalsStore.setModalData('templateInfoModal', {
    canHandleSubmit: false,
    showOtherTabs: true,
    isSysTemplateRef: true,
    templateId: row.sysTemplateRef,
    isVisible: true
  })
  modalsStore.setActiveTab('templateInfoModal', 'tab1')
  modalsStore.showModal('templateInfoModal')
}
const getSketchInfoBySketchCode = async (val) => {
  sketchInfo.value = {}
  let res = await reqSketchInfoBySketchCode({ sketchCode: val })
  if (res.success) {
    Object.assign(sketchInfo.value, res.data)
  } else {
    showErrorMessage(res)
  }
}

const closeButton = () => {
  closeTabs(false)
  // fetchData({
  //   ...Object.assign(queryForm, initQueryForm()),
  //   ...pageObj.value
  // })
}
/**
 * Open a route in a new tab.
 *
 * @param {string} route The route path.
 * @param {Record<string, string>} params The route query parameters.
 */
function openInNewTab(route: string, params: Record<string, string>) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  window.open(routeData.href, '_blank')
}

const viewCompButton = (row: ITemplateListData) => {
  openInNewTab('/webVisionBuilderTemplate', { templateId: row.templateId })
  // sessionCache.setCache('templateRowInfo', row)
  // const page = 1,
  //   size = 1
  // getTemplateComponent({ page, size, templateId: row.templateId })
  //   .then((res) => {
  //     if (res.success) {
  //       if (res.data.list.length) {
  //         const templateId = res.data.list[0].templateId
  //         openInNewTab('/webVisionTemplate', { templateId })
  //       } else {
  //         openInNewTab('/webVisionTemplate', { templateId: row.templateId })
  //       }
  //     } else {
  //       showErrorMessage(res)
  //     }
  //   })
  //   .catch((err) => {
  //     console.log('err', err)
  //   })
}

const closeDialogView = () => {
  isViewForm.value = false
  viewForm.value = {}
  activeName.value = 'sketch'
}
const handTabs = (row) => {
  isTabs.value = true
  activeTabCodeStatistics.value = 'first'
  reqTemplateInfoByTemplateId({ templateId: row.templateId })
    .then((res) => {
      if (res.success) {
        Object.assign(stateInfo.value, res.data)
      } else {
        showErrorMessage(res)
      }
    })
    .catch((err) => {
      console.log('err', err)
    })
}

watch(
  () => [queryForm.page, queryForm.size],
  (newVal) => {
    fetchData()
  }
)

onMounted(() => {
  fetchData()
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

.checked {
  .el-checkbox {
    width: 100px;
  }
}

.code-box {
  margin-bottom: 2rem;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .code-style {
    font-size: 12px;
    color: #000;
    background-color: #f0f0f0;
    padding: 2px 4px;
    border-radius: 4px;
  }
}

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
