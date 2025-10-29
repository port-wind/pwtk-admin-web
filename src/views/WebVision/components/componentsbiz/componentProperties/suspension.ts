import type { IComponentProperty, ISetStyle } from './index'

// 悬浮按钮组件配置类型
export interface SuspensionConfigType {
  text: string
  position: 'left' | 'right' | 'center'
  verticalPosition: 'top' | 'middle' | 'bottom'
  buttonStyle: 'circle' | 'square' | 'rounded'
  size: 'small' | 'medium' | 'large'
  backgroundColor: string
  textColor: string
  icon: string
  showText: boolean
  buttonText: string
  actionType: 'link' | 'phone' | 'custom'
  actionValue: string
  zIndex: number
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<SuspensionConfigType>>>()

componentProperties.set('suspension', {
  component: 'suspension',
  text: '悬浮按钮',
  active: false,
  style: 'suspensionstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '悬浮按钮',
    componentType: 'suspension',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '悬浮按钮',
      position: 'right',
      verticalPosition: 'bottom',
      buttonStyle: 'circle',
      size: 'medium',
      backgroundColor: '#1989fa',
      textColor: '#ffffff',
      icon: '',
      showText: false,
      buttonText: '联系我们',
      actionType: 'phone',
      actionValue: '',
      zIndex: 1000
    }
  }
})

export default componentProperties
