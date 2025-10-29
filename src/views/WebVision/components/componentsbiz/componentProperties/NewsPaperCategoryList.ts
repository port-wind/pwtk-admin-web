import type { NewsPaperCategoryList } from '../NewsPaperCategoryList/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<NewsPaperCategoryList>>>()
// 定义 NewsPaperCategoryList 配置类型

// 创建 Map 并导出
componentProperties.set('NewsPaperCategoryList', {
  component: 'NewsPaperCategoryList', // 中间预览组件名称
  text: '分类图纸列表', // 显示名称
  active: false, // 是否可编辑
  style: 'NewsPaperCategoryListStyle', // 右侧配置组件名称
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '分类图纸列表',
    componentType: 'NewsPaperCategoryList',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '港澳六合图纸分类列表组件',
    pageCode: '',
    configParamJson: {
      title: '港澳六合图纸大全',
      description: '港澳六合图纸分类列表',
      defaultActiveTab: 1, // 默认激活"香港热图区"
      enable: true,
      categories: [
        {
          id: 'category_macau',
          name: '澳门热图区',
          enabled: true,
          items: [
            {
              id: 'item_1',
              text: '新版跑狗图',
              link: '/macau/paogou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_2',
              text: '高清跑狗图',
              link: '/macau/hd-paogou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_3',
              text: '正版蛇蛋图',
              link: '/macau/shedan',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_4',
              text: '香港禁肖图',
              link: '/macau/jinxiao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_5',
              text: '五点来料',
              link: '/macau/wudian',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_6',
              text: '码头诗',
              link: '/macau/matou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_7',
              text: '六肖王计划',
              link: '/macau/liuxiao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_8',
              text: '赌侠独高论坛',
              link: '/macau/duxia',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_9',
              text: '香港龙报图',
              link: '/macau/longbao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_10',
              text: '香港大小王',
              link: '/macau/daxiaowang',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_11',
              text: '蛇虎报',
              link: '/macau/shehu',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'item_12',
              text: '伯乐相马经',
              link: '/macau/bole',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            }
          ]
        },
        {
          id: 'category_hongkong',
          name: '香港热图区',
          enabled: true,
          items: [
            {
              id: 'hk_item_1',
              text: '马会传真图',
              link: '/hongkong/mahui',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_2',
              text: '金多宝传真',
              link: '/hongkong/jinduobao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_3',
              text: '无错三十六码',
              link: '/hongkong/wucuo36',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_4',
              text: '小纸条',
              link: '/hongkong/xiaozhi',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_5',
              text: '香港跑狗图',
              link: '/hongkong/paogou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_6',
              text: '四不像中特图',
              link: '/hongkong/sibuxiang',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_7',
              text: '生活幽默',
              link: '/hongkong/shenghuo',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_8',
              text: '独家原创12码',
              link: '/hongkong/dujia12',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_9',
              text: '曾道人来料',
              link: '/hongkong/zengdao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_10',
              text: '红姐综合资料',
              link: '/hongkong/hongjie',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_11',
              text: '118精算神排',
              link: '/hongkong/jingsuan',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_12',
              text: '正版四不像',
              link: '/hongkong/zhengban',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'hk_item_more',
              text: '查看更多>>',
              link: '/hongkong/more',
              enabled: true,
              isMoreButton: true,
              buttonColor: '#ff6600',
              textColor: '#ffffff'
            }
          ]
        },
        {
          id: 'category_new_macau',
          name: '新澳门热图区',
          enabled: true,
          items: [
            {
              id: 'new_item_1',
              text: '正版四不像',
              link: '/new-macau/sibuxiang',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_2',
              text: '正版挂牌全篇',
              link: '/new-macau/guapai',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_3',
              text: '管家婆',
              link: '/new-macau/guanjiaPo',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_4',
              text: '老版跑狗图',
              link: '/new-macau/laoban-paogou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_5',
              text: '一句话嬴大钱',
              link: '/new-macau/yijuhua',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_6',
              text: '平特一肖',
              link: '/new-macau/pingteyi',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_7',
              text: '男版跑狗图',
              link: '/new-macau/nanban-paogou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_8',
              text: '九龙挂牌解特码',
              link: '/new-macau/jiulong',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_9',
              text: '广州传真中特诗',
              link: '/new-macau/guangzhou',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_10',
              text: '香港密报A',
              link: '/new-macau/mibao',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            },
            {
              id: 'new_item_11',
              text: '死门客钱',
              link: '/new-macau/simen',
              enabled: true,
              isMoreButton: false,
              buttonColor: '#f5f5f5',
              textColor: '#333333'
            }
          ]
        }
      ],
      listStyleJSON: {
        headerBackgroundColor: '#4CAF50',
        headerTextColor: '#FFFF00',
        activeTabColor: '#4CAF50',
        inactiveTabColor: '#f5f5f5',
        tabTextColor: '#000000',
        itemsPerRow: 3,
        itemSpacing: 0,
        itemPadding: 12,
        itemBorderRadius: 4,
        itemBackgroundColor: '#FFFFFF',
        itemTextColor: '#333333',
        itemBorderColor: '#d9d9d9',
        itemBorderWidth: 1,
        moreButtonColor: null,
        moreButtonTextColor: '#FE2D03',
        containerPadding: 4
      }
    }
  }
})

export default componentProperties
