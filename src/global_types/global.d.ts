declare global {
  const webConfigApi: {
    apiPath: string
    logoPath: string
    phone: string
    whatsapp: string
    facebook: string
    instagram: string
    PUBLIC_KV_URL: string
    VITE_PROXY_UPLOAD: string
    VITE_SERVER_CALLBACK: string
    VITE_CDN_URL: string
    VITE_STORY_TYPE: StorageType
    VITE_STORAGE_BUCKET: Env
    VITE_NODE_ENV: string
    VITE_CHAT_DOMAIN: string
    VITE_PUBLIC_ENCRYPTION_URL: string
    VITE_PUBLIC_AES_KEY_VERSION: string
    VITE_TASK_DOMAIN: string
    version: string
    VITE_VIDEO_DOMAIN: string
    VITE_AUDIO_CONVERT_TOOL_DOMAIN: string
    VITE_TASK_LIVE_DOMAIN: string
    appName: string
  }
  interface Window {
    webConfigApi: {
      apiPath: string
      logoPath: string
      phone: string
      whatsapp: string
      facebook: string
      instagram: string
      PUBLIC_KV_URL: string
      VITE_PROXY_UPLOAD: string
      VITE_SERVER_CALLBACK: string
      VITE_CDN_URL: string
      VITE_STORY_TYPE: StorageType
      VITE_STORAGE_BUCKET: Env
      VITE_NODE_ENV: string
      VITE_CHAT_DOMAIN: string
      VITE_PUBLIC_ENCRYPTION_URL: string
      VITE_PUBLIC_AES_KEY_VERSION: string
      VITE_TASK_DOMAIN: string
      version: string
      VITE_VIDEO_DOMAIN: string
      VITE_TASK_LIVE_DOMAIN: string
      VITE_AUDIO_CONVERT_TOOL_DOMAIN: string
      appName: string
    }
  }
}

export {}
