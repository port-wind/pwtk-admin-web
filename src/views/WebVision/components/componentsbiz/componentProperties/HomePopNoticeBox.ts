import type { IComponentProperty, ISetStyle } from './index'

// 首页公告组件配置类型
export interface HomePopNoticeBoxConfigType {
  model: string
  title: string
  content: string
  showCloseButton: boolean
  autoClose: boolean
  autoCloseDelay: number
  showOnce: boolean
  backgroundColor: string
  textColor: string
  position: 'center' | 'top' | 'bottom'
  showMask: boolean
  maskColor: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<HomePopNoticeBoxConfigType>>>()

componentProperties.set('HomePopNoticeBox', {
  component: 'HomePopNoticeBox',
  text: '首页公告',
  active: false,
  style: 'HomePopNoticeBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '首页公告模块',
    componentType: 'HomePopNoticeBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      title: '重要公告',
      content: '这里是公告内容，请注意查看！',
      showCloseButton: true,
      autoClose: false,
      autoCloseDelay: 5000,
      showOnce: false,
      backgroundColor: '#ffffff',
      textColor: '#333333',
      position: 'center',
      showMask: true,
      maskColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
})

export default componentProperties
