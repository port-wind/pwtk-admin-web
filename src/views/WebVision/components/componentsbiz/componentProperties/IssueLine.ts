import { type IssueLine } from '../IssueLine/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<IssueLine>>>()

componentProperties.set('IssueLine', {
  component: 'IssueLine',
  text: '期数行',
  active: false,
  style: 'IssueLineStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '期数行',
    componentType: 'IssueLine',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      enable: true,
      title: '期数行',
      titlePrefix: '',
      gameType: '1',
      subtitle: '最新数据',
      page: 1,
      size: 10,
      onlyShowCurrentIssue: false,
      forumId: '10',
      isAll: 'y',
      frontExtend_Enable: false,
      frontExtend_StyleEnable: false,
      frontExtend_Content: '<p> 前置数据</p>',
      backendextend_Enable: false,
      backendextend_StyleEnable: false,
      backendextend_Content: '<p> 后置数据 </p>',
      dynamicTemplate:
        '{\"enable\":true,\"title\":\"赛马会【内部料】\",\"titlePrefix\":\"\",\"subtitle\":\"\",\"size\":10,\"forumId\":\"smh012\",\"frontExtend_Enable\":false,\"frontExtend_Content\":\"\",\"backendextend_Enable\":false,\"backendextend_Content\":\"\",\"dynamicTemplate\":\"<p><span style=\\\"color: rgb(146, 84, 222); font-size: 16px;\\\">{{issueNumber}}期数 「内部料」 开 【 {{shengxiao}} 】准</span></p><p><br></p><p><span style=\\\"font-size: 16px;\\\">资料 1 </span>{{0_predict0}}</p><p><br></p><p><span style=\\\"font-size: 16px;\\\">资料2 &nbsp;</span>{{1_predict0}}</p><p><br></p><p><span style=\\\"font-size: 16px;\\\">资料 3 </span>{{2_predict0}}</p>\",\"dynamicActiveBg\":\"#ffeb3b\",\"dynamicActiveText\":\"#000\",\"dynamicActiveTextAlign\":\"center\",\"dynamicActiveFontSize\":\"1.4rem\",\"dynamicActiveFontWeight\":\"600\",\"dynamicNoResult\":\"#00F\",\"styleHeader\":{\"backgroundColor\":\"#f8f9fa\",\"isGradient\":false,\"headerBgColor\":\"#EB0725\",\"headerBg\":\"#09663f\",\"headerBg2\":\"#1d9b3f\",\"subTitleColor\":\"#ffffff\",\"titleColor\":\"#FFFFFF\",\"borderRadius\":0,\"padding\":0},\"styleMain\":{\"borderRadius\":0,\"layout\":\"center\",\"contentPaddingLeftRight\":10,\"contentPaddingTopBottom\":19,\"paddingLeftRight\":5,\"paddingTopBottom\":7,\"columnCount\":1,\"itemSpacing\":0,\"listSpacing\":8,\"itemBackgroundColor\":\"#FFFFFF\",\"backgroundColor\":\"#FFFFFF\"},\"mainboardId\":\"saimahui\",\"forumName\":\"内部料\",\"forumStatus\":\"y\",\"mainboardName\":\"赛马会\",\"\":\"\"}',
      dynamicActiveBg: '#ffeb3b',
      dynamicActiveText: '#000',
      dynamicActiveTextAlign: 'center',
      dynamicActiveFontSize: '1.4rem',
      dynamicActiveFontWeight: '600',
      dynamicNoResult: '#00F',
      customJumpUrl: [],
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
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#e9ecef',
        contentPaddingLeftRight: 10,
        contentPaddingTopBottom: 19,
        paddingLeftRight: 5,
        paddingTopBottom: 7,
        columnCount: 1,
        itemSpacing: 0,
        listSpacing: 8,
        itemBackgroundColor: '#0DEEC5',
        backgroundColor: '#EACBCB',
        flexDirection: 'row',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)'
      }
    }
  }
})

export default componentProperties
