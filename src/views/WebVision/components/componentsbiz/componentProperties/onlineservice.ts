import type { IComponentProperty, ISetStyle } from './index'

// 在线客服组件配置类型
export interface OnlineserviceConfigType {
  text: string
  title: string
  model: string
  serviceType: 'chat' | 'phone' | 'email' | 'form'
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  icon: string
  backgroundColor: string
  textColor: string
  showWelcomeMessage: boolean
  welcomeMessage: string
  showAvatar: boolean
  avatarUrl: string
  serviceName: string
  serviceStatus: 'online' | 'offline' | 'busy'
  contactInfo: {
    phone: string
    email: string
    workingHours: string
  }
  autoShow: boolean
  showDelay: number
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<OnlineserviceConfigType>>>()

componentProperties.set('onlineservice', {
  component: 'onlineservice',
  text: '在线客服',
  active: false,
  style: 'onlineservicestyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '在线客服',
    componentType: 'onlineservice',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '在线客服',
      title: '客服中心',
      model: 's1',
      serviceType: 'chat',
      position: 'bottom-right',
      icon: 'service',
      backgroundColor: '#1989fa',
      textColor: '#ffffff',
      showWelcomeMessage: true,
      welcomeMessage: '您好！有什么可以帮助您的吗？',
      showAvatar: true,
      avatarUrl: '',
      serviceName: '客服小助手',
      serviceStatus: 'online',
      contactInfo: {
        phone: '400-123-4567',
        email: 'service@example.com',
        workingHours: '9:00-18:00'
      },
      autoShow: false,
      showDelay: 3000
    }
  }
})

export default componentProperties
