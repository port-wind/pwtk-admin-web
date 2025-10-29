import {
  reqBbsPush,
  reqManageSiteList,
  reqNewsPaperIssuePush,
  reqWebsiteGuaranteePush,
  reqWebsitePush
} from '@/api/super/index'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'

const modalsStore = useModalsStore()

const handleSyncClick = async () => {
  modalsStore.checkboxTable.isVisible = true
  try {
    const response = await reqManageSiteList({ page: 1, size: 999 })
    if (response.success) {
      modalsStore!.checkboxTable!.modalData!.tableList = response.data.list.map((item: any, index: number) => ({
        siteId: item.manageId,
        siteName: item.siteName,
        oapiUrl: item.oapiUrl,
        key: index + 1
      }))
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const handleSpecialClick = async (name: 'guarantee' | 'website' | 'bbs' | 'newsPaperIssue') => {
  switch (name) {
    case 'guarantee':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqWebsiteGuaranteePush
      break
    case 'website':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqWebsitePush
      break
    case 'bbs':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsPush
      break
    case 'newsPaperIssue':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqNewsPaperIssuePush
      break
    default:
      console.error('未找到对应的功能')
      break
  }
  handleSyncClick()
}
