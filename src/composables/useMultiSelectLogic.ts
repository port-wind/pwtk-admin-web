import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { CheckboxValueType } from 'element-plus'

export interface MultiSelectState {
  isAllSelected: boolean
  isIndeterminate: boolean
  selectedKeys: string[]
  selectedRows: any[]
  checkedMap?: Map<string, boolean>
}

export interface MultiSelectOptions {
  selectKey?: string
  useCheckedMap?: boolean
  initialCheckedMap?: Map<string, boolean>
  onSelectionChange?: (_state: MultiSelectState) => void
  checkableStrategy?: (_row: any) => boolean
}

export interface MultiSelectLogic {
  // State
  isAllSelected: Ref<boolean>
  isIndeterminate: Ref<boolean>
  selectedKeys: ComputedRef<string[]>
  selectedRows: ComputedRef<any[]>
  checkedMap?: Ref<Map<string, boolean>>
  multiSelectState: ComputedRef<MultiSelectState>
  checkableStrategy?: (_row: any) => boolean

  // Methods
  handleSelectAll: (_data: any[]) => (_val: CheckboxValueType) => void
  handleCheckboxChange: (_data: any[]) => (_row: any, _val: boolean) => void
  clearSelection: (_data: any[]) => void
  getSelectedData: (_data: any[]) => MultiSelectState
  selectItems: (_data: any[], _keys: string[]) => void
  unselectItems: (_data: any[], _keys: string[]) => void
  toggleItem: (_data: any[], _key: string) => void
  resetAllCheckedStatus: (_data: any[]) => void
  initializeData: (_data: any[]) => void
}

export function useMultiSelectLogic(options: MultiSelectOptions = {}) {
  const {
    selectKey = 'id',
    useCheckedMap = false,
    initialCheckedMap = new Map(),
    onSelectionChange,
    checkableStrategy
  } = options

  // State
  const isAllSelected = ref(false)
  const isIndeterminate = ref(false)
  const checkedMap = useCheckedMap ? ref(new Map(initialCheckedMap)) : undefined

  // Computed values
  const selectedKeys = computed(() => {
    console.log('checkedMap', checkedMap)
    if (checkedMap) {
      return Array.from(checkedMap.value.keys()).filter((key) => checkedMap.value.get(key))
    }
    // Fallback: find selected from data directly (will be provided by methods)
    return []
  })

  const selectedRows = computed(() => {
    // This will be updated by the methods when called with data
    return []
  })

  const multiSelectState = computed<MultiSelectState>(() => ({
    isAllSelected: isAllSelected.value,
    isIndeterminate: isIndeterminate.value,
    selectedKeys: selectedKeys.value,
    selectedRows: selectedRows.value,
    ...(checkedMap && { checkedMap: checkedMap.value })
  }))
  // Internal method to get selected data
  const getSelectedDataInternal = (data: any[]): MultiSelectState => {
    const selectedRowsArray = data.filter((row) => row.checked)
    const selectedKeysArray = selectedRowsArray.map((row) => row[selectKey])

    return {
      isAllSelected: isAllSelected.value,
      isIndeterminate: isIndeterminate.value,
      selectedKeys: checkedMap ? selectedKeys.value : selectedKeysArray,
      selectedRows: selectedRowsArray,
      ...(checkedMap && { checkedMap: checkedMap.value })
    }
  }
  // Internal method to emit selection change
  const emitSelectionChange = (data: any[]) => {
    if (onSelectionChange) {
      const state = getSelectedDataInternal(data)
      onSelectionChange(state)
    }
  }

  const resetAllCheckedStatus = (data: any[]) => {
    const allChecked = data.length > 0 && data.every((item) => item.checked)
    const someChecked = data.some((item) => item.checked)
    isAllSelected.value = allChecked
    isIndeterminate.value = someChecked && !allChecked
  }

  const handleSelectAll = (data: any[]) => (val: CheckboxValueType) => {
    console.log('handleSelectAll', data, val)
    const boolVal = !!val
    data
      .filter((row) => {
        console.log('row', row)
        console.log('checkableStrategy', checkableStrategy?.(row))
        return checkableStrategy?.(row) || true
      })
      .forEach((row) => {
        let checked = boolVal
        if (checkableStrategy?.(row)) {
          checked = false
        }
        row.checked = checked
        if (checkedMap) {
          checkedMap.value.set(row[selectKey], checked)
        }
      })
    isAllSelected.value = boolVal
    isIndeterminate.value = false
    emitSelectionChange(data)
  }

  const handleCheckboxChange = (data: any[]) => (row: any, val: boolean) => {
    if (checkedMap) {
      checkedMap.value.set(row[selectKey], val)
    }
    resetAllCheckedStatus(data)
    emitSelectionChange(data)
  }

  const clearSelection = (data: any[]) => {
    data.forEach((row) => {
      row.checked = false
    })
    if (checkedMap) {
      checkedMap.value.clear()
    }
    resetAllCheckedStatus(data)
    emitSelectionChange(data)
  }

  const getSelectedData = (data: any[]): MultiSelectState => {
    return getSelectedDataInternal(data)
  }

  const selectItems = (data: any[], keys: string[]) => {
    keys.forEach((key) => {
      const row = data.find((item) => item[selectKey] === key)
      if (row) {
        row.checked = true
        if (checkedMap) {
          checkedMap.value.set(key, true)
        }
      }
    })
    resetAllCheckedStatus(data)
    emitSelectionChange(data)
  }

  const unselectItems = (data: any[], keys: string[]) => {
    keys.forEach((key) => {
      const row = data.find((item) => item[selectKey] === key)
      if (row) {
        row.checked = false
        if (checkedMap) {
          checkedMap.value.set(key, false)
        }
      }
    })
    resetAllCheckedStatus(data)
    emitSelectionChange(data)
  }

  const toggleItem = (data: any[], key: string) => {
    const row = data.find((item) => item[selectKey] === key)
    if (row) {
      const newVal = !row.checked
      row.checked = newVal
      if (checkedMap) {
        checkedMap.value.set(key, newVal)
      }
      resetAllCheckedStatus(data)
      emitSelectionChange(data)
    }
  }

  const initializeData = (data: any[]) => {
    // Initialize new data's checked status
    data.forEach((row) => {
      if (row.checked === undefined) {
        row.checked = false
        if (useCheckedMap) {
          row.checked = checkedMap?.value?.get(row[selectKey]) || false
        }
      }
    })
    resetAllCheckedStatus(data)
  }

  return {
    // State
    isAllSelected,
    isIndeterminate,
    selectedKeys,
    selectedRows,
    ...(checkedMap && { checkedMap }),
    multiSelectState,

    // Methods
    handleSelectAll,
    handleCheckboxChange,
    clearSelection,
    getSelectedData,
    selectItems,
    unselectItems,
    toggleItem,
    resetAllCheckedStatus,
    initializeData,
    checkableStrategy
  }
}
