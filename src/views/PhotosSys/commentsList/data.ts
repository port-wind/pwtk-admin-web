import type { TableOptions } from '@/components/mTable/types'

// 年份 期数 图纸名称 报纸名称 系列名称 彩种 发布用户 评论内容
//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'nickname',
    label: '发布用户',
    width: 200,
    slot: 'nickname',
    fixed: 'left',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'postYear',
    label: '年份',
    fixed: 'left',
    width: 80
  },
  {
    prop: 'postIssue',
    label: '期数',
    fixed: 'left',
    width: 100
  },
  {
    prop: 'issueName',
    label: '图纸名称',
    width: 140,
    slot: 'issueName',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'newspaperName',
    label: '报纸名称',
    width: 120,
    slot: 'newspaperName',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'seriesName',
    label: '系列名称',
    width: 120,
    slot: 'seriesName',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'gameTypeName',
    label: '彩种',
    width: 80,
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'postContent',
    label: '评论内容',
    slot: 'postContent'
  },
  {
    prop: 'status',
    label: '状态',
    width: 105,
    slot: 'status',
    columAttr: {
      // minWidth: 200
    }
  },
  {
    prop: 'postTime',
    label: '发布时间',
    width: 170,
    slot: 'postTime',
    columAttr: {
      // minWidth: 200
    }
  }
]
