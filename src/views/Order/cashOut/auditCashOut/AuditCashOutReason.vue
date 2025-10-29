<template>
  <div>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="70px">
      <el-form-item label="理由" prop="reason">
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          :disabled="viewOnly"
        />
      </el-form-item>

      <div class="button-row" v-if="!viewOnly">
        <el-button type="primary" size="small" @click="submit">提交</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String,
    default: ''
  }
})
const reason = computed(() => props.reason)
const viewOnly = computed(() => props.viewOnly)

const formRef = ref<any>()
const emits = defineEmits(['close', 'submit'])
const form = ref({
  reason: ''
})
const rules = ref({
  reason: [{ required: true, message: '请输入审核原因', trigger: 'blur' }]
})

const submit = () => {
  formRef.value.validate((valid: boolean) => {
    console.log(valid)
    if (valid) {
      emits('submit', form.value)
    }
  })
}
const close = () => {
  emits('close')
}
watch(reason, (newVal) => {
  if (viewOnly.value) {
    form.value.reason = newVal
  }
})
onMounted(() => {
  if (viewOnly.value) {
    form.value.reason = reason.value
  }
})
</script>

<style lang="less"></style>
