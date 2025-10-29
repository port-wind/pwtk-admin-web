import type { IComponentProperty, ISetStyle } from './index'
import type { TwoGameResult } from '../TwoGameResult/type'

const componentProperties = new Map<String, IComponentProperty<ISetStyle<TwoGameResult>>>()

componentProperties.set('TwoGameResult', {
  component: 'TwoGameResult',
  text: '双彩票结果',
  active: false,
  style: 'TwoGameResultStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '双彩票结果模块',
    componentType: 'TwoGameResult',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      imageUrl: '',
      gameStyle: {
        isOpenTime: true,
        isNextIssue: true,
        isIssue: true,
        isGifAd: false
      },
      isOpenTime: true,
      model: 's1',
      isHistory: true,
      isNextIssue: true,
      isIssue: true,
      isIcon: true,
      isLongName: true,
      showArray: ['2032', '1', '5', '6'],
      isGifAd: false,
      noTab: false
    }
  }
})

export default componentProperties
