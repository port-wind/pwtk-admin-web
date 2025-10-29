<template>
  <el-form :model="editForm" ref="editFormRef" :rules="issueFormRules" style="display: flex" class="dialog-form">
    <el-row :gutter="20">
      <!-- 左边部分 -->
      <el-col :span="11" :offset="0">
        <el-form-item label="图解标题:" prop="name" label-width="100px">
          {{ editForm.name }}
        </el-form-item>
        <el-form-item prop="postUserId" label="模拟用户:" label-width="100px">
          <SelectUserIdAndNickname
            v-model="editForm.postUserId"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="用户昵称｜帐号"
          />
        </el-form-item>
        <el-form-item prop="postContent" label="内容:" label-width="100px">
          <div class="text-editor-wrapper">
            <TextEditor v-if="editForm" placeholder="请输入正文..." v-model="editForm.postContent" mode="simple" />
          </div>
          <div>textlength: {{ editForm.postContent.length }}</div>
        </el-form-item>
      </el-col>
      <!-- 中部 -->
      <el-col :span="5" :offset="0">
        <el-form-item label="" label-width="70px">
          <!-- 占位 样式 -->
          {{ '&nbsp;' }}
        </el-form-item>
        <el-form-item label="状态:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.status">
            <el-radio value="y">启用</el-radio>
            <el-radio value="n">删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="评论:" label-width="70px" prop="commentFlag">
          <el-radio-group class="custom-radio" v-model="editForm.commentFlag">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="推荐:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.isRecommended">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="热门:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.isHot">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.isTop">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="精选:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.isSelected">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="爆款:" label-width="70px">
          <el-radio-group class="custom-radio" v-model="editForm.isBloom">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <!-- 右边部分 -->
      <el-col :span="8" :offset="0">
        <div class="image-wrapper">
          <el-image :src="VITE_CDN_URL + issueInfo.imgPath" fit="scale-down" style="height: 100%" />
        </div>
      </el-col>
    </el-row>
  </el-form>
  <div class="button-row">
    <el-button @click="resetForm">取消</el-button>
    <el-button type="primary" :loading="isLoading" @click="handleSave">提交</el-button>
  </div>
</template>
<script lang="ts" setup>
import { getDetailById, replyIssuePost } from '@/api/photoSys/issues/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqUserListByUserId } from '@/api/user/index'

const { VITE_CDN_URL } = webConfigApi

const props = defineProps({
  issueInfo: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['returnToChooseIssue'])
const isLoading = ref(false)
const initEditForm = () => ({
  issue: 10,
  seriesCode: '',
  newspaperCode: '',
  gameType: '',
  imgPath: '',
  isColorful: 'y',
  isTop: 'n',
  isSelected: 'n',
  isHot: 'n',
  isBloom: 'n',
  isRecommended: 'n',
  commentFlag: 'y',
  voteFlag: 'y',
  isAllAnnotateContent: 'y',
  annotateContent: '',
  status: 'y',
  createTime: 0,
  seriesName: '',
  newspaperName: '',
  name: `第${props.issueInfo.issue}期 ${props.issueInfo.newspaperName} 图解`,
  readCount: 0,
  postUserId: '',
  postContent: ''
})
const editForm = reactive(initEditForm())
const editFormRef = ref()
const issueFormRules = reactive({
  seriesCode: [{ required: true, message: '请选择图纸系列', trigger: 'blur' }],
  name: [{ required: true, message: '请输入图纸名称', trigger: 'blur' }],
  postUserId: [{ required: true, message: '请输入模拟用户', trigger: 'blur' }],
  newspaperCode: [{ required: true, message: '请选择报纸', trigger: 'blur' }],
  postContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  hostDomain: [{ required: true, message: '请输入域名', trigger: 'blur' }],
  navOutStyle: [{ required: true, message: '请选择导航方式' }]
})
const resetForm = () => {
  //   issueDialogVisible.value = false
  Object.assign(editForm, initEditForm())
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
  emit('returnToChooseIssue')
}
const handleSave = async () => {
  let res
  try {
    let isValid = false
    await editFormRef.value.validate(async (valid, fields) => {
      isValid = valid
      if (valid) {
        if (editForm.postContent.length > 10000) {
          ElMessage.error('内容长度不能超过10000')
          return
        }

        const req = {
          ...editForm,
          issueId: props.issueInfo.issueId,
          postType: 'a',
          gameType: props.issueInfo.gameType
        }
        try {
          res = await replyIssuePost(req)
        } catch (error) {
          console.error('Error saving data:', error)
        }
      } else {
        console.log('error submit!', fields)
      }
    })
    if (!isValid) {
      return
    }

    // if (isEditMode.value) {
    //   res = await update(editForm)
    // } else {
    //   res = await create({ ...editForm })
    // }

    if (checkSuccess(res)) {
      ElMessage.success('保存成功')
      resetForm()
      //   issueDialogVisible.value = false
      //   currentPage.value = 1
      //   fetchData()
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const checkSuccess = (res) => {
  return !!res?.success
}
const getDetail = async (id) => {
  try {
    const response = await getDetailById({ issueId: id })
    if (response.success) {
      const { data } = response
      Object.assign(editForm, data)

      if (editForm.imgPath) {
        const parts = editForm.imgPath.split('/')
        const lastPart = parts[parts.length - 1]
      }
      // fileList.value = [editForm.imgPath]
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}
</script>
<style lang="less" scoped>
.text-editor-wrapper {
  height: 500px;
}

.custom-radio .el-radio {
  margin-right: 16px;
}

.image-wrapper {
  padding: 20px;
}
</style>
