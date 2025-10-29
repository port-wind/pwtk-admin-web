// import constants from "@/constants";
// import utils from "@/utils";
import axios from 'axios'
// import { PUBLIC_KV_URL } from '@/consts'
const PUBLIC_KV_URL = 'https://ocs.ai4funs.com/pwtk'

const instance = axios.create({})

// const WEBSITE = JSON.parse(utils.getSession(constants.sessionStorageKeys.WEBSITE) || '');
// const WEBSITE_DOMAIN = JSON.parse(utils.getSession(constants.sessionStorageKeys.WEBSITE_DOMAIN) || '');
// https://ocs.ai4funs.com/pwtk/tk/a6/issueList
export default () => {
  const init: string[] = []

  const api = {
    getAllNumInfo: () => {
      init.push(`allNumInfo`)
      return api
    },
    /**
     * @description 获取最近几年的期数
     * @param {string} gameType 游戏类型
     */
    getRecentYearsIssueList: (gameType: string) => {
      init.push(`tk/${gameType}/issueList`)
      return api
    },
    /**
     * @description 获取站点信息
     */
    getDomain: (domain?: string) => {
      // init.push(`wm/domain/${domain ?? import.meta.env.PUBLIC_WEBSITE_DOMAIN}`);
      init.push(`wm/domain/${domain}`)
      return api
    },
    // 获取网站全量
    getWebsiteAll: (domain?: string) => {
      // wm/domain/simple/{domain}
      // init.push(`wm/domain/simple/${domain ?? import.meta.env.PUBLIC_WEBSITE_DOMAIN}`);
      init.push(`wm/domain/simple/${domain}`)
      return api
    },
    /**
     * @description 获取游戏类型
     */
    getGamePlatform: () => {
      init.push(`gr/gameType/list`)
      return api
    },
    /**
     *
     * @param gameType 游戏id
     * @param manageSiteId 客商id
     * @returns
     */
    getAllGamePlatform: (gameType: string, manageSiteId: string) => {
      init.push(`tk/websiteList/${manageSiteId}/${gameType}`)
      return api
    },
    /**
     * @description 获取当前期期数
     * @param gameType 游戏类型
     */
    getGameIssueCurrentInfo: (gameType: string) => {
      init.push(`gr/${gameType}/issue/currentInfo`)
      return api
    },
    /**
     * @description 获取当前期期数
     * @param gameType 游戏类型
     */
    getGameIssueCurrent: (gameType: string) => {
      init.push(`gr/${gameType}/current`)
      return api
    },
    /**
     * @description 获取开奖历史
     * @param gameType 游戏类型
     * @param year 年份
     */
    getGameResultHistory: (gameType: string, year: string) => {
      init.push(`gr/${gameType}/history/${year}`)
      return api
    },
    /**
     * @description 获取开奖日期
     * @param gameType 游戏类型
     */
    getGameOpenTime: (gameType: string) => {
      init.push(`gr/${gameType}/openTime`)
      return api
    },
    //==================================页面组件库用 部分=================================
    // https://ocs.ai4funs.com/pwtk/bbs/{manageSiteId}/forum/{forumId}/{gameType}
    // /**
    //  * @description 获取特定论坛列表
    //  */
    // getBBSDetailList: (forumId: string, gameType: string) => {
    //   init.push(`bbs/${WEBSITE?.manageSiteId}/forum/${forumId}/${gameType}`);
    //   return api;
    // },
    /**
     * @description 获取BBS列表
     */
    getBBSList: (manageSiteId: string) => {
      init.push(`bbs/${manageSiteId}/bbsList`)
      return api
    },
    getPlayRules: () => {
      init.push(`gr/website/playRules`)
      return api
    },
    /**
     * @description 获取页面组件数据
     */
    getPageComponent: (websiteId: string, pageCode?: string) => {
      // console.log(websiteId, pageCode, WEBSITE, WEBSITE_DOMAIN);
      if (pageCode) {
        init.push(`wm/website/${websiteId}/${pageCode}/components`)
      } else {
        init.push(`wm/website/${websiteId}/components`)
      }
      return api
    },

    do: () => instance.get<any[]>(`${PUBLIC_KV_URL}?keys=${init.join(',')}`).then((res) => Object.values(res.data)),
    getRequest: () => instance.get<any[]>(`${PUBLIC_KV_URL}/${init}`).then((res) => Object.values(res.data))
  }
  return api
}
