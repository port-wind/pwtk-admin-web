import type { IGameType, IGameTypePlatformBodyParameter } from '@/api/global/types'
import { gameTypePlatformList } from '@/api/system/gameTypeManagement'
import { defineStore, type _GettersTree } from 'pinia'
import service from '@/service/index'
import { BizFlag, type IListTypeCode } from '@/api/betting/types'
import { listPlayTypeCode } from '@/api/betting'
import gameList from '@/assets/json/game_detail.json'
import type { IListPlayTypeData } from '@/api/expert/sale-list/type'
import { listPlayType } from '@/api/expert/sale-list'

type TGameKey = { [key: string]: string }

const gameKey: TGameKey = { '2032': 'a6', '1': 'hk6', '3995': 'sg6', '84': 'tw6', '5': 'xa6', '6': 'kl8' }

const convertNumberToString = (value: any) => {
  return typeof value === 'number' ? value.toString() : value
}
interface IState {
  isLoading: boolean
  error: string | null
  gameType: IGameType[]
  gameListTypeCode: IListTypeCode[]
  currentGameTypeCode: IListTypeCode | null
  playTypeCodeList: any[] | undefined
  gameSubListTypeCode: IListPlayTypeData[]
  currentGameType: IGameType | null
  issueList: IIssueList
  queryForm: any
  currentTabs: string
  temp1PlayTypeCode: string
  temp2PlayTypeCode: string
}

interface IIssueList {
  [key: string]: any[]
}

interface IOption {
  value: any
  label: string
  disabled?: boolean
}

interface IssueIOption {
  label: string
  issue: string
  issueShort: string
  type: string
  year: string
  value: any
}

interface IGetter extends _GettersTree<IState> {
  labelOption: (state: IState) => IOption[]
  IssuelabelOption: (state: IState) => IssueIOption[]
  gameSubList: (state: IState) => (gameTypeCode: string) => IListPlayTypeData[]
}

interface IAction {
  getGameType: (query?: Partial<IGameTypePlatformBodyParameter>) => Promise<boolean>
  /** 获取 投票类型: 全部 特肖 特码 单双 平特肖 大小 波色 连肖 */
  getListPlayTypeCode: (bizFlag?: BizFlag) => Promise<void>
  /**
   * type 1 第一列
   * type 2 第二列的
   * 第一列切换 ，第二列也跟着变， 之前选择的也变了
   * 第一列选择在某些情况 第二列不现实
   * 第二例空选择当前第一列的值
   *
   * @param type
   * @param playTypeCode
   * @returns
   */
  changePlayTypeCode: (type: number, playTypeCode: string) => void
  getlistPlayType: () => Promise<void>
  changeGameType: (gameType?: string | null) => void
  getIssueByGameType: (gameType: string) => Promise<boolean>
  changeTab: (tab: string) => void
  handleReset: (queryForm: any) => void
  initSixKingListPage: (callback: Function) => void
}

