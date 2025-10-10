<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    @close="emits('close')"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="打赏规则配置" name="config" class="m_tabs_pane">
        <el-form :model="form" label-width="auto" ref="formRef" v-loading="isLoading">
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
                <el-input-number :min="1" v-model="item.value" />
              </div>
            </el-col>
          </el-row>
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
import { reactive, ref } from 'vue'
import { reqGetRuleList, reqRuleChange } from '@/api/user'
import type { IReqGetRuleListData, RewardSettingItem } from '@/api/user/type'
import { usePassedTimeValidation } from '@/components/BasicTimePicker/logic/usePassedTimeValidation'

const form = ref()
const formRef = ref<FormInstance>()

const isLoading = ref(true)
const activeTab = ref('config')
const emits = defineEmits(['close'])
const queryForm = reactive<{ list: IReqGetRuleListData[]; delayEffect: boolean; effectTime: number; enable: boolean }>({
  list: [],
  delayEffect: false,
  effectTime: 0,
  enable: false
})
const { validateEffectiveTime } = usePassedTimeValidation()
const onSubmit = async () => {
  // console.log(formRef.value?.validate)

  const minValue = queryForm.list.find((item) => item.bizName === 'down_limit')?.value
  const maxValue = queryForm.list.find((item) => item.bizName === 'up_limit')?.value

  if (maxValue && minValue && maxValue < minValue) {
    ElMessage({
      message: '下限值不可以大于上限制',
      type: 'warning'
    })
    return
  }

  if (queryForm.delayEffect && queryForm.effectTime) {
    const result = await validateEffectiveTime(queryForm.effectTime)

    if (!result.valid) {
      return
    }

    // If time was adjusted (set to tomorrow), update the form
    if (result.adjustedTime) {
      queryForm.effectTime = result.adjustedTime
    }
  }

  isLoading.value = true
  try {
    const query: RewardSettingItem[] = queryForm.list.map((item) => {
      return {
        ruleId: item.ruleId,
        enable: item.enable,
        value: item.value
      }
    })
    console.log('🚀 ~ constquery:RewardSettingItem[]=queryForm.list.map ~ query:', query)
    const res = await reqRuleChange({
      ruleList: query,
      delayEffect: queryForm.delayEffect,
      effectTime: queryForm.effectTime,
      enable: true
    })
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
const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await reqGetRuleList()
    if (res.success && res.data) {
      queryForm.list = res.data.list
      queryForm.delayEffect = res.data.delayEffect
      queryForm.effectTime = Number(res.data.effectTime || new Date().getTime())
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  await fetchData()
})
</script>

<style lang="less" scoped>
.submit-wrapper {
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  .btn {
    margin-bottom: 5px;
  }
}
</style>
