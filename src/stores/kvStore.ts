// 菜单列表
import service from '@/service'
import { defineStore, type _GettersTree } from 'pinia'

interface IssueList {
  year: number
  issues: { issue: string; issueShort: string }[]
}

interface IState {
  issueList: IssueList[]
  isLoading: boolean
  error: string | null
}
interface IAction {
  getIssueList: (gameType: string) => void
}

export const useKvStore = defineStore<'kv', IState, _GettersTree<IState>, IAction>('kv', {
  state: (): IState => ({
    error: null,
    isLoading: false,
    issueList: []
  }),
  getters: {
    // labelOption: (state: IState) => {
    //   console.log(state)
    //   return
    // }
  },
  actions: {
    async getIssueList(gameType: string) {
      this.isLoading = true
      this.error = null
      try {
        const res = await service.kv().getRecentYearsIssueList(gameType).do()
        if (res[0]) {
          this.issueList = res[0]
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    }
  }
})
