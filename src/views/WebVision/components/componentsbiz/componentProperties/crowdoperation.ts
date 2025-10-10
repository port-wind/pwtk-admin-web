import type { IComponentProperty, ISetStyle } from './index'

// 人群运营组件配置类型
export interface CrowdoperationConfigType {
  text: string
  title: string
  model: string
  targetAudience: string
  operationStrategy: string
  activityList: Array<{
    id: string
    name: string
    type: string
    startTime: string
    endTime: string
    status: 'active' | 'pending' | 'completed'
    participantCount: number
  }>
  showParticipantCount: boolean
  showActivityStatus: boolean
  maxDisplayCount: number
  autoRefresh: boolean
  refreshInterval: number
}

const componentProperties = new Map<String, IComponentProperty<ISetStyle<CrowdoperationConfigType>>>()

componentProperties.set('crowdoperation', {
  component: 'crowdoperation',
  text: '人群运营',
  active: false,
  style: 'crowdoperationstyle',
  setStyle: {
    componentId: '',
    sketchCodeList: '',
    templateId: '',
    pageRenderingSeq: 0,
    websiteId: '',
    componentRef: '',
    componentName: '人群运营',
    componentType: 'crowdoperation',
    componentSort: '',
    status: '',
    isView: '',
    memo: '',
    pageCode: '',
    configParamJson: {
      text: '人群运营',
      title: '运营活动',
      model: 's1',
      targetAudience: '全体用户',
      operationStrategy: '精准营销',
      activityList: [],
      showParticipantCount: true,
      showActivityStatus: true,
      maxDisplayCount: 5,
      autoRefresh: false,
      refreshInterval: 30000
    }
  }
})

export default componentProperties
