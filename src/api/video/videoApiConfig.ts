import { useManageSiteStore } from '@/stores/manageSiteStore'
import { videoApiPath } from '@/utils/http'

const manageSiteIdStore = useManageSiteStore()
export const videoApiOptions = {
  baseurl: videoApiPath,
  headers: {
    businessType: 'XA6',
    'x-manage-site-id': manageSiteIdStore.getManageSiteId(),
    clientType: 'S_WEB'
  }
}
