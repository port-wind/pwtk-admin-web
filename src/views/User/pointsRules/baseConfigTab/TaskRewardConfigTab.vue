<template>
  <el-tab-pane label="任务奖励配置" name="taskReward" class="m_tabs_pane" v-loading="isLoading">
    <el-form :model="lineFormData" ref="editFormRef" :rules="rules" class="dialog-form">
      <el-row :span="20">
        <el-col :span="13">
          <el-form-item label="签到奖励配置:">
            <div v-for="(item, index) in signInConfig" :key="item.ruleId" class="config-rule-item">
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="item.bizDesc" disabled>
                    <el-option
                      v-for="item in signInConfig"
                      :key="item.ruleId"
                      :label="item.bizDesc"
                      :value="item.bizName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select v-model="lineFormData[item.bizName + 'Type']" disabled>
                    <el-option label="积分增加" :value="1" />
                    <el-option label="积分减少" :value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item>
                  <el-select v-model="lineFormData[item.bizName + 'Enable']">
                    <el-option label="启用" :value="true" />
                    <el-option label="关闭" :value="false" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="item.bizName">
                  <el-input-number
                    v-model="lineFormData[item.bizName]"
                    :min="0"
                    :step="1"
                    @change="(value) => handleNumberChange(item.bizName, value)"
                    :precision="0"
                    step-strictly
                    controls-position="right"
                    :rules="{
                      required: true,
                      message: '该值不可为空',
                      trigger: 'change'
                    }"
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="13">
          <el-form-item label="任务说明配置:">
            <div v-for="(item, index) in taskConfig" :key="item.ruleId" class="config-rule-item">
              <el-col :span="8">
                <el-form-item>
                  <el-select v-model="item.name" disabled>
                    <el-option v-for="t in taskConfig" :key="t.ruleId" :label="t.desc" :value="t.name" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :prop="item.content">
                  <el-input
                    v-model="lineFormData[item.name]"
                    @change="(value) => handleNumberChange(item.name, value)"
                    :maxlength="50"
                    show-word-limit
                    :rules="{
                      required: true,
                      message: '该值不可为空',
                      trigger: 'change'
                    }"
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button-row">
      <el-button @click="cancle">取消</el-button>
      <el-button type="primary" @click="handleSave">提交</el-button>
    </div>
  </el-tab-pane>
</template>

<script lang="ts" setup>
import showErrorMessage from '@/utils/showErrorMessage'
import { reqTaskRewardConfig, reqUpdateTaskRewardConfig } from '@/api/user/pointRules'

const emit = defineEmits(['cancel', 'refreshPage'])
const isLoading = ref(false)
const editFormRef = ref()

const signInConfig = ref<any[]>([])
const taskConfig = ref<any[]>([])

const initsignInConfigEditForm = () => {
  return {}
}

const lineFormData = reactive<any>(initsignInConfigEditForm())
const rules = ref<any>({})

const cancle = () => {
  emit('cancel')
}

const handleSave = async () => {
  editFormRef.value.clearValidate()
  const res = await editFormRef.value.validate()
  try {
    if (!res) {
      return
    }
    if (!lineFormData || typeof lineFormData !== 'object') {
      throw new Error('Form data is invalid')
    }
    const updatedRules = signInConfig.value.map((item) => ({
      ruleId: item.ruleId,
      value: lineFormData[item.bizName],
      enable: lineFormData[`${item.bizName}Enable`]
    }))
    const taskDescList = taskConfig.value.map((item) => ({
      name: item.name,
      content: lineFormData[item.name]
    }))
    const response: any = await reqUpdateTaskRewardConfig({
      scoreConfigList: updatedRules,
      taskDescList
    })
    if (response.success) {
      ElMessage.success('更新成功')
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const handleNumberChange = (bizName, value, times = 1) => {
  console.log(bizName, value, times)
}

const initializeFormData = async () => {
  isLoading.value = true
  try {
    const response: any = await reqTaskRewardConfig()
    if (response.success) {
      const newRules = {}
      signInConfig.value = response.data.scoreConfigList
      signInConfig.value.forEach((config) => {
        lineFormData[config.bizName] = Number(config.value) || 0
        lineFormData[`${config.bizName}Type`] = config.type
        lineFormData[`${config.bizName}Enable`] = config?.enable ?? false
        newRules[config.bizName] = [{ required: true, message: `请输入积分值`, trigger: 'change' }]
      })
      taskConfig.value = response.data.taskDescList
      taskConfig.value.forEach((config) => {
        lineFormData[config.name] = config.content
        newRules[config.name] = [{ required: true, message: `请输入内容`, trigger: 'change' }]
      })
      rules.value = newRules
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await initializeFormData()
})
</script>

<style lang="scss" scoped>
.config-rule-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  :deep(.el-form-item) {
    margin-bottom: 18px;
    margin-right: 18px;
  }
}
</style>
