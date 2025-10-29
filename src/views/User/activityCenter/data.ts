import type { TableOptions } from '@/components/mTable/types'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'url',
    label: '图标',
    slot: 'imageInfo',
    width: 72,
    columAttr: {
      align: 'center'
    }
  },
  {
    prop: 'activityName',
    label: '活动名称',
    slot: 'activityName',
    width: 160
  },
  {
    prop: 'sortNum',
    label: '排序编号',
    width: 90,
    columAttr: {
      align: 'left'
    }
  },
  {
    prop: 'beginTime',
    label: '开始时间',
    slot: 'beginTime',
    width: 180
  },
  {
    prop: 'endTime',
    label: '结束时间',
    slot: 'endTime',
    width: 180
  },
  {
    prop: 'talents',
    label: '针对对象',
    slot: 'talents'
  },
  {
    prop: 'state',
    label: '状态',
    slot: 'state',
    width: 160
  },
  {
    prop: 'remark',
    label: '备注',
    width: 170
  }
]
