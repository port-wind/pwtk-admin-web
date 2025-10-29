import type { LotteryResult } from '../LotteryResult/type'
import type { IComponentProperty, ISetStyle } from './index'

const componentProperties = new Map<string, IComponentProperty<ISetStyle<LotteryResult>>>()

componentProperties.set('LotteryResult', {
  component: 'LotteryResult',
  text: '开奖结果',
  active: false,
  style: 'LotteryResultStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '开奖结果',
    componentType: 'LotteryResult',
    componentSort: '0',
    status: 'y',
    isView: 'y',
    memo: '',
    pageCode: '',
    configParamJson: {
      apiEndpoint: '',
      defaultTabId: 'macau',
      lotteries: [
        {
          id: 'macau',
          name: '澳门六合彩',
          displayName: '澳门彩',
          issue: '162期',
          numbers: [
            { value: '32', color: 'green', zodiac: '狗', element: '火' },
            { value: '10', color: 'blue', zodiac: '猴', element: '火' },
            { value: '15', color: 'blue', zodiac: '兔', element: '木' },
            { value: '49', color: 'green', zodiac: '蛇', element: '土' },
            { value: '06', color: 'green', zodiac: '鼠', element: '土' },
            { value: '14', color: 'blue', zodiac: '龙', element: '水' },
            { value: '48', color: 'blue', zodiac: '马', element: '火' }
          ]
        },
        {
          id: 'hongkong',
          name: '香港六合彩',
          displayName: '香港彩',
          issue: '159期',
          numbers: [
            { value: '11', color: 'red', zodiac: '羊', element: '金' },
            { value: '22', color: 'green', zodiac: '猴', element: '水' },
            { value: '33', color: 'blue', zodiac: '鸡', element: '木' },
            { value: '44', color: 'red', zodiac: '狗', element: '火' },
            { value: '01', color: 'green', zodiac: '猪', element: '土' },
            { value: '12', color: 'blue', zodiac: '鼠', element: '金' },
            { value: '23', color: 'red', zodiac: '牛', element: '水' }
          ]
        },
        {
          id: 'newmacau',
          name: '新澳六合彩',
          displayName: '新澳彩',
          issue: '108期',
          numbers: [
            { value: '07', color: 'blue', zodiac: '猪', element: '土' },
            { value: '18', color: 'green', zodiac: '鼠', element: '金' },
            { value: '29', color: 'red', zodiac: '牛', element: '水' },
            { value: '30', color: 'blue', zodiac: '虎', element: '木' },
            { value: '41', color: 'green', zodiac: '兔', element: '火' },
            { value: '02', color: 'red', zodiac: '龙', element: '土' },
            { value: '13', color: 'blue', zodiac: '蛇', element: '金' }
          ]
        }
      ]
    }
  }
})

export default componentProperties 