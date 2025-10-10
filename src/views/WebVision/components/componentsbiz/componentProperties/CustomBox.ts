import type { IComponentProperty, ISetStyle } from './index'

// 通用盒子组件配置类型
export interface CustomBoxConfigType {
  jsonData: any[] // value1为sass显示内容，value2为前端显示内容
  postIdData: any[]
  text: string
  title: string
  model: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CustomBoxConfigType>>>()

componentProperties.set('CustomBox', {
  component: 'CustomBox',
  text: '通用盒子',
  active: false,
  style: 'CustomBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '自定义模块',
    componentType: 'CustomBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      jsonData: [],
      postIdData: [],
      text: '表单模块',
      title: '表单模块',
      model: 's1'
    }
  }
})

export default componentProperties
