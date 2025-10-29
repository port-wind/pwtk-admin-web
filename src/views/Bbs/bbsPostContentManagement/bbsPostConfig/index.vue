<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    @close="emits('close')"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="修改规则配置" name="config" class="m_tabs_pane">
        <el-form
          :model="form"
          label-width="auto"
          :rules="rules"
          ref="formRef"
          v-loading="isLoading"
          style="flex: 1; overflow: hidden auto"
        >
          <el-row class="form-row" :gutter="20" style="margin-bottom: 10px">
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
          <el-row class="form-row" :gutter="20" v-for="(item, index) in queryForm.list" :key="index">
            <el-col :span="6"></el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="item.bizName" disabled>
                  <el-option
                    v-for="item in queryForm.list"
                    :key="item.ruleId"
                    :label="item.bizDesc"
                    :value="item.bizName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-select v-model="item.enable" placeholder="请选择" :disabled="!item.enableItemEditable">
                <el-option label="启用" :value="true" />
                <el-option label="停用" :value="false" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <div style="display: flex; column-gap: 10px">
                <el-select
                  v-model="item.selectedAuthItem"
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="2"
                  placeholder="请选择"
                  :disabled="!item.enable"
                  @change="handleConfigAuthChange($event, item)"
                >
                  <el-option
                    v-for="(configAuthItem, index) in item.configAuthList"
                    :key="index"
                    :label="configAuthItem.bizDesc"
                    :value="configAuthItem.ruleId"
                    :disabled="!configAuthItem.enableItemEditable"
                  />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <div v-if="isBBSUserPublic">
            <el-row class="form-row" :gutter="20" v-for="(item, index) in queryForm.userPublicList" :key="index">
              <el-col :span="6" style="text-align: right">{{ index === 0 ? '*高手论坛' : '' }}</el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-select v-model="item.bizName" disabled>
                    <el-option
                      v-for="item in queryForm.userPublicList"
                      :key="item.ruleId"
                      :label="item.bizName"
                      :value="item.bizName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.bizDesc" disabled>
                  <el-option
                    v-for="item in queryForm.userPublicList"
                    :key="item.ruleId"
                    :label="item.bizDesc"
                    :value="item.bizDesc"
                  />
                </el-select>
              </el-col>
              <el-col :span="8">
                <div style="display: flex; column-gap: 10px">
                  <el-form-item :prop="'userPublic' + item.ruleId">
                    <el-input-number
                      v-model="form['userPublic' + item.ruleId]"
                      :min="0"
                      :step="1"
                      :precision="0"
                      step-strictly
                      controls-position="right"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row class="form-row" :gutter="20" v-for="(item, index) in queryForm.winScoreList" :key="index">
              <el-col :span="6" style="text-align: right">{{ index === 0 ? '*中奖得分' : '' }}</el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-select v-model="item.bizName" disabled>
                    <el-option
                      v-for="item in queryForm.winScoreList"
                      :key="item.ruleId"
                      :label="item.bizName"
                      :value="item.bizName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.bizDesc" disabled>
                  <el-option
                    v-for="item in queryForm.winScoreList"
                    :key="item.ruleId"
                    :label="item.bizDesc"
                    :value="item.bizDesc"
                  />
                </el-select>
              </el-col>
              <!-- <el-col :span="2">
                <el-select v-model="item.type" disabled>
                  <el-option label="星星" value="star" />
                  <el-option label="积分" value="score" />
                </el-select>
              </el-col> -->
              <el-col :span="8">
                <div style="display: flex; column-gap: 10px">
                  <el-form-item :prop="'winScore' + item.ruleId">
                    <el-input-number
                      v-model="form['winScore' + item.ruleId]"
                      :min="0"
                      :step="1"
                      :precision="0"
                      step-strictly
                      controls-position="right"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form>

        <div class="submit-wrapper">
          <div class="btn">
            <el-button @click="emits('close')">取消</el-button>
            <el-button type="primary" :loading="isLoading" @click="onSubmit()">提交</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import { usePassedTimeValidation } from '@/components/BasicTimePicker/logic/usePassedTimeValidation'
import { postReviewRule, postReviewRuleUpdate } from '@/api/bss/postContentManagement'
import { usePostGameUtilLogic } from '../new/components/usePostGameUtilLogic'
import { validatePureInteger } from '@/utils/validators'

