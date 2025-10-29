import { type Ref } from 'vue'

/**
 * Composable for list reordering operations that returns new lists instead of mutating
 * @param list Reactive ref containing the list
 * @returns Object with reordering methods that return new lists
 */
export function useListReordering<T extends { index: number }>(list: Ref<T[]>) {
  /**
   * Creates a new array with updated indices
   * @param items Array to update indices for
   * @returns New array with updated indices
   */
  const updateIndices = (items: T[]): T[] => {
    return items.map((item, index) => ({
      ...item,
      index
    }))
  }

  /**
   * Creates a copy of the list with an item moved to a new position
   * @param item The item to move
   * @param targetIndex The index to move the item to
   * @returns A new array with the item moved, or the original list if the move couldn't be performed
   */
  const moveItem = (item: T, targetIndex: number): T[] => {
    // Create a copy of the original list
    const items = [...list.value]

    // Find the current index of the item
    const currentIndex = items.findIndex((listItem) => listItem.index === item.index)

    // Return the original list if the item isn't found or the target position is invalid
    if (currentIndex === -1 || targetIndex === currentIndex || targetIndex < 0 || targetIndex >= items.length) {
      return list.value
    }

    // Create a new list with the item moved
    const result = [...items]
    const [movedItem] = result.splice(currentIndex, 1)
    result.splice(targetIndex, 0, movedItem)

    return updateIndices(result)
  }

  return {
    /**
     * Returns a new list with the item moved up one position
     * @param item The item to move up
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveUp: (item: T): T[] => {
      console.log(item)

      const currentIndex = list.value.findIndex((listItem) => listItem.index === item.index)
      console.log(list.value)

      console.log(currentIndex)

      if (currentIndex <= 0) return list.value

      return moveItem(item, currentIndex - 1)
    },

    /**
     * Returns a new list with the item moved down one position
     * @param item The item to move down
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveDown: (item: T): T[] => {
      const currentIndex = list.value.findIndex((listItem) => listItem.index === item.index)
      if (currentIndex === -1 || currentIndex >= list.value.length - 1) return list.value

      return moveItem(item, currentIndex + 1)
    },

    /**
     * Returns a new list with the item moved to the top
     * @param item The item to move to the top
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveToTop: (item: T): T[] => {
      const currentIndex = list.value.findIndex((listItem) => listItem.index === item.index)
      if (currentIndex <= 0) return list.value

      return moveItem(item, 0)
    },

    /**
     * Returns a new list with the item moved to the bottom
     * @param item The item to move to the bottom
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveToBottom: (item: T): T[] => {
      const currentIndex = list.value.findIndex((listItem) => listItem.index === item.index)
      if (currentIndex === -1 || currentIndex === list.value.length - 1) return list.value

      return moveItem(item, list.value.length - 1)
    },

    /**
     * Returns a new list with the item moved to the specified position
     * @param item The item to move
     * @param targetIndex The target index to move the item to
     * @returns A new list with the item moved, or the original list if the move wasn't possible
     */
    moveTo: (item: T, targetIndex: number): T[] => {
      return moveItem(item, targetIndex)
    },

    /**
     * Returns a new list with the item removed
     * @param item The item to remove
     * @returns A new list without the item, or the original list if the item wasn't found
     */
    removeItem: (item: T): T[] => {
      const items = [...list.value]
      const index = items.findIndex((listItem) => listItem.index === item.index)

      if (index === -1) return list.value

      const result = [...items]
      result.splice(index, 1)

      return updateIndices(result)
    }
  }
}

// Usage example:
// const list = ref([1, 2, 3, 4, 5])
// const { moveUp, moveDown, moveToTop, moveToBottom, removeItem } = useListReordering(list)
//
// // To use it without mutating the original list:
// const newList = moveUp(list.value[2])
//
// // Or to update the original list with the new result:
// list.value = moveUp(list.value[2])
