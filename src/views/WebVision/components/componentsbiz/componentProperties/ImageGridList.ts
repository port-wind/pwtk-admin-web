import type { ImageGridList } from '../ImageGridList/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<ImageGridList>>>()

componentProperties.set('ImageGridList', {
  component: 'ImageGridList',
  text: '图片网格列表',
  active: false,
  style: 'ImageGridListStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '图片网格列表',
    componentType: 'ImageGridList',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '澳门好彩【热门推荐】',
      subtitle: '',
      gameType: '2032', // 默认选择澳彩
      // 按彩种分组的图片项数据
      '2032': {
        gridItems: [
          {
            id: '1',
            title: '澳门跑狗图',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          },
          {
            id: '2',
            title: '九肖十码',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          },
          {
            id: '3',
            title: '大三巴30码',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      '1': {
        gridItems: [
          {
            id: '4',
            title: '港彩开奖图',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          },
          {
            id: '5',
            title: '港版跑狗图',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      '84': {
        gridItems: [
          {
            id: '6',
            title: '台彩资讯',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      '3995': {
        gridItems: [
          {
            id: '7',
            title: '新彩推荐',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      '5': {
        gridItems: [
          {
            id: '8',
            title: '新澳彩资料',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      '6': {
        gridItems: [
          {
            id: '9',
            title: '快乐8预测',
            imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
            link: '#',
            enabled: true,
            newspaper: ''
          }
        ]
      },
      gridStyleJSON: {
        contentItemPadding: 10,
        columnsPerRow: 3,
        itemSpacing: 8,
        itemPadding: 8,
        borderRadius: 8,
        imageHeight: 120,
        titleFontSize: 14,
        titleColor: '#333333',
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ed',
        borderWidth: 1,
        hoverEffect: true,
        showTitle: true
      },
      styleHeader: {
        backgroundColor: '#f8f9fa',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#09663f',
        headerBg2: '#1d9b3f',
        subTitleColor: '#ffffff',
        titleColor: '#FFFFFF'
      }
    }
  }
})

export default componentProperties
