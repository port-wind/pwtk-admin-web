import type { IReqSysCompListData } from '@/api/site/sysComponent/type'
import type { TableOptions } from '@/components/mTable/types'
export interface IExpose {
  open: (row?: IReqSysCompListData) => void
}
//
//Table需要的数据

export const options: TableOptions[] = [
  {
    prop: 'componentId',
    label: '组件ID',
    columAttr: {
      minWidth: 185
    }
  },
  {
    prop: 'componentType',
    label: '组件类型',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'componentName',
    label: '组件名称',
    slot: 'componentName',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: '组件',
    label: '组件',
    slot: 'button',
    minWidth: 110
  },
  {
    prop: 'pageCode',
    label: '页面编码',
    slot: 'pageCode',
    minWidth: 160
  },
  {
    prop: 'sketchCodeList',
    label: '草图代码',
    slot: 'sketchCode',
    columAttr: {
      minWidth: 160
    }
  },
  {
    prop: 'status',
    label: '状态',
    columAttr: {
      minWidth: 80
    },
    slot: 'status'
  },
  {
    prop: 'isView',
    label: '可见',
    columAttr: {
      minWidth: 80
    },
    slot: 'isView'
  },
  // {
  //   prop: 'deleteItem',
  //   label: '操作',
  //   slot: 'deleteItem',
  //   columAttr: {
  //     width: 110
  //   }
  // },
  {
    prop: 'memo',
    label: '备注',
    columAttr: {
      minWidth: 200
    },
    slot: 'memo'
  }
]
