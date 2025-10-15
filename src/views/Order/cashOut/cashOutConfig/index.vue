<template>
  <el-form :model="queryForm" label-width="auto" ref="editFormRef" :rules="rules" class="dialog-form">
    <el-row class="form-row" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-form-item label="规则配置:">
          <el-select :model-value="true" disabled>
            <el-option label="提现下限" :value="true" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item prop="withdrawalLowerLimitEnable">
          <el-select v-model="queryForm.withdrawalLowerLimitEnable" disabled placeholder="请选择">
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="">
          <el-input-number
            v-model="queryForm.withdrawalLowerLimitValue"
            :min="1"
            :precision="0"
            :step="1"
            placeholder="请输入最低提现金额"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
    <el-row class="form-row" v-for="(item, index) in rulesConfig" :key="item.index">
      <el-col :span="6"></el-col>
      <el-col :span="4">
        <el-form-item :prop="item.index.toString()">
          <el-input v-model="queryForm[item.index]" placeholder="请输入域名" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :prop="`${item.index}Url`">
              <el-input v-model="queryForm[`${item.index}Url`]" placeholder="请输入域名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :prop="`${item.index}Enable`">
              <el-select v-model="queryForm[item.index + 'Enable']">
                <el-option label="启用" :value="true" />
                <el-option label="禁用" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="success" v-if="index === 0" @click="handleAddRule(item)">新增</el-button>
            <el-button type="danger" v-else @click="handleDeleteRule(item)">删除</el-button>
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
import { reqWithdrawalListRule, uploadWithdrawalRule } from '@/api/order/orderList'
import type { IWithdrawalRuleItem } from '@/api/order/orderList/type'

interface IWithdrawalRuleConfigItem extends IWithdrawalRuleItem {
  index: number
  url?: string
}

const editFormRef = ref()
const rulesConfig = ref<IWithdrawalRuleConfigItem[]>([])
const initrulesConfigEditForm = (): {
  withdrawalEnable: boolean
  withdrawalLowerLimitValue: number
  withdrawalLowerLimitEnable: boolean
} & IWithdrawalRuleConfigItem => {
  return {
    platId: '',
    platName: '',
    enable: false,
    index: 0,
    withdrawalEnable: false,
    withdrawalLowerLimitValue: 0,
    withdrawalLowerLimitEnable: false
  }
}
const queryForm = reactive<
  {
    withdrawalEnable: boolean
    withdrawalLowerLimitValue: number
    withdrawalLowerLimitEnable: boolean
  } & IWithdrawalRuleConfigItem
>(initrulesConfigEditForm())
const emit = defineEmits(['close', 'refreshPage'])
const rules = ref<any>({})
const close = () => {
  emit('close')
}
const cancle = () => {
  emit('close')
}
const handleAddRule = (item: IWithdrawalRuleConfigItem) => {
  const newItem = { ...item, index: rulesConfig.value.length, platName: '', platId: '' }
  queryForm[newItem.index] = ''
  queryForm[`${newItem.index}Enable`] = true
  queryForm[`${newItem.index}Url`] = ''
  rulesConfig.value.push(newItem)
  rules.value[newItem.index.toString()] = [{ required: true, message: '请输入域名', trigger: 'blur' }]
}
const handleDeleteRule = (itemToDelete: IWithdrawalRuleConfigItem) => {
  rulesConfig.value = rulesConfig.value.filter((item) => item.index !== itemToDelete.index)
  delete queryForm[itemToDelete.index]
  delete queryForm[`${itemToDelete.index}Enable`]
  delete queryForm[`${itemToDelete.index}Url`]
  delete rules.value[itemToDelete.index.toString()]
}
const handleSave = async () => {
  const config = rulesConfig
  const ref = editFormRef

  const res = await ref.value.validate()
  try {
    if (!res) {
      return
    }
    if (!queryForm || typeof queryForm !== 'object') {
      throw new Error('Form data is invalid')
    }
    const updatedRules = config.value.map((item) => ({
      platId: item.platId ?? undefined,
      platName: queryForm[item.index],
      enable: queryForm[`${item.index}Enable`],
      url: queryForm[`${item.index}Url`] ?? ''
    }))
    const response = await uploadWithdrawalRule({
      withdrawalEnable: queryForm.withdrawalEnable,
      withdrawalLowerLimitValue: queryForm.withdrawalLowerLimitValue,
      withdrawalLowerLimitEnable: queryForm.withdrawalLowerLimitEnable,
      ruleList: updatedRules
    })
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
const initializeFormData = async () => {
  try {
    const response = await reqWithdrawalListRule()
    if (response.success) {
      const newRules: any = {}
      const { ruleList, withdrawalEnable, withdrawalLowerLimitValue, withdrawalLowerLimitEnable } = response.data!
      if (ruleList.length === 0) {
        ruleList.push({ platName: '', enable: false, platId: '' })
      }
      rulesConfig.value = ruleList.map((item, index) => ({ ...item, index }))
      rulesConfig.value.forEach((config: IWithdrawalRuleConfigItem) => {
        queryForm[config.index] = config.platName
        queryForm[`${config.index}Url`] = config.url ?? ''
        queryForm[`${config.index}Enable`] = config.enable
        newRules[config.index.toString()] = [{ required: true, message: '请输入域名', trigger: 'blur' }]
      })
      rules.value = newRules
      queryForm.withdrawalEnable = withdrawalEnable
      queryForm.withdrawalLowerLimitEnable = withdrawalLowerLimitEnable!
      queryForm.withdrawalLowerLimitValue = withdrawalLowerLimitValue!
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
