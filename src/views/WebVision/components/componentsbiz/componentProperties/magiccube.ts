import type { IComponentProperty, ISetStyle } from './index'

// 魔方组件配置类型
export interface MagiccubeConfigType {
  text: string
  rubiksCubeType: number // 魔方类型
  pageMargin: number // 页面间距
  imgMargin: number // 图片间隙
  imageList: Array<{
    src: string
    linktype: string
    http: any
  }> // 图片列表
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<MagiccubeConfigType>>>()

componentProperties.set('magiccube', {
  component: 'magiccube',
  text: '魔方',
  active: false,
  style: 'magiccubestyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '魔方',
    componentType: 'magiccube',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '魔方',
      rubiksCubeType: 0,
      pageMargin: 0,
      imgMargin: 0,
      imageList: [
        {
          src: '',
          linktype: '10',
          http: {}
        },
        {
          src: '',
          linktype: '10',
          http: {}
        },
        {
          src: '',
          linktype: '10',
          http: {}
        },
        {
          src: '',
          linktype: '10',
          http: {}
        },
        {
          src: '',
          linktype: '10',
          http: {}
        }
      ]
    }
  }
})

export default componentProperties
