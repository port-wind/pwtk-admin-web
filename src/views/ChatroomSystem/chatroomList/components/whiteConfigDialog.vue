<template>
  <div class="whiteUser_dialog">
    <el-dialog
      v-model="dialogVisible"
      title="选择白名单用户"
      width="672px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="search_box">
        <div class="search_box_item">
          <el-input v-model="leftSearchQuery" placeholder="搜索用户源" @input="handleGetUserList" />
          <el-select v-model="userType" placeholder="选择用户类型" @change="getUserList">
            <el-option v-for="item in userTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="search_box_item">
          <el-input v-model="rightSearchQuery" placeholder="搜索白名单用户" @input="filterWhiteUserList" />
        </div>
      </div>
      <div class="transfer_box">
        <el-transfer
          v-if="dialogVisible"
          ref="transferRef"
          :num="20"
          :data="finalUsersList"
          v-model="whiteUserList"
          :titles="['用户源', '白名单用户']"
          :props="{
            key: 'userId',
            label: 'nickname'
          }"
          @change="handleChange"
        ></el-transfer>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { reqUserList } from '@/api/user/index'
import { getWhiteList, addWhiteList, delWhiteList, getUserInfoMapByUserIds } from '@/api/chat'

const userTypeList: Record<string, string>[] = [
  { label: '用户', value: 'u' },
  { label: '代理', value: 'a' },
  { label: '子账号', value: 's' },
  { label: '后台', value: 'b' },
  { label: '开放平台', value: 'o' },
  { label: '全部', value: 'L' }
]
const emit = defineEmits(['close'])
const dialogVisible = ref(false)
const usersList = ref<any[]>([])
const allUsersList = ref<any[]>([])
const cacehWhiteUserValueList = ref<any[]>([])
const whiteUserList = ref<any[]>([])
const originWhiteUserList = ref<any[]>([])
const transferRef = ref<any>(null)
const leftSearchQuery = ref('')
const rightSearchQuery = ref('')
const remainWhiteUserList = ref<any[]>([])
const filteredWhiteUserList = ref<any[]>([])
const userType = ref<'u' | 'a' | 's' | 'b' | 'o' | 'L'>('L')
const timer = ref()
const finalUsersList = computed(() => {
  // 使用 Map 根据 userId 去重
  const userMap = new Map()

  // 先添加 usersList 中的用户
  usersList.value.forEach((user) => {
    if (user.userId) {
      userMap.set(user.userId, user)
    }
  })

  // 再添加 remainWhiteUserList 中的用户
  remainWhiteUserList.value.forEach((user) => {
    if (user.userId) {
      userMap.set(user.userId, user)
    }
  })

  // 移除已经在 filteredWhiteUserList 中的用户
  filteredWhiteUserList.value.forEach((user) => {
    if (user.userId) {
      userMap.delete(user.userId)
    }
  })

  // 转换回数组并排序
  return Array.from(userMap.values()).sort((a, b) => {
    // 如果两个用户都有nickname，按nickname排序
    if (a.nickname && b.nickname) {
      return a.nickname.localeCompare(b.nickname)
    }
    // 如果只有a有nickname，a排在前面
    if (a.nickname) {
      return -1
    }
    // 如果只有b有nickname，b排在前面
    if (b.nickname) {
      return 1
    }
    // 如果都没有nickname，按userId排序

    return a.userId.localeCompare(b.userId)
  })
})

// 获取原始用户列表数据
const getUserList = async (): Promise<void> => {
  try {
    const res = await reqUserList({
      page: 1,
      size: 1000,
      nickname: leftSearchQuery.value,
      userType: userType.value
    })
    if (res && res.data && Array.isArray(res.data.list)) {
      usersList.value = res.data.list
      if (!allUsersList.value.length && !leftSearchQuery.value && userType.value === 'L') {
        allUsersList.value = res.data.list
      }
    }
  } catch (error) {
    console.error('获取原始用户列表失败:', error)
  }
}
const handleGetUserList = async () => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(async () => {
    await getUserList()
  }, 300)
}

const splitWhiteUserList = async () => {
  const removeWhiteUserList = [...originWhiteUserList.value].filter(
    (item: string) => !whiteUserList.value.includes(item)
  )
  const addWhiteUserList = [...whiteUserList.value].filter((item: string) => !originWhiteUserList.value.includes(item))
  const userMap = (await getUserInfoMapByUserIds(removeWhiteUserList.concat(addWhiteUserList))) as Map<string, any>
  return {
    removeWhiteUserList,
    addWhiteUserList,
    removeWhiteUserListValue: removeWhiteUserList.map((item: string) => userMap?.get(item)).filter((item) => item),
    addWhiteUserListValue: addWhiteUserList.map((item: string) => userMap?.get(item)).filter((item) => item)
  }
}
const remove = async (data: any[]) => {
  if (data.length === 0) return
  const res = await delWhiteList(data)
  if (res && res.success) {
    ElMessage.success('操作成功')
  } else {
    ElMessage.error('操作失败')
  }
}

