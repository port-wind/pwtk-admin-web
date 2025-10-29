<template>
  <el-tab-pane label="星星规则配置" name="starconfig" class="m_tabs_pane" v-loading="isLoading">
    <el-form :model="starFormData" :rules="starRules" class="dialog-form" ref="starFormRef">
      <el-row :span="20" justify="center">
        <el-col :span="14">
          <el-row>
            <el-col :span="10">
              <el-form-item prop="StarUnit" label="星星单位:">
                <el-select v-model="starFormData.StarUnit" style="width: 140px" disabled>
                  <el-option v-for="unit in pointUnits" :key="unit" :label="unit.toString()" :value="unit.toString()" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="display: flex; padding-bottom: 20px; align-items: center">
              <el-icon style="font-size: 20px; color: #868789"><Right /></el-icon>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="transformScore" label="" class="input-number-item-unit">
                <el-input-number
                  v-model="starFormData.transformScore"
                  :min="1"
                  :step="1"
                  :precision="0"
                  step-strictly
                  controls-position="right"
                  style="width: 200px"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="星星规则配置:">
            <div v-for="(item, index) in starConfig" :key="item.ruleId" class="config-rule-item">
              <el-row style="width: 100%" v-if="item.viewType === 'v'">
                <el-col :span="7">
                  <el-form-item :prop="item.bizDesc">
                    <el-select v-model="item.bizDesc" disabled>
                      <el-option
                        v-for="item in starConfig"
                        :key="item.ruleId"
                        :label="item.bizDesc"
                        :value="item.bizName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :prop="starFormData[item.bizName + 'Type']">
                    <el-select v-model="starFormData[item.bizName + 'Type']" disabled>
                      <el-option label="星星增加" :value="1" />
                      <el-option label="星星减少" :value="2" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-select v-model="starFormData[item.bizName + 'Enable']">
                      <el-option label="启用" :value="true" />
                      <el-option label="关闭" :value="false" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :prop="item.bizName">
                    <el-input-number
                      v-model="starFormData[item.bizName]"
                      :min="Number(starFormData.StarUnit)"
                      :step="Number(starFormData.StarUnit)"
                      @change="(value) => handleNumberChange(item.bizName, value)"
                      :precision="0"
                      step-strictly
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="width: 100%" v-if="item.viewType === 'b'">
                <el-col :span="7">
                  <el-form-item :prop="item.bizDesc">
                    <el-select v-model="item.bizDesc" disabled>
                      <el-option
                        v-for="item in starConfig"
                        :key="item.ruleId"
                        :label="item.bizDesc"
                        :value="item.bizName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :prop="starFormData[item.bizName + 'Type']">
                    <el-select v-model="starFormData[item.bizName + 'Type']" disabled>
                      <el-option label="星星增加" :value="1" />
                      <el-option label="星星减少" :value="2" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item>
                    <el-select v-model="starFormData[item.bizName + 'Enable']">
                      <el-option label="启用" :value="true" />
                      <el-option label="关闭" :value="false" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
              </el-row>
              <el-row style="width: 100%" v-if="item.viewType === 'p'">
                <el-col :span="7">
                  <el-form-item :prop="item.bizDesc">
                    <el-select v-model="item.bizDesc" disabled>
                      <el-option
                        v-for="item in starConfig"
                        :key="item.ruleId"
                        :label="item.bizDesc"
                        :value="item.bizName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-select v-model="starFormData[item.bizName + 'Enable']">
                      <el-option label="启用" :value="true" />
                      <el-option label="关闭" :value="false" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item :prop="item.bizName" class="input-number-item-percent">
                    <el-input-number
                      v-model="starFormData[item.bizName]"
                      :min="Number(starFormData.StarUnit)"
                      :max="Number(starFormData.StarLimit)"
                      :step="Number(starFormData.StarUnit)"
                      @change="(value) => handleNumberChange(item.bizName, value)"
                      :precision="0"
                      step-strictly
                      controls-position="right"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="星星期限:">
            <el-radio-group v-model="starFormData.StarLimitType">
              <el-radio label="永久有效" value="1" />
            </el-radio-group>
          </el-form-item>

          <el-form-item label="星星获取上限:">
            <el-input-number
              v-model="starFormData.StarLimit"
              :precision="0"
              :min="Number(starFormData.StarUnit) * 10"
              :step="Number(starFormData.StarUnit)"
              @change="(value) => handleNumberChange('StarLimit', value, 10)"
              step-strictly
              controls-position="right"
            />
          </el-form-item>
          <el-form-item label="星星说明:" prop="scoreDesc">
            <el-input v-model="starFormData.scoreDesc" type="textarea" :rows="6" :maxlength="500" show-word-limit />
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
import { Right } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqStarRulesList, reqUpdateStarRules } from '@/api/user/pointRules'

