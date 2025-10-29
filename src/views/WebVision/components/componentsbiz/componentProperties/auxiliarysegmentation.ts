import type { IComponentProperty, ISetStyle } from './index'

// 辅助分割组件配置类型
export interface AuxiliarysegmentationConfigType {
  blankHeight: number // 空白高度
  segmentationtype: number // 分割类型
  paddType: number // 边距
  auxliarColor: string // 辅助线颜色
  bordertp: string // 线的类型
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<AuxiliarysegmentationConfigType>>>()

componentProperties.set('auxiliarysegmentation', {
  component: 'auxiliarysegmentation',
  text: '辅助分割',
  active: false,
  style: 'auxiliarysegmentationstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '辅助分割',
    componentType: 'auxiliarysegmentation',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      blankHeight: 30,
      segmentationtype: 1,
      paddType: 0,
      auxliarColor: 'rgb(229, 229, 229)',
      bordertp: 'solid'
    }
  }
})

export default componentProperties
