import type { TableOptions } from '@/components/mTable/types'

export const options: TableOptions[] = [
  { prop: 'logo', label: '广告图片', slot: 'logo', columAttr: { width: '120' } },
  { prop: 'name', label: '广告名称', slot: 'name', columAttr: { width: '200' } },
  { prop: 'gameType', label: '彩种', slot: 'gameType', columAttr: { width: '150' } },
  {
    prop: 'startTime',
    label: '开始时间',
    dateName: 'startTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '180' }
  },
  {
    prop: 'endTime',
    label: '结束时间',
    dateName: 'endTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '180' }
  },
  { prop: 'status', label: '状态', slot: 'status', columAttr: { width: '150' } },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: { width: '180' }
  },
  // { prop: 'taskStatus', label: '任务状态', slot: 'taskStatus', columAttr: { width: '120px' } },
  { prop: 'operation', label: '操作', slot: 'operation' }
]
