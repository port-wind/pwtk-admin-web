import { useManageSiteStore } from '@/stores/manageSiteStore'
import { taskApiPath, taskLiveApiPath } from '@/utils/http'

const manageSiteIdStore = useManageSiteStore()
export const options = {
  baseurl: taskApiPath,
  headers: {
    businessType: 'XA6',
    'x-manage-site-id': manageSiteIdStore.getManageSiteId(),
    clientType: 'S_WEB'
  }
}

export const liveOptions = {
  baseurl: taskLiveApiPath,
  headers: {
    businessType: 'XA6',
    'x-manage-site-id': manageSiteIdStore.getManageSiteId(),
    clientType: 'S_WEB'
  }
}
