<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { createUrlValidator } from '@/utils/validators'
import { editUserActivity, addUserActivity } from '@/api/user/activityCenter'
import type {
  IAaddUserActivityQueryParams,
  IEditUserActivityQueryParams,
  IReqHttpActivityCenterData
} from '@/api/user/activityCenter/type'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { EUploadFrom } from '@/components/uploadImage/type'
import getImageUrl from '@/utils/getImageUrl'

interface IExpose {
  open: (_: IReqHttpActivityCenterData) => void
}

const emits = defineEmits(['onClose'])
const ruleFormRef = ref<FormInstance>()
const rulesDialogVisible = ref(false)
const currentActivityId = ref('')
const isLoading = ref(false)
const initQueryForm = (): IAaddUserActivityQueryParams => {
  return {
    activityName: '',
    beginTime: '',
    endTime: '',
    talents: [],
    url: '',
    state: '1',
    remark: '',
    routeType: '0',
    clientType: 'h',
    imgPath: '',
    sortNum: 0
  }
}
const activeTab = ref('active_tabs')
const queryForm = reactive<IAaddUserActivityQueryParams>(initQueryForm())

const formRules = ref<FormRules<IAaddUserActivityQueryParams>>({
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  beginTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入url', trigger: 'blur' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ]
})
const resetForm = () => {
  ruleFormRef.value?.resetFields()
  Object.assign(queryForm, initQueryForm())
}
const handleSubmit = async (formEl: FormInstance | undefined) => {
  const resValid = await formEl?.validate()

  if (!resValid) {
    return
  }

  try {
    isLoading.value = true
    if (currentActivityId.value) {
      const queryEdit: IEditUserActivityQueryParams = {
        ...queryForm,
        activityId: currentActivityId.value
      }

      const res = await editUserActivity(queryEdit)
      if (res.success) {
        ElMessage({
          message: '更新成功',
          type: 'success'
        })
        onClosed()
      } else {
        ElMessage({
          message: res.errMessage as string,
          type: 'error'
        })
      }
    } else {
      const query: IAaddUserActivityQueryParams = {
        ...queryForm
      }

      const res = await addUserActivity(query)
      if (res.success) {
        ElMessage({
          message: '已添加',
          type: 'success'
        })
        onClosed()
      } else {
        ElMessage({
          message: res.errMessage as string,
          type: 'error'
        })
      }
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const open = (row: IReqHttpActivityCenterData) => {
  rulesDialogVisible.value = true
  currentActivityId.value = row?.activityId
  if (row?.activityId) {
    Object.assign(queryForm, row)
  }
}

const talentMap = {
  // 1: '高手',
  2: '专家'
}

const onClosed = () => {
  resetForm()
  rulesDialogVisible.value = false
  emits('onClose', !!currentActivityId.value)
}
const onCancel = () => {
  resetForm()
  rulesDialogVisible.value = false
  emits('onClose', true)
}

defineExpose<IExpose>({
  open
})
</script>

<template>
  <el-dialog
    v-model="rulesDialogVisible"
    class="custom-tabs-dialog"
    draggable
    overflow
    destroy-on-close
    @close="onCancel"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="活动详细" name="active_tabs" class="custom-tab">
        <el-form :model="queryForm" label-width="auto" ref="ruleFormRef" :rules="formRules">
          <el-row :gutter="20" style="padding: 0 50px; height: 100%">
            <!-- 左列 -->
            <el-col :span="12" class="long-col">
              <el-form-item label="活动名称:" prop="activityName">
                <el-input v-model="queryForm.activityName" maxlength="20" clearable />
              </el-form-item>
              <el-form-item label="活动时间:" prop="beginTime">
                <TimeSelect
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model:startDate="queryForm.beginTime"
                  v-model:endDate="queryForm.endTime"
                  :minDate="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
                ></TimeSelect>
              </el-form-item>
              <el-form-item label="针对对象:" prop="talents">
                <el-select v-model="queryForm.talents" multiple clearable>
                  <el-option v-for="(value, key) in talentMap" v-bind:key="key" :label="value" :value="key" />
                </el-select>
              </el-form-item>
              <el-form-item label="排序编号:" prop="sortNum">
                <el-input-number v-model="queryForm.sortNum" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="URL:" prop="url">
                <el-input v-model="queryForm.url" clearable />
              </el-form-item>
              <el-form-item label="状态:" prop="state">
                <el-radio-group v-model="queryForm.state">
                  <el-radio value="1">启用</el-radio>
                  <el-radio value="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="currentActivityId && queryForm.createTime" label="创建时间:" prop="createTime">
                {{ unitFormatDate(queryForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
              <el-form-item label="备注:" prop="remark">
                <el-input type="textarea" v-model="queryForm.remark" show-word-limit maxlength="64" :rows="3" />
              </el-form-item>
            </el-col>
            <!-- 右列 -->
            <el-col :span="12" class="long-col" style="height: 100%">
              <div class="image-wrapper" v-if="queryForm.imgPath">
                <AsyncImage class="async-image-preview" fit="cover" :src="getImageUrl(queryForm.imgPath)" />
                <div class="overlay">
                  <el-icon class="large-icon" @click="queryForm.imgPath = ''">
                    <Delete />
                  </el-icon>
                </div>
              </div>
              <!-- <el-form-item label="图片:" prop="imgPath"> -->
              <div v-else class="upload-wrapper">
                <FileImageUpload
                  class="custom-file-upload"
                  v-model="queryForm.imgPath"
                  type="info"
                  :upload-from="EUploadFrom.ACTIVITY_CENTER"
                />
              </div>
              <!-- </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div class="submit-wrapper">
      <div class="btn">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit(ruleFormRef)">提交</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="less">
//  custom-tabs-dialog
.custom-tabs-dialog {
  margin-top: 80px;
  padding: 10px;
  height: calc(100vh - 8.5rem);
  width: 78%;
  position: relative;
  border-radius: 0.6rem;
}

.custom-tabs-dialog .el-dialog__header {
  padding: 0;
  position: absolute;
  right: -15px;
  top: -15px;
  z-index: 1;
  border-radius: 100%;
  background: #e4e7ed;
  height: 40px;
  width: 40px;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn {
  height: 40px;
  width: 40px;
  line-height: 1;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: red;
}

.custom-tabs-dialog .el-dialog__body {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-tabs-dialog .el-dialog__body .el-tabs {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
}

.custom-tabs-dialog .el-dialog__body .el-tabs .el-tabs__content {
  flex: 1;
  overflow-y: auto;
}
.custom-tabs-dialog {
  .submit-wrapper {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding-top: 10px;
  }
  .code-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .async-image-preview {
    width: 100%;
  }

  .image-wrapper:hover .overlay {
    opacity: 1;
    /* 鼠标悬停时显示遮罩层 */
  }

  .image-wrapper {
    width: 350px;
    height: 525px;
    justify-self: center;
    border: 1px solid #ccc;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    .uploaded-image {
      position: relative;
    }

    .overlay {
      cursor: pointer;
      z-index: 100;
      background-color: blue;
      position: absolute;
      /* 绝对定位 */
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: rgba(128, 128, 128, 0.8);
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .upload-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .upload-wrapper .custom-upload .el-upload--picture-card {
    width: 350px;
    height: 525px;
  }
}

.custom-tab {
  // height: 100%;
}

.custom-tab form {
  // height: 100%;
}
.custom-file-upload {
  // height: 100%;
}

.custom-file-upload .custom-upload {
  // width: 100%;
  // height: 100%;
}
</style>
