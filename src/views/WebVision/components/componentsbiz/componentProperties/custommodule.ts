import type { IComponentProperty, ISetStyle } from './index'

// 自定义模块组件配置类型
export interface CustommoduleConfigType {
  text: string
  demo: string
  img: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CustommoduleConfigType>>>()

componentProperties.set('custommodule', {
  component: 'custommodule',
  text: '自定义模块',
  active: false,
  style: 'custommodulestyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '自定义模块',
    componentType: 'custommodule',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '自定义模块',
      demo: '自定义内容',
      img: 'https://img2.baidu.com/it/u=1905875968,4289754134&fm=26&fmt=auto&gp=0.jpg'
    }
  }
})

export default componentProperties
