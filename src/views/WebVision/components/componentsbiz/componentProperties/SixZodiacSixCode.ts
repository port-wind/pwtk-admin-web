import type { Issue24 } from '../Issue24/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<Issue24>>>()

componentProperties.set('SixZodiacSixCode', {
  component: 'SixZodiacSixCode',
  text: '六肖六码',
  active: false,
  style: 'SixZodiacSixCodeStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '六肖六码',
    componentType: 'SixZodiacSixCode',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '六肖六码组件，支持多期切换和广告配置',
    pageCode: '',
    configParamJson: {
      model: 19, // 六肖六码对应的EModel值
      title: '六肖六码',
      titlePrefix: '澳门六合彩',
      subtitle: '精准预测',
      enable: true,
      size: 8,
      forumId: 'haocai001',
      forumName: '澳门好彩【六肖六码】',
      mainboardName: '澳门好彩',
      mainboardId: 'haocai',
      forumIcon: 'dev/bbs/forum/icon/default.png',
      forumStatus: 'y',
      styleHeader: {
        backgroundColor: '#d32f2f',
        isGradient: true,
        headerBgColor: '#d32f2f',
        headerBg: '#d32f2f',
        headerBg2: '#f44336',
        subTitleColor: '#ffffff',
        titleColor: '#ffffff'
      },
      styleMain: {
        numberSize: 14,
        numberSpacing: 8,
        padding: 8,
        showPeriod: true,
        borderRadius: 4,
        showStatus: true,
        showResult: true,
        headerTextColor: '#333333'
      },
      // 六肖六码专用配置
      advertisementContent: '兴云播雨隐苍穹',
      advertisementTextColor: '#ffeb3b',
      advertisementFontSize: 14,
      itemBackgroundColor: '#333333',
      // 六肖六码组件新增配置
      sixZodiacSixCodeConfig: {
        itemBackgroundColor: '#333333',
        contentAreaBackgroundColor: '#000000',
        issueConfigs: {}
      }
    }
  }
})

export default componentProperties