const emit = defineEmits(['cancel', 'refreshPage'])
const isLoading = ref(false)
const starFormRef = ref()
const pointUnits = ref([1])
const starConfig = ref<any[]>([])

const initStarConfigEditForm = () => {
  return {
    StarUnit: '10',
    StarLimitType: '1',
    StarLimit: 100,
    transformScore: 100
  }
}

const starFormData = reactive<any>(initStarConfigEditForm())
const starRules = ref<any>({})

const cancle = () => {
  emit('cancel')
}

const handleSave = async () => {
  starFormRef.value.clearValidate()
  const res = await starFormRef.value.validate()
  try {
    if (!res) {
      return
    }
    if (!starFormData || typeof starFormData !== 'object') {
      throw new Error('Form data is invalid')
    }
    const updatedRules = starConfig.value.map((item) => ({
      ruleId: item.ruleId,
      value: item.viewType === 'b' ? '1' : starFormData[item.bizName],
      enable: starFormData[`${item.bizName}Enable`]
    }))
    const response: any = await reqUpdateStarRules({
      items: updatedRules,
      scoreUnit: starFormData.StarUnit,
      scoreLimit: starFormData.StarLimit,
      scoreDesc: starFormData.scoreDesc,
      transformScore: starFormData.transformScore
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
  if (value < Number(starFormData.StarUnit) * times) {
    starFormData[bizName] = Number(starFormData.StarUnit) * times
  }
}

const initializeStarFormData = async () => {
  isLoading.value = true
  try {
    const response: any = await reqStarRulesList()
    if (response.success) {
      const newRules = {}
      starFormData.StarLimit = Number(response.data.scoreLimit) || 100
      starFormData.StarUnit = '1'
      starFormData.scoreDesc = response.data.scoreDesc || ''
      starFormData.transformScore = response.data.transformScore || 100
      starConfig.value = response.data.list
      starConfig.value.forEach((config) => {
        starFormData[config.bizName] =
          Math.floor(Number(config.value) / Number(starFormData.StarUnit)) * Number(starFormData.StarUnit) || 0
        starFormData[`${config.bizName}Type`] = config.type
        starFormData[`${config.bizName}Enable`] = config.enable
        newRules[config.bizName] = [
          { required: true, message: `请输入星星值`, trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value < Number(starFormData.StarUnit)) {
                callback(new Error('不能小于星星单位'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      })
      starRules.value = newRules
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
  await initializeStarFormData()
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
.input-number-item-percent {
  :deep(.el-input-number) {
    position: relative;

    &::after {
      content: '%';
      position: absolute;
      right: 35px;
      top: 50%;
      transform: translateY(-50%);
      color: #868789;
      font-size: 14px;
    }
  }
}
.input-number-item-unit {
  :deep(.el-input-number) {
    position: relative;

    &::after {
      content: '积分';
      position: absolute;
      right: 35px;
      top: 50%;
      transform: translateY(-50%);
      color: #868789;
      font-size: 14px;
    }
  }
}
</style>
