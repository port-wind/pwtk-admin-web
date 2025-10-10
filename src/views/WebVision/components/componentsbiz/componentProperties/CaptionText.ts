import type { IComponentProperty, ISetStyle } from './index'
import type { CaptionTextConfig } from '../CaptionText/type'

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CaptionTextConfig>>>()

// 预设值
componentProperties.set('CaptionText', {
  component: 'CaptionText',
  text: '标题文字',
  active: false,
  style: 'CaptionTextStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '标题文字',
    componentType: 'CaptionText',
    componentSort: '',
    status: 'y',
    isView: 'y',
    memo: '标题文字组件',
    pageCode: '',
    configParamJson: {
      text: '标题文字',
      title: '',
      subtitle: '',
      enable: true,
      name: '标题文字',
      description: '这是一个标题文字组件的描述内容',
      wordSize: 18,
      descriptionSize: 14,
      wordWeight: 600,
      positions: 'left',
      descriptionWeight: 400,
      wordColor: '#333333',
      descriptionColor: '#666666',
      backColor: 'rgba(241, 241, 241, 1)',
      borderBott: false,
      wordHeight: 29,
      more: {
        show: false,
        type: 1,
        text: '查看更多',
        httpType: 10,
        http: ''
      },
      styleHeader: {
        backgroundColor: '#4a90e2',
        isGradient: true,
        headerBgColor: '#102B4B',
        headerBg: '#4a90e2',
        headerBg2: '#66bb6a',
        subTitleColor: '#BB1F1F',
        titleColor: '#AD2C2C'
      },
      styleMain: {
        containerPadding: 0,
        backgroundColor: '#ffffff',
        borderRadius: 0,
        margin: 0,
        boxShadow: 'none'
      }
    }
  }
})

export default componentProperties
