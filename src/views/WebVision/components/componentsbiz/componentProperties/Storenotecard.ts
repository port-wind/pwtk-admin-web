import type { IComponentProperty, ISetStyle } from './index'

// 文章模块组件配置类型
export interface StorenotecardConfigType {
  text: string
  title: string
  model: string
  articleList: Array<{
    id: string
    title: string
    summary: string
    coverImage: string
    publishTime: string
    author: string
    readCount: number
    category: string
  }>
  showAuthor: boolean
  showDate: boolean
  showReadCount: boolean
  showCategory: boolean
  pageSize: number
  layout: 'list' | 'grid' | 'card'
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<StorenotecardConfigType>>>()

componentProperties.set('Storenotecard', {
  component: 'Storenotecard',
  text: '文章模块',
  active: false,
  style: 'StorenotecardStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '文章模块',
    componentType: 'Storenotecard',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '文章模块',
      title: '最新文章',
      model: 's1',
      articleList: [],
      showAuthor: true,
      showDate: true,
      showReadCount: true,
      showCategory: true,
      pageSize: 10,
      layout: 'list'
    }
  }
})

export default componentProperties
