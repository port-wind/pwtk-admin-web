import type { IComponentProperty, ISetStyle } from './index'

// 公告栏组件配置类型
export interface NoticeBarBoxConfigType {
  model: string
  text: string
  backgroundColor: string
  textColor: string
  showIcon: boolean
  icon: string
  scrollable: boolean
  scrollSpeed: number
  showCloseButton: boolean
  actionType: 'none' | 'link' | 'popup'
  actionValue: string
  height: number
  position: 'top' | 'bottom' | 'fixed'
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<NoticeBarBoxConfigType>>>()

componentProperties.set('NoticeBarBox', {
  component: 'NoticeBarBox',
  text: '公告栏',
  active: false,
  style: 'NoticeBarBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '公告栏模块',
    componentType: 'NoticeBarBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      text: '这是一条重要公告信息，请大家注意查看！',
      backgroundColor: '#fff3cd',
      textColor: '#856404',
      showIcon: true,
      icon: 'notice',
      scrollable: true,
      scrollSpeed: 50,
      showCloseButton: true,
      actionType: 'none',
      actionValue: '',
      height: 40,
      position: 'top'
    }
  }
})

export default componentProperties
