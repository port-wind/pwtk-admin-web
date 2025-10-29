import type { TableOptions } from '@/components/mTable/types'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'nickname',
    label: '发布用户',
    width: 200,
    slot: 'nickname',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'title',
    label: '帖子标题',
    width: 200,
    slot: 'title'
  },
  {
    prop: 'gameTypeName',
    label: '彩种',
    width: 80,
    columAttr: {}
  },
  {
    prop: 'forumName',
    label: '论坛',
    width: 120,
    slot: 'forumName',
    columAttr: {
      // minWidth: 200
    }
  },

  {
    prop: 'postYear',
    label: '年份',
    width: 80
  },
  {
    prop: 'postIssue',
    label: '期数',
    width: 120
  },
  {
    prop: 'postContent',
    label: '评论内容',
    slot: 'postContent'
  },
  {
    prop: 'postStatus',
    label: '状态',
    width: 105,
    slot: 'postStatus',
    columAttr: {}
  },
  {
    prop: 'postTime',
    label: '发布时间',
    width: 170,
    slot: 'postTime',
    columAttr: {}
  }
]
