<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        ref="queryRef"
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        @keyup.enter="fetchData()"
      >
        <el-form-item label="" prop="name">
          <el-input v-model.trim="queryForm.name" :placeholder="t('input.QueryContent')"></el-input>
        </el-form-item>
        <el-form-item label="" prop="type">
          <el-select v-model="queryForm.type" placeholder="类型" style="width: 160px">
            <el-option :value="-1" :label="t('input.allResourse')"></el-option>
            <el-option :value="0" :label="t('input.pageResourse')"></el-option>
            <el-option :value="1" :label="t('input.buttonResourse')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="fetchData" type="primary">
            {{ t('button.search') }}
          </el-button>
          <el-button @click="reset" type="">
            {{ t('login.reset') }}
          </el-button>
        </el-form-item>
        <div style="float: right">
          <el-button :disabled="per.includes('menu:add') ? false : true" @click="add" type="success">
            {{ t('button.addResources') }}
          </el-button>
        </div>
      </el-form>
    </section>
    <section class="custom-table">
      <el-table :data="resourcelist" border row-key="id">
        <el-table-column prop="orderNum" :label="t('table.pageSorting')" align="left" width="100px"></el-table-column>
        <el-table-column prop="name" :label="t('table.name')" align="left"></el-table-column>
        <el-table-column prop="type" :label="t('table.resourceCategory')" align="left"></el-table-column>
        <el-table-column prop="path" :label="t('table.pageAddress')" align="left"></el-table-column>
        <el-table-column prop="component" :label="t('table.componentAddress')" align="left"></el-table-column>
        <el-table-column :label="t('table.creationTime')" align="left">
          <template #default="scope">
            <div class="number-text">
              {{ scope.row.createTime ? unitFormatDate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss') : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('table.controls')" align="center">
          <template #default="scope">
            <el-button :disabled="per.includes('menu:edit') ? false : true" @click="edit(scope.row)" type="primary">
              {{ t('button.edit') }}
            </el-button>
            <el-button :disabled="per.includes('menu:delete') ? false : true" @click="del(scope.row.id)" type="danger">
              {{ t('button.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </section>
  <el-dialog @closed="closebox" v-model="boxShow" class="tabs-dialog">
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane
        :label="sourceInfo.id !== '' ? t('button.edit') + t('table.resource') : t('button.addResources')"
        name="editorResource_tab"
        class="m_tabs_pane"
      >
        <el-form ref="ruleform" class="dialog-form single-form" :rules="rules" :model="sourceInfo">
          <el-form-item :label="t('table.resourceCategory') + ' :'">
            <el-select v-model="sourceInfo.type">
              <el-option :label="t('input.pageResourse')" :value="0"></el-option>
              <el-option :label="t('input.buttonResourse')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="sourceInfo.type === 0 ? t('pop.pageName') + ' :' : t('table.button') + t('table.name') + ' :'"
            prop="name"
          >
            <el-input v-model="sourceInfo.name" :placeholder="t('table.name')"></el-input>
          </el-form-item>
          <el-form-item :label="t('pop.EnglishName') + ' :'">
            <el-input v-model="sourceInfo.nameEn" :placeholder="t('input.eng') + t('table.name')"></el-input>
          </el-form-item>
          <el-form-item v-if="sourceInfo.type === 0" :label="t('table.componentAddress') + ' :'">
            <el-input v-model="sourceInfo.component" :placeholder="t('table.componentAddress')"></el-input>
          </el-form-item>
          <el-form-item v-if="sourceInfo.type === 0" :label="t('table.pageAddress') + ' :'">
            <el-input v-model="sourceInfo.path" :placeholder="t('table.pageAddress')"></el-input>
          </el-form-item>
          <el-form-item :label="t('pop.parentPage') + ' :'">
            <el-select v-model="sourceInfo.parentId" :placeholder="t('pop.parentPage')">
              <el-option value="0" label="无"></el-option>
              <template v-if="sourceInfo.type === 0">
                <el-option
                  :disabled="page.id === sourceInfo.id ? true : false"
                  v-for="page in pagelist"
                  :key="page.id"
                  :value="page.id"
                  :label="page.name"
                ></el-option>
              </template>
              <template v-else>
                <el-option-group v-for="page in pagelist" :key="page.id" :label="page.name">
                  <el-option v-for="p in page.children" :value="p.id" :label="p.name" :key="p.id"></el-option>
                </el-option-group>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('pop.permisstionCode') + ' :'">
            <el-input v-model="sourceInfo.perms" :placeholder="t('pop.permisstionCode')"></el-input>
          </el-form-item>
          <el-form-item :label="t('table.serialNumber') + ' :'">
            <el-input v-model="sourceInfo.orderNum" :placeholder="t('table.serialNumber')"></el-input>
          </el-form-item>
        </el-form>
        <div class="button-row">
          <el-button @click="boxShow = false">{{ t('button.cancel') }}</el-button>
          <el-button type="primary" @click="saveResource">
            {{ t('button.confirm') }}
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import i18n from '@/locales'
const { t } = i18n.global as any
import { setPermissionsStore } from '@/stores/index'
import { menulist, addresource, editresource, deletesource, menupage } from '@/api/system/index'
import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { unitFormatDate } from '@/utils/dateFormat'
import type {
  IAddresourceQueryParams,
  IEditresourceQueryParams,
  IMenuExtends,
  IMenulistQueryParams,
  IMenupageData
} from '@/api/system/type'
const permissionStore = setPermissionsStore()
const queryRef = ref()
const per = computed(() => permissionStore.menupermissions) //获取权限集
const ruleform = ref<FormInstance>()
const queryForm = reactive({
  name: '',
  type: undefined
}) //查询条件
const resourcelist = ref<IMenuExtends[]>([]) //资源列表
const boxShow = ref<boolean>(false) //新增编辑弹窗
const pagelist = ref<IMenupageData[]>([]) //页面列表
const sourceInfo = reactive({
  //资源信息
  id: '',
  type: 0,
  name: '',
  path: '',
  component: '',
  perms: '',
  nameEn: '',
  parentId: '',
  orderNum: ''
})
const activeTab = ref('editorResource_tab') //tab切换第一条
// 表单验证
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: (sourceInfo.type === 0 ? t('input.page') : t('table.button')) + t('table.name'),
      trigger: 'blur'
    }
  ]
})
// 删除资源
const del = (id) => {
  ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      deletesource({ id: id }).then((res) => {
        if (res.success) {
          ElMessage({
            message: t('button.delete') + t('errorCode.0'),
            type: 'success'
          })
          fetchData()
        } else {
          ElMessage({
            message: res.errMessage,
            type: 'error'
          })
          boxShow.value = false
        }
      })
    })
    .catch(() => {})
}
// 新增资源
const add = () => {
  sourceInfo.id = ''
  sourceInfo.type = 0
  sourceInfo.name = ''
  sourceInfo.path = ''
  sourceInfo.nameEn = ''
  sourceInfo.component = ''
  sourceInfo.perms = ''
  sourceInfo.parentId = ''
  sourceInfo.orderNum = ''
  boxShow.value = true
}
// 编辑弹窗
const edit = (obj) => {
  sourceInfo.id = obj.id
  sourceInfo.type = obj.type === t('input.pageResourse') ? 0 : 1
  sourceInfo.name = obj.nameZh
  sourceInfo.path = obj.path === '------' ? '' : obj.path
  sourceInfo.nameEn = obj.nameEn
  sourceInfo.component = obj.component === '------' ? '' : obj.component
  sourceInfo.perms = obj.perms
  sourceInfo.parentId = obj.parentId === 0 ? '' : obj.parentId
  sourceInfo.orderNum = obj.orderNum
  boxShow.value = true
}

