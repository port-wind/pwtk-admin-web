import type { IComponentProperty, ISetStyle } from './index'

// 表单模块组件配置类型
export interface InvestigateConfigType {
  jsonData: any[] // value1为sass显示内容，value2为前端显示内容
  postIdData: any[]
  text: string
  title: string
  model: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<InvestigateConfigType>>>()

componentProperties.set('Investigate', {
  component: 'Investigate',
  text: '表单模块',
  active: false,
  style: 'InvestigateStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '表单模块',
    componentType: 'Investigate',
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
