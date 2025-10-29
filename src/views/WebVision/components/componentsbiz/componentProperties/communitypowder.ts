import type { IComponentProperty, ISetStyle } from './index'

// 社群涨粉组件配置类型
export interface CommunitypowderConfigType {
  text: string
  title: string
  description: string
  qrCodeUrl: string
  groupName: string
  backgroundColor: string
  textColor: string
  showQRCode: boolean
  showGroupInfo: boolean
  actionText: string
  actionType: 'join' | 'scan' | 'link'
  actionValue: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CommunitypowderConfigType>>>()

componentProperties.set('communitypowder', {
  component: 'communitypowder',
  text: '社群涨粉',
  active: false,
  style: 'communitypowderstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '社群涨粉',
    componentType: 'communitypowder',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '社群涨粉',
      title: '加入我们的社群',
      description: '扫码加入，获取更多优质内容和服务',
      qrCodeUrl: '',
      groupName: '官方交流群',
      backgroundColor: '#f8f9fa',
      textColor: '#333333',
      showQRCode: true,
      showGroupInfo: true,
      actionText: '立即加入',
      actionType: 'scan',
      actionValue: ''
    }
  }
})

export default componentProperties
