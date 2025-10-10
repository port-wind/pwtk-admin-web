<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1 })"
        ref="formRef"
      >
        <el-form-item label="" prop="announcementTitle">
          <el-input v-model="queryForm.announcementTitle" placeholder="公告标题" style="width: 120px" />
        </el-form-item>
        <el-form-item label="" prop="anStatus">
          <el-select v-model="queryForm.anStatus" placeholder="公告状态" style="width: 120px">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="announcementScope">
          <el-select v-model="queryForm.announcementScope" placeholder="公告范围" style="width: 120px">
            <el-option label="全部" value="L"></el-option>
            <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
            style="width: 360px"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="addButton">新增</el-button>
          <el-button type="danger" :icon="Sort" @click="sortButton">排序</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableList"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #announcementTitle="{ scope }">
          <p class="like-a overflow-hidden g-text-nowrap-ellipsis" type="primary" @click="handleEdit(scope.row)">
            {{ scope.row.announcementTitle }}
          </p>
        </template>
        <template #announcementDesc="{ scope }">
          <SimplePopover v-model="scope.row.announcementDesc"></SimplePopover>
        </template>
        <template #isSecretDesc="{ scope }">
          {{ scope.row.isSecretDesc === 'y' ? '是' : '否' }}
        </template>
        <template #announcementScope="{ scope }">
          {{ optionsScope?.find((item) => item.value === scope.row.announcementScope)?.label }}
        </template>
        <template #anUserId="{ scope }">
          <p
            class="like-a overflow-hidden"
            v-if="scope.row.anUserId && scope.row.anUserId != ''"
            @click="showUserInfo(scope.row)"
          >
            用户ID：{{ scope.row.anUserId }}
          </p>
          <p
            class="like-a overflow-hidden"
            v-else-if="scope.row.anTeamUserId && scope.row.anTeamUserId != ''"
            @click="showUserInfo(scope.row)"
          >
            用户ID：{{ scope.row.anTeamUserId }}
          </p>
          <p
            class="like-a overflow-hidden"
            v-else-if="scope.row.anWebsiteId && scope.row.anWebsiteId != ''"
            @click="showSideInfo(scope.row)"
          >
            站点ID：{{ scope.row.anWebsiteId }}
          </p>
          <p
            class="like-a overflow-hidden"
            v-else-if="scope.row.anDomain && scope.row.anDomain != ''"
            @click="showDomainInfo(scope.row)"
          >
            域名：{{ scope.row.anDomain }}
          </p>
          <p v-else>平台</p>
        </template>
        <template #anTargets="{ scope }">
          {{ formatTargets(scope.row.anTargets) }}
        </template>
        <template #anStatus="{ scope }">
          <el-switch
            class="switch-custom"
            v-model="scope.row.anStatus"
            :loading="isLoading"
            active-value="y"
            inactive-value="n"
            :inactive-text="scope.row.anStatus === 'y' ? '启用' : '关闭'"
            @click="switchChange($event, scope.row, scope.$index)"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </m-table>
    </section>

    <!-- 新增公告/编辑公告-->
    <el-dialog v-model="isForm" :close-on-click-modal="false" @close="closeDialog" class="tabs-dialog">
      <el-tabs v-model="activeTab" class="m_tabs">
        <el-tab-pane label="公告" name="first" class="m_tabs_pane">
          <el-scrollbar>
            <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
              <el-form-item label="公告ID：" v-if="distinguish" prop="announcementId">
                {{ addForm.announcementId }}
                <copy :content="addForm.announcementId" />
              </el-form-item>
              <el-form-item label="公告标题：" prop="announcementTitle">
                <el-input v-model="addForm.announcementTitle" placeholder="请输入公告标题" autocomplete="off" />
              </el-form-item>
              <el-form-item label="公告内容：" prop="announcementDesc">
                <div class="text-editor">
                  <TextEditor v-if="isForm" placeholder="请输入正文..." v-model="addForm.announcementDesc" />
                </div>
              </el-form-item>
              <el-form-item label="是否加密：" prop="isSecretDesc">
                <el-radio-group v-model="addForm.isSecretDesc">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="公告状态：" prop="anStatus">
                <el-radio-group v-model="addForm.anStatus">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="addForm.createTime" label="创建时间：" prop="">
                {{ unitFormatDate(addForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
              <el-form-item label="公告时间：" prop="">
                <TimeSelect v-model:startDate="addForm.startTime" v-model:endDate="addForm.endTime"></TimeSelect>
              </el-form-item>
              <el-form-item label="公告范围：" prop="announcementScope">
                <el-select v-model="addForm.announcementScope" placeholder="请选择公告范围">
                  <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <!-- 只有公告范围为首页才需要上传 -->
              <el-form-item v-show="addForm.announcementScope == 'g'" label="公告图片：">
                <FileImageUpload
                  v-model="addForm.announcementLogo"
                  type="info"
                  :upload-from="EUploadFrom.ANNOUNCEMENT_LOGO"
                  ref="fileImageUploadRef"
                />
              </el-form-item>
              <el-form-item label="针对端点：" prop="anTargets">
                <el-select v-model="addForm.anTargets" placeholder="请选择端点" multiple>
                  <el-option v-for="item in optionsTargets" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="延迟秒数：" prop="delayCloseSeconds">
                <el-input v-model="addForm.delayCloseSeconds" placeholder="请输入延迟时间" autocomplete="off" />
              </el-form-item>
              <!-- <el-form-item label="用户端列表" prop="mtTargets">
          <el-select v-model="addForm.mtTargets" multiple placeholder="请选择语言" style="width: 240px">
            <el-option v-for="item in optionsTargets" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
              <el-form-item label="对象类型：" prop="">
                <el-radio-group v-model="addForm.announcementUserType" @change="changeUserType">
                  <el-radio value="L">平台</el-radio>
                  <el-radio value="user">用户</el-radio>
                  <el-radio value="team">团队</el-radio>
                  <el-radio value="web">网站</el-radio>
                  <el-radio value="domain">域名</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="addForm.announcementUserType == 'user' || addForm.announcementUserType == 'team'"
                label="用户ID："
                prop="announcementUserValue"
              >
                <SelectUserIdAndNickname
                  v-model="addForm.announcementUserValue"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                />
                <!-- <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入用户ID'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
                    :value="item.scopesId"
                  />
                </el-select> -->
              </el-form-item>
              <el-form-item
                v-else-if="addForm.announcementUserType == 'web'"
                label="站点ID："
                prop="announcementUserValue"
              >
                <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入站点ID'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
                    :value="item.scopesId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-else-if="addForm.announcementUserType == 'domain'"
                label="域名："
                prop="announcementUserValue"
              >
                <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入域名'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
                    :value="item.scopesId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="button-row">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="isLoading2" @click="submitInfo(formRef)">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 针对对象信息 -->
    <UserListComponent></UserListComponent>

    <EditWebsiteTabs v-if="modalsStore.websiteInfoModal.isVisible" ref="editWebsiteTabsRef" />

    <DomainInformationTabs v-if="modalsStore.domainInfoModal.isVisible" ref="domainInfoTabsRef" />

    <el-dialog v-model="sortedListVisible" class="tabs-dialog" draggable overflow destroy-on-close>
      <el-tabs class="article-tabs m_tabs">
        <el-tab-pane label="公告排序" class="article-content m_tabs_pane">
          <NoticeSortedList v-if="sortedListVisible" @cancel="sortedListVisible = false" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
</template>

<script setup lang="ts">
import { Search, Refresh, Plus, Sort } from '@element-plus/icons-vue'
import i18n from '@/locales'
import {
  reqAnnouncementList,
  reqAnnouncementEdit,
  reqAnnouncementAdd,
  reqAnnouncementEditStatus,
  reqListBlurTemplate
} from '@/api/messageNotice/index'

import { optionsTargets, useOptions, optionsScope } from '@/const/options'
import TimeSelect from '@/components/timeSelect2/index.vue'
import { options } from '@/views/MessageNotice/data'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import EditWebsiteTabs from '@/views/Site/editWebsiteTabs.vue'
import DomainInformationTabs from '@/views/Site/Domain/components/DomainInformationTabs.vue'
import { useModalsStore } from '@/stores/modalStore'
import type { IReqAnnouncementListData, IReqAnnouncementListQueryParams } from '@/api/messageNotice/type'
import { EUploadFrom } from '@/components/uploadImage/type'

const { t } = i18n.global as any

const modalsStore = useModalsStore()
const queryRef = ref()
const fileImageUploadRef = ref<any>(null)
//公告多端
const { formatData: formatTargets } = useOptions(optionsTargets)

//tabs
const activeTab = ref('first')

const editWebsiteTabsRef = ref<InstanceType<typeof EditWebsiteTabs> | null>(null)
const domainInfoTabsRef = ref<InstanceType<typeof DomainInformationTabs> | null>(null)
const sortedListVisible = ref(false)
const rulesAddFrom = ref({
  announcementTitle: [{ required: true, message: '请输公告标题', trigger: 'blur' }],
  delayCloseSeconds: [{ pattern: /^[0-9]*$/, message: '延迟秒数必须为数字', trigger: 'blur' }],
  announcementUserValue: [{ required: true, message: '请输入对象信息', trigger: 'blur' }],
  announcementDesc: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
})

const initQueryForm = (): IReqAnnouncementListQueryParams => ({
  page: 1,
  size: 15,
  announcementTitle: '',
  announcementScope: 'L',
  anStatus: 'L',
  startTime: '',
  endTime: '',
  sortOrder: 'DESC',
  sortName: 'create_time'
})

const initForm = () => ({
  announcementId: '',
  announcementTitle: '',
  announcementDesc: '',
  isSecretDesc: 'n',
  startTime: null,
  endTime: null,
  createTime: null,
  announcementScope: 'g',
  anTeamUserId: '',
  anUserId: '',
  anWebsiteId: '',
  anDomain: '',
  anTargets: [],
  anStatus: 'y',
  delayCloseSeconds: '',
  announcementUserType: 'L',
  announcementUserValue: '',
  announcementLogo: ''
})

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
const distinguish = ref(false)
//分页数据
const isForm = ref(false)
const isEditForm = ref(false)
const isLoading = ref(false)
const isLoading2 = ref(false)
const formRef: any = ref()
const total = ref(0)
const tableList = ref<IReqAnnouncementListData[]>([])
const addForm: any = ref(initForm())
const queryForm = reactive<IReqAnnouncementListQueryParams>(initQueryForm())
const remoteTemplateOptions: any = ref([])

async function fetchData(vals?: Partial<IReqAnnouncementListQueryParams>) {
  isLoading.value = true
  try {
    const query: IReqAnnouncementListQueryParams = {
      ...queryForm,
      ...vals
    }

    if (query.announcementScope === 'L') {
      delete query.announcementScope
    }
    if (query.anStatus === 'L') {
      delete query.anStatus
    }

    const res = await reqAnnouncementList(query)
    tableList.value = res.data.list
    const totalValue = res.data.total
    total.value = totalValue ? Number(totalValue) : 0
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
  isForm.value = true
  distinguish.value = false
  fileImageUploadRef.value?.clearFileList()
  // 初始化 addForm
  Object.assign(addForm.value, { ...initForm() })
}

const sortButton = () => {
  sortedListVisible.value = true
}

// Helper 方法：根据 row 数据确定用户类型
const getUserType = (row) => {
  if (row.anUserId) return 'user'
  if (row.anTeamUserId) return 'team'
  if (row.anWebsiteId) return 'web'
  if (row.anDomain) return 'domain'
  return 'L' // 平台
}

// Helper 方法：根据用户类型获取用户值
const getUserValue = (row) => {
  return row.anUserId || row.anTeamUserId || row.anWebsiteId || row.anDomain || ''
}

const handleEdit = (row) => {
  isForm.value = true
  distinguish.value = true
  fileImageUploadRef.value?.clearFileList()
  // 初始化 addForm
  Object.assign(addForm.value, { ...row })

  // 设置公告用户类型和值
  addForm.value.announcementUserType = getUserType(row)
  addForm.value.announcementUserValue = getUserValue(row)
}

const addFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, _) => {
    if (valid) {
      try {
        const res = await reqAnnouncementAdd({
          ...addForm.value,
          announcementLogo: addForm.value.announcementScope === 'g' ? addForm.value.announcementLogo : ''
        })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          // fetchData({
          //   ...Object.assign(queryForm, initQueryForm()),
          //   ...Object.assign(pageObj.value)
          // })
          fetchData()
          isForm.value = false
          Object.assign(addForm.value, initForm())

          isForm.value = false
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      isLoading2.value = false
    }
  })
}

const editFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, _) => {
    if (valid) {
      try {
        const res = await reqAnnouncementEdit({
          ...addForm.value,
          announcementLogo: addForm.value.announcementScope === 'g' ? addForm.value.announcementLogo : ''
        })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          // Object.assign(queryForm, initQueryForm()),
          fetchData()
          // isForm.value = false
          // Object.assign(addForm.value, initForm())

          isForm.value = false
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      isLoading2.value = false
    }
  })
}
const submitInfo = (formRefval) => {
  if (formRefval.announcementUserType === 'L') {
    formRefval.announcementUserValue = ''
  }
  if (distinguish.value) {
    editFormInfo(formRefval)
  } else {
    addFormInfo(formRefval)
  }
}
const handleSizeChange = (val) => {
  queryForm.size = val
  fetchData()
}

