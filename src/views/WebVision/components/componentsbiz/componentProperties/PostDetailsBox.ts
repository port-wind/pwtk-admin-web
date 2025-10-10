import type { IComponentProperty, ISetStyle } from './index'

// 帖子详情模块组件配置类型
export interface PostDetailsBoxConfigType {
  model: string
  postId: string
  showAuthor: boolean
  showDate: boolean
  showTags: boolean
  showComments: boolean
  showLikes: boolean
  showShare: boolean
  commentPageSize: number
  autoLoad: boolean
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<PostDetailsBoxConfigType>>>()

componentProperties.set('PostDetailsBox', {
  component: 'PostDetailsBox',
  text: '帖子详情模块',
  active: false,
  style: 'PostDetailsBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '帖子详情模块',
    componentType: 'PostDetailsBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      postId: '',
      showAuthor: true,
      showDate: true,
      showTags: true,
      showComments: true,
      showLikes: true,
      showShare: true,
      commentPageSize: 10,
      autoLoad: true
    }
  }
})

export default componentProperties
