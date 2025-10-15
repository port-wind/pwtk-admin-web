import type { IComponentProperty, ISetStyle } from './index'

// 单元格组件配置类型
export interface EntertheshopConfigType {
  text: string
  icon: string // 左侧图标
  shopName: string // 左侧标题
  copywriting: string // 右侧内容
  type: string
  http: any
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<EntertheshopConfigType>>>()

componentProperties.set('entertheshop', {
  component: 'entertheshop',
  text: '单元格',
  active: false,
  style: 'entertheshopstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '单元格',
    componentType: 'entertheshop',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '单元格',
      icon: '',
      shopName: '左侧标题',
      copywriting: '右侧内容',
      type: '10',
      http: {}
    }
  }
})

export default componentProperties
