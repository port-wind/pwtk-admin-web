<template>
  <div class="comment-tab-container">
    <el-image v-if="fileList.length > 0" :src="fileList[0].url" fit="scale-down" class="issue-image-post" />

    <div class="tab-content comments-tab">
      <PhoneFrame>
        <template #mainBody>
          <div class="post-content-wrapper">
            <section>
              <el-form
                style="display: flex; align-items: center; justify-content: space-between; width: 38%"
                ref="mainReplyFormRef"
                :rules="replyRules"
                :model="mainReplyForm"
              >
                <el-form-item prop="replyUserId" label="模拟用户" :label-width="'85px'" style="margin-bottom: 7px">
                  <SelectUserIdAndNickname
                    v-model="mainReplyForm.replyUserId"
                    id="userId"
                    :group="['nickname', 'loginId']"
                    placeholder="用户昵称｜帐号"
                    style="width: 240px"
                    :disabled="!!selectedUserId"
                    @on-select="handleReplyUserIdChange"
                  />
                  <!-- <UniRemoteInput
                    v-model="mainReplyForm.replyUserId"
                    :search-obj="{}"
                    valueKey="userId"
                    labelKey="loginId"
                    searchKey="userId"
                    placeholder="用户ID"
                    :disabled="!!selectedUserId"
                    style="width: 240px"
                    :formatLabel="(item) => (item.loginId ? `${item.loginId} - ${item.userId}` : item.userId)"
                    @valueChange="handleReplyUserIdChange"
                  /> -->
                </el-form-item>

                <el-form-item class="reply-actions" style="margin-left: 5px; margin-bottom: 7px">
                  <el-button size="small" @click="closeReply" v-if="!!selectedUserId">取消</el-button>
                  <el-button type="primary" size="small" @click="submitReply" v-else-if="mainReplyForm.replyUserId">
                    确认
                  </el-button>
                </el-form-item>
              </el-form>
            </section>

            <section class="outside-comment-list">
              <issue-comments
                :issueId="props.issueId"
                :postUserId="userId"
                :selectedUserId="selectedUserId"
                :disabledAction="disabledAction"
              ></issue-comments>
            </section>
          </div>
        </template>
      </PhoneFrame>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { RxState } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import { useImageUpload } from '@/views/PhotosSys/newsPaperIssue/composables/useImageUpload'
import type { IssueFormData } from '@/views/PhotosSys/newsPaperIssue/newsIssueType/index'

const props = defineProps({
  rxState: {
    type: Object as () => RxState<IssueFormData>,
    required: true
  },
  issueId: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  }
})
const disabledAction = ref(true)

const { fileList } = useImageUpload(props.rxState)

const mainReplyFormRef = ref()
const selectedUserId = ref('')
const mainReplyForm = reactive({
  replyUserId: ''
})
const replyRules = {
  replyUserId: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
}

const userId = computed(() => mainReplyForm?.replyUserId || '')

const handleReplyUserIdChange = (selectedUser: string) => {
  if (selectedUser) {
    mainReplyForm.replyUserId = selectedUser
    mainReplyFormRef.value?.validateField('replyUserId')
  }
}

const closeReply = () => {
  selectedUserId.value = ''
  mainReplyForm.replyUserId = ''
  disabledAction.value = true
}

const submitReply = () => {
  mainReplyFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      selectedUserId.value = mainReplyForm.replyUserId
      disabledAction.value = false
    }
  })
}
</script>

<style scoped lang="less">
.comment-tab-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 100%;
  .issue-image-post {
    width: 420px;
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .tab-content {
    height: 100%;
    overflow-y: auto;
    padding: 1px 20px;
    box-sizing: border-box;
  }

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
}
</style>
