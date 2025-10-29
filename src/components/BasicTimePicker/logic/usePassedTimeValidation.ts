// useTimeValidation.ts
import { ElMessageBox } from 'element-plus'

export function usePassedTimeValidation() {
  /**
   * Checks if a time is in the past based on hours and minutes
   */
  const isTimePassed = (timestamp: number): boolean => {
    if (!timestamp) return false

    const selectedDate = new Date(timestamp)
    const now = new Date()

    return (
      selectedDate.getHours() < now.getHours() ||
      (selectedDate.getHours() === now.getHours() && selectedDate.getMinutes() < now.getMinutes())
    )
  }

  /**
   * Formats a timestamp to HH:MM:SS
   */
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}:00`
  }

  /**
   * Validates if a time is in the past and shows confirmation dialog
   * @returns {Promise<{valid: boolean, adjustedTime?: number}>}
   */
  const validateEffectiveTime = async (timestamp: number): Promise<{ valid: boolean; adjustedTime?: number }> => {
    if (!timestamp) {
      return { valid: true }
    }

    // Check if time is in the past
    if (!isTimePassed(timestamp)) {
      return { valid: true }
    }

    // Time is in the past, show confirmation dialog
    const timeString = formatTime(timestamp)
    const message = `生效时间将设置为次日的 ${timeString}。是否继续提交？`

    try {
      await ElMessageBox.confirm(message, '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // Adjust to tomorrow
      const tomorrow = new Date(timestamp)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return { valid: true, adjustedTime: tomorrow.getTime() }
    } catch {
      // User canceled
      return { valid: false }
    }
  }

  return {
    isTimePassed,
    formatTime,
    validateEffectiveTime
  }
}
