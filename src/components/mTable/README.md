# mTable Component

A Vue 3 table component based on Element Plus with optional multi-select functionality using composable architecture.

## Features

- Standard table functionality
- Pagination support
- Drag and drop (optional)
- Multi-select functionality (optional) - **Now with composable architecture!**
- Customizable columns
- Loading states

## Multi-Select Usage (New Composable Architecture)

### Basic Setup

The multi-select functionality is now extracted into a reusable composable `useMultiSelectLogic` that operates on data provided by the mTable component. The logic is lightweight by default and only uses checkedMap when explicitly enabled.

```vue
<template>
  <div>
    <!-- Control buttons -->
    <div style="margin-bottom: 16px;">
      <el-button @click="clearSelection">清空选择</el-button>
      <el-button @click="getSelected">获取选中项</el-button>
      <el-button
        @click="performBatchAction"
        :disabled="currentSelectedCount === 0"
      >
        批量操作 ({{ currentSelectedCount }})
      </el-button>
    </div>

    <!-- mTable with multi-select -->
    <mTable
      :data="tableData"
      :options="tableOptions"
      :multi-select="true"
      :multi-select-logic="multiSelectLogic"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import mTable from '@/components/mTable'
import { useMultiSelectLogic } from '@/composables/useMultiSelectLogic'

const tableData = ref([
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' },
  { id: '3', name: 'Bob', email: 'bob@example.com' }
])

const tableOptions = [
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { label: '操作', action: { label: '操作', width: 120 } }
]

// Initialize multi-select logic (no data needed!)
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'id',
  useCheckedMap: true, // Optional: enable for persistent tracking
  onSelectionChange: (state) => {
    console.log('Selection changed:', state)
    ElMessage.info(`已选择 ${state.selectedKeys.length} 项`)
  }
})

// Computed values for reactive UI
const currentSelectionState = computed(() => {
  return multiSelectLogic.getSelectedData(tableData.value)
})
const currentSelectedCount = computed(() => currentSelectionState.value.selectedRows.length)

// Use composable methods (pass data when calling)
const clearSelection = () => {
  multiSelectLogic.clearSelection(tableData.value)
}

const getSelected = () => {
  const selected = multiSelectLogic.getSelectedData(tableData.value)
  console.log('Current selection:', selected)
}

const performBatchAction = () => {
  const selected = multiSelectLogic.getSelectedData(tableData.value)
  if (selected.selectedRows.length === 0) {
    ElMessage.warning('请选择要操作的项目')
    return
  }

  // Your batch operation logic here
  console.log('Performing batch action on:', selected.selectedRows)
}
</script>
```

### Composable API: `useMultiSelectLogic`

#### Parameters

```typescript
useMultiSelectLogic(options?: MultiSelectOptions)
```

**Note:** No data parameter needed! The logic operates on data passed to its methods.

| Parameter | Type                 | Description           |
| --------- | -------------------- | --------------------- |
| `options` | `MultiSelectOptions` | Configuration options |

#### Options Interface

```typescript
interface MultiSelectOptions {
  selectKey?: string // The unique identifier field (default: 'id')
  useCheckedMap?: boolean // Enable persistent tracking (default: false)
  initialCheckedMap?: Map<string, boolean> // Initial checked state
  onSelectionChange?: (state: MultiSelectState) => void // Callback when selection changes
}
```

#### Returned State & Methods

| Property/Method | Type | Description |
| --- | --- | --- |
| `isAllSelected` | `Ref<boolean>` | Whether all items are selected |
| `isIndeterminate` | `Ref<boolean>` | Whether in indeterminate state |
| `selectedKeys` | `ComputedRef<string[]>` | Array of selected item keys (reactive) |
| `selectedRows` | `ComputedRef<any[]>` | Array of selected row objects (reactive) |
| `checkedMap` | `Ref<Map<string, boolean>>?` | Map of selection states (optional) |
| `multiSelectState` | `ComputedRef<MultiSelectState>` | Complete state object |
| `handleSelectAll` | `(data: any[]) => (val: CheckboxValueType) => void` | Handle select all action |
| `handleCheckboxChange` | `(data: any[]) => (row: any, val: boolean) => void` | Handle individual checkbox change |
| `clearSelection` | `(data: any[]) => void` | Clear all selections |
| `getSelectedData` | `(data: any[]) => MultiSelectState` | Get current selection state |
| `selectItems` | `(data: any[], keys: string[]) => void` | Programmatically select items |
| `unselectItems` | `(data: any[], keys: string[]) => void` | Programmatically unselect items |
| `toggleItem` | `(data: any[], key: string) => void` | Toggle selection of a single item |
| `initializeData` | `(data: any[]) => void` | Initialize data (called by mTable) |

### mTable Props for Multi-Select

| Prop Name          | Type             | Default | Description                       |
| ------------------ | ---------------- | ------- | --------------------------------- |
| `multiSelect`      | Boolean          | `false` | Enable multi-select functionality |
| `multiSelectLogic` | MultiSelectLogic | `null`  | Multi-select logic composable     |

### Advanced Usage Examples

#### Lightweight Mode (Default)

```typescript
// No checkedMap, minimal memory usage
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'id',
  onSelectionChange: (state) => {
    console.log(`Selected ${state.selectedKeys.length} items`)
  }
})
```

#### Persistent Tracking Mode

```typescript
// With checkedMap for advanced tracking
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'postId',
  useCheckedMap: true,
  onSelectionChange: (state) => {
    // state.checkedMap is available when useCheckedMap: true
    console.log('Checked map:', state.checkedMap)
  }
})
```

#### Programmatic Selection

```typescript
// All methods require data to be passed
multiSelectLogic.selectItems(tableData.value, ['1', '3', '5'])
multiSelectLogic.unselectItems(tableData.value, ['2', '4'])
multiSelectLogic.toggleItem(tableData.value, '1')
multiSelectLogic.clearSelection(tableData.value)
```

## Architecture Benefits

### ✅ **No Data Duplication**

- Logic doesn't own data, operates on data from mTable
- Single source of truth for table data
- No memory waste from duplicated arrays

### ✅ **Optional Performance Optimization**

- `checkedMap` only created when needed (`useCheckedMap: true`)
- Lightweight by default
- Scale up features as needed

### ✅ **Clean Separation**

- **mTable**: Owns data, handles presentation
- **useMultiSelectLogic**: Stateless controller with methods
- **Parent Component**: Orchestrates interactions

### ✅ **Perfect Encapsulation**

- Single prop interface: just pass `multiSelectLogic`
- All functionality contained in one object
- Future-proof and extensible

## Migration from Old API

### Before (Old API)

```vue
<mTable :multi-select="true" select-key="id" @selection-change="handleChange" ref="tableRef" />
```

### After (New Composable API)

```vue
<script setup>
const multiSelectLogic = useMultiSelectLogic({
  selectKey: 'id',
  onSelectionChange: handleChange
})
</script>

<template>
  <mTable
    :multi-select="true"
    :multi-select-logic="multiSelectLogic"
  />
</template>
```

## Best Practices

1. **No data duplication**: Logic operates on mTable's data
2. **Choose your mode**: Use `useCheckedMap: true` only when you need persistent tracking
3. **Computed reactive values**: Use computed properties for UI that reacts to selection changes
4. **Pass data to methods**: All logic methods need data passed as first parameter
5. **Single prop interface**: Just pass `multiSelectLogic` to mTable - ultra clean!
6. **Lightweight by default**: Only enable features you actually need
