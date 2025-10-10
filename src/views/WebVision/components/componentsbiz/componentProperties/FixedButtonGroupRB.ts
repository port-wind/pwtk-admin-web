import type { FixedButtonGroupRBConfig } from '../FixedButtonGroupRB/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<FixedButtonGroupRBConfig>>>()

componentProperties.set('FixedButtonGroupRB', {
  component: 'FixedButtonGroupRB',
  text: '固定按钮（下）',
  active: false,
  style: 'FixedButtonGroupRBStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '固定按钮（下）',
    componentType: 'FixedButtonGroupRB',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '固定按钮（下）',
      subtitle: '这是一个固定按钮（下）',
      content: '这里是内容区域，您可以在此处添加任何文本内容。',
      enable: true,
      showGameType: false,
      gameType: '2032',
      gameTypeCode: 'a6',
      forumId: '10',
      size: 10,
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
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 400,
        textColor: '#333333'
      }
    }
  }
})

export default componentProperties