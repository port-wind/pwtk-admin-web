import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
interface IState {
  isLoading: boolean
  error: string | null
  manageSiteId: string
}

export const useManageSiteStore = defineStore('ManageSiteStore', {
  state: (): IState => ({
    isLoading: false,
    error: null,
    manageSiteId: ''
  }),
  actions: {
    resetState() {
      // 添加重置状态的方法
      this.isLoading = false
      this.error = null
    },
    setManageSiteId(id: string) {
      this.manageSiteId = id
    },
    getManageSiteId() {
      return this.manageSiteId || Cookies.get('manageSiteId')
    }
  }
})
