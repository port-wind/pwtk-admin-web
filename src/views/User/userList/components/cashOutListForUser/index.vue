<template>
  <div class="cash-out-list-for-user">
    <el-form :model="queryForm" label-width="auto" ref="editFormRef" :rules="rules" class="dialog-form" style="flex: 1">
      <el-row class="form-row" v-for="(item, index) in rulesConfig" :key="item.index" :gutter="10">
        <el-col :span="3">{{ index === 0 ? '绑定账户:' : '' }}</el-col>
        <el-col :span="7">
          <el-form-item :prop="item.index.toString()">
            <el-input disabled v-model="queryForm[item.index]" placeholder="请输入域名" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :prop="`${item.index}Name`">
            <el-input v-model="queryForm[item.index + 'Name']" placeholder="请输入用户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :prop="`${item.index}Account`">
            <el-input v-model="queryForm[item.index + 'Account']" placeholder="请输入平台账号" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="button-row">
      <el-button @click="cancle">取消</el-button>
      <el-button type="primary" @click="handleSave">提交</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import showErrorMessage from '@/utils/showErrorMessage'
import {
  reqUserWithdrawalAccountList,
  reqUserWithdrawalAccountUpdate,
  type IReqUserWithdrawalAccountListData
} from '@/api/user'

const props = defineProps<{
  userId: string
}>()
interface IWithdrawalRuleConfigItem extends IReqUserWithdrawalAccountListData {
  index: number
}

const editFormRef = ref()
const rulesConfig = ref<IWithdrawalRuleConfigItem[]>([])
const initrulesConfigEditForm = (): IWithdrawalRuleConfigItem => {
  return {
    platName: '',
    platAccount: '',
    platId: '',
    userName: '',
    index: 0
  }
}
const queryForm = reactive<IWithdrawalRuleConfigItem>(initrulesConfigEditForm())
const emit = defineEmits(['close', 'refreshPage'])
const rules = ref<any>({})
const close = () => {
  emit('close')
}
const cancle = () => {
  emit('close')
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
      platName: queryForm[item.index],
      platAccount: queryForm[`${item.index}Account`],
      userName: queryForm[`${item.index}Name`],
      platId: item.platId ?? undefined
    }))
    const response = await reqUserWithdrawalAccountUpdate({
      userId: props.userId,
      accounts: updatedRules
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
    const response = await reqUserWithdrawalAccountList({ userId: props.userId })
    if (response.success) {
      const newRules: any = {}
      const ruleList = response.data!
      if (ruleList.length === 0) {
        ElMessage.error('用户没有绑定提现账号')
        return
      }
      rulesConfig.value = ruleList.map((item, index) => ({ ...item, index }))
      rulesConfig.value.forEach((config: IWithdrawalRuleConfigItem) => {
        queryForm[config.index] = config.platName
        queryForm[`${config.index}Account`] = config.platAccount
        queryForm[`${config.index}Name`] = config.userName

        // 通用验证逻辑
        const validatePairedFields = (fieldType: 'account' | 'name', callback: any) => {
          const accountValue = queryForm[`${config.index}Account`]
          const nameValue = queryForm[`${config.index}Name`]

          // 如果两个字段都为空，验证通过
          if ((!accountValue || accountValue.trim() === '') && (!nameValue || nameValue.trim() === '')) {
            callback()
            return
          }

          // 如果两个字段都有值，验证通过
          if (accountValue && accountValue.trim() !== '' && nameValue && nameValue.trim() !== '') {
            callback()
            return
          }

          // 根据字段类型检查对应的验证逻辑
          if (fieldType === 'account') {
            // 如果只填写了用户名而没填账号
            if ((!accountValue || accountValue.trim() === '') && nameValue && nameValue.trim() !== '') {
              callback(new Error('请输入平台账号'))
              return
            }
          } else if (fieldType === 'name') {
            // 如果只填写了账号而没填用户名
            if (accountValue && accountValue.trim() !== '' && (!nameValue || nameValue.trim() === '')) {
              callback(new Error('请输入用户名称'))
              return
            }
          }

          callback()
        }

        // 账号字段验证器
        const validateAccountField = (rule: any, value: any, callback: any) => {
          validatePairedFields('account', callback)
        }

        // 用户名字段验证器
        const validateNameField = (rule: any, value: any, callback: any) => {
          validatePairedFields('name', callback)
        }

        newRules[`${config.index}Account`] = [{ validator: validateAccountField, trigger: 'blur' }]
        newRules[`${config.index}Name`] = [{ validator: validateNameField, trigger: 'blur' }]
      })
      rules.value = newRules
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
.cash-out-list-for-user {
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 300px;
}
</style>
