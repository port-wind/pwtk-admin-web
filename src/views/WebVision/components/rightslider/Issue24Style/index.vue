<script setup lang="ts" name="Issue24Style">
import { ref, watch, computed, defineProps } from 'vue'
import type { FormInstance } from 'element-plus'
import { useStore } from '@nanostores/vue'
import Fuse from 'fuse.js'

import type { IDatas } from '@/views/WebVision/components/componentsbiz/Issue24/type'
import { EModel } from '@/views/WebVision/components/componentsbiz/Issue24/type'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import ForumList from '@/views/WebVision/components/rightslider/ForumList/index.vue'
import SixZodiacSixCodeConfig from '@/views/WebVision/components/rightslider/SixZodiacSixCodeConfig/index.vue'

interface IProps {
  datas: IDatas
}
const props = defineProps<IProps>()
const datas = ref(props.datas)
const gameStoreData = useStore(gameStore)
const forum = computed(() => gameStoreData.value.forum)
const rules = ref({})
const ruleFormRef = ref<FormInstance>()

const modelListRaw = ref([
  {
    label: '24码',
    value: EModel['24码']
  },
  {
    label: '胆大胆小',
    value: EModel['胆大胆小']
  },
  {
    label: '三半波色',
    value: EModel['三半波色']
  },
  {
    label: '杀两肖',
    value: EModel['杀两肖']
  },
  {
    label: '尾数大小',
    value: EModel['尾数大小']
  },
  {
    label: '平特二尾',
    value: EModel['平特二尾']
  },
  {
    label: '吃鱼吃虾',
    value: EModel['吃鱼吃虾']
  },
  {
    label: '买啥中啥',
    value: EModel['买啥中啥']
  },
  {
    label: '三炮中特',
    value: EModel['三炮中特']
  },
  {
    label: '一句赢钱',
    value: EModel['一句赢钱']
  },
  {
    label: '平特二肖',
    value: EModel['平特二肖']
  },
  {
    label: '绝杀区',
    value: EModel['绝杀区']
  },
  {
    label: '中特码段',
    value: EModel['中特码段']
  },
  {
    label: '天地生肖',
    value: EModel['天地生肖']
  },
  {
    label: '合数单双',
    value: EModel['合数单双']
  },
  {
    label: '无敌八尾',
    value: EModel['无敌八尾']
  },
  {
    label: '复式平码',
    value: EModel['复式平码']
  },
  {
    label: '一句解特码',
    value: EModel['一句解特码']
  },
  {
    label: '横扫黑庄',
    value: EModel['横扫黑庄']
  },
  {
    label: '六肖六码',
    value: EModel['六肖六码']
  }
])
const fuse = new Fuse(modelListRaw.value, {
  keys: ['label'],
  includeScore: true,
  threshold: 0.1
})
const modelList = ref(modelListRaw.value)

const fuseModelList = computed(() => {
  const combined = [...modelList.value, ...modelListRaw.value]
  const uniqueMap = new Map()
  combined.forEach((item) => uniqueMap.set(item.value, item))
  console.log(Array.from(uniqueMap.values()))

  return Array.from(uniqueMap.values())
})
const filterModel = (value: string) => {
  if (!value.trim()) {
    return
  }
  if (modelListRaw.value.find((item) => item.label === value)) {
    modelList.value = modelListRaw.value.filter((item) => item.label === value)
    return
  }

  const results = new Set()

  // For single character searches, use simple string matching
  if (value.length === 1) {
    modelListRaw.value.forEach((item) => {
      if (item.label.includes(value)) {
        results.add(item)
      }
    })
  } else {
    // For longer inputs, use the substring approach with Fuse
    for (let len = 1; len <= Math.min(6, value.length); len += 1) {
      for (let i = 0; i <= value.length - len; i += 1) {
        const substring = value.substring(i, i + len)

        // Skip very short substrings for longer queries to avoid noise
        if (value.length > 3 && substring.length < 2) {
          // eslint-disable-next-line no-continue
          continue
        }

        const searchResults = fuse.search(substring)
        searchResults.forEach((result) => results.add(result.item))
      }
    }
  }

  modelList.value = Array.from(results) as { label: string; value: EModel }[]
  console.log(modelList.value)
}
watch(forum, (newVal) => {
  if (newVal) {
    datas.value.configParamJson.forumId = newVal.forumId
    datas.value.configParamJson.mainboardId = newVal.mainboardId
    datas.value.configParamJson.forumName = newVal.forumName
    datas.value.configParamJson.mainboardName = newVal.mainboardName
    datas.value.configParamJson.forumIcon = newVal.forumIcon
    datas.value.configParamJson.forumStatus = newVal.forumStatus
    filterModel(newVal.forumName)
    datas.value.configParamJson.model = fuseModelList.value[0].value
  }
})

