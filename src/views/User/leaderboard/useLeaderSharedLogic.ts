// src/composables/useLeaderboard.ts
import { useModalsStore } from '@/stores/modalStore'
import { ref, onMounted, reactive } from 'vue'

export function useLeaderSharedLogic(fetchData: Function) {
  const tableData = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = ref(15)
  const total = ref(0)
  const isLoading = ref(false)
  const currentQueryParams = reactive<any>({})

  const handleSearch = (queryParams: any) => {
    Object.assign(currentQueryParams, queryParams)
    fetchData()
  }

  const handleReset = () => {
    Object.keys(currentQueryParams).forEach((key) => {
      delete currentQueryParams[key]
    })
    currentPage.value = 1
    pageSize.value = 15
    fetchData()
  }

  const handleSizeChange = (val: number) => {
    pageSize.value = val
    fetchData()
  }

  const handleCurrentChange = (val: number) => {
    currentPage.value = val
    fetchData()
  }
  const handTabs = (row: any) => {
    const modalsStore = useModalsStore()
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.userId
    })
    modalsStore.showModal('userInfoModal')
  }
  onMounted(() => {
    fetchData()
  })

  return {
    tableData,
    currentPage,
    pageSize,
    total,
    isLoading,
    currentQueryParams,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    handTabs
  }
}
