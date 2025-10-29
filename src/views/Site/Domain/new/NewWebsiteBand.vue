<template>
  <!-- ドマインはウェブの繋がりがある場合に、ダイアログを開いた後、タブ二つ目である。 -->
  <!-- 父コンポーネントはsrc/views/Site/Domain/components/DomainInformationTabs.vue -->
  <el-form :model="formModel" class="website-band-form" label-width="160">
    <el-row :gutter="20" class="center-row">
      <el-col :span="16" offset="2">
        <div class="column-content">
          <el-form-item :label="formLabelObj.websiteId.chnProp + ':'" prop="websiteId">
            {{ formModel.websiteInnerName }} | {{ formModel.websiteId }}
            <copy :content="formModel.websiteId"></copy>
          </el-form-item>
          <el-form-item :label="formLabelObj.websiteTitle.chnProp + ':'" prop="websiteTitle">
            {{ formModel.websiteTitle }}
          </el-form-item>
          <!-- 登录账户 -->
          <el-form-item :label="formLabelObj.userId.chnProp + ':'" prop="userId">
            {{ formModel.userName }} | {{ formModel.ownerUserId }}
          </el-form-item>
          <el-form-item :label="formLabelObj.keyWords.chnProp + ':'" prop="keyWords">
            {{ formModel.keyWords }}
          </el-form-item>
          <el-form-item :label="formLabelObj.langCodes.chnProp + ':'" prop="langCodes">
            {{ getLanguageLabels(formModel.langCodes, optionsLang) }}
          </el-form-item>
          <el-form-item :label="formLabelObj.areaCodes.chnProp + ':'" prop="areaCodes">
            <!-- {{ formModel.areaCodes }} -->
            {{ getLanguageLabels(formModel.areaCodes, optionsArea) }}
          </el-form-item>
          <el-form-item :label="formLabelObj.memo.chnProp + ':'" prop="memo">
            {{ formModel.memo }}
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="4">
        <el-form-item label="" prop="">
          <el-button
            class="unBindBtn"
            @click="handleUnBindWebsiteRef(props.domain)"
            type="success"
            :style="{ color: 'black' }"
          >
            解绑
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
const searchModel = inject<Ref<any>>('searchModel')
interface propsInterface {
  domain: string
}
import { unBingWebsite } from '@/api/site'
import { getWebsiteRefMsgByDomain } from '@/api/site/domain'
import { optionsArea, optionsLang, domainStatus } from '@/const/options'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { DomainConfig, domainDetailDataInit, getLanguageLabels } from '@/views/Site/Domain/type'
import { withDefaults } from 'vue'
const props = withDefaults(defineProps<propsInterface>(), {
  domain: '' // Set default value
})
const emit = defineEmits<{
  // (e: 'updateActiveTab', tab: string | number, additionalData?: any): void
  (e: 'onCallback', value: any): void
}>()
// 触发事件的函数
const updateTab = (flag: any) => {
  emit('onCallback', flag) // 发出事件并传递参数
}
const handleUnBindWebsiteRef = (domain: string) => {
  if (domain) {
    // 解绑
    unBingWebsite({ domain })
      .then((res) => {
        // console.log('res',res)
        if (res.errMessage === 'success') {
          // 解绑成功
          // 刷新页面
          ElMessage({
            message: '解绑成功',
            type: 'success',
            duration: 2000
          })
          // 更新
          updateTab(false)
        } else {
          ElMessage({
            message: '解绑失败',
            type: 'error',
            duration: 2000
          })
        }
      })
      .catch((err) => {
        console.error('err', err)
      })
      .finally(() => {
        // 修改结束，更新Table
        if (searchModel) {
          fetchData({ size: 15, page: 1, ...searchModel.value })
        } else {
          fetchData({ size: 15, page: 1 })
        }
      })
  }
}
const fetchData = inject('fetchData') as (params: any) => void
const formModel = reactive<DomainConfig>(domainDetailDataInit())
const formLabelObj = reactive<any>({
  websiteId: {
    chnProp: '站点名称 | ID'
  },
  websiteTemplateRef: {
    chnProp: '引用模板名称 | ID'
  },
  userId: {
    chnProp: '登入账户 | 用户ID'
  },
  websiteTitle: { chnProp: '站点标题' },
  langCodes: { chnProp: '语言' },
  memo: { chnProp: '备注' },
  createTime: { chnProp: '创建时间' },
  websiteStatus: { chnProp: '状态' },
  keyWords: { chnProp: '关键字' },
  areaCodes: { chnProp: '地区' }
})
onMounted(() => {
  // return
  const { domain } = props
  getWebsiteRefMsgByDomain({ domain })
    .then((res) => {
      // console.log('res', res)
      if (res && res.errMessage === 'success' && res.data.length > 0) {
        Object.assign(formModel, res.data[0])
        //   console.log('formModel',formModel);
      }
    })
    .catch((err) => {
      console.error('err', err)
    })
})
</script>
<style scoped lang="less">
.center-row {
  justify-content: center;
  display: flex;
  width: 80%;
}

.column-content {
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
