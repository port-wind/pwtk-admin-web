import type { Infobox } from '../Infobox/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<Infobox>>>()

componentProperties.set('Infobox', {
  component: 'Infobox',
  text: '信息框',
  active: false,
  style: 'InfoboxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '信息框',
    componentType: 'Infobox',
    componentSort: '0',
    status: 'y',
    isView: 'y',
    memo: '',
    pageCode: '',
    configParamJson: {
      line1: '以上资料载自互联网谨供友娱乐参考',
      line2: 'Copyright @ 2006-2025 天天好彩',
      line3: '广告联系TG:@U22244',
      styleJSON: {
        backgroundColor: '#f7f8fa',
        textColor: '#000'
      }
    }
  }
})

export default componentProperties
