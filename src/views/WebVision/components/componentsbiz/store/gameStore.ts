// src/stores/counter.js
import { atom } from 'nanostores'
import service from '../service/index'
import type { IGetBBsForumIdByIdData } from '@/api/bss/forumManagement/types'

export interface IGameType {
  areaCode: string
  classifier: string
  createTime: number
  gameType: string
  gameTypeCode: string
  gameTypeLongName: string
  gameTypeName: string
  gameTypeShortName: string
  sortNum: number
  status: string
  updateTime: number
}
interface IGameStore {
  year: number
  gameType: string
  gameTypeCode: string
  currentGame: IGameType | null
  gameTypeList: IGameType[]
  numInfo: any[]
  issueList: any[]
  forum: IGetBBsForumIdByIdData | null
  gameNameMap: Map<string, string>
  activeTabIndex: number // 用于六肖六码组件的tab同步
  playRules: any | null // 玩法规则数据
}

export const gameStore = atom<IGameStore>({
  year: 2025,
  gameType: '2032', // 默认值 澳彩
  gameTypeCode: 'a6',
  currentGame: {
    areaCode: '',
    classifier: '',
    createTime: 0,
    gameType: '2032',
    gameTypeCode: 'a6',
    gameTypeLongName: '澳门六合彩',
    gameTypeName: '澳彩',
    gameTypeShortName: '澳彩',
    sortNum: 0,
    updateTime: 0,
    status: 'y'
  },
  gameNameMap: new Map<string, string>(),
  numInfo: [],
  gameTypeList: [],
  issueList: [], //https://ocs.ai4funs.com/pwtk/gr/a6/history/2025
  forum: {
    forumId: '',
    mainboardId: '',
    forumName: '',
    forumCategory: '',
    forumIcon: '',
    createTime: '',
    mainboardName: ''
  },
  activeTabIndex: 0,
  playRules: null
})

export function setGameType(gameType: string) {
  // 查询所有彩种信息。并找出 current game
  const gameTypeList = gameStore.get().gameTypeList
  const currentGame = gameTypeList.find((item) => item.gameType === gameType)
  if (currentGame) {
    gameStore.set({
      ...gameStore.get(),
      gameType: currentGame.gameType,
      currentGame: currentGame
    })
    console.log('🚀 ~ setGameType ~ currentGame:', currentGame)
  }
}

export function changeGameType(game: IGameType) {
  gameStore.set({
    ...gameStore.get(),
    gameType: game.gameType,
    gameTypeCode: game.gameTypeCode,
    currentGame: game,
    activeTabIndex: 0 // 重置tab索引
  })
}

export function changeYear(year: number) {
  gameStore.set({
    ...gameStore.get(),
    year
  })
}

export function setActiveTabIndex(index: number) {
  gameStore.set({
    ...gameStore.get(),
    activeTabIndex: index
  })
}

async function getNumInfo() {
  const res: any = await service.kv().getAllNumInfo().do()
  if (res && res.length > 0) {
    gameStore.set({
      ...gameStore.get(),
      numInfo: res[0]
    })
  }
}

async function getPlayRules() {
  try {
    const res: any = await service.kv().getPlayRules().do()
    if (res && res.length > 0) {
      gameStore.set({
        ...gameStore.get(),
        playRules: res[0]
      })
    }
  } catch (error) {
    console.error('Failed to fetch play rules:', error)
  }
}

async function getIssueList() {
  const { gameTypeCode, year } = gameStore.get()
  const res: any = await service.kv().getGameResultHistory(gameTypeCode, year.toString()).do()
  if (res && res.length > 0) {
    gameStore.set({
      ...gameStore.get(),
      issueList: res[0].data
    })
  }
}

export async function getGameTypeList() {
  const res = await service.kv().getGamePlatform().do()
  if (res && res.length > 0) {
    gameStore.set({
      ...gameStore.get(),
      gameTypeList: res[0].data
    })
    gameStore.get().gameTypeList.forEach((item) => {
      gameStore.get().gameNameMap.set(item.gameType, item.gameTypeLongName.replace('六合彩', ''))
    })
  }
}

export async function updateForum(forumData) {
  let forum = gameStore.get().forum || ({} as IGetBBsForumIdByIdData)

  if (forum) {
    forum.mainboardId = forumData.mainboardId
    forum.forumId = forumData.forumId
  }

  if (forumData.forumStatus) {
    Object.assign(forum, forumData)
  }

  console.log(gameStore.get().forum)

  gameStore.set({
    ...gameStore.get(),
    forum
  })
}

export function getGameName(gameType: string) {
  return gameStore.get().gameNameMap.get(gameType)
}

// 获取玩法规则数据的便捷方法
export function getPlayRulesData() {
  return gameStore.get().playRules
}

// 获取生肖到数字的映射
export function getShengXiaoToNumber() {
  const { playRules } = gameStore.get()
  return playRules?.shengXiaoToNumber || {}
}

export function getChongOfRule() {
  const { playRules } = gameStore.get()
  return playRules?.chong || {}
}

// 获取五行到数字的映射
export function getWuXingToNumber() {
  const { playRules } = gameStore.get()
  return playRules?.wuXingToNumber || {}
}

// 获取玩法类型数组
export function getPlayTypes() {
  const { playRules } = gameStore.get()
  return playRules?.playTypes || []
}

// 根据代码获取特定玩法类型
export function getPlayTypeByCode(code: string) {
  const playTypes = getPlayTypes()
  return playTypes.find((playType: any) => playType.code === code)
}

getNumInfo()
getGameTypeList()
getIssueList()

async function initGameStore() {
  await getPlayRules() // 初始化玩法规则数据
}

initGameStore()