// 列表数据
const initArr = (arr: IMenuExtends[]) => {
  let list: IMenuExtends[] = []
  if (arr) {
    for (let a of arr) {
      let obj: IMenuExtends = {
        name: a.name,
        nameEn: a.nameEn,
        nameZh: a.nameZh,
        id: a.id,
        perms: a.perms,
        orderNum: a.orderNum,
        modifyTime: a.modifyTime,
        selected: a.selected,
        hasParent: a.hasParent,
        type: a.type ? t('input.buttonResourse') : t('input.pageResourse'),
        component: a.type ? '------' : a.component ? a.component : '------',
        path: a.type === 1 ? '------' : a.path ? a.path : '------',
        parentId: a.parentId,
        createTime: a.createTime
      }
      if (a.children) {
        obj.children = initArr(a.children)
      }
      list.push(obj)
    }
  }
  console.log('🚀 ~ initArr ~ list:', list)
  return list
}

const reset = () => {
  queryForm.name = ''
  queryForm.type = undefined
  fetchData()
}

// 获取资源列表
const fetchData = async () => {
  try {
    const query: IMenulistQueryParams = {
      ...queryForm
    }
    if (query.type === -1) {
      delete query.type
    }
    if (query.name === '') {
      delete query.name
    }

    const res = await menulist(query)
    if (res.success) {
      const data = initArr(res.data!)
      resourcelist.value = data
    }
  } catch (error) {
    console.error('Error fetching resource list:', error)
  } finally {
    // Handle any cleanup or final actions here
  }
}
interface paramsinter {
  id: number | string
  type: number
  name: string
  nameEn: string
  path: string
  component: string
  perms: string
  parentId?: string
  orderNum: number
}

// 保存资源
const saveResource = () => {
  if (!sourceInfo.name) return
  const params: IAddresourceQueryParams | IEditresourceQueryParams = {
    id: sourceInfo.id,
    type: sourceInfo.type,
    name: sourceInfo.name,
    nameEn: sourceInfo.nameEn,
    path: sourceInfo.type ? '' : sourceInfo.path,
    component: sourceInfo.type ? '' : sourceInfo.component,
    perms: sourceInfo.perms,
    orderNum: Number(sourceInfo.orderNum)
  }
  if (sourceInfo.parentId !== '') {
    params.parentId = sourceInfo.parentId
  }
  if (params.id !== '') {
    //编辑资源
    editresource(params).then((res) => {
      if (res.success) {
        ElMessage({
          message: t('button.edit') + t('errorCode.0'),
          type: 'success'
        })
        fetchData()
        boxShow.value = false
      } else {
        ElMessage({
          message: res.errMessage,
          type: 'error'
        })
        boxShow.value = false
      }
    })
  } else {
    //新增资源
    addresource(params).then((res) => {
      if (res.success) {
        ElMessage({
          message: t('button.add') + t('errorCode.0'),
          type: 'success'
        })
        fetchData()
        pagelist.value = []
        getMenulist()
        boxShow.value = false
      } else {
        ElMessage({
          message: res.errMessage,
          type: 'error'
        })
        boxShow.value = false
      }
    })
  }
}
// 关闭新增编辑
const closebox = () => {
  ruleform.value?.resetFields()
}
// 获取父级页面列表
const getMenulist = () => {
  menupage().then((res) => {
    if (res.success && res.data) {
      if (res.data.list) {
        for (let el of res.data.list) {
          pagelist.value.push(el)
        }
      } else {
        pagelist.value = []
      }
    }
  })
}
onMounted(() => {
  fetchData() //获取资源管理列表
  getMenulist() //获取父级页面列表
})
</script>
<style lang="less" scoped>
.wrapper {
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}

.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
</style>