const handleCurrentChange = (val) => {
  queryForm.page = val
  fetchData()
}

const switchChange = (event, row, index) => {
  if (row.anStatus === 'y') {
    tableList.value[index].anStatus = 'n'
  } else {
    tableList.value[index].anStatus = 'y'
  }
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      isLoading.value = true
      reqAnnouncementEditStatus({
        announcementId: row.announcementId,
        anStatus: row.anStatus === 'n' ? 'y' : 'n'
      }).then((res) => {
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          isLoading.value = false
          fetchData()
        } else {
          showErrorMessage(res)
        }
      })
    })
    .catch(() => {
      isLoading.value = false
    })
}

async function remoTetemplateIdChange(val) {
  if (val) {
    try {
      const res = await reqListBlurTemplate({
        announcementUserType: addForm.value.announcementUserType,
        announcementUserValue: val
      })
      remoteTemplateOptions.value = res.data
    } catch (err) {}
  } else {
    remoteTemplateOptions.value = []
  }
}

//针对对象窗口
const showUserInfo = (row) => {
  if (row.anUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.anUserId,
      showCommitButton: false
    })
    modalsStore.showModal('userInfoModal')
  } else if (row.anTeamUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.anTeamUserId,
      showCommitButton: false
    })
    modalsStore.showModal('userInfoModal')
  } else {
  }
}

