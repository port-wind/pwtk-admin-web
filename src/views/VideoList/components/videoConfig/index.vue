<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    @close="closeDialog"
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
                  :multiple="item.multiple"
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="2"
                  placeholder="请选择"
                  :disabled="!item.enable"
                  @change="handleConfigAuthChange($event, item)"
                >
                  <el-option
                    v-for="(configAuthItem, index) in item.options"
                    :key="index"
                    :label="configAuthItem.label"
                    :value="configAuthItem.value"
                    :disabled="!configAuthItem.enableItemEditable"
                  />
                </el-select>
              </div>
            </el-col>
          </el-row>
          <div>
            <el-row class="form-row" :gutter="20" v-for="(item, index) in queryForm.auditConfigList" :key="index">
              <el-col :span="6" style="text-align: right">审核配置:</el-col>

              <el-col :span="4">
                <el-select v-model="item.bizDesc" disabled>
                  <el-option
                    v-for="item in queryForm.auditConfigList"
                    :key="item.ruleId"
                    :label="item.bizDesc"
                    :value="item.bizDesc"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-select v-model="item.enable" placeholder="请选择" :disabled="!item.enableItemEditable">
                    <el-option label="启用" :value="true" />
                    <el-option label="停用" :value="false" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div style="display: flex; column-gap: 10px">
                  <el-select
                    v-model="item.selectedAuthItem"
                    :multiple="item.multiple"
                    collapse-tags
                    collapse-tags-tooltip
                    :max-collapse-tags="2"
                    placeholder="请选择"
                    :disabled="!item.enable"
                    @change="handleConfigAuthChange($event, item)"
                  >
                    <el-option
                      v-for="(configAuthItem, index) in item.options"
                      :key="index"
                      :label="configAuthItem.label"
                      :value="configAuthItem.value"
                      :disabled="!configAuthItem.enableItemEditable"
                    />
                  </el-select>
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
// import { validatePureInteger } from '@/utils/validators'
import { getVideoListRule, getVideoUploadRule } from '@/api/video'

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
}

interface BBSPostConfigRule {
  enable: boolean
  delayEffect: boolean
  effectTime?: number
  list: any[]
  auditConfigList?: any[]
}
const form = ref()
const formRef = ref<FormInstance>()
const rules = ref({})
const isLoading = ref(true)
const activeTab = ref('config')

const emits = defineEmits(['close', 'update:modelValue'])
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
    const query: any = {
      enable: queryForm.enable,
      delayEffect: queryForm.delayEffect,
      effectTime: queryForm.effectTime,
      ruleList: queryForm.list.concat(queryForm.auditConfigList).map((item) => ({
        ...item,
        value: item.multiple ? item.selectedAuthItem : [item.selectedAuthItem],
        currentValue: item.multiple ? item.selectedAuthItem : [item.selectedAuthItem]
      }))
    }

    // Only include effectTime if delayEffect is true
    if (!query.delayEffect) {
      delete query.effectTime
    }
    console.log(query)

    const res = (await getVideoUploadRule(query)) as { success: boolean }
    if (res.success) {
      ElMessage({
        message: '更新成功',
        type: 'success'
      })
      // 关闭dailog
      emits('update:modelValue', false)
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

// const loadValueToForm = (qForm, list, key) => {
//   const formValues = qForm.value || {}
//   list.forEach((item) => {
//     formValues[key + item.ruleId] = item.value
//     rules.value[key + item.ruleId] = [{ validator: validatePureInteger('请输入正确的数字'), trigger: 'change' }]
//   })
//   qForm.value = formValues
// }
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await getVideoListRule()
    const { data } = res
    data.list = data.ruleConfigList.map((item) => {
      item.currentValue = item.currentValue.length > 0 ? item.currentValue : ['']
      return {
        ...item,
        options: item.availableValueList.map((aItem) => ({
          label: aItem.v,
          value: aItem.k,
          enableItemEditable: true
        })),
        selectedAuthItem: item.multiple ? item.currentValue : item.currentValue[0]
      }
    })
    data.auditConfigList = data.auditConfigList.map((item) => {
      item.currentValue = item.currentValue.length > 0 ? item.currentValue : ['']
      return {
        ...item,
        options: item.availableValueList.map((aItem) => ({
          label: aItem.v,
          value: aItem.k,
          enableItemEditable: true
        })),
        selectedAuthItem: item.multiple ? item.currentValue : item.currentValue[0]
      }
    })
    if (res.success && res.data) {
      queryForm.list = res.data.list
      queryForm.auditConfigList = res.data.auditConfigList
      queryForm.enable = res.data.enable
      queryForm.delayEffect = res.data.delayEffect
      queryForm.effectTime = Number(res.data.effectTime || new Date().getTime())
      // loadValueToForm(form, queryForm.userPublicList, 'userPublic')
      // loadValueToForm(form, queryForm.winScoreList, 'winScore')
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
const closeDialog = () => {
  emits('close')
  emits('update:modelValue', false)
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
