import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useAppInfo = () => {
  const { t } = useI18n()
  const domainName = ref(window.location.hostname)

  // 简洁的两层判断
  const appName = computed(() => {
    const envAppName = import.meta.env.VITE_APP_NAME || ''
    const webAppName = window.webConfigApi?.appName || ''

    // 有 VITE_APP_NAME（开发环境）就用它，否则用 webConfigApi（生产环境）
    const finalAppName = envAppName || webAppName

    console.info('🏷️ AppName:', finalAppName, envAppName ? '[开发环境]' : '[生产环境]', '域名:', domainName.value)

    return finalAppName
  })

  const titleName = computed(() => {
    switch (appName.value) {
      case '49gallery':
        return t('TK49 管端')
      case '6gallery':
        return t('TK6图库 管端')
      default:
        return ''
    }
  })

  return {
    appName,
    titleName,
    domainName
  }
}
