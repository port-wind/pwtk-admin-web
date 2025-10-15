export function getValue(obj: Record<string, any>, path: string): any {
  // 如果传入的对象为空或路径为空，直接返回 undefined
  if (!obj || !path) return obj

  // 将路径字符串按点号分割成数组
  const keys = path.split('.')

  // 使用 reduce 逐步深入对象获取值
  return keys.reduce((current, key) => {
    // 如果当前值存在且不是 null/undefined，则继续取下一层值
    return current && current[key] !== undefined ? current[key] : undefined
  }, obj)
}
