<template>
  <!-- 用户信息编辑 -->
  <el-scrollbar>
    <el-form :model="editForm" ref="editFormRef" :rules="rulesUser" class="dialog-form">
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10" style="padding: 0 0 5px 55px">
          <div style="display: flex">
            <div class="box_avatar" style="width: 80px">
              <div class="img_avatar">
                <el-avatar v-if="avatarUrl" :size="65" :src="avatarUrl" />
                <el-avatar v-else :size="65" :icon="UserFilled" />
              </div>
              <m-avatar
                type="image"
                ref="cropperRef"
                :btnDisabled="displayHandleButton"
                @get-response="handleUploadResponse"
                :allowTypeList="['png', 'jpg', 'jpeg']"
                :limitSize="1"
                :fixedNumber="[1, 1]"
                :previewWidth="200"
              />
            </div>
            <div>
              <el-form-item
                label="账户名称:"
                prop="loginId"
                label-width="80"
                label-position="left"
                style="margin: 3px 0 0 0"
              >
                {{ editForm.loginId }}
                <copy :content="editForm.loginId"></copy>
                <el-dropdown
                  style="margin: 0 0px 0 5px; cursor: pointer"
                  trigger="click"
                  size="small"
                  @command="stateChange"
                >
                  <span class="el-dropdown-link">
                    <el-tag v-if="editForm.gender == 'm'" class="mx-1" type="primary">男</el-tag>
                    <el-tag v-else-if="editForm.gender == 'f'" class="mx-1" type="info">女</el-tag>
                    <el-tag v-else-if="editForm.gender == 'x'" class="mx-1" type="warning">未知</el-tag>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'm' }">
                        <el-tag type="primary">男</el-tag>
                      </el-dropdown-item>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'f' }">
                        <el-tag type="info">女</el-tag>
                      </el-dropdown-item>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'x' }">
                        <el-tag type="warning">未知</el-tag>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-form-item>
              <el-form-item label="ID:" prop="userId" label-width="80" style="margin: 0 0 0 0">
                {{ editForm.userId }}
                <copy :content="editForm.userId"></copy>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="会员等级:" prop="vipLevel" label-width="80" style="margin: 0 0 0 0">
                    {{ editForm.vipLevel === 0 ? '未设置' : 'VIP' + editForm.vipLevel }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="80" style="margin: 0 0 0 0; cursor: pointer">
                    <el-dropdown
                      style="margin: 0 0px 0 5px; cursor: pointer"
                      trigger="click"
                      size="small"
                      @command="talentChange"
                    >
                      <span class="el-dropdown-link">
                        <el-tag v-if="editForm.talent == '0'" class="mx-1" type="info">普通</el-tag>
                        <el-tag v-else-if="editForm.talent == '2'" class="mx-1" type="warning">专家</el-tag>
                        <!-- <el-tag v-else-if="editForm.talent == '1'" class="mx-1" type="primary">高手</el-tag> -->
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item class="mx-1" :command="{ talent: '0' }">
                            <el-tag type="info">普通</el-tag>
                          </el-dropdown-item>
                          <!-- <el-dropdown-item class="mx-1" :command="{ talent: '1' }">
                            <el-tag type="primary">高手</el-tag>
                          </el-dropdown-item> -->
                          <el-dropdown-item class="mx-1" :command="{ talent: '2' }">
                            <el-tag type="warning">专家</el-tag>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item
                    label="积分:"
                    prop="points"
                    label-width="80"
                    style="margin: 0 0 0 0; position: relative"
                  >
                    <div class="points-wrapper">
                      <span style="color: #02a7f0">
                        <span @click="turnToPoints" style="cursor: pointer">
                          {{ editForm.score || 0 }}
                        </span>
                      </span>
                      <ChangePoint
                        v-if="editForm.userId && menupermissions.includes(Permissions.USER_TRANSFER_SCORE)"
                        :userId="editForm.userId"
                        @onClosed="onClosed"
                      />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="星星:" prop="stars" label-width="44" style="margin: 0 0 0 0">
                    <span style="color: #02a7f0">
                      <span @click="turnToStars" style="cursor: pointer">
                        {{ editForm.stars || 0 }}
                      </span>
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="推广码:" prop="selfPromotionCode" label-width="80" style="margin: 0 0 0 0">
                    {{ editForm.selfPromotionCode }}
                    <copy v-if="editForm.selfPromotionCode" :content="editForm.selfPromotionCode"></copy>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="团队:" prop="userLevel">
            <el-popover placement="top-start" :show-after="800" trigger="hover" content="当前层级">
              <template #reference>
                <span>{{ editForm.userLevel }}</span>
              </template>
            </el-popover>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <el-popover placement="top-start" :show-after="800" trigger="hover" content="直属下级人数">
              <template #reference>
                <span>{{ editForm.directSubCnt }}</span>
              </template>
            </el-popover>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <el-popover placement="top-start" :show-after="800" :width="100" trigger="hover" content="团队总人数">
              <template #reference>
                <span>{{ editForm.totalTeamCnt }}</span>
              </template>
            </el-popover>
            <!-- {{ editForm.userLevel }} | {{ editForm.directSubCnt }} | {{ editForm.totalTeamCnt }} -->
          </el-form-item>
          <el-form-item label="注册时间 | IP:" prop="userLevel">
            {{ unitFormatDate(editForm.regTime, 'yyyy-MM-dd HH:mm:ss') }} |
            {{ !editForm.regIP ? '未知' : editForm.regIP }}
          </el-form-item>
          <el-form-item label="提现账号:" label-width="50px;">
            <div style="max-height: 100px; overflow-y: auto; display: flex; align-items: center">
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  max-width: 200px;
                  display: inline-block;
                "
              >
                {{ withdrawalAccountListComputed }}
              </span>
              <el-popover :visible="editCashOutListVisible" placement="left" :width="600" :show-after="800">
                <template #reference>
                  <el-icon @click="editCashOutList" style="margin-left: 8px; cursor: pointer">
                    <EditPen />
                  </el-icon>
                </template>
                <CashOutListForUser
                  v-if="editCashOutListVisible"
                  @close="editCashOutListVisible = false"
                  @refresh="refreshCashOutList"
                  :userId="editForm.userId"
                />
              </el-popover>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-form-item label="用户标签:" label-width="50px;">
            <div style="max-height: 100px; overflow-y: auto">
              <el-popover placement="right" :width="600" :show-after="800" :visible="editUserTagsVisible">
                <template #reference>
                  <el-button round size="small" :icon="Edit" @click="editUserTags">编辑标签</el-button>
                </template>
                <TagMaster
                  v-if="editUserTagsVisible"
                  @close="editUserTagsVisible = false"
                  @refresh="refreshUserTags"
                  :userId="editForm.userId"
                />
              </el-popover>

              <el-tag
                v-for="tag in editForm.tags"
                type="primary"
                round
                plain
                size="small"
                style="margin: 0 0 0 5px"
                :key="tag"
              >
                {{ tag.tagName }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="手机号码:" prop="mobile">
            <div class="mobile-sms-wrapper">
              <MobilePhoneWithCountryCodes
                v-if="props.accountInfo"
                v-model:mobile-country-code="editForm.mobileCountryCode"
                v-model:mobile="editForm.mobile"
              />
              <SMSCodeSend :account-info="props.accountInfo" />
            </div>
          </el-form-item>
          <el-form-item label="账户密码:" prop="password">
            <el-input
              class="account-password"
              v-model.trim="editForm.password"
              :disabled="!editPassword"
              maxlength="16"
              style="max-width: 412px"
              :type="editPassword ? 'text' : 'password'"
            >
              <template #append>
                <el-tooltip content="仅用状态表示不更改密码" placement="top">
                  <el-button @click="changePasswordStatus()">修改</el-button>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="账户昵称:" prop="nickname" style="width: 100%">
            <el-input
              v-model.trim="editForm.nickname"
              placeholder="请输入账户昵称"
              autocomplete="off"
              maxlength="20"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="用户状态:" prop="userStatus">
            <el-radio-group v-model="editForm.userStatus">
              <el-radio
                v-for="item in optionsUserStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户类型:" prop="userType">
            <el-radio-group v-model="editForm.userType">
              <el-radio
                v-for="item in optionsUserType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联账户:" prop="innerDistribution">
            <el-input
              v-model="editForm.innerDistribution"
              maxlength="30"
              style="width: 100%"
              autocomplete="off"
              placeholder="请输入关联账户"
            />
          </el-form-item>
          <el-form-item label="用户简介:" prop="userMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入用户简介"
              maxlength="100"
              :rows="4"
              v-model="editForm.userMemo"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="邮箱:" prop="email" style="width: 100% !important">
            <el-row style="width: 100%">
              <el-col :span="24">
                <el-input
                  class="input-with-select"
                  placeholder="请输入邮箱"
                  autocomplete="off"
                  :disabled="!isShowEmail"
                  v-model.trim="editForm.email"
                >
                  <template #append>
                    <el-button v-if="isShowEmail" :icon="View" @click="viewEmail()" />
                    <el-button v-else :icon="Hide" @click="viewEmail()" />
                  </template>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="用户上级:" prop="parentId">
            <el-col :span="22">
              <SelectUserIdAndNickname
                v-show="parentEdit"
                v-model="editForm.parentId"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
              />
              <!-- <UniRemoteInput
                v-show="parentEdit"
                v-model="editForm.parentId"
                :search-obj="{}"
                valueKey="userId"
                labelKey="nickname"
                searchKey="userId"
                placeholder="请输入用户上级"
                event-focus="focus"
                :fetchOptions="reqUserList"
                :formatLabel="(item) => (item.nickname ? `${item.nickname} - ${item.userId}` : item.userId)"
              /> -->
              <div v-show="!parentEdit">
                <el-popover placement="top-start" :show-after="800" :width="240" trigger="hover">
                  <template #reference>
                    <p
                      v-if="!editForm.parentId || editForm.parentId == 0"
                      style="display: inline-block; height: 33.31px"
                    >
                      无上级
                    </p>
                    <p v-else style="display: inline-block; height: 33.31px">
                      {{ editForm.parentId }}
                    </p>
                  </template>
                  <template #default>
                    <template v-if="editForm?.userPath?.length == 0">无上级</template>
                    <template v-else>
                      <p v-for="(item, index) in editForm?.userPath?.slice()?.reverse()" :key="index">
                        第{{ index + 1 }}层 - {{ item }}
                      </p>
                    </template>
                  </template>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="2" style="display: flex; justify-content: flex-end; align-items: center">
              <el-icon @click="editIdutton">
                <el-icon>
                  <Edit />
                </el-icon>
                <!-- <View v-if="isShowEmail"/>
                  <Hide v-else/> -->
              </el-icon>
            </el-col>
            <el-popover placement="top-start" :show-after="800" :width="240" trigger="hover">
              <template #reference>
                <!-- <el-button style="width:15%" type="info" plain>路径</el-button> -->
              </template>
              <template #default>
                <template v-if="editForm?.userPath?.length == 0">无上级</template>
                <template v-else>
                  <p v-for="(item, index) in editForm?.userPath?.slice()?.reverse()" :key="index">
                    第{{ index + 1 }}层 - {{ item }}
                  </p>
                </template>
              </template>
            </el-popover>

            <!-- <el-input v-model="editForm.parentId" autocomplete="off" placeholder="请输入用户上级" /> -->
          </el-form-item>
          <el-form-item label="上级备注:" prop="upperMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入上级备注"
              maxlength="200"
              :rows="2"
              v-model="editForm.upperMemo"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="运营状态:" prop="accountType">
            <el-radio-group v-model="editForm.accountType">
              <el-radio
                v-for="item in optionsAccountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上次登入 | IP:" prop="userLevel">
            {{ unitFormatDate(editForm.lastLoginTime, 'yyyy-MM-dd HH:mm:ss') }} |
            {{ !editForm.lastLoginIP ? '未知' : editForm.lastLoginIP }}
          </el-form-item>
          <el-form-item label="IP属地:" prop="lastLoginIP" v-if="editForm.userType === 'b'">
            <SelectIPList :ip="currentIP" @on-select="onSelectIP" />
          </el-form-item>
          <el-form-item label="后台备注:" prop="sysMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入系统备注"
              maxlength="200"
              :rows="2"
              v-model="editForm.sysMemo"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
    </el-form>
  </el-scrollbar>
  <div class="button-row" v-if="displayHandleButton">
    <el-button @click="closeHand">取消</el-button>
    <el-button type="primary" :loading="isLoading2" @click="addFormInfo(editFormRef)">提交</el-button>
  </div>
</template>
<script setup lang="ts">
import { UserFilled, Edit, Hide, View } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { optionsUserStatus, optionsUserType, optionsAccountType } from '@/const/options'
import {
  reqUserEdit,
  reqShowEmail,
  reqUserInfo,
  updateUserPassword,
  reqUserWithdrawalAccountList
} from '@/api/user/index'
import type { IUpdateUserPassword } from '@/api/user/index'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import TagMaster from './TagMaster/index.vue'
import mAvatar from '@/components/cropImg/cropImg.vue'
import i18n from '@/locales'
import type { IReqUserListData } from '@/api/user/type'
import { useModalsStore } from '@/stores/modalStore'
import { generateSecret, sha1Base64 } from '@/utils/passwordEncrypt'
import { validateText } from '@/utils/validators'
import { setPermissionsStore } from '@/stores'
import { Permissions } from '@/consts'

const emit = defineEmits(['closeTabs'])
const editUserTagsVisible = ref<boolean>(false)
//上传相关
const { VITE_CDN_URL } = webConfigApi

const { t } = i18n.global as any
const modalsStore = useModalsStore()
const permissionsStore = setPermissionsStore()
const menupermissions = computed(() => permissionsStore.menupermissions)
// 父组件传参props
interface AccountInfoProps {
  accountInfo: IReqUserListData | null
  displayHandleButton?: boolean
}
const props = withDefaults(defineProps<AccountInfoProps>(), {
  displayHandleButton: false,
  accountInfo: null
})
const editForm: any = ref<any>({})
const editFormRef = ref()
const isLoading2 = ref(false)
const editPassword = ref(false)
const editCashOutListVisible = ref(false)
const isShowEmail = ref(false)
const tempPhone = ref(props.accountInfo?.mobile)
const tempEmail = ref(props.accountInfo?.email)
const parentEdit = ref(false)
const imgUrl = props.accountInfo?.avatar ? VITE_CDN_URL + props.accountInfo?.avatar : ''
const avatarUrl = ref(imgUrl)
const isEditPoints = ref(false)
const currentIP = computed(() => props?.accountInfo?.lastLoginIPInfo?.ip)
const lastLoginIPInfo = ref<any | undefined>()
const withdrawalAccountListComputed = computed(() => {
  const accountInfoList = editForm.value.withdrawalAccountList?.slice(0, 1)
  let accountInfo = ''
  if (accountInfoList?.length > 0) {
    const info = accountInfoList[0]
    accountInfo = `${info.platName} - ${info.userName} - ${info.platAccount}`
  }
  return accountInfo || '暂无提现账号'
})

const onSelectIP = (selected) => {
  lastLoginIPInfo.value = selected
}

const validatorPassword = (rule: any, value: any, callback) => {
  if (!value) {
    callback()
  } else {
    // 验证8位置以上
    if (value.length < 8 || value.length > 16) {
      callback(new Error('请设置一个8到16位的密码'))
    } else {
      callback()
    }
  }
}

const changePasswordStatus = () => {
  editPassword.value = !editPassword.value
  if (editPassword.value) {
    editForm.value.password = ''
  } else {
    // 不修改
    editForm.value.password = undefined
  }
}

const validatePhoneNumber = (rule: any, value: any, callback: any) => {
  const phoneRegex = /^\d+$/
  if (editForm.value.mobile == '') {
    callback()
  }
  if (editForm.value.mobile == tempPhone.value) {
    callback()
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入合法的电话话吗'))
  } else {
    callback()
  }
}

const validateEmail = (rule: any, value: any, callback: any) => {
  // 新的正则表达式：只能包含数字和英文字符
  const pwdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (editForm.value.email == '' || editForm.value.email == tempEmail.value) {
    callback()
    return
  }

  if (!pwdRegex.test(value)) {
    callback(new Error('请输入正确的邮箱地址'))
  } else {
    callback()
  }
}

editForm.value = {
  ...props.accountInfo,
  parentId: props.accountInfo?.parentId == 0 ? '' : props.accountInfo?.parentId
}
// remove + phone country
editForm.value.mobileCountryCode = editForm.value.mobileCountryCode.replace('+', '')

const rulesUser = reactive<FormRules>({
  loginId: [{ message: '请输入账户名称', trigger: 'blur' }],
  email: [{ validator: validateEmail, message: '请输入正确的邮箱地址', trigger: 'blur' }],
  nickname: [{ message: '请输入账户昵称', trigger: 'blur', required: true }, { validator: validateText }],
  mobile: [
    { message: '请输入电话号码', trigger: 'blur' },
    { validator: validatePhoneNumber, trigger: 'blur' }
  ],
  password: [{ validator: validatorPassword }]
})

watch(
  () => props.accountInfo,
  (newVal) => {
    avatarUrl.value = newVal?.avatar ? VITE_CDN_URL + newVal?.avatar : ''
    if (newVal && Object.keys(newVal).length > 0) {
      editForm.value = { ...newVal }
      tempPhone.value = newVal?.mobile
      tempEmail.value = newVal?.email
      editForm.value.parentId = newVal?.parentId == 0 ? '' : newVal?.parentId
    }
  },
  { deep: true }
)
// 获取路由实例
const router = useRouter()
const route = useRoute()

const onClosed = () => {
  // 加载新数据
  refreshUserTags()
}
const turnToPoints = () => {
  // 使用 router.push 更新路由，清空查询参数
  router.push({ path: route.path }) // 只传递路径，不传递查询参数

  modalsStore.userInfoModal.isVisible = true
  modalsStore.userInfoModal.activeTab = 'points'
}

const turnToStars = () => {
  router.push({ path: route.path }) // 只传递路径，不传递查询参数
  modalsStore.userInfoModal.isVisible = true
  modalsStore.userInfoModal.activeTab = 'stars'
}

const handleUploadResponse = async (_res) => {
  if (_res) {
    // avatarUrl.value = VITE_CDN_URL + _res.path
    editForm.value.avatar = _res.path
    avatarUrl.value = VITE_CDN_URL + _res.path
  }
}
const editUserTags = () => {
  editUserTagsVisible.value = true
}
const addFormInfo = async (FormRef: FormInstance | undefined) => {
  if (!FormRef) return
  isLoading2.value = true
  await FormRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = { ...editForm.value }

        if (data.userType === 'b') {
          if (lastLoginIPInfo.value) {
            data.lastLoginIPInfo = lastLoginIPInfo?.value
            data.ipAddr = lastLoginIPInfo?.value?.ip
          } else {
            data.lastLoginIPInfo = '*'
            data.ipAddr = '*'
          }
        }

        if (data.password) {
          const sha1Password = sha1Base64(data.password)
          const salt = '1234'
          const secret = generateSecret(data.password, data.userId, salt)
          // 组装数据
          const pwdData: IUpdateUserPassword = {
            userId: data.userId,
            sha1Password,
            salt,
            secret
          }
          await updateUserPassword(pwdData)
        }

        // PASSWORD CRYPTO

        const res = await reqUserEdit({ ...data, parentId: data.parentId ? data.parentId : 0 })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand()
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      isLoading2.value = false
    }
  })
}

