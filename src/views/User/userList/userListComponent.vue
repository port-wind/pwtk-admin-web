<template>
  <!-- 注册用户tab页面 -->
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="modalsStore.userInfoModal.isVisible"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs v-model="modalsStore.userInfoModal.activeTab" class="m_tabs" @tab-click="handleClick">
      <el-tab-pane class="m_tabs_pane" label="账户信息" name="tab1" :stretch="true">
        <AccountInfo
          v-if="accountInfo"
          :accountInfo="accountInfo"
          :display-handle-button="modalsStore.userInfoModal.modalData?.showCommitButton"
          @close-tabs="closeTabs"
        ></AccountInfo>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="积分明细" name="points">
        <Points v-if="accountInfo" :accountInfo="accountInfo"></Points>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="星星明细" name="stars">
        <Stars v-if="accountInfo" :accountInfo="accountInfo"></Stars>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的勋章" name="achievementShow">
        <AchievementShow v-if="accountInfo" :accountInfo="accountInfo"></AchievementShow>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的收藏" name="favoriteList">
        <FavoriteList />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的点赞" name="likeList">
        <LikeList v-if="accountInfo" ref="likeListRef" :accountInfo="accountInfo"></LikeList>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的关注" name="followerList">
        <followerList v-if="accountInfo" :accountInfo="accountInfo"></followerList>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的评论" name="userComment">
        <MyComment />
        <!-- <UserComment
          v-if="accountInfo"
          :accountInfo="accountInfo"
        ></UserComment> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的粉丝" name="myFans">
        <Myfans v-if="accountInfo" :accountInfo="accountInfo"></Myfans>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的团队" name="myTeams">
        <MyTeams ref="myTeamsRef" v-if="accountInfo" :accountInfo="accountInfo"></MyTeams>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的投票" name="userVote">
        <UserVote v-if="accountInfo" :accountInfo="accountInfo"></UserVote>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的访客" name="userVisiter">
        <UserVisiter v-if="accountInfo" :accountInfo="accountInfo"></UserVisiter>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="买料记录" name="buyingList">
        <BuyingLists></BuyingLists>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="卖料记录" name="saleList">
        <SaleLists></SaleLists>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名访客" name="anonymousVisiter">
        <AnonymousVisiter v-if="accountInfo" :accountInfo="accountInfo"></AnonymousVisiter>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="浏览记录" name="browsingHistory">
        <BrowsingHistory v-if="accountInfo" :accountInfo="accountInfo"></BrowsingHistory>
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="黑名单" name="blockList">
        <BlockList ref="blockListRef" v-if="accountInfo" :accountInfo="accountInfo"></BlockList>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'
import AccountInfo from '@/views/User/userList/components/accountInfo.vue'
import Myfans from '@/views/User/userList/components/myFans.vue'
import BrowsingHistory from '@/views/User/userList/components/browseHistory/index.vue'
import Points from '@/views/User/userList/components/points/index.vue'
import FavoriteList from '@/views/User/userList/components/favoriteList/index.vue'
import Stars from '@/views/User/userList/components/stars/index.vue'
// import UserComment from '@/views/User/userList/components/userComment/index.vue'
import BuyingLists from '@/views/User/userList/components/BuyingLists/index.vue'
import MyComment from '@/views/User/userList/components/myComment/index.vue'
import SaleLists from '@/views/User/userList/components/SaleLists/index.vue'
import { reqUserInfo } from '@/api/user/index'

// userId 3个来源, 一个是 传进来, 一个是 route 来, 一个是对象里面包含
interface IProps {
  entity?: any
  entityId?: string
}
defineProps<IProps>()

const emit = defineEmits(['closeEvent'])
const modalsStore = useModalsStore()
const accountInfo = ref(null)
//获取用户信息
const reqUserInfoObject = async () => {
  if (modalsStore.userInfoModal.modalData?.userId) {
    try {
      const res: any = await reqUserInfo(modalsStore.userInfoModal.modalData?.userId)
      if (res.success) {
        accountInfo.value = { ...res.data }
        modalsStore.setModalData('userInfoModal', {
          ...modalsStore.userInfoModal.modalData,
          accountInfo: { ...res.data }
        })
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  }
}

// interface AccountInfoProps {
//   displayHandleButton?: boolean
// }
// const props = withDefaults(defineProps<AccountInfoProps>(), {
//   displayHandleButton: true
// })

// 使用 computed 属性来获取 isVisible 和 modalData 如果页面是queryLink则走不同逻辑。否则通过piana动态修改
// const isVisible = ref(true)
// 使用计算属性来获取 isVisible
/* const isVisible = computed({
  get: () => {
    return modalsStore.userInfoModal.isVisible
  },
  set: (value) => {
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      isVisible: value
    })
  }
}) */
// const isVisible = computed({
//   get: () => {
//     if (isQueryLink.value) {
//       return queryPageVisiable.value
//     }
//     return modalsStore.userInfoModal.isVisible
//   },
//   set: (value) => {
//     if (isQueryLink.value) {
//       queryPageVisiable.value = value
//       if (!value) {
//         // 当关闭对话框时，清除查询参数
//         if (route.query && Object.keys(route.query).length > 0) {
//           useRouter().push({ path: route.path })
//         }
//       }
//     }
//   }
// })
// const isVisible = modalsStore.userInfoModal.isVisible
// console.log('isVisible', isVisible)
// // 使用计算属性来获取 activeTab
// const activeTab = computed({
//   get: () => {
//     if (isQueryLink.value) {
//       return queryPageActiveTab.value
//     }
//     return modalsStore.userInfoModal.activeTab
//   },
//   set: (value) => {
//     if (isQueryLink.value) {
//       queryPageActiveTab.value = value
//     } else {
//       modalsStore.setActiveTab('userInfoModal', value)
//     }
//   }
// })

// const modalData = modalsStore.userInfoModal.modalData
const showCommitButton = modalsStore.userInfoModal.modalData?.showCommitButton

// 提供accountInfo给子组件使用
// provide('accountInfo', accountInfo.value)

// const userId: Ref<string> = ref('')
// const userId: Ref<string> = computed({
//   get: () => {
//     return modalsStore.userInfoModal.modalData?.userId || ''
//   },
//   set: (value) => {
//     modalsStore.setModalData('userInfoModal', {
//       ...modalsStore.userInfoModal.modalData,
//       userId: value
//     })
//   }
// })

const route = useRoute()
const isQueryLink = ref<boolean>(false)
const queryPageVisiable = ref<boolean>(false)
const queryPageActiveTab = ref<string>('tab1')

const handleClick = (tab, event) => {
  // console.log(tab, event)
}

const closeTabs = () => {
  modalsStore.hideModal('userInfoModal')
  modalsStore.setModalData('userInfoModal', {})
}

// const openReq = async () => {
//   await reqUserInfoObject()
// }
// 添加更新可见性的方法
// const updateVisibility = (value: boolean) => {
//   if (value) {
//     modalsStore.showModal('userInfoModal')
//   } else {
//     modalsStore.hideModal('userInfoModal')
//   }
// }

onMounted(() => {
  reqUserInfoObject()
})

watch(
  () => modalsStore.userInfoModal.modalData?.userId,
  async (newVal, oldVal) => {
    await reqUserInfoObject()
  }
)
</script>
