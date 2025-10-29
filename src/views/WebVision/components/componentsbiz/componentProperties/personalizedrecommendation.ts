import type { IComponentProperty, ISetStyle } from './index'

// 个性化推荐组件配置类型
export interface PersonalizedrecommendationConfigType {
  text: string
  title: string
  model: string
  recommendationType: 'user_based' | 'item_based' | 'content_based' | 'hybrid'
  maxRecommendations: number
  showReason: boolean
  showScore: boolean
  refreshOnLoad: boolean
  enableUserFeedback: boolean
  categories: string[]
  filters: {
    minRating: number
    maxPrice: number
    tags: string[]
  }
  displayStyle: 'list' | 'grid' | 'carousel'
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<PersonalizedrecommendationConfigType>>>()

componentProperties.set('personalizedrecommendation', {
  component: 'personalizedrecommendation',
  text: '个性化推荐',
  active: false,
  style: 'personalizedrecommendationstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '个性化推荐',
    componentType: 'personalizedrecommendation',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '个性化推荐',
      title: '为您推荐',
      model: 's1',
      recommendationType: 'hybrid',
      maxRecommendations: 6,
      showReason: true,
      showScore: false,
      refreshOnLoad: true,
      enableUserFeedback: true,
      categories: [],
      filters: {
        minRating: 0,
        maxPrice: 0,
        tags: []
      },
      displayStyle: 'grid'
    }
  }
})

export default componentProperties
