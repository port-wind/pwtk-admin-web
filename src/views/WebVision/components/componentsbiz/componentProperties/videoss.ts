import type { IComponentProperty, ISetStyle } from './index'

// 视频组件配置类型
export interface VideossConfigType {
  text: string
  src: string // 视频地址
  coverUrl: string | null // 封面地址
  autoplay: boolean // 是否自动播放
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<VideossConfigType>>>()

componentProperties.set('videoss', {
  component: 'videoss',
  text: '视频',
  active: false,
  style: 'videostyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '视频',
    componentType: 'videoss',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '视频',
      src: '',
      coverUrl: null,
      autoplay: false
    }
  }
})

export default componentProperties
