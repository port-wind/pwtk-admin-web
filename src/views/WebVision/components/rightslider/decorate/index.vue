<template>
  <div class="decorate">
    <div v-if="type === 'template'">
      <el-form label-width="100">
        <el-form-item label="草图名称">
          <el-input disabled v-model="datas.sketchName" maxlength="25" show-word-limit />
        </el-form-item>
        <el-form-item label="草图编码">
          <el-input disabled v-model="datas.sketchCode" placeholder="" />
        </el-form-item>
        <el-form-item label="模版名称">
          <el-input disabled v-model="datas.templateName" placeholder="" />
        </el-form-item>
        <el-form-item label="模版状态">
          <el-switch disabled v-model="datas.templateStatus" active-value="y" inactive-value="n" />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="头部背景色" prop="headerBgColor">
              <el-color-picker v-model="headerBgColor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头部渐变色1" prop="headerBg">
              <el-color-picker v-model="headerBg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头部渐变色2" prop="headerBg2">
              <el-color-picker v-model="headerBg2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else-if="type === 'website'">
      <el-form label-width="100">
        <el-form-item label="账户名称 | 账户昵称">
          <el-input disabled v-model="datas.userName" placeholder="" />
        </el-form-item>
        <el-form-item label="站点">
          <el-input disabled v-model="datas.websiteInnerName" placeholder="" />
        </el-form-item>
        <el-form-item label="站点标题">
          <el-input disabled v-model="datas.websiteTitle" placeholder="" />
        </el-form-item>
        <el-form-item label="绑定模板">
          <el-input disabled v-model="datas.templateName" placeholder="" />
        </el-form-item>
        <el-form-item label="模版名称">
          <el-input disabled v-model="datas.websiteTemplateRef" placeholder="" />
        </el-form-item>
        <el-form-item label="站点状态">
          <el-switch disabled v-model="datas.websiteStatus" active-value="y" inactive-value="n" />
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="头部背景色" prop="headerBgColor">
              <el-color-picker v-model="headerBgColor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头部渐变色1" prop="headerBg">
              <el-color-picker v-model="headerBg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头部渐变色2" prop="headerBg2">
              <el-color-picker v-model="headerBg2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-else>
      <div>其他设置</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import { useStore } from '@nanostores/vue'
import type { PageSetup } from '@/views/WebVision/type'
import {
  useGenericConfigStore,
  genericConfigStore
} from '@/views/WebVision/components/componentsbiz/store/genericConfigStore'

// 定义 props
const props = defineProps({
  datas: {
    type: Object as PropType<PageSetup>,
    required: true
  },
  type: {
    type: String as PropType<'template' | 'website'>,
    required: true
  },
  pageModel: {
    type: String
  }
})

const { setConfig } = useGenericConfigStore()
// Make the store reactive in the template
const storeData = useStore(genericConfigStore)
const storedConfig = computed(() => storeData.value.config.configParamJson)

const datas = computed(() => props.datas)
const configParamJson = computed(() => datas.value.configParamJson || {})

// Initialize data structure
const ensureStyleHeader = () => {
  if (!datas.value.configParamJson) {
    datas.value.configParamJson = {}
  }
  if (!datas.value.configParamJson.styleHeader) {
    datas.value.configParamJson.styleHeader = {
      headerBgColor: '#4a90e2',
      headerBg: '#4a90e2',
      headerBg2: '#5aa5f0'
    }
  }
}

// Safe computed properties for colors with auto-initialization
const headerBgColor = computed({
  get: () => datas.value.configParamJson?.styleHeader?.headerBgColor || '#4a90e2',
  set: (value: string) => {
    ensureStyleHeader()
    datas.value.configParamJson.styleHeader.headerBgColor = value
  }
})

const headerBg = computed({
  get: () => datas.value.configParamJson?.styleHeader?.headerBg || '#4a90e2',
  set: (value: string) => {
    ensureStyleHeader()
    datas.value.configParamJson.styleHeader.headerBg = value
  }
})

const headerBg2 = computed({
  get: () => datas.value.configParamJson?.styleHeader?.headerBg2 || '#5aa5f0',
  set: (value: string) => {
    ensureStyleHeader()
    datas.value.configParamJson.styleHeader.headerBg2 = value
  }
})

watch(
  configParamJson,
  (newVal) => {
    setConfig('configParamJson', newVal)
  },
  { deep: true }
)

onMounted(() => {
  ensureStyleHeader()
  console.log('storedConfig', storedConfig.value)
})

// const pickeShow = ref(false)
// const predefineColors = [
//   '#ff4500',
//   '#ff8c00',
//   '#ffd700',
//   '#90ee90',
//   '#00ced1',
//   '#1e90ff',
//   '#c71585',
//   '#409EFF',
//   '#909399',
//   '#C0C4CC',
//   'rgba(255, 69, 0, 0.68)',
//   'rgb(255, 120, 0)',
//   'hsv(51, 100, 98)',
//   'hsva(120, 40, 94, 0.5)',
//   'hsl(181, 100%, 37%)',
//   'hsla(209, 100%, 56%, 0.73)',
//   '#c7158577'
// ]

// const uploadImgDataType = ref<string | null>(null)

// // 方法
// const showUpload = (type: string) => {
//   uploadImgDataType.value = type
//   // 注意: 这里需要修改,因为 $refs 在 setup 中不可用
//   // 可能需要使用 template ref
// }

// const uploadInformation = (res: string) => {
//   if (uploadImgDataType.value === '2') {
//     emit('update:datas', { ...props.datas, bgImg: res })
//   }
// }

// const clear = () => {
//   emit('update:datas', { ...props.datas, bgImg: '' })
// }
</script>

<style scoped lang="less">
/* 页面设置 */
.decorate {
  width: 100%;
  box-sizing: border-box;
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
  /* 选择器添加和刷新 */
  .ification {
    color: #155bd4;
    font-size: 14px;
    padding: 0 15px;
    cursor: pointer;
  }
  /* 颜色选择器 */
  .picke {
    margin-left: 15px;
    vertical-align: top;
  }
  .home-bg {
    width: 100px;
    height: 300px;
  }

  .lef {
    display: flex;
    :deep(.el-form-item__label) {
      text-align: left;
      margin-right: 20px;
    }
  }
  .lef-height {
    :deep(.el-form-item__label) {
      text-align: left;
      width: 80px;
      float: left;
    }
    :deep(.el-form-item__content) {
      margin-left: 80px;
    }
  }

  // 底部logo
  .bottomLogo {
    display: flex;
    flex-direction: column;
    img {
      display: block;
      width: 220px;
      margin: 10px auto;
    }
  }

  // 店铺信息修改
  .shop-info {
    .shop-name {
      display: flex;
      flex-direction: row;
      color: #ababab;
      .el-input {
        flex: 1;
      }
    }
    .shop-head-pic {
      color: #ababab;
      display: flex;
      flex-direction: column;
      img {
        width: 70px;
        height: 70px;
        margin: 10px auto;
      }
      .shop-head-pic-btn {
        display: flex;
        flex-direction: row;
        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
