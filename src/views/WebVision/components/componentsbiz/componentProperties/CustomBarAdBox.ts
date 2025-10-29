import type { CustomBarType } from '@/views/WebVision/components/componentsbiz/CustomBarAdBox/type.ts'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CustomBarType>>>()

componentProperties.set('CustomBarAdBox', {
  component: 'CustomBarAdBox',
  text: '自定义广告',
  active: false,
  style: 'CustomBarAdBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '通用广告模块',
    componentType: 'CustomBarAdBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      title: '精选广告',
      model: 's1',
      itemData: [
        {
          text: '广告文字内容',
          link: 'https://www.baidu.com'
        }
      ]
    }
  }
})

export default componentProperties
