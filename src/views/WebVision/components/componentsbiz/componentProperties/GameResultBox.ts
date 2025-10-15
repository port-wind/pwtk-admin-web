import type { IComponentProperty, ISetStyle } from './index'
import type { GameResultBox } from '../GameResultBox/type'

const componentProperties = new Map<String, IComponentProperty<ISetStyle<GameResultBox>>>()

componentProperties.set('GameResultBox', {
  component: 'GameResultBox',
  text: '开奖结果',
  active: false,
  style: 'GameResultBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '开奖结果模块',
    componentType: 'GameResultBox',
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
