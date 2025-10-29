import type { AggregationGameplay } from '../AggregationGameplay/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<AggregationGameplay>>>()

componentProperties.set('AggregationGameplay', {
  component: 'AggregationGameplay',
  text: '聚合玩法',
  active: false,
  style: 'AggregationGameplayStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '聚合玩法',
    componentType: 'AggregationGameplay',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '聚合玩法',
      subtitle: '这是一个聚合玩法',
      bottomTitle: '关注八仙 88846.com 年底换大别墅！',
      bottomTitleFontColor: '#0000ff',
      bottomTitleFontSize: 16,
      bottomTitleFontWeight: 800,
      bottomTitleBackgroundColor: '#508a88',
      content: '这里是内容区域，您可以在此处添加任何文本内容。',
      enable: true,
      size: 1,
      forumId: 'bx001',
      forumName: '八仙澳门《三肖③码》',
      forumStatus: 'y',
      mainboardName: '八仙澳门',
      mainboardId: 'baxianluntan',
      forumIcon: 'dev/bbs/forum/icon/3187e4e98b574bd8bf8022652ee23576.jpeg',
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
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 400,
        showResult: true,
        showStatus: true,
        showPeriod: true,
        textColor: '#333333'
      }
    }
  }
})

export default componentProperties
