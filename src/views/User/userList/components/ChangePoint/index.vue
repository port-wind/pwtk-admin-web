<template>
  <div v-if="visible" class="custom-popup-wrapper" ref="popWrapper" :style="popupStyle">
    <div class="custom-popup">
      <el-form ref="formRef" :model="queryForm" label-position="top" :rules="rules">
        <el-form-item label="数量:" prop="score">
          <el-input-number
            v-model="queryForm.score"
            :controls="false"
            placeholder="请输入正数(加积分)或是负数(减积分)"
          />
        </el-form-item>
        <el-form-item label="原因:" prop="bak">
          <el-input v-model="queryForm.bak" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="" prop="" class="submit-btn">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <el-icon ref="btnRef" class="btn" @click="togglePopup">
    <EditPen />
  </el-icon>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { setTransferScore } from '@/api/user'
import type { ISetTransferScoreQueryParams } from '@/api/user/type.ts'
import showErrorMessage from '@/utils/showErrorMessage'
import type { FormInstance } from 'element-plus'
import { Right } from '@element-plus/icons-vue'
interface IProps {
  userId: string
}

const props = defineProps<IProps>()
const emits = defineEmits(['onClosed'])
const popWrapper = ref()
const visible = ref(false)
const formRef = ref<FormInstance>()
const popupStyle = ref({ top: '30px', left: '-131px' })
const btnRef = ref()

const initQueryForm = (): ISetTransferScoreQueryParams => ({
  userId: props.userId,
  score: 0,
  bak: ''
})

const rules = ref({
  score: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { pattern: /^-?[0-9]+$/, message: '请输入正数(加积分)或是负数(减积分)', trigger: 'blur' }
  ],
  bak: [{ required: true, message: '请输入原因', trigger: 'blur' }]
})

const queryForm = reactive<ISetTransferScoreQueryParams>(initQueryForm())

const onSubmit = () => {
  formRef?.value?.validate(async (valid, fields) => {
    if (valid) {
      if (verificationQuantity()) return
      const params: ISetTransferScoreQueryParams = {
        userId: props.userId,
        score: Number(queryForm.score),
        bak: queryForm.bak
      }
      const res = await setTransferScore(params)
      if (res.success) {
        visible.value = false
        formRef?.value?.resetFields()
        emits('onClosed')
      } else {
        showErrorMessage(res)
      }
    } else {
      console.error('error submit!', fields)
    }
  })
}

const verificationQuantity = () => {
  if (Number(queryForm.score) > 100000) {
    ElMessage.error('积分调整失败，单次增加不得超过10万')
    return true
  } else {
    return false
  }
}

const togglePopup = async () => {
  visible.value = !visible.value
  if (visible.value) {
    await nextTick()
    const btn = btnRef.value.$el || btnRef.value
    const rect = btn.getBoundingClientRect()
    console.log('🚀 ~ togglePopup ~ rect:', rect)
    // ref({ top: '30px', left: '-131px' })
    popupStyle.value = {
      top: `${30}px`,
      left: `${-100}px `
    }
  }
}

const handleClickOutside = (event) => {
  if (
    visible.value &&
    popWrapper.value &&
    !popWrapper.value.contains(event.target) &&
    event?.target?.nodeName !== 'svg'
  ) {
    visible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="less" scoped>
.btn {
  cursor: pointer;
}

.custom-popup-wrapper {
  position: absolute;
  z-index: 1000;
}

.custom-popup {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 300px;
}
.submit-btn {
  margin-top: 20px;
}
</style>
