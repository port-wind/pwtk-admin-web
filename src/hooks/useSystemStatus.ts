import { computed } from 'vue'

/**
 * System status hook that provides various system configuration states
 * based on environment variables
 */
export function useSystemStatus() {
  // Get environment variables
  const { VITE_DEPLOY_CONFIG } = import.meta.env

  /**
   * Determines if checkbox tables should be shown based on deployment configuration
   * @returns {boolean} true if deployment config is 'super', false otherwise
   */
  const isShowCheckboxTable = computed(() => {
    return VITE_DEPLOY_CONFIG === 'super'
  })

  /**
   * Determines if the system is in super admin mode
   * @returns {boolean} true if deployment config is 'super', false otherwise
   */
  const isSuperAdmin = computed(() => {
    return VITE_DEPLOY_CONFIG === 'super'
  })

  /**
   * Determines if the system is in development mode
   * @returns {boolean} true if NODE_ENV is 'development', false otherwise
   */
  const isDevelopment = computed(() => {
    return import.meta.env.MODE === 'development'
  })

  return {
    isShowCheckboxTable,
    isSuperAdmin,
    isDevelopment
  }
}

// Export the hook as default
export default useSystemStatus