const closeHand = () => {
  emit('closeTabs')
}
const editIdutton = () => {
  parentEdit.value = !parentEdit.value
}

const viewEmail = async () => {
  if (isShowEmail.value) {
    isShowEmail.value = false
    editForm.value.email = tempEmail.value
  } else {
    try {
      const res = await reqShowEmail(props.accountInfo?.userId)
      if (res.success) {
        editForm.value.email = res.data
        isShowEmail.value = !isShowEmail.value
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  }
}
const refreshUserTags = async () => {
  try {
    const res = await reqUserInfo(props.accountInfo?.userId)
    if (res.success && res.data) {
      editForm.value.tags = res.data.tags
      editForm.value.score = res.data.score
    }
  } catch (error) {
    console.error(error)
  }
}
const refreshCashOutList = async () => {
  try {
    const res = await reqUserWithdrawalAccountList({ userId: props.accountInfo?.userId! })
    if (res.success) {
      editForm.value.withdrawalAccountList = res.data
    }
  } catch (error) {
    console.error(error)
  }
}
const editCashOutList = () => {
  editCashOutListVisible.value = true
}
const stateChange = (row) => {
  const { gender } = row
  editForm.value.gender = gender
}
const talentChange = (row) => {
  const { talent } = row
  editForm.value.talent = talent
}
onMounted(async () => {
  await refreshCashOutList()
})
</script>

<style lang="less" scoped>
.box_avatar {
  position: relative;
  height: 6rem;

  .img_avatar {
    // width: 4rem;
    // border-radius: 4rem;
    position: absolute;
    top: 13%;
    left: 3%;
  }

  .edit_avatar {
    position: absolute;
    bottom: 0;
  }
}

#system_account .el-input__wrapper {
  max-width: 100%;
}

.points-wrapper {
  display: flex;
  column-gap: 10px;
  align-items: center;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.input-with-select.is-disabled .el-input-group__prepend {
  background-color: #f5f7fa;
}

.input-with-select .el-input-group__append {
  width: 35px;
  padding: 0 10px;
  background: white;
}

.mobile-sms-wrapper {
  display: flex;
  flex: 1;
  column-gap: 5px;
}

.account-password {
}
</style>
