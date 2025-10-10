<template>
  <div class="video-tag-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="24">
          <!-- Video Author -->
          <el-row justify="center">
            <el-col :span="14">
              <!-- Video Title -->
              <el-form-item label="标签名称:" prop="name">
                <el-input v-model="form.name" :maxlength="200" placeholder="请输入标签名称" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <!-- Video Description -->
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="排序:" prop="sortOrder">
                <el-input-number
                  v-model="form.sortOrder"
                  :min="1"
                  :step="1"
                  :precision="0"
                  step-strictly
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14" v-if="isEdit">
              <el-form-item label="创建时间:" prop="createTime">
                {{ unitFormatDate(form.createdAtTimestamp, 'yyyy-MM-dd HH:mm:ss') }}
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
import { createTag, getTagDetails, updateTag } from '@/api/video'
import { unitFormatDate } from '@/utils/dateFormat'

const props = defineProps<{
  id: string
}>()

const isEdit = computed(() => props.id)

const emit = defineEmits(['close', 'refresh'])
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const isSubmitting = ref(false)
const form = reactive<any>({
  baseUrl: '',
  status: 'y',
  remark: ''
})

const formRules = reactive({
  name: [{ required: true, message: '请输入标签名称', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})

// Close modal
const handleCancel = () => {
  emit('close')
}
// Submit form with upload
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      // Create video with uploaded URL
      const queryParams = {
        ...form
      }

      console.log('Creating video with data:', queryParams)
      const result = isEdit.value ? await updateTag(queryParams) : await createTag(queryParams)

      if (result.success) {
        ElMessage.success(isEdit.value ? '修改成功' : '创建成功')
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || (isEdit.value ? '修改失败' : '创建失败'))
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      ElMessage.error(error.message || '提交失败')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
    isSubmitting.value = false
  }
}

// Initialize component
onMounted(async () => {
  if (props.id) {
    const result = await getTagDetails({ id: Number(props.id) })
    if (result.success) {
      Object.assign(form, result.data)
    } else {
      ElMessage.error(result.message || '获取爬取信息失败')
    }
  }
})
</script>

<style scoped lang="less">
.video-tag-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.button-row {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 10px 0;
}
</style>
