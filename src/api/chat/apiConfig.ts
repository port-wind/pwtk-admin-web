import { useManageSiteStore } from '@/stores/manageSiteStore'
import { chatApiPath } from '@/utils/http'
const manageSiteIdStore = useManageSiteStore()
export const options = {
  baseurl: chatApiPath,
  headers: {
    businessType: 'XA6',
    manage_set_id: manageSiteIdStore.getManageSiteId(),
    clientType: 'S_WEB'
  }
}
