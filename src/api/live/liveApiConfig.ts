import { useManageSiteStore } from '@/stores/manageSiteStore'
import { liveApiPath } from '@/utils/http'

const manageSiteIdStore = useManageSiteStore()
export const liveApiOptions = {
  baseurl: liveApiPath,
  headers: {
    businessType: 'XA6',
    'x-manage-site-id': manageSiteIdStore.getManageSiteId(),
    clientType: 'S_WEB'
  }
}
