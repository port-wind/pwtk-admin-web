import type { HotRecommendations } from '../HotRecommendations/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<HotRecommendations>>>()

componentProperties.set('HotRecommendations', {
  component: 'HotRecommendations',
  text: '热门推荐',
  active: false,
  style: 'HotRecommendationsStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '热门推荐',
    componentType: 'HotRecommendations',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '热门推荐',
      subtitle: '这是一个热门推荐',
      content: '这里是内容区域，您可以在此处添加任何文本内容。',
      enable: true,
      styleHeader: {
        backgroundColor: '#f8f9fa',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#4a90e2',
        headerBg2: '#5aa5f0',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff'
      },
      styleMain: {
        padding: 0,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 400,
        textColor: '#333333'
      },
      links: [
        {
          id: '1',
          text: '稳准中半波',
          tag: '25中22',
          stag: ' 热门',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '2',
          text: '二字猜平特',
          tag: '16中16',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '3',
          text: '大胆买一肖',
          tag: '23中22',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '4',
          text: '绝杀10码',
          tag: '17中15',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '5',
          text: '买啥就开啥',
          tag: '15中12',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '6',
          text: '一句爆特码',
          tag: '10中10',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '7',
          text: '(三)头必中特',
          tag: '42中40',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '8',
          text: '四肖选一肖',
          tag: '35中33',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '9',
          text: '一肖中特码',
          tag: '11中10',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '10',
          text: '特码单双王',
          tag: '18中14',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '11',
          text: '霸气三连肖',
          tag: '33中30',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '12',
          text: '四肖博八码',
          tag: '16中15',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '13',
          text: '九宫禁特肖',
          tag: '20中20',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '14',
          text: '16码爆中特',
          tag: '17中15',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '15',
          text: '五尾期期中',
          tag: '29中25',
          stag: ' 推荐',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '16',
          text: '一波博⑥码',
          tag: '22中20',
          stag: ' 热门',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '17',
          text: '六肖中码王',
          tag: '14中13',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '18',
          text: '三肖博⑥码',
          tag: '19中17',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '19',
          text: '极限杀肖料',
          tag: '25中23',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '20',
          text: '挑战28码',
          tag: '12中12',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '21',
          text: '财富六肖王',
          tag: '28中26',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '22',
          text: '港澳计划王',
          tag: '15中14',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '23',
          text: '金牌爆二尾',
          tag: '21中19',
          stag: ' 热门',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '24',
          text: '精品出四肖',
          tag: '18中16',
          stag: ' 推荐',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        }
      ],
      listStyleJSON: {
        headerBackgroundColor: 'rgba(32, 81, 139, 1)',
        headerTextColor: '#ffffff',
        itemsPerRow: 4,
        itemSpacing: 5,
        itemPadding: 12,
        itemBorderRadius: 5,
        itemBackgroundColor: '#ffffff',
        itemTextColor: '#333333',
        itemBorderColor: '#e0e0e0',
        itemBorderWidth: 1,
        containerPadding: 3,
        itemHoverColor: '#f0f8ff'
      }
    }
  }
})

export default componentProperties
