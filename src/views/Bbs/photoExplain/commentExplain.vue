<template>
  <div class="issue-image-post">
    <el-image :src="imgPath" fit="scale-down" class="content-with-border-issue" style="flex: 0.8" />
    <div
      class="content-with-border-issue"
      v-html="selectedRow.postContent"
      style="flex: 0.2; width: 100%; margin: 10px 0; padding: 10px; overflow: auto"
    ></div>
  </div>

  <div class="tab-content comments-tab">
    <PhoneFrame>
      <template #mainBody>
        <div class="post-content-wrapper">
          <section>
            <el-form
              style="display: flex; align-items: center; justify-content: space-between; width: 38%"
              ref="photoGroupReplyFormRef"
              :rules="replyRules"
              :model="photoGroupReplyForm"
            >
              <el-form-item prop="replyUserId" label="模拟用户" :label-width="'85px'" style="margin-bottom: 7px">
                <SelectUserIdAndNickname
                  v-model="photoGroupReplyForm.replyUserId"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                  style="width: 240px"
                  :disabled="!!photoGroupSelectedUserId"
                  @on-select="handlePhotoGroupReplyUserIdChange"
                />
              </el-form-item>
              <el-form-item class="reply-actions" style="margin-left: 5px; margin-bottom: 7px">
                <el-button size="small" @click="closePhotoGroupReply" v-if="!!photoGroupSelectedUserId">取消</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitPhotoGroupReply"
                  v-else-if="photoGroupReplyForm.replyUserId"
                >
                  确认
                </el-button>
              </el-form-item>
            </el-form>
          </section>
          <section class="outside-comment-list">
            <explain-comments
              :issueId="issueId"
              :imageExplainId="imageExplainId"
              :postUserId="photoGroupReplyForm.replyUserId"
              :selectedUserId="photoGroupSelectedUserId"
              :disabledAction="disabledAction"
            ></explain-comments>
          </section>
        </div>
      </template>
    </PhoneFrame>
  </div>
</template>
<script lang="ts" setup>
import { resetPhotoGroupState } from '@/stores/photoGroupState'

const { VITE_CDN_URL } = webConfigApi

const props = defineProps({
  selectedRow: {
    type: Object,
    required: true
  }
})
const disabledAction = ref(true)
const imageExplainId = computed(() => props.selectedRow.postId)
const issueId = computed(() => props.selectedRow.issueId)

const imgPath = ref('')

const photoGroupSelectedUserId = ref()
const photoGroupReplyFormRef = ref()

const photoGroupReplyForm = reactive({
  replyUserId: ''
})
const replyRules = ref({
  replyUserId: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})
const resetMainReplyForm = () => {
  photoGroupReplyForm.replyUserId = ''
  photoGroupSelectedUserId.value = ''
  resetPhotoGroupState({ subjectName: 'issue' })
}
const handlePhotoGroupReplyUserIdChange = (userId) => {
  console.log('selectedUser', userId)

  if (userId) {
    photoGroupReplyForm.replyUserId = userId
    // Trigger validation for the replyUserId field
    photoGroupReplyFormRef.value.validateField('replyUserId')
  }
}
const submitPhotoGroupReply = () => {
  photoGroupReplyFormRef.value.validate(async (valid, _) => {
    if (valid) {
      console.log('valid', valid)
      photoGroupSelectedUserId.value = photoGroupReplyForm.replyUserId
      disabledAction.value = false
    } else {
      console.log('表单验证失败')
    }
  })
}
const closePhotoGroupReply = () => {
  photoGroupSelectedUserId.value = ''
  photoGroupReplyForm.replyUserId = ''
  disabledAction.value = true
}
onMounted(async () => {
  resetMainReplyForm()
  imgPath.value = VITE_CDN_URL + props.selectedRow.issueDTO.imgPath
})
</script>
<style lang="less" scoped>
.phoneAll {
  height: 100%;
  overflow: hidden;
  .post-content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    .outside-comment-list {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      :deep(.comment-list) {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
}

:deep(.comments-tab) {
  padding: 3px 10px;
}

:deep(.hide-add) {
  .el-upload--picture-card {
    display: none;
  }
}
.issue-image-post {
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.content-with-border-issue {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
