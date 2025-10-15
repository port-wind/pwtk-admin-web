import type { ICarouselApp } from '../CarouselApp/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<ICarouselApp>>>()

// 创建默认配置
componentProperties.set('CarouselApp', {
  component: 'CarouselApp',
  text: '轮播图广告',
  active: false,
  style: 'CarouselAppStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '轮播图广告',
    componentType: 'CarouselApp',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      tabs: [
        {
          title: '特码尽在66853',
          promoText: '特码点击在线',
          amount: '首充送988元',
          bannerColor: '#ff6b6b',
          appIcon: 'dev/bbs/mainboard/icon/956297c4afb84f3dae0af33bf6149692.png',
          appName: 'tk6图库 APP',
          appSize: '60.28MB',
          category: '图库软件',
          downloads: '已有本站评分9999万',
          rating: '9.9',
          screenshot: '/images/screenshots/lottery-screenshot-1.png',
          androidDownload: 'https://example.com/android-download-1',
          iosDownload: 'https://example.com/ios-download-1',
          webUrl: 'https://example.com/website-1',
          statusText: '已有本站评分9999万，请放心下载！',
          banner: 'dev/bbs/mainboard/icon/92fa75ae0364498288a6c4796f02c457.png'
        },
        {
          title: '首充送988元',
          promoText: '新朋好友／六含',
          amount: '注册即送188',
          bannerColor: '#4CAF50',
          appIcon: 'dev/bbs/mainboard/icon/833270c90a73451582a0b93edad7daaa.png',
          appName: '6262彩票 APP',
          appSize: '37.28MB',
          category: '国产软件',
          downloads: '已有本站评分5000万',
          rating: '9.9',
          screenshot: '/images/screenshots/lottery-screenshot-2.png',
          androidDownload: 'https://example.com/android-download-2',
          iosDownload: 'https://example.com/ios-download-2',
          webUrl: 'https://example.com/website-2',
          statusText: '已有本站评分5000万，请放心投注！',
          banner: 'dev/bbs/mainboard/icon/3f28cdcedbab48fe9ada8ab27ba25b98.png'
        }
      ]
    }
  }
})

export default componentProperties
