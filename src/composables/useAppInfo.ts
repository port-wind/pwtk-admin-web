import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export const useAppInfo = () => {
  const { t } = useI18n()
  const domainName = ref(window.location.hostname)

  // 根据环境判断 appName
  const appName = computed(() => {
    // 开发环境：通过域名判断
    if (domainName.value.includes('dev-web.pwtk.cc') || domainName.value.includes('dev-web49.pwtk.cc')) {
      switch (domainName.value) {
        case 'dev-web49.pwtk.cc':
          return '49gallery'
        case 'dev-web.pwtk.cc':
          return '6gallery'
        default:
          return '6gallery'
      }
    }

    // 生产环境：使用 webConfigApi
    return window.webConfigApi?.appName || '6gallery'
  })

  // 根据 appName 返回对应的 titleName
  const titleName = computed(() => {
    switch (appName.value) {
      case '49gallery':
        return t('TK49 管端')
      case '6gallery':
        return t('login.titleName')
      default:
        return t('login.titleName')
    }
  })

  return {
    appName,
    titleName,
    domainName
  }
}
