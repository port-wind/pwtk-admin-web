import crypto from 'crypto-js'

/**
 * 计算 SHA-1 哈希值并转换为 Base64 编码
 * @param data 输入字符串
 * @returns Base64 编码的 SHA-1 哈希值
 */
export function sha1Base64(data: string): string {
  const hash = crypto.SHA1(data)
  return hash.toString(crypto.enc.Base64)
}

/**
 * 生成用户密文 secret
 * 规则：base64(sha1(盐 + 用户ID + base64(sha1(密码明文))))
 * @param password 明文密码
 * @param userId 用户ID
 * @param salt 盐值
 * @returns 符合规则的 secret 值
 */
export function generateSecret(password: string, userId: string, salt: string): string {
  console.log('🚀 ~ generateSecret ~ password:', password) // 123456
  // 第一步：计算 SHA-1(密码明文) 并转为 Base64
  const sha1PasswordBase64 = sha1Base64(password)

  // 第二步：拼接 salt + userId + base64(sha1(密码明文))
  const combined = salt + userId + sha1PasswordBase64

  // 第三步：对拼接结果计算 SHA-1 并转为 Base64
  const secret = sha1Base64(combined)

  return secret
}
