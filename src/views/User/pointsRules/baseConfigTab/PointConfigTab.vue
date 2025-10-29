<template>
  <el-tab-pane label="积分基础配置" name="basic" class="m_tabs_pane" v-loading="isLoading">
    <el-form :model="lineFormData" ref="editFormRef" :rules="rules" class="dialog-form">
      <el-row :span="20" justify="center">
        <el-col :span="14">
          <el-form-item prop="PointUnit" label="积分单位:">
            <el-select v-model="lineFormData.PointUnit" style="width: 160px" @change="handlePointUnitChange">
              <el-option v-for="unit in pointUnits" :key="unit" :label="unit.toString()" :value="unit.toString()" />
            </el-select>
          </el-form-item>
          <el-form-item label="积分规则配置:">
            <div v-for="(item, index) in pointConfig" :key="item.ruleId" class="config-rule-item">
              <el-col :span="7">
                <el-form-item>
                  <el-select v-model="item.bizDesc" disabled>
                    <el-option
                      v-for="item in pointConfig"
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
              <el-col :span="6">
                <el-form-item :prop="item.bizName">
                  <el-input-number
                    v-model="lineFormData[item.bizName]"
                    :min="Number(lineFormData.PointUnit)"
                    :max="Number(lineFormData.PointLimit)"
                    :step="Number(lineFormData.PointUnit)"
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

        <el-col :span="8">
          <el-form-item label="积分期限:">
            <el-radio-group v-model="lineFormData.PointLimitType">
              <el-radio label="永久有效" value="1" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="每日积分获取上限:">
            <el-input-number
              v-model="lineFormData.PointLimit"
              :precision="0"
              :min="Number(lineFormData.PointUnit) * 10"
              :step="Number(lineFormData.PointUnit)"
              @change="(value) => handleNumberChange('PointLimit', value, 10)"
              step-strictly
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="积分说明:" prop="scoreDesc">
            <el-input v-model="lineFormData.scoreDesc" type="textarea" :rows="6" :maxlength="500" show-word-limit />
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
import { reqPointRulesList, reqUpdatePointRules } from '@/api/user/pointRules'

const emit = defineEmits(['cancel', 'refreshPage'])
const isLoading = ref(false)
const editFormRef = ref()
const pointUnits = ref([10, 100, 1000])
const pointConfig = ref<any[]>([])

const initPointConfigEditForm = () => {
  return {
    PointUnit: '10',
    PointLimitType: '1',
    PointLimit: 100
  }
}

const lineFormData = reactive<any>(initPointConfigEditForm())
const rules = ref<any>({})

const cancle = () => {
  emit('cancel')
}

const handlePointUnitChange = async (_value) => {
  try {
    await editFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        console.log(fields)
      } else {
        console.log(fields)
      }
    })
  } catch (error) {
    console.error('Error validating form:', error)
  }
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
    const updatedRules = pointConfig.value.map((item) => ({
      ruleId: item.ruleId,
      value: lineFormData[item.bizName],
      enable: lineFormData[`${item.bizName}Enable`]
    }))
    const response: any = await reqUpdatePointRules({
      items: updatedRules,
      scoreUnit: lineFormData.PointUnit,
      scoreLimit: lineFormData.PointLimit,
      scoreDesc: lineFormData.scoreDesc
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
  console.log(bizName, value)
  if (value < Number(lineFormData.PointUnit) * times) {
    lineFormData[bizName] = Number(lineFormData.PointUnit) * times
  }
}

const initializeFormData = async () => {
  isLoading.value = true
  try {
    const response: any = await reqPointRulesList()
    if (response.success) {
      const newRules = {}
      lineFormData.PointLimit = Number(response.data.scoreLimit) || 100
      lineFormData.PointUnit = Number(response.data.scoreUnit) || 10
      lineFormData.scoreDesc = response.data.scoreDesc || ''
      pointUnits.value = [...new Set([10, 100, 1000, Number(response.data.scoreUnit) || 10])]
        .filter((item) => item <= lineFormData.PointLimit)
        .sort((a, b) => a - b)
      pointConfig.value = response.data.list
      pointConfig.value.forEach((config) => {
        lineFormData[config.bizName] = Number(config.value) || lineFormData.PointUnit || 0
        lineFormData[`${config.bizName}Type`] = config.type
        lineFormData[`${config.bizName}Enable`] = config?.enable ?? false
        newRules[config.bizName] = [
          { required: true, message: `请输入积分值`, trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value < Number(lineFormData.PointUnit)) {
                callback(new Error('不能小于积分单位'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
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
