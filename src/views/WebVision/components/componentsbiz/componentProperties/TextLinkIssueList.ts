import type { TextLinkIssueList } from '../TextLinkIssueList/type'
import type { IComponentProperty, ISetStyle } from './index'

// 创建 Map 并导出
const componentProperties = new Map<string, IComponentProperty<ISetStyle<TextLinkIssueList>>>()
componentProperties.set('TextLinkIssueList', {
  component: 'TextLinkIssueList', // 中间预览组件名称
  text: '文本链接列表', // 显示名称
  active: false, // 是否可编辑
  style: 'TextLinkIssueListStyle', // 右侧配置组件名称
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '文本链接列表',
    componentType: 'TextLinkIssueList',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '文本链接列表组件',
    pageCode: '',
    configParamJson: {
      title: '新澳门好彩【高手榜三】',
      subtitle: '',
      forumId: 'tiantianhaocai7',
      forumIcon: 'dev/bbs/forum/icon/ece01ed1b1184c3bae9d5e40bf4c690c.jpeg',
      forumName: '澳门好彩【高手榜三】',
      forumStatus: 'y',
      mainboardName: '天天好彩',
      mainboardId: 'tiantianhaocai',
      enable: true,
      size: 20,
      links: [],
      listStyleJSON: {
        itemSpacing: 4,
        itemPadding: 9,
        itemsPerRow: 1,
        itemBorderWidth: 1,
        containerPadding: 4,
        itemBorderRadius: 5,
        itemBackgroundColor: '#FCFCFC',
        itemBorderColor: '#DDDDDD',
        itemHoverColor: '',
        itemTextColor: '#000000',
        headerBackgroundColor: '#E76B6B',
        headerTextColor: '#F5F5F5'
      },
      styleHeader: {
        backgroundColor: '#f8f9fa',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#09663f',
        headerBg2: '#1d9b3f',
        subTitleColor: '#ffffff',
        titleColor: '#FFFFFF'
      },
      styleMain: {
        numberSpacing: 4,
        numberSize: 14,
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
