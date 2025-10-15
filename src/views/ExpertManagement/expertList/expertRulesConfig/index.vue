<template>
  <el-form :model="queryForm" label-width="auto" ref="editFormRef" :rules="rules" class="dialog-form">
    <el-row class="form-row" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-form-item label="规则配置:">
          <el-select :model-value="true" disabled>
            <el-option label="配置生效时间" :value="true" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-select v-model="queryForm.delayEffect" placeholder="请选择">
          <el-option label="定时生效" :value="true" />
          <el-option label="即时生效" :value="false" />
        </el-select>
      </el-col>
      <el-col :span="12">
        <div v-if="queryForm.delayEffect && queryForm.effectTime">
          <BasicTimePicker v-model="queryForm.effectTime" style="width: 150px" :clearable="false" />
        </div>
      </el-col>
    </el-row>
    <el-row class="form-row" v-for="(item, index) in rulesConfig" :key="item.ruleId">
      <el-col :span="6"></el-col>
      <el-col :span="4">
        <el-form-item>
          <el-select v-model="item.bizName" disabled>
            <el-option v-for="item in rulesConfig" :key="item.ruleId" :label="item.bizDesc" :value="item.bizName" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item>
              <el-select v-model="queryForm[item.bizName + 'Enable']" :disabled="!item.enableItemEditable">
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="item.bizName">
              <el-input-number
                v-model="queryForm[item.bizName]"
                :min="0"
                :step="1"
                @change="(value) => handleNumberChange(item.bizName, value)"
                :precision="0"
                step-strictly
                controls-position="right"
                :rules="{
                  required: true,
                  message: 'domain can not be null',
                  trigger: 'blur'
                }"
              />
              {{ item.unit }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
  <div class="button-row">
    <el-button @click="cancle">取消</el-button>
    <el-button type="primary" @click="handleSave">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import showErrorMessage from '@/utils/showErrorMessage'
import { listRulesConfig, uploadRule } from '@/api/expert/expert-list'
import { usePassedTimeValidation } from '@/components/BasicTimePicker/logic/usePassedTimeValidation'

const editFormRef = ref()
const rulesConfig = ref<any[]>([])
const initrulesConfigEditForm = () => {
  return {
    delayEffect: false,
    effectTime: 0,
    PointUnit: 0
  }
}
const queryForm = reactive<{ delayEffect: boolean; effectTime: number; PointUnit: number }>(initrulesConfigEditForm())
const emit = defineEmits(['close', 'refreshPage'])
const rules = ref<any>({})
const close = () => {
  emit('close')
}
const cancle = () => {
  emit('close')
}
const { validateEffectiveTime } = usePassedTimeValidation()
const handleSave = async () => {
  const config = rulesConfig
  const ref = editFormRef
  if (queryForm.delayEffect && queryForm.effectTime) {
    const result = await validateEffectiveTime(queryForm.effectTime)

    if (!result.valid) {
      return // User canceled, exit early
    }

    // If time was adjusted (set to tomorrow), update the form
    if (result.adjustedTime) {
      queryForm.effectTime = result.adjustedTime
    }
  }
  const res = await ref.value.validate()
  try {
    if (!res) {
      return
    }
    if (!queryForm || typeof queryForm !== 'object') {
      throw new Error('Form data is invalid')
    }
    const updatedRules = config.value.map((item) => ({
      ruleId: item.ruleId,
      enable: queryForm[`${item.bizName}Enable`],
      value: queryForm[item.bizName]
    }))
    const response = (await uploadRule({
      delayEffect: queryForm.delayEffect,
      effectTime: queryForm.effectTime,
      enable: true,
      ruleList: updatedRules
    })) as any
    if (response.success) {
      ElMessage.success('更新成功')
      close()
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const handleNumberChange = (bizName, value, times = 1) => {
  console.log(bizName, value)
  if (value < Number(queryForm.PointUnit) * times) {
    queryForm[bizName] = Number(queryForm.PointUnit) * times
  }
}
const initializeFormData = async () => {
  try {
    const response = (await listRulesConfig()) as any
    if (response.success) {
      const newRules = {}
      const { list } = response.data
      rulesConfig.value = list
      rulesConfig.value.forEach((config) => {
        queryForm[config.bizName] = Number(config.newValue) || 0
        queryForm[`${config.bizName}Enable`] = config.newEnable
        newRules[config.bizName] = [{ required: true, message: `请输入${config.unit}数`, trigger: 'blur' }]
      })
      rules.value = newRules
      queryForm.effectTime = Number(response.data.effectTime || new Date().getTime())
      queryForm.delayEffect = response.data.delayEffect
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
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
}
</style>
