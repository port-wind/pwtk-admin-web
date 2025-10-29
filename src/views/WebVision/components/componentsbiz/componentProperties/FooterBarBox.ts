import type { IComponentProperty, ISetStyle } from './index'

// 首页页脚组件配置类型
export interface FooterBarBoxConfigType {
  model: string
  backgroundColor: string
  textColor: string
  showCopyright: boolean
  copyrightText: string
  showLinks: boolean
  links: Array<{
    text: string
    url: string
  }>
  contactInfo: {
    phone: string
    email: string
    address: string
  }
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<FooterBarBoxConfigType>>>()

componentProperties.set('FooterBarBox', {
  component: 'FooterBarBox',
  text: '首页页脚',
  active: false,
  style: 'FooterBarBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '首页页脚模块',
    componentType: 'FooterBarBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      backgroundColor: '#f8f9fa',
      textColor: '#333333',
      showCopyright: true,
      copyrightText: 'Copyright © 2024 WebVision. All rights reserved.',
      showLinks: true,
      links: [
        { text: '关于我们', url: '/about' },
        { text: '服务条款', url: '/terms' },
        { text: '隐私政策', url: '/privacy' }
      ],
      contactInfo: {
        phone: '',
        email: '',
        address: ''
      }
    }
  }
})

export default componentProperties
