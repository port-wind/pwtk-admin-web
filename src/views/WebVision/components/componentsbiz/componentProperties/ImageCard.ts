import type { ImageCard } from '../ImageCard/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<ImageCard>>>()

componentProperties.set('ImageCard', {
  component: 'ImageCard',
  text: '图片卡片',
  active: false,
  style: 'ImageCardStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '图片卡片',
    componentType: 'ImageCard',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      enable: true,
      imageUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
      title: '产品标题',
      description: '这里是产品描述',
      link: '',
      imageStyleJSON: {
        enableHeight: false,
        height: 200,
        borderRadius: 8
      }
    }
  }
})

export default componentProperties