const add = async (data: any[]) => {
  if (data.length === 0) return
  const res = await addWhiteList({
    count: data.length,
    setIds: data
  })
  if (res && res.success) {
    ElMessage.success('添加成功')
  } else {
    ElMessage.error('添加失败')
  }
}
// 保存选择的原始用户
const saveWhiteUser = async (removeWhiteUserList: any[], addWhiteUserList: any[]) => {
  await remove(removeWhiteUserList.map((item: any) => item.userId))
  await add(addWhiteUserList.map((item: any) => item.userId))
  dialogVisible.value = false
}

const filterWhiteUserList = () => {
  const localRemainWhiteUserList: any[] = []
  const localFilteredWhiteUserList: any[] = []

  // eslint-disable-next-line no-restricted-syntax
  for (const item of cacehWhiteUserValueList.value) {
    if ((item.nickname || item.userId).includes(rightSearchQuery.value)) {
      localRemainWhiteUserList.push(item)
    } else {
      localFilteredWhiteUserList.push(item)
    }
  }
  remainWhiteUserList.value = localRemainWhiteUserList
  filteredWhiteUserList.value = localFilteredWhiteUserList
}
const handleChange = async (value: any[], direction: string, movedKeys: any[]) => {
  if (direction === 'right') {
    const userMap = (await getUserInfoMapByUserIds(movedKeys)) as Map<string, any>
    const newUserList = movedKeys.map((item) => userMap?.get(item)).filter((item) => item)
    cacehWhiteUserValueList.value = [...cacehWhiteUserValueList.value, ...newUserList]
  } else {
    cacehWhiteUserValueList.value = [...cacehWhiteUserValueList.value].filter(
      (item) => !movedKeys.includes(item.userId)
    )
  }
  filterWhiteUserList()
}
const getWhiteUserList = async (removeWhiteUserList: any[] = [], addWhiteUserList: any[] = []) => {
  const res = await getWhiteList()
  if (res && res.data && Array.isArray(res.data)) {
    originWhiteUserList.value = res.data.map((item: any) => `${item.setId}`)
    whiteUserList.value = [...new Set([...originWhiteUserList.value, ...addWhiteUserList])].filter(
      (item: string) => !removeWhiteUserList.includes(item)
    )
    await handleChange(whiteUserList.value, 'right', whiteUserList.value)
  }
}
// 打开弹窗的方法
const openDialog = async (removeWhiteUserList: any[], addWhiteUserList: any[]) => {
  dialogVisible.value = true
  await getUserList()
  await getWhiteUserList(removeWhiteUserList, addWhiteUserList)
}

// 确定
const confirm = () => {
  dialogVisible.value = false
  ElMessage.success('操作成功')
  emit('close')
}

// 关闭对话框时重置
const resetWhiteUserList = () => {
  userType.value = 'L'
  leftSearchQuery.value = ''
  rightSearchQuery.value = ''
  usersList.value = []
  whiteUserList.value = []
  getWhiteUserList()
  setTimeout(() => {
    usersList.value = [...allUsersList.value]
  }, 0)
}

// 组件挂载时初始化
onMounted(() => {})

// 暴露方法给父组件
defineExpose({
  openDialog,
  confirm,
  saveWhiteUser,
  splitWhiteUserList,
  update: resetWhiteUserList
})
</script>

<style scoped lang="less">
.whiteUser_dialog {
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  .search_box {
    display: flex;
    width: 640px;
    gap: 122px;
    margin-bottom: 10px;
    .search_box_item:first-child {
      width: 55%;
      display: flex;
      align-items: center;
      gap: 10px;
      .el-select {
        width: 200px;
      }
    }
    .search_box_item:last-child {
      width: 45%;
    }
  }
  .transfer_box {
    width: 640px;
    :deep(.el-transfer) {
      display: flex;
      .el-transfer-panel:first-child {
        width: 55%;
      }
      .el-transfer-panel:last-child {
        width: 45%;
      }
      .el-transfer__buttons {
        display: flex;
        align-items: center;
        padding: 0 10px;
      }
    }
  }
}
</style>
