# WebVision 模块专用规则

## WebVision 组件开发规范

### 拖拽组件规范

- 所有拖拽组件必须使用 `vuedraggable`
- 图片组件必须设置 `draggable="false"`
- 组件边框显示规则: `border: element.active && deleShow ? '2px solid #155bd4' : ''`

### 组件映射规范

- 中间预览组件注册到 `componentMap`
- 右侧配置组件注册到 `componentRightMap`
- 配置组件文件名必须以 `style` 结尾

### 状态管理规范

```typescript
// WebVision专用状态结构
const datas = reactive<Data>({
  id: null,
  pageSetup: {
    /* 页面设置 */
  },
  pageComponents: []
})

const choose = reactive<Choose>({
  deleShow: true,
  rightcom: 'decorate',
  currentproperties: datas.pageSetup
  // ...其他选择状态
})
```

### API 调用规范

```typescript
// WebVision相关API导入
import { getSysComponent } from '@/api/webgw/sysCompent'
import { addTemplateComponent, getTemplateComponent } from '@/api/webgw/template'
import { addWebsiteComponent, findWebsiteComponent } from '@/api/webgw/websit'
```
