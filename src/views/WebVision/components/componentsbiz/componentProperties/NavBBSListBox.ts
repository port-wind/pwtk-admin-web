import type { IComponentProperty, ISetStyle } from './index'

// BBS列表组件配置类型
export interface NavBBSListBoxConfigType {
  model: string
  pageSize: number
  title: string
  bbsId: string
  forumId: string
  mainBoardId: string
  postId: string
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<NavBBSListBoxConfigType>>>()

componentProperties.set('NavBBSListBox', {
  component: 'NavBBSListBox',
  text: 'BBS列表模块',
  active: false,
  style: 'navBBSListBoxStyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: 'BBS列表模块',
    componentType: 'NavBBSListBox',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      model: 's1',
      pageSize: 5,
      title: 'BBS列表',
      bbsId: '',
      forumId: '',
      mainBoardId: '',
      postId: ''
    }
  }
})

export default componentProperties
