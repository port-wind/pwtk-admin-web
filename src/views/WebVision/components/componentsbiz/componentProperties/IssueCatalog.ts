import { type IssueCatalog } from '../IssueCatalog/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<IssueCatalog>>>()

componentProperties.set('IssueCatalog', {
  component: 'IssueCatalog',
  text: '期数目录',
  active: false,
  style: 'IssueCatalogStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '期数目录',
    componentType: 'IssueCatalog',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '期数目录',
      titlePrefix: '',
      subtitle: '',
      enable: true,
      size: 3, // 期数数量
      isAll: 'n',
      issueGroup: 7,
      page: 1,
      mainboardId: 'baxianluntan',
      forumId: 'bx010',
      forumIcon: 'dev/bbs/forum/icon/3187e4e98b574bd8bf8022652ee23576.jpeg',
      forumName: '天地生肖',
      forumStatus: 'y',
      mainboardName: '八仙论坛',
      enableTemplateByPostIssue: false, // 按照期数配置模版， 如果是true，那就是每一期都要单独配置一个模版
      issueListTemplate: [], // 按照期数配置模版， 如果是true，那就是每一期都要单独配置一个模版, 如果没有找到对应的模版，则使用全局模版
      styleHeader: {
        backgroundColor: '#f8f9fa',
        isGradient: true,
        headerBgColor: '#4a90e2',
        headerBg: '#09663f',
        headerBg2: '#1d9b3f',
        subTitleColor: '#ffffff',
        titleColor: '#FFFFFF',
        borderRadius: 0,
        padding: 0
      },
      styleMain: {
        borderRadius: 8,
        layout: 'center',
        contentPaddingLeftRight: 10,
        contentPaddingTopBottom: 19,
        paddingLeftRight: 5,
        paddingTopBottom: 7,
        columnCount: 1,
        itemSpacing: 0,
        listSpacing: 8,
        itemBackgroundColor: '#0DEEC5',
        backgroundColor: '#EACBCB'
      },
      playGameCode: 8008,
      dynamicActiveBg: '#ffeb3b',
      dynamicActiveBgText: '#000',
      dynamicFontSize: 1,

      dynamicActiveText: '#00FF00',
      dynamicNoResult: '未开奖',
      frontExtend_Enable: true,
      backendextend_Enable: true,
      dynamicActive: '#ff0',
      dynamicTemplate:
        '<p>{{issueNumber}} 期 &nbsp;<span style="color: rgb(9, 109, 217);">【 &nbsp;{{issue_lp00_p00}} &nbsp;{{issue_lp01_p00}} &nbsp;{{issue_lp01_p01}} &nbsp;】</span> &nbsp; 开 {{shengxiao}}{{num}}准</p>',
      frontExtend_Content: '<p> 前置数据</p>',
      backendextend_Content: '<p> 后置数据 </p>'
    }
  }
})

export default componentProperties
