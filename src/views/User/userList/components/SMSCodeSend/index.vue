<script setup lang="ts">
import { sendMessageUserId } from '@/api/user'
import { IReqUserListData } from '@/api/user/type'
import { useModalsStore } from '@/stores/modalStore'

interface IProps {
  accountInfo: IReqUserListData
}
const props = defineProps<IProps>()

const modalsStore = useModalsStore()

const isAvailableSMS = ref(true)
const availableTime = ref(0)
const onFinish = () => {
  isAvailableSMS.value = true
}
const sendSMS = async () => {
  const userId = modalsStore?.userInfoModal?.modalData?.accountInfo.userId
  if (userId) {
    const res = await sendMessageUserId(userId)
    if (res.success) {
      // res.data.expire
      // console.log(' res.data.expire', res.data?.expire)
      availableTime.value = Number(res.data?.expire)
      isAvailableSMS.value = false

      localStorage.setItem(userId, res.data?.expire!)
    }
  }
}

const checkMobileStatus = (accountInfo: IReqUserListData) => {
  // Step 1: Check if there’s a mobile number and valid userId
  if (!accountInfo?.mobile || !accountInfo?.userId) {
    isAvailableSMS.value = false
    availableTime.value = 0 // Reset timer if no mobile number or userId
    return
  }

  // Step 2: Check if there’s a stored sending state in localStorage
  const storedExpire = localStorage.getItem(accountInfo.userId)

  if (!storedExpire) {
    // No stored expiration, allow sending
    isAvailableSMS.value = true
    availableTime.value = 0
    return
  }

  // Step 3: There’s a stored expiration, check if it’s still valid
  const expireTime = Number(storedExpire) // Stored timestamp in milliseconds
  const currentTime = Date.now() // Current timestamp in milliseconds

  // Handle invalid stored expiration
  if (isNaN(expireTime)) {
    isAvailableSMS.value = true
    availableTime.value = 0
    localStorage.removeItem(accountInfo.userId) // Clean up invalid data
    return
  }

  if (currentTime < expireTime) {
    // Not expired, disable sending and set remaining time
    isAvailableSMS.value = false
    availableTime.value = expireTime
  } else {
    // Expired, allow sending and clean up
    isAvailableSMS.value = true
    availableTime.value = 0
    localStorage.removeItem(accountInfo.userId) // Remove expired data
  }
}

watch(
  () => modalsStore?.userInfoModal?.modalData?.accountInfo,
  (newVal, oldVal) => {
    checkMobileStatus(newVal)
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="true" class="sms-area">
    <el-button v-show="isAvailableSMS" @click="sendSMS()" class="btn-sms">发送验证码</el-button>
    <Countdown v-show="!isAvailableSMS" :targetTimestamp="availableTime" date-format="mm:ss" @on-finish="onFinish" />
  </div>
</template>

<style lang="less" scoped>
.btn-sms {
  width: 88px;
}
.btn-sms-timer {
  font-family: monospace;
}
.sms-area {
  line-height: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
