<script setup lang="ts">
import { SSOLogin } from '@/api/super/index'

// const login = async (token) => {
//   try {
//     const
//     // 替换为你的后端 API 接口
//     const response = await axios.post('//ssoLogin', { token })
//     if (response.data.success) {
//       // 登录成功后的操作，例如保存 token 到 localStorage 或 Vuex
//       localStorage.setItem('authToken', token)
//       window.location.href = '/dashboard' // 跳转到登录后的页面
//     } else {
//       throw new Error(response.data.message || 'Login failed')
//     }
//   } catch (err) {
//     error.value = err.message
//   } finally {
//     loading.value = false
//   }
// }

onMounted(async () => {
  // http://localhost:8001/#/superAdmin/ssoLogin?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMSIsInVzZXJuYW1lIjoicHd0azIiLCJjaWQiOiI4NiIsImV4cCI6MTczMjYyNjIzOX0.b2D4BrZ96gK-EwCmJR56iChi_00bl4Yewj5wfaJNa7U&cid=86
  console.log('111123123SSO page add')

  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  const cid = urlParams.get('cid')
  if (token) {
    const res = await SSOLogin({
      cid: cid!,
      ssoToken: token
    })
    console.log('🚀 ~ onMounted ~ res:', res)
  }
})
</script>

<template>
  <div>
    <h1>SSO Login</h1>
  </div>
</template>

<style lang="less" scoped></style>
