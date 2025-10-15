import type { IssueList } from '../IssueList/type'
import type { IComponentProperty, ISetStyle } from './index'

// 定义默认数据
const IssueListData = {
  title: '澳门好彩【黄历一号】',
  description: '澳门开奖信息列表',
  enable: true,
  maxDisplayCount: 30,
  issueItems: [
    {
      id: 'item_1',
      period: '167期',
      title: '一位定单',
      subtitle: '二条中特',
      status: '已嗮幸',
      link: '/link1',
      enabled: true
    },
    {
      id: 'item_2',
      period: '167期',
      title: '稳准脑筋',
      subtitle: '十月十日',
      status: '已嗮幸',
      link: '/link2',
      enabled: true
    },
    {
      id: 'item_3',
      period: '167期',
      title: '我能爆发',
      subtitle: '笃定必发',
      status: '已嗮幸',
      link: '/link3',
      enabled: true
    },
    {
      id: 'item_4',
      period: '167期',
      title: '大胆爱丁',
      subtitle: '七仙界',
      status: '已嗮幸',
      link: '/link4',
      enabled: true
    },
    {
      id: 'item_5',
      period: '167期',
      title: '科州中特',
      subtitle: '高好计分',
      status: '已嗮幸',
      link: '/link5',
      enabled: true
    },
    {
      id: 'item_6',
      period: '167期',
      title: '鸟鹤翘翡',
      subtitle: '黄蓍中特',
      status: '已嗮幸',
      link: '/link6',
      enabled: true
    },
    {
      id: 'item_7',
      period: '167期',
      title: '四肖选一肖',
      subtitle: '败军失利',
      status: '已嗮幸',
      link: '/link7',
      enabled: true
    },
    {
      id: 'item_8',
      period: '167期',
      title: '一肖中特码',
      subtitle: '白明指令',
      status: '已嗮幸',
      link: '/link8',
      enabled: true
    },
    {
      id: 'item_9',
      period: '167期',
      title: '特码草头王',
      subtitle: '四月二计',
      status: '已嗮幸',
      link: '/link9',
      enabled: true
    },
    {
      id: 'item_10',
      period: '167期',
      title: '新气三连肖',
      subtitle: '黄文中特',
      status: '已嗮幸',
      link: '/link10',
      enabled: true
    },
    {
      id: 'item_11',
      period: '167期',
      title: '大连赌王',
      subtitle: '老黑赌特',
      status: '已嗮幸',
      link: '/link11',
      enabled: true
    },
    {
      id: 'item_12',
      period: '167期',
      title: '仙人献码',
      subtitle: '闪明先锋',
      status: '已嗮幸',
      link: '/link12',
      enabled: true
    },
    {
      id: 'item_13',
      period: '167期',
      title: '十选诗财',
      subtitle: '玄机特码',
      status: '已嗮幸',
      link: '/link13',
      enabled: true
    },
    {
      id: 'item_14',
      period: '167期',
      title: '一字猪平特',
      subtitle: '黄文玄机',
      status: '已嗮幸',
      link: '/link14',
      enabled: true
    },
    {
      id: 'item_15',
      period: '167期',
      title: '五尾期期中',
      subtitle: '黄总选钱',
      status: '已嗮幸',
      link: '/link15',
      enabled: true
    },
    {
      id: 'item_16',
      period: '167期',
      title: '一波博总码',
      subtitle: '四肖博八码',
      status: '已嗮幸',
      link: '/link16',
      enabled: true
    },
    {
      id: 'item_17',
      period: '167期',
      title: '六肖中特码',
      subtitle: '九宫禁肖诗',
      status: '已嗮幸',
      link: '/link17',
      enabled: true
    },
    {
      id: 'item_18',
      period: '167期',
      title: '三肖博总码',
      subtitle: '16码爆中特',
      status: '已嗮幸',
      link: '/link18',
      enabled: true
    },
    {
      id: 'item_19',
      period: '167期',
      title: '极限杀码料',
      subtitle: '城区28码',
      status: '已嗮幸',
      link: '/link19',
      enabled: true
    },
    {
      id: 'item_20',
      period: '167期',
      title: '财富六肖王',
      subtitle: '港澳计划王',
      status: '已嗮幸',
      link: '/link20',
      enabled: true
    },
    {
      id: 'item_21',
      period: '167期',
      title: '金牌爆三尾',
      subtitle: '精品出四肖',
      status: '已嗮幸',
      link: '/link21',
      enabled: true
    },
    {
      id: 'item_22',
      period: '167期',
      title: '神算子平特',
      subtitle: '飞鹰爆特码',
      status: '已嗮幸',
      link: '/link22',
      enabled: true
    },
    {
      id: 'item_23',
      period: '167期',
      title: '特码天骄仙',
      subtitle: '六合心水',
      status: '已嗮幸',
      link: '/link23',
      enabled: true
    },
    {
      id: 'item_24',
      period: '167期',
      title: '玄机来料',
      subtitle: '神童送码',
      status: '已嗮幸',
      link: '/link24',
      enabled: true
    },
    {
      id: 'item_25',
      period: '167期',
      title: '彩民救星',
      subtitle: '财神爷',
      status: '已嗮幸',
      link: '/link25',
      enabled: true
    },
    {
      id: 'item_26',
      period: '167期',
      title: '极限验证',
      subtitle: '天机不可泄露',
      status: '已嗮幸',
      link: '/link26',
      enabled: true
    },
    {
      id: 'item_27',
      period: '167期',
      title: '大彩小彩',
      subtitle: '富贵在天',
      status: '已嗮幸',
      link: '/link27',
      enabled: true
    },
    {
      id: 'item_28',
      period: '167期',
      title: '先锋火爆',
      subtitle: '码如神助',
      status: '已嗮幸',
      link: '/link28',
      enabled: true
    },
    {
      id: 'item_29',
      period: '167期',
      title: '一肖翡翠',
      subtitle: '财码通神',
      status: '已嗮幸',
      link: '/link29',
      enabled: true
    },
    {
      id: 'item_30',
      period: '167期',
      title: '天线宝宝',
      subtitle: '精英码王',
      status: '已嗮幸',
      link: '/link30',
      enabled: true
    }
  ],
  listStyleJSON: {
    // 头部样式
    headerBackgroundColor: '#28a745',
    headerTextColor: '#ffffff',
    headerPadding: 15,
    
    // 列表样式
    listBackgroundColor: '#ffffff',
    itemPadding: 12,
    itemSpacing: 2,
    itemBorderColor: '#e6e6e6',
    itemBorderWidth: 1,
    
    // 文本样式
    periodTextColor: '#333333',
    titleTextColor: '#333333',
    subtitleTextColor: '#666666',
    statusTextColor: '#28a745',
    
    // 容器样式
    containerPadding: 0,
    borderRadius: 8
  }
}

const componentProperties = new Map<string, IComponentProperty<ISetStyle<IssueList>>>()

componentProperties.set('IssueList', {
  component: 'IssueList',
  text: '期数列表',
  active: false,
  style: 'IssueListStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '期数列表',
    componentType: 'IssueList',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '',
    pageCode: '',
    configParamJson: IssueListData
  }
})

export default componentProperties
