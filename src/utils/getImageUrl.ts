import getLSItem from '@/utils/getLocalStorageItem'
import avatorImage from '@/assets/images/avator.png'
import axios from 'axios'
const { VITE_PUBLIC_ENCRYPTION_URL } = import.meta.env
const DEFAULT_IMAGE_URL = '' // 可根据需要补充默认图片url

const aesKeyValues = [
  { key: 123451, value: 'kQuj0NlBZHVkYvIi' },
  { key: 123452, value: 'HFe6MRf2wCMs30Bt' },
  { key: 123453, value: 'xsrgf4ybfAxiGODl' },
  { key: 123454, value: '6PvGeGX4GhApkdli' },
  { key: 123700, value: '4e1735bebec93eb6' }
]

let version = Number(import.meta.env.VITE_PUBLIC_AES_KEY_VERSION)

if (isNaN(version)) {
  version = 0
}

if (version >= aesKeyValues.length) {
  version = 0
}

const { key, value } = aesKeyValues[version]

export default async function getImageUrl(
  url: string | undefined | null,
  type: 'normal' | 'avatar' = 'normal'
): Promise<string> {
  let _url = url === 'mine' ? getLSItem('avatar') : url
  if (!_url) {
    return type === 'avatar' ? avatorImage : DEFAULT_IMAGE_URL
  }

  let prefix = ''

  const arr = _url.split('/')
  if (arr.length > 1) {
    prefix = arr[0]
    _url = arr.slice(1).join('/')
  }

  const encryptedImageUrl = `${VITE_PUBLIC_ENCRYPTION_URL}/msecret-${key}-0x0-${prefix}/${_url}`

  const response = await axios.get(encryptedImageUrl)
  const encryptedImageData = response.data
  if (typeof encryptedImageData !== 'string') {
    return DEFAULT_IMAGE_URL
  }
  const decryptedBase64 = await aesDecrypt(encryptedImageData, value)
  return decryptedBase64
}

/**
 * AES 解密函数（基于 Web Crypto API）
 * @param {string} ciphertext - 待解密的密文（Base64 编码）
 * @param {string} key - 密钥（字符串，长度为 16、24 或 32 字节）
 * @returns {Promise<string>} 解密后的明文字符串
 */
async function aesDecrypt(ciphertext: string, key: string): Promise<string> {
  if (![16, 24, 32].includes(key.length)) {
    console.error('密钥长度必须为 16、24 或 32 字节！')
    throw new Error('密钥长度必须为 16、24 或 32 字节！')
  }

  // 将密钥和密文转换为 Uint8Array
  const keyBytes = new TextEncoder().encode(key) // 密钥
  const encryptedBytes = base64ToUint8Array(ciphertext) // 密文

  // 初始化向量（IV）取密钥的前 16 字节
  const iv = keyBytes.slice(0, 16)

  // 导入加密密钥
  const cryptoKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CBC' }, false, ['decrypt'])

  // 解密密文
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: iv
    },
    cryptoKey,
    encryptedBytes
  )

  // 解密结果转换为字符串
  return new TextDecoder().decode(decryptedBuffer)
}

/**
 * 将 Base64 编码字符串转换为 Uint8Array
 * @param {string} base64 - Base64 编码字符串
 * @returns {Uint8Array}
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return bytes
}