const showSideInfo = (row) => {
  modalsStore.setActiveTab('websiteInfoModal', 'tab1')
  modalsStore.setModalData('websiteInfoModal', {
    websiteId: row.anWebsiteId,
    showOtherTabs: true,
    canHandleSubmit: true,
    isVisible: true,
    hasRightToSubmit: false
  })
  modalsStore.showModal('websiteInfoModal')
}

const showDomainInfo = (row) => {
  if (row.anDomain !== '') {
    modalsStore.setActiveTab('domainInfoModal', 'tab1')
    modalsStore.setModalData('domainInfoModal', {
      domain: row.anDomain,
      hasRightToSubmit: false
    })
    modalsStore.showModal('domainInfoModal')
  }
}

const changeUserType = (val) => {
  if (val === 'user' && addForm.value.anUserId && addForm.value.anUserId !== '') {
    addForm.value.announcementUserValue = addForm.value.anUserId
  } else if (val === 'team' && addForm.value.anTeamUserId && addForm.value.anTeamUserId !== '') {
    addForm.value.announcementUserValue = addForm.value.anTeamUserId
  } else if (val === 'web' && addForm.value.anWebsiteId && addForm.value.anWebsiteId !== '') {
    addForm.value.announcementUserValue = addForm.value.anWebsiteId
  } else if (val === 'domain' && addForm.value.anDomain && addForm.value.anDomain !== '') {
    addForm.value.announcementUserValue = addForm.value.anDomain
  } else {
    addForm.value.announcementUserValue = ''
  }
}

const closeDialog = () => {
  isForm.value = false
  isEditForm.value = false
  distinguish.value = false
  Object.assign(addForm.value, initForm())
  if (formRef?.value?.clearValidate) {
    formRef?.value?.clearValidate()
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="less">
.text-editor {
  height: 300px;
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 120px;
}

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

.phone {
  display: flex;

  p {
    font-size: 22px;
  }

  .one {
    margin: 0 10px;

    .onee {
      width: 80px;
    }
  }

  .two {
    .twoo {
      width: 180px;
    }
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

.el-button--text {
  margin-right: 15px;
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

.switch-custom .el-switch__label.is-active {
  color: #303133;
}
</style>
