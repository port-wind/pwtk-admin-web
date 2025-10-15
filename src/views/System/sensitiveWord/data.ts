import type { TableOptions } from '@/components/mTable/types'

// 年份 期数 图纸名称 报纸名称 系列名称 彩种 发布用户 评论内容
//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'id',
    label: 'id',
    columAttr: {
      minWidth: 80
    }
  },
  {
    prop: 'word',
    label: '敏感词',
    columAttr: {
      minWidth: 80
    },
    slot: 'word'
  },
  {
    prop: 'status',
    label: '状态',
    columAttr: {
      minWidth: 120
    },
    slot: 'status'
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    columAttr: {
      minWidth: 160
    },
    slot: 'createdAt'
  },
  {
    prop: 'option',
    label: '操作',
    columAttr: {
      minWidth: 160
    },
    slot: 'option'
  }
]
