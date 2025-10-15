import type { TableOptions } from '@/components/mTable/types'

// 年份 期数 图纸名称 报纸名称 系列名称 彩种 发布用户 评论内容
//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'websiteId',
    label: '站点',
    slot: 'websiteId',
    width: 200
  },
  {
    prop: 'templateName',
    label: '绑定模板',
    slot: 'templateName',
    width: 200
  },
  {
    prop: 'ownerUserId',
    label: '账户名称 | 账户昵称',
    slot: 'ownerUserId',
    width: 180
  },
  {
    prop: 'websiteStatus',
    label: '状态',
    slot: 'websiteStatus',
    width: 70
  },
  {
    prop: 'pageComponent',
    label: '页面组件',
    slot: 'pageComponent',
    width: 100
  },

  {
    prop: 'keyWords',
    label: '标题',
    width: 120
  },
  {
    prop: 'templateName',
    showOmission: true,
    label: '关键字'
  },
  {
    prop: 'describe',
    label: '描述',
    showOmission: true,
    width: 170
  },
  {
    prop: 'onlineServiceCode',
    label: '在线客服',
    width: 200
  },
  {
    prop: 'statisticsCode',
    label: '统计代码',
    slot: 'statisticsCode',
    width: 200
  },
  {
    prop: 'langCodes',
    label: '语言',
    slot: 'langCodes',
    showOmission: true,
    width: 200
  },
  {
    prop: 'areaCodes',
    label: '地区',
    slot: 'areaCodes',
    width: 200
  },
  {
    prop: 'memo',
    label: '备注',
    showOmission: true,
    width: 200
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    width: 200
  }
]