export const useSixKingListPageStore = defineStore<'page.expertManagement.sixKingList', IState, IGetter, IAction>(
  'page.expertManagement.sixKingList',
  {
    state: (): IState => ({
      isLoading: false,
      error: null,
      gameType: [],
      currentGameType: null,
      issueList: {},
      currentTabs: 'sixking',
      gameListTypeCode: [],
      currentGameTypeCode: null,
      gameSubListTypeCode: [],
      playTypeCodeList: [],
      temp1PlayTypeCode: '',
      temp2PlayTypeCode: '',
      queryForm: {
        startIssue: '2025043',
        endIssue: '2025057',
        issue: '2025057',
        gameType: '2032',
        nickname: '',
        page: 1,
        playTypeCode: '0106',
        size: 15,
        sortName: 'recent_continue_win_count', // OR 'recent_continue_win_count'
        sortOrder: 'DESC',
        userId: '',
        isAll: true,
        loginOrUserId: ''
      }
    }),
    getters: {
      labelOption: (state: IState) => {
        return state.gameType.map((item) => ({
          label: item.gameTypeName,
          value: item.gameType
        }))
      },
      IssuelabelOption: (state: IState) => {
        if (state.currentGameType?.gameType) {
          return state.issueList[state.currentGameType.gameType]
        } else {
          return []
        }
      },
      gameSubList: (state: IState) => {
        return (gameTypeCode: string) => {
          return state.gameSubListTypeCode?.find((item) => item.playTypeCode === gameTypeCode)?.children || []
        }
      }
    },
    actions: {
      changeGameType(gameType) {
        this.queryForm.gameType = gameType

        if (gameType) {
          //  读取期数列表
          if (!this.issueList[gameType] || this.issueList[gameType].length === 0) {
            this.getIssueByGameType(gameType)
            return
          }

          this.currentGameType = this.gameType.find((i) => i.gameType === gameType) || null

          const data = this.issueList[gameType]
          if (gameType === '1') {
            data.map((item) => {
              return {
                ...item,
                issue: convertNumberToString(item.year) + item.issue,
                value: convertNumberToString(item.year) + item.issue,
                label: convertNumberToString(item.year) + item.issue,
                year: convertNumberToString(item.year)
              }
            })
          }

          this.queryForm.issue = data[0].issue
          this.queryForm.endIssue = data[0].issue
          this.queryForm.startIssue = data[2].issue
        } else {
          this.currentGameType = null
        }
      },
      changeTab(tab) {
        this.currentTabs = tab
      },
      handleReset(inital) {
        Object.assign(this.queryForm, inital)
      },
      async initSixKingListPage(callback) {
        this.isLoading = true
        try {
          // 加载游戏列表
          await this.getGameType()
          // 加载玩法列表
          await this.getListPlayTypeCode(BizFlag.Insight)
          // 加载玩法列表
          await this.getlistPlayType()

          // 加载开启的彩种
          const game = this.gameType.find((item) => item.status === 'y')
          // gameTypeShortName
          if (game) {
            this.queryForm.gameType = game.gameType
            await this.getIssueByGameType(game.gameType)
          } else {
            ElMessage.error('游戏期数加载失败,请查看彩种是否开启，或者刷新页面')
          }
          if (
            this.queryForm.gameType &&
            this.queryForm.endIssue &&
            this.queryForm.startIssue &&
            this.queryForm.issue &&
            this.queryForm.playTypeCode
          ) {
            callback()
          }
        } catch (error) {
          console.error('游戏列表加载失败')
        } finally {
          this.isLoading = false
        }
      },
      changePlayTypeCode(type, playTypeCode) {
        // * type 1 第一列
        // * type 2 第二列的
        // * 第一列切换 ，第二列也跟着变， 之前选择的也变了
        // * 第一列选择在某些情况 第二列不现实
        // * 第二例空选择当前第一列的值
        if (type === 1) {
          this.queryForm.playTypeCode = playTypeCode
          this.temp2PlayTypeCode = ''

          this.playTypeCodeList = this.gameSubListTypeCode
            .find((item) => item.playTypeCode === playTypeCode)
            ?.children?.map((item) => {
              return {
                label: item.predictionTypeName,
                value: item.playTypeCode
              }
            })
        }

        if (type === 2 && playTypeCode) {
          this.queryForm.playTypeCode = playTypeCode
        } else if (type === 2 && !playTypeCode) {
          this.queryForm.playTypeCode = this.temp1PlayTypeCode
          // 清空
          // this.temp1PlayTypeCode = playTypeCode
        }
      },
      /**
       * 游戏列表
       * currentGameType 默认加载第一个游戏 或者 指定游戏
       * @param _Query
       * @returns
       */
      async getGameType(_Query?: Partial<IGameTypePlatformBodyParameter>) {
        this.isLoading = true
        this.error = null
        try {
          // getGameTypePlatformList
          const query: IGameTypePlatformBodyParameter = {
            page: 1,
            size: 100,
            sortName: '',
            sortOrder: 'ASC',
            gameTypeShortName: '',
            gameTypeName: '',
            status: undefined,
            ..._Query
          }
          const res = await gameTypePlatformList(query)
          this.gameType = res.data.list
          this.currentGameType = res.data.list.find((i) => i.gameTypeName === _Query?.gameTypeName) || null
        } catch (error) {
          this.error = error instanceof Error ? error.message : 'Unknown error'
          return Promise.resolve(false)
        } finally {
          this.isLoading = false
        }

        return Promise.resolve(true)
      },
      /**
       * 特肖 特码  单双  一肖  大小  波色  连肖  杀特肖  一尾  杀肖  杀特尾  杀尾
       * 不中  天地生肖  家禽野兽  左右生肖  杀一头  稳禁一段  合数单双  杀一合 三行中特
       * @param bizFlag
       */
      async getListPlayTypeCode(bizFlag?: BizFlag) {
        this.isLoading = true
        this.error = null
        try {
          const res = await listPlayTypeCode({ bizFlag: bizFlag || BizFlag.Gallery })
          this.gameListTypeCode = res.data.list.map((item) => {
            const gameInfo = gameList.find((game) => {
              return game.gameName === item.predictionTypeName
            })
            return Object.assign(item, { other: gameInfo })
          })
          this.currentGameTypeCode = this.gameListTypeCode[0]
          this.queryForm.playTypeCode = this.gameListTypeCode[0].playTypeCode
          this.temp1PlayTypeCode = this.gameListTypeCode[0].playTypeCode
        } catch (error) {
          this.error = error instanceof Error ? error.message : 'Unknown error'
        } finally {
          this.isLoading = false
        }
      },
      /**
       * gameSubListTypeCode 玩法列表，不能直接用，需要过滤
       * 使用 currentGameTypeCode， 过滤玩法列表
       *
       */
      async getlistPlayType() {
        this.isLoading = true
        this.error = null
        try {
          const res = await listPlayType()
          if (res.success) {
            this.gameSubListTypeCode = res.data?.list
          }
          this.playTypeCodeList = res.data?.list
            .find((item) => item.playTypeCode === this.currentGameTypeCode?.playTypeCode)
            ?.children?.map((item) => {
              return {
                label: item.predictionTypeName,
                value: item.playTypeCode
              }
            })
        } catch (error) {
          this.error = error instanceof Error ? error.message : 'Unknown error'
        } finally {
          this.isLoading = false
        }
      },
      /**
       * 期数 issue queryForm.issue queryForm.endIssue queryForm.startIssue
       * @param gameType
       * @returns
       */
      async getIssueByGameType(gameType: string) {
        try {
          const res = await service.kv().getRecentYearsIssueList(gameKey[gameType]).do()
          const condition = (rawData: any[]) => {
            const all = rawData.flatMap(({ issues, year }) => {
              return issues.map((issue: any) => ({ ...issue, year }))
            })
            return all
          }

          const result = condition(res[0])
          const data = result
            .flatMap((item) => {
              if (gameType === '1') {
                // ！！！注意：港彩要特殊处理。 2025012 之前是 012 不含有年份
                return {
                  ...item,
                  issue: convertNumberToString(item.year) + item.issueShort,
                  value: convertNumberToString(item.year) + item.issueShort,
                  label: convertNumberToString(item.year) + item.issueShort,
                  year: convertNumberToString(item.year)
                }
              } else {
                return {
                  ...item,
                  issue: convertNumberToString(item.issue),
                  value: convertNumberToString(item.issue),
                  label: item.issue,
                  year: convertNumberToString(item.year)
                }
              }
            })
            .filter((i) => i.type === 'history')
            .slice(0, 25)

          this.issueList[gameType] = data
          this.queryForm.issue = data[0].issue
          this.queryForm.endIssue = data[0].issue
          this.queryForm.startIssue = data[2].issue

          return Promise.resolve(true)
        } catch (error) {
          return Promise.resolve(false)
        }
      }
    }
  }
)
