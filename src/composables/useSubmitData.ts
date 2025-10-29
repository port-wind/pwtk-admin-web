import { ref, type Ref } from 'vue'
import { ElMessage } from 'element-plus'

export interface NextOptionsInterface {
  successMessage?: string
  onSuccess?: (data: Record<string, any>) => any
  failMessage?: string
  onFail?: (data: Record<string, any>) => any
}

export interface SubmitDataInterface {
  fetchFn: (params: any) => Promise<any>
  fetchParams: any
  nextOptions?: NextOptionsInterface
}

export interface UseSubmitDataInterface<T = any> {
  data: Ref<T | undefined>
  isLoading: Ref<boolean>
  submitData: (config: SubmitDataInterface) => Promise<any>
}

export function useSubmitData<T = any>(options?: Record<string, any>): UseSubmitDataInterface<T> {
  const data = ref<T>()
  const isLoading = ref<boolean>(false)

  const submitData = async ({ fetchFn, fetchParams, nextOptions }: SubmitDataInterface) => {
    isLoading.value = true
    const response = await fetchFn(fetchParams)
    if (response.success) {
      nextOptions?.successMessage !== 'none' &&
        ElMessage({
          message: nextOptions?.successMessage || '提交成功',
          type: 'success'
        })
      nextOptions?.onSuccess && nextOptions?.onSuccess(response)
    } else {
      nextOptions?.failMessage !== 'none' &&
        ElMessage({
          message: nextOptions?.failMessage || '提交失败,请稍后再试试',
          type: 'error'
        })
      nextOptions?.onFail && nextOptions?.onFail(response)
    }
    isLoading.value = false
  }

  if (options?.fetchFn) {
    submitData({
      fetchFn: options.fetchFn,
      fetchParams: options.fetchParams,
      nextOptions: options.nextOptions
    })
  }

  return {
    data,
    isLoading,
    submitData
  }
}
