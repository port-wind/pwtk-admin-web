import type { TableOptions } from '@/components/mTable/types'

export const options: TableOptions[] = [
  { prop: 'announcementTitle', label: '公告标题', slot: 'announcementTitle', columAttr: { width: '180px' } },
  { prop: 'announcementDesc', label: '公告内容', slot: 'announcementDesc', columAttr: { width: '180px' } },
  { prop: 'isSecretDesc', label: '加密', slot: 'isSecretDesc', columAttr: { width: '90px' } },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '170px' }
  },
  {
    prop: 'startTime',
    label: '开始时间',
    dateName: 'startTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '170px' }
  },
  {
    prop: 'endTime',
    label: '结束时间',
    dateName: 'endTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '170px' }
  },
  { prop: 'announcementScope', label: '公告范围', slot: 'announcementScope' },
  { prop: 'anUserId', label: '针对对象', slot: 'anUserId', columAttr: { width: '200px' } },
  { prop: 'anTargets', label: '针对端点', slot: 'anTargets', columAttr: { width: '300px' } },
  { prop: 'anStatus', label: '状态', slot: 'anStatus', columAttr: { width: '120px' } },
  { prop: 'createUserName', label: '创建人', columAttr: { width: '120px' } },
  { prop: 'delayCloseSeconds', label: '延迟关闭秒数', columAttr: { width: '110px' } }

  //   { prop: 'taskId', label: '任务ID' },
  //   { prop: 'announcementId', label: '公告ID' },
  //   { prop: 'anTeamUserId', label: '公告针对团队ID' },
  //   { prop: 'anUserId', label: '公告针对用户ID' },
  //   { prop: 'anWebsiteId', label: '公告针对站点ID' },
  //   { prop: 'anDomain', label: '公告针对域名' },
  //   { prop: 'announcementUserType', label: '检索类型字段' },
  //   { prop: 'announcementUserValue', label: '检索值' },
  //   { prop: 'maintainPlanUserValueResultMap', label: '映射表' },
  //   { prop: 'createUserName', label: '创建人名称' }
]

//Table需要的数据
// export const options: TableOptions[] = [
//   {
//     prop: 'title',
//     label: '帖子标题',
//   },
//   {
//     prop: 'forumName',
//     label: '论坛',
//     width: 120,
//     slot: 'forumName',
//     columAttr: {
//       // minWidth: 200
//     }
//   },
//   {
//     prop: 'gameTypeName',
//     label: '彩种',
//     width: 80,
//     columAttr: {}
//   },
//   {
//     prop: 'postYear',
//     label: '年份',
//     width: 80
//   },
//   {
//     prop: 'postIssue',
//     label: '期数',
//     width: 120
//   },
//   {
//     prop: 'nickname',
//     label: '发布用户',
//     width: 160,
//     slot: 'nickname',
//     columAttr: {
//       // minWidth: 200
//     }
//   },
//   {
//     prop: 'postContent',
//     label: '评论内容',
//     slot: 'postContent'
//   },
//   {
//     prop: 'postStatus',
//     label: '状态',
//     width: 105,
//     slot: 'postStatus',
//     columAttr: {}
//   },
//   {
//     prop: 'postTime',
//     label: '发布时间',
//     width: 170,
//     slot: 'postTime',
//     columAttr: {}
//   }
// ]
