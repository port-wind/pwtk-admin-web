// utils.js

export default function safeParseJSON(jsonString: any) {
  try {
    // 检查 jsonString 是否为字符串
    if (typeof jsonString !== 'string') {
      console.warn('Provided data is not a string:', jsonString)
      return null
    }

    // 尝试解析 JSON 字符串
    const parsedData = JSON.parse(jsonString)

    // 可选：进一步验证解析后的对象结构
    if (typeof parsedData !== 'object' || parsedData === null) {
      console.warn('Parsed data is not a valid object:', parsedData)
      return null
    }

    return parsedData
  } catch (error: any) {
    console.warn('JSON parsing error:', error.message)
    return null
  }
}
