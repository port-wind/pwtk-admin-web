/**
 * 过滤掉空数组、空字符串和 null 值
 * @param data - 要过滤的数组
 * @returns 过滤后的数组
 */
export function filterEmptyValues<T>(data: Array<T | null | string | []>): T[] {
  return data.filter((item) => {
    if (item !== null) {
      if (typeof item === 'string' && item.trim() !== '') {
        return true
      }
      if (Array.isArray(item) && item.length > 0) {
        return true
      }
      return !(typeof item === 'string' || Array.isArray(item)) // 过滤掉空数组和空字符串之外的值
    }
    return false
  }) as T[]
}

/**
 * 过滤掉对象中空数组、空字符串和 null 值的属性
 * @param obj - 要过滤的对象
 * @returns 过滤后的对象
 */
export function filterEmptyProperties<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' && value.trim() !== '') {
        result[key as keyof T] = value
      } else if (Array.isArray(value) && value.length > 0) {
        result[key as keyof T] = value
      } else if (typeof value !== 'string' && !Array.isArray(value)) {
        result[key as keyof T] = value
      }
    }
  })
  return result
}

//更新bbsDialogOptions
// 将这个函数移到 script 标签外部,作为一个独立的工具函数
export const updateOptions = (data: any, options: any[]): any[] => {
  return options.map((option) => {
    if (Object.prototype.hasOwnProperty.call(data, option.prop)) {
      return { ...option, value: data[option.prop] }
    }
    return option
  })
}

export const isCheckUserId = (item) => typeof item === 'string' && Number(item).toString().length === 19
