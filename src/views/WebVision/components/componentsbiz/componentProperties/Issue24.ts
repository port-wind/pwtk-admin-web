import { EModel, type Issue24 } from '../Issue24/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<Issue24>>>()

componentProperties.set('Issue24', {
  component: 'Issue24',
  text: '精选24码',
  active: false,
  style: 'Issue24Style',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '精选24码',
    componentType: 'Issue24',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '好彩【精选24码】',
      titlePrefix: '',
      subtitle: '',
      enable: true,
      model: EModel['24码'],
      size: 2,
      mainboardId: 'tiantianhaocai',
      forumId: 'tiantianhaocai1',
      forumIcon: 'dev/bbs/forum/icon/3187e4e98b574bd8bf8022652ee23576.jpeg',
      forumName: '澳门好彩【精选24码】',
      forumStatus: 'y',
      mainboardName: '天天好彩',
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
      },
      dynamicTemplate: '<p>{{issueNumber}} 期 &nbsp;<span style="color: rgb(9, 109, 217);">【 &nbsp;{{issues}} &nbsp;】</span> &nbsp; 开 {{result}} &nbsp;<span style="color: rgb(56, 158, 13);">{{flag}}</span></p>',
      dynamicActive: '#ff0'
    }
  }
})

export default componentProperties