interface BBSPostConfigItemList {
  ruleId: string
  bizName: string
  bizDesc: string
  enableItemEditable: boolean
  value: boolean
}
interface BBSPostConfigRuleList {
  ruleId: string
  bizName: string
  bizDesc: string
  enable: boolean
  enableItemEditable: boolean
  configAuthList: BBSPostConfigItemList[]
  selectedAuthItem: string[]
  value?: number
  type?: 'score' | 'star'
}

interface BBSPostConfigRule {
  enable: boolean
  delayEffect: boolean
  effectTime?: number
  list: BBSPostConfigRuleList[]
  userPublicList?: BBSPostConfigRuleList[]
  winScoreList?: BBSPostConfigRuleList[]
}
const { isBBSUserPublic } = usePostGameUtilLogic()
const form = ref()
const formRef = ref<FormInstance>()
const rules = ref({})
const isLoading = ref(true)
const activeTab = ref('config')

const emits = defineEmits(['close'])
const queryForm = reactive<BBSPostConfigRule>({
  list: [],
  enable: false,
  delayEffect: false,
  effectTime: 0
})

// Import time validation utilities
const { validateEffectiveTime } = usePassedTimeValidation()

const onSubmit = async () => {
  // Only validate time if delayed effect is enabled
  console.log('queryForm', queryForm)
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (error) {
    ElMessage({
      message: '请检查各配置项',
      type: 'warning'
    })
    return
  }
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

  isLoading.value = true
  try {
    const query: BBSPostConfigRule = {
      enable: queryForm.enable,
      delayEffect: queryForm.delayEffect,
      effectTime: queryForm.effectTime,
      list: queryForm.list.map((item) => ({
        ruleId: item.ruleId,
        bizName: item.bizName,
        bizDesc: item.bizDesc,
        enable: item.enable,
        enableItemEditable: item.enableItemEditable,
        configAuthList: item.configAuthList,
        selectedAuthItem: item.selectedAuthItem
      }))
    }
    if (queryForm.userPublicList) {
      query.userPublicList = queryForm.userPublicList?.map((item) => ({
        ...item,
        value: form.value[`userPublic${item.ruleId}`]
      }))
    }
    if (queryForm.winScoreList) {
      query.winScoreList = queryForm.winScoreList?.map((item) => ({
        ...item,
        value: form.value[`winScore${item.ruleId}`]
      }))
    }
    // Only include effectTime if delayEffect is true
    if (!query.delayEffect) {
      delete query.effectTime
    }
    console.log(query)

    const res = (await postReviewRuleUpdate(query)) as { success: boolean }
    if (res.success) {
      ElMessage({
        message: '更新成功',
        type: 'success'
      })
      // 关闭dailog
      emits('close')
    } else {
      ElMessage({
        message: '更新失败,请稍后再试试',
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const loadValueToForm = (qForm, list, key) => {
  const formValues = qForm.value || {}
  list.forEach((item) => {
    formValues[key + item.ruleId] = item.value
    rules.value[key + item.ruleId] = [{ validator: validatePureInteger('请输入正确的数字'), trigger: 'change' }]
  })
  qForm.value = formValues
}
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = (await postReviewRule({
      showUserPublicRule: isBBSUserPublic.value,
      showWinScoreRule: isBBSUserPublic.value
    })) as { success: boolean; data: BBSPostConfigRule }
    const { data } = res
    data.list = data.list.map((item) => ({
      ...item,
      selectedAuthItem: item.configAuthList.filter((auth) => auth.value).map((auth) => auth.ruleId)
    }))
    if (res.success && res.data) {
      queryForm.list = res.data.list
      queryForm.userPublicList = res.data.userPublicList
      queryForm.winScoreList = res.data.winScoreList
      queryForm.enable = res.data.enable
      queryForm.delayEffect = res.data.delayEffect
      queryForm.effectTime = Number(res.data.effectTime || new Date().getTime())
      if (isBBSUserPublic.value) {
        loadValueToForm(form, queryForm.userPublicList, 'userPublic')
        loadValueToForm(form, queryForm.winScoreList, 'winScore')
      }
    }
  } catch (error) {
    ElMessage({
      message: '获取配置失败',
      type: 'error'
    })
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
const handleConfigAuthChange = (list: string[], item: BBSPostConfigRuleList) => {
  console.log(list, item)
  item.configAuthList = item.configAuthList.map((auth) => ({
    ...auth,
    value: list.includes(auth.ruleId)
  }))
}

onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less" scoped>
.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  .btn {
    margin-bottom: 5px;
  }
}
</style>
