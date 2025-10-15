import type { AdBarConfigType } from '../AdBar/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<String, IComponentProperty<ISetStyle<AdBarConfigType>>>()

componentProperties.set('AdBar', {
  component: 'AdBar',
  text: '推广广告',
  active: false,
  style: 'AdBarStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '推广广告模块',
    componentType: 'AdBar',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      adData: [
        {
          index: 1,
          img: 'https://tp.7217tp.com/960x80.gif',
          link: '',
          name: '广告位1'
        },
        {
          index: 2,
          img: 'https://7188tp1.com/960801.gif',
          link: '',
          name: '广告位2'
        }
      ]
    }
  }
})

export default componentProperties
