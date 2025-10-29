<template>
  <div class="video-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="8">
          <!-- Video Upload -->
          <div class="input-with-button">
            <nativeVideoViewer :video-source="form.videoPath" />
          </div>
        </el-col>
        <el-col :span="16">
          <el-row>
            <el-col :span="24">
              <div class="video-info-card">
                <div class="info-row">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="视频作者:" prop="nickname">
                        <div class="info-value">
                          {{ truncateText(form.nickname || '', 6) || '未知' }} |
                          {{ truncateText(form.loginId || '') || '未知' }}
                        </div>
                        <copy :content="form.loginId"></copy>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="视频ID:" prop="id">
                        <div class="info-value">{{ form.id || '未知' }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3" v-if="form.auditStatus === 1">
                      <el-button v-if="!form.isPublished" type="success" @click="publishVideo(form)">上架</el-button>
                      <el-button v-else type="danger" @click="offlineVideo(form)">下架</el-button>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="发布时间:" prop="auditedAt">
                        <div class="info-value">
                          {{ unitFormatDate(form.createdAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="发布IP:" prop="ipAddress">
                        <div class="info-value">{{ form.ipAddress || '未知' }} | {{ form.country || '未知' }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3"></el-col>

                    <el-col :span="11">
                      <el-form-item label="更新人:" prop="updatedByName">
                        <div class="info-value">{{ form.updatedByName || '未知' }}</div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="更新时间:" prop="updateTime">
                        <div class="info-value">
                          {{ unitFormatDate(form.updatedAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3"></el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="video-stats-card">
                <div class="card-info">
                  <el-icon :size="20" class="icon-style">
                    <View />
                  </el-icon>
                  <div class="info-label">浏览:</div>
                  <div class="info-value">{{ formatViewCount(form.viewCount) }}</div>
                </div>
                <div class="card-info">
                  <img :src="ThumbUpLine" class="icon-style" />
                  <div class="info-label">点赞:</div>
                  <div class="info-value">{{ formatViewCount(form.likeCount) }}</div>
                </div>
                <div class="card-info">
                  <el-icon :size="20" class="icon-style">
                    <Star />
                  </el-icon>
                  <div class="info-label">收藏:</div>
                  <div class="info-value">{{ formatViewCount(form.favoriteCount) }}</div>
                </div>
                <div class="card-info">
                  <el-icon :size="20" class="icon-style">
                    <ChatDotSquare />
                  </el-icon>
                  <div class="info-label">评论:</div>
                  <div class="info-value">{{ formatViewCount(form.commentCount) }}</div>
                </div>
                <div class="card-info">
                  <el-icon :size="20" class="icon-style">
                    <Share />
                  </el-icon>
                  <div class="info-label">分享:</div>
                  <div class="info-value">{{ formatViewCount(form.shareCount) }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="24">
              <!-- Video Title -->
              <el-form-item label="视频标题:" prop="title">
                <el-input
                  v-model="form.title"
                  type="textarea"
                  rows="1"
                  placeholder="请输入视频标题"
                  :maxlength="50"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="视频标签:" prop="tags">
                <el-select
                  v-model="form.tags"
                  placeholder="视频标签"
                  clearable
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="1"
                >
                  <el-option
                    v-for="item in tagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="width: 260px"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="彩种:" prop="gameType" v-if="form.ifActive === 'y'">
                <GameTypeList v-model="form.gameType" @onSelect="($event) => handleGameTypeChange($event?.gameType)" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="启用彩种:" prop="ifActive">
                <el-radio-group v-model="form.ifActive" style="margin-right: 10px" @change="handleIfActiveChange">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="年份:" prop="year" v-if="form.ifActive === 'y'">
                <el-select v-model="form.year" placeholder="年份" @change="handleYearChange">
                  <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14"></el-col>
            <el-col :span="10">
              <el-form-item label="期数:" prop="issue" v-if="form.ifActive === 'y'">
                <el-select
                  v-model="form.issue"
                  placeholder="请选择期数"
                  filterable
                  :disabled="!form.gameType || !form.year"
                >
                  <el-option
                    v-for="item in issueOptionsState.data"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- <p v-else>{{ form.issue }}</p> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <!-- Video Description -->
              <el-form-item label="视频简介:" prop="description">
                <el-input
                  v-model="form.description"
                  type="textarea"
                  rows="3"
                  placeholder="请输入视频简介"
                  :maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <section class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { View, ChatDotSquare, Share, Star } from '@element-plus/icons-vue'
import ThumbUpLine from '@/assets/images/ri--thumb-up-line.svg'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import type { VideoInfo } from '@/global_types/video-upload'
import { getFormattedVideoTagList, getVideoDetails, updateVideoAuditStatus } from '@/api/video'
import { enhanceWithUserInfo } from '@/api/chat'
import { formatViewCount, toggleVideo } from '../../videoUtils'
import { unitFormatDate } from '@/utils/dateFormat'
import { useIssueOptions } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueOpLogic'
import { useBettingStore } from '@/stores/bettingStore'

const emit = defineEmits(['close', 'refresh'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  videoData: {
    type: Object,
    default: () => ({})
  }
})
const bettingStore = useBettingStore()
const { issueOptionsState, loadIssueOptions } = useIssueOptions()

const yearOptions = ref<any[]>(YearTypes)
// Set up store and composables
// Set up refs for form and loading states
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const isSubmitting = ref(false)
const tagList = ref<any[]>([])
// Form data structure
interface VideoForm {
  userId: string
  title: string
  description: string
  tags: string[]
  videoPath: string
  videoInfo?: VideoInfo
  id?: string
  nickname?: string
  loginId?: string
  createdAtTimestamp?: number
  ipAddress?: string
  country?: string
  region?: string
  updatedByName?: string
  updatedAtTimestamp?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
  favoriteCount?: number
  shareCount?: number
  isPublished?: boolean
  auditStatus?: number
  ifActive?: string
  gameType?: string
  year?: string
  issue?: string
}
const form = reactive<VideoForm>({
  userId: '',
  title: '',
  description: '',
  tags: [],
  videoPath: '',
  ifActive: 'n',
  gameType: '',
  year: '',
  issue: ''
})
const isActive = computed(() => form.ifActive === 'y')
const formRules = reactive({
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  videoPath: [{ required: true, message: '请选择视频', trigger: 'change' }],
  title: [{ required: true, message: '请输入视频标题', trigger: 'change' }],
  gameType: [{ required: isActive, message: '请选择彩种', trigger: 'change' }],
  year: [{ required: isActive, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: isActive, message: '请选择期数', trigger: 'change' }],
  description: [{ required: true, message: '请输入视频简介', trigger: 'change' }]
})

// Close modal
const handleCancel = () => {
  emit('close')
}

// Submit form
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()

    if (!valid) return
    if (!form.videoPath) {
      ElMessage.error('请选择视频')
      return
    }

    isSubmitting.value = true

    try {
      const params: any = {
        id: form.id,
        title: form.title,
        description: form.description,
        tags: form.tags.map((tag) => {
          // @ts-ignore
          return tag.id ? tag.id : tag
        })
      }
      if (isActive.value) {
        const gameInfo = bettingStore.gameType.find((item) => item.gameType === form.gameType)!
        params.gameTypeCode = gameInfo.gameTypeCode
        params.gameTypeLongName = gameInfo.gameTypeLongName
        params.gameTypeName = gameInfo.gameTypeName
        params.gameTypeShortName = gameInfo.gameTypeShortName
        params.gameType = form.gameType
        params.gamePublishYear = form.year
        params.gameDrawNumber = form.issue
      } else {
        delete params.gameType
        delete params.gamePublishYear
        delete params.gameDrawNumber
      }
      const result = await updateVideoAuditStatus(params)

      if (result.success && result.data) {
        ElMessage.success('提交成功')

        // Close modal and refresh parent
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || '提交失败')
      }
    } catch (error: any) {
      console.log(error)

      ElMessage.error(error.message || '提交失败')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
  }
}

// Load video details into the form
const loadVideoDetails = async (id: any) => {
  isLoading.value = true
  try {
    // Update form with video data
    const result = await getVideoDetails({ id })
    if (result.success && result.data) {
      const enhancedList = await enhanceWithUserInfo([result.data])
      if (enhancedList.length > 0) {
        const { userInfo, updatedByName } = enhancedList[0]
        delete result.data.year
        Object.assign(form, {
          ...result.data,
          nickname: userInfo.nickname,
          loginId: userInfo.loginId,
          tags: result.data.tags.map((tag: any) => tag.id),
          updatedByName
        })
        if (result.data.gameType) {
          form.ifActive = 'y'
          form.gameType = result.data.gameType
          form.year = result.data.gamePublishYear || yearOptions.value[0].value
          form.issue = result.data.gameDrawNumber || ''
          await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
        }
      } else {
        ElMessage.error('获取用户信息失败')
        Object.assign(form, { ...result.data })
      }
      console.log('enhancedList', enhancedList)
    }
  } catch (error) {
    console.error('Error loading video details:', error)
    ElMessage.error('获取视频详情失败')
  } finally {
    isLoading.value = false
  }
}
const publishVideo = async (data: any) => {
  console.log('上架视频', data)
  await toggleVideo(data)
  await loadVideoDetails(props.videoData.id)
}

const offlineVideo = async (data: any) => {
  console.log('下架视频', data)
  await toggleVideo(data)
  await loadVideoDetails(props.videoData.id)
}
const handleGameTypeChange = async (gt: string | undefined) => {
  console.log('handleGameTypeChange', gt)
  form.issue = ''
  await loadIssueOptions({ gameType: gt!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const handleYearChange = async () => {
  await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const handleIfActiveChange = async () => {
  if (form.ifActive === 'n') {
    return
  }
  if (!form.gameType) {
    form.gameType = (await bettingStore.getActiveGameType())[0].gameType
  }
  if (!form.issue) {
    await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
    form.issue = issueOptionsState.data[0]?.value || ''
  }
}
// Initialize component
onMounted(async () => {
  console.log('Initializing component...')
  // Load initial data
  console.log('props.videoData', props.videoData)
  tagList.value = await getFormattedVideoTagList()

  // Get video details if we have video data
  if (props.videoData && props.videoData.id) {
    await loadVideoDetails(props.videoData.id)
  }
  if (!form.year) {
    form.year = yearOptions.value[0].value
  }
})
</script>

<style scoped lang="scss">
.video-form {
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .input-with-button {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-height: 500px;

    .el-input {
      flex: 1;
    }
    .video-player {
      flex: 1;
    }
  }
}

.button-row {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 10px 0;
}
.video-info-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  margin: 0 0 10px 10px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.video-stats-card {
  background-color: #f5f5f5;
  border-radius: 10px;
  margin: 0 0 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .card-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 60px;
    .info-label {
      margin-right: 10px;
    }
  }
}
</style>