const dialogVisible = ref(false)
const tempText = ref()

const openDynamicTemplate = () => {
  tempText.value = props.datas.configParamJson.dynamicTemplate
  dialogVisible.value = true
}

const handleSave = () => {
  props.datas.configParamJson.dynamicTemplate = tempText.value
  dialogVisible.value = false
}
</script>

<template>
  <div class="Issue24Style">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
      <StoreGameTypeList :datas="datas" />
      <ForumList :datas="datas" />
      <el-form-item label="开奖期数量" prop="size">
        <el-input-number v-model="datas.configParamJson.size" placeholder="请输入开奖期数量" />
      </el-form-item>

      <!-- <el-form-item label="是否启用" prop="enable">
        <el-switch v-model="datas.configParamJson.enable" />
      </el-form-item> -->

      <el-form-item label="玩法风格" prop="size">
        <el-select
          v-model="datas.configParamJson.model"
          placeholder="请选择玩法风格"
          filterable
          :filter-method="filterModel"
        >
          <el-option v-for="item in fuseModelList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="配置动态模版" prop="size">
        <el-button type="primary" @click="openDynamicTemplate">配置动态模版</el-button>
      </el-form-item>
      <el-form-item label="配置动态激活" prop="size">
        <el-color-picker v-model="datas.configParamJson.dynamicActive" />
      </el-form-item>

      <!-- 样式设置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <!-- <el-form-item label="头部文字色" prop="headerTextColor">
        <el-color-picker v-model="datas.configParamJson.styleMain.headerTextColor" />
      </el-form-item> -->

      <el-form-item label="号码大小" prop="numberSize">
        <el-input-number v-model="datas.configParamJson.styleMain.numberSize" :min="10" :max="24" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="号码间距" prop="numberSpacing">
        <el-input-number v-model="datas.configParamJson.styleMain.numberSpacing" :min="0" :max="20" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number v-model="datas.configParamJson.styleMain.borderRadius" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <el-form-item label="内边距" prop="padding">
        <el-input-number v-model="datas.configParamJson.styleMain.padding" />
        <span style="margin-left: 8px">px</span>
      </el-form-item>

      <!-- 显示选项 -->
      <el-divider content-position="left">显示选项</el-divider>

      <el-form-item label="显示期数" prop="showPeriod">
        <el-switch v-model="datas.configParamJson.styleMain.showPeriod" />
      </el-form-item>

      <el-form-item label="显示状态" prop="showStatus">
        <el-switch v-model="datas.configParamJson.styleMain.showStatus" />
      </el-form-item>

      <el-form-item label="显示结果" prop="showResult">
        <el-switch v-model="datas.configParamJson.styleMain.showResult" />
      </el-form-item>

      <!-- 六肖六码组件专用配置 -->
      <template v-if="datas.configParamJson.model === EModel['六肖六码']">
        <SixZodiacSixCodeConfig :datas="datas" />
      </template>
    </el-form>

    <!-- 编辑器弹出框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑文本内容"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <WangEditor v-model="tempText" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.Issue24Style {
  .issue-items-list {
    max-height: 500px;
    overflow-y: auto;
  }

  .issue-item-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    margin-bottom: 16px;
    background: #fafafa;

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
      border-radius: 8px 8px 0 0;

      span {
        font-weight: 500;
        color: #303133;
      }

      .item-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .item-content {
      padding: 16px;
    }
  }

  .numbers-management {
    .numbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .number-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background: #fff;
    }
  }
}
</style>
