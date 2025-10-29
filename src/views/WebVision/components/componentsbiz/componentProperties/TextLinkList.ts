import type { TextLinkList } from '../TextLinkList/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<TextLinkList>>>()

componentProperties.set('TextLinkList', {
  component: 'TextLinkList', // 中间预览组件名称
  text: '文本链接列表', // 显示名称
  active: false, // 是否可编辑
  style: 'TextLinkListStyle', // 右侧配置组件名称
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '文本链接列表',
    componentType: 'TextLinkList',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '自定义文本链接列表组件',
    pageCode: '',
    configParamJson: {
      title: '新澳门好彩【热门推荐】',
      subtitle: '',
      enable: true,
      links: [
        {
          id: '1',
          text: '神算码王【港澳计划王】',
          tag: '25中22',
          stag: ' 热门',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '2',
          text: '浪客剑心【五肖博10码】',
          tag: '16中16',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '3',
          text: '百里乔曦【稳杀三尾数】',
          tag: '23中22',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '4',
          text: '年年春时【公式七肖王】',
          tag: '17中15',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '5',
          text: '魅影无痕【平特五连肖】',
          tag: '15中12',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '6',
          text: '云鹤公子【三头爆特码】',
          tag: '10中10',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '7',
          text: '江湖故人【正版输尽光】',
          tag: '42中40',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '8',
          text: '一剑残月【绝杀料专区】',
          tag: '35中33',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '9',
          text: '仙风道骨【三肖主③码】 ',
          tag: '11中10',
          stag: '特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '10',
          text: '花田醉客【复式二中二】',
          tag: '18中14',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '11',
          text: '过分迷人【公式特三头】',
          tag: '33$30',
          stag: ' 神准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '12',
          text: '海棠花开【谜语解特码】',
          tag: '16中15',
          stag: ' 特准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '13',
          text: '慕容紫君【庄家必吃码】',
          tag: '20中20',
          stag: ' 无错',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '14',
          text: '六合天尊【内幕平特尾】',
          tag: '17中15',
          stag: ' 超准',
          link: '',
          enabled: true,
          textColor: '#333333',
          backgroundColor: '#f5f5f5'
        },
        {
          id: '15',
          text: '东北彩王【公式算六尾】',
          tag: '29中25',
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
        itemsPerRow: 1,
        itemSpacing: 5,
        itemPadding: 12,
        itemBorderRadius: 5,
        itemBackgroundColor: '#ffffff',
        itemTextColor: '#333333',
        itemBorderColor: '#e0e0e0',
        itemBorderWidth: 1,
        containerPadding: 3,
        itemHoverColor: '#f0f8ff'
      },
      styleHeader: {
        backgroundColor: '#4a90e2',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#09663F',
        headerBg2: '#1D9B3F',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff'
      },
      styleMain: {
        numberSize: 14,
        numberSpacing: 4,
        padding: 0,
        borderRadius: 8,
        showPeriod: true,
        showStatus: true,
        showResult: true,
        headerTextColor: '#ffffff'
      }
    }
  }
})

export default componentProperties
