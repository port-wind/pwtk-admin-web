<script setup lang="ts" name="ImageGridListStyle">
import { ref, computed, watch, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useStore } from '@nanostores/vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import shareComponent from '@/views/WebVision/components/rightslider/shareComponent/index.vue'
import componentHeadTitle from '@/views/WebVision/components/rightslider/componentHeadTitle/index.vue'
import headerTitle from '@/views/WebVision/components/rightslider/headerTitle/index.vue'
import StoreGameTypeList from '@/views/WebVision/components/rightslider/StoreGameTypeList/index.vue'
import type { IDatas, GridImageItem } from '@/views/WebVision/components/componentsbiz/ImageGridList/type'
import { EUploadFrom } from '@/components/uploadImage/type'
import { getGraphicUsers, getNewsPaperList } from '@/api/photoSys/issues'
import { getLatestIssue } from '@/views/WebVision/components/componentsbiz/api'
import { gameStore } from '@/views/WebVision/components/componentsbiz/store'
import { PUBLIC_CDN_URL } from '@/views/WebVision/components/componentsbiz/utils'
interface IProps {
  datas: IDatas
}

const gameStoreData = useStore(gameStore)
const gameType = computed(() => gameStoreData.value.gameType)
const gameTypeList = computed(() => gameStoreData.value.gameTypeList)

const props = defineProps<IProps>()

const rules = ref({})
const ruleFormRef = ref<FormInstance>()

const onNewspaperChange = async (newspaperCode: string, item: GridImageItem, index: number) => {
  const res = await getLatestIssue({
    newspaperCode: newspaperCode,
    gameType: Number(gameType.value)
  })

  if (res.success) {
    console.log('🚀 ~ onNewspaperChange  image .. image ~ res:', res)
    props.datas.configParamJson[gameType.value].gridItems[index].imageUrl = res.data?.imgPath || ''
    props.datas.configParamJson[gameType.value].gridItems[index].title = res.data?.name || ''
  }
}

// 彩种ID列表
const gameTypeIds = ['2032', '1', '84', '3995', '5', '6']
const placeholderText = ref('')

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 添加新图片项
const addGridItem = () => {
  // 确保当前彩种有数据结构
  const gObj = props.datas.configParamJson[gameType.value]
  if (!gObj || !gObj.gridItems) {
    props.datas.configParamJson[gameType.value] = { gridItems: [] }
  }
  console.log(props.datas.configParamJson)

  const newItem: GridImageItem = {
    id: generateId(),
    title: '新图片',
    newspaper: '',
    imageUrl: 'https://stt.pwtk.cc/devmedia/img/game/picture/25/06/16/1ed377391f8d4ddcaed68cee2b6220cf.jpg',
    link: '',
    enabled: true
  }
  console.log(props.datas.configParamJson)

  props.datas.configParamJson[gameType.value].gridItems.push(newItem)
}

// 删除图片项
const removeGridItem = (index: number) => {
  const gridItems = props.datas.configParamJson[gameType.value]?.gridItems || []

  if (gridItems.length <= 1) {
    ElMessage.warning('至少保留一个图片项')
    return
  }

  gridItems.splice(index, 1)
}

// 监听彩种切换，确保每个彩种都有基本数据结构
watch(
  () => gameType.value,
  (newGameType) => {
    console.log('🚀 ~ newGameType:', newGameType)
    if (newGameType && !props.datas.configParamJson[newGameType]) {
      props.datas.configParamJson[newGameType] = { gridItems: [] }
    }
  },
  { immediate: true }
)

// const handleGameTypeChange = (_gameType: string) => {
//   gameType.value = _gameType
//   changeGameType(_gameType)
// }

// 组件挂载时初始化数据
// onMounted(() => {
//   initializeGameTypeData()

//   // 确保有默认的gameType
//   if (!props.datas.configParamJson.gameType) {
//     props.datas.configParamJson.gameType = '2032'
//   }
// })

const getFullUrl = (url: string, baseUrl: string): string => {
  if (!url) {
    return ''
  }
  return /^https?:\/\//.test(url) ? url : `${baseUrl}${url}`
}

// 预设的常用配置
const presetConfigs = [
  { text: '2列布局', columnsPerRow: 2 },
  { text: '3列布局', columnsPerRow: 3 },
  { text: '4列布局', columnsPerRow: 4 }
]

// 应用预设配置
const applyPresetConfig = (preset: any) => {
  props.datas.configParamJson.gridStyleJSON.columnsPerRow = preset.columnsPerRow
}
</script>

<template>
  <div class="ImageGridListStyle">
    <h2>{{ datas.componentName }}</h2>
    <el-form label-width="auto" ref="ruleFormRef" :model="datas" :rules="rules" class="lef">
      <!-- 组件基本信息配置 -->
      <share-component :datas="datas" />
      <!-- 以下是组件的样式、数据配置 -->
      <componentHeadTitle :datas="datas" />
      <!-- Header样式配置 -->
      <header-title :datas="datas" />
      <!-- 彩票切换 -->
      <StoreGameTypeList :datas="datas" />

      <!-- 布局配置 -->
      <el-divider content-position="left">Grid列表布局配置</el-divider>

      <el-form-item label="排列方式">
        <div class="preset-buttons">
          <el-button v-for="preset in presetConfigs" :key="preset.text" size="small" @click="applyPresetConfig(preset)">
            {{ preset.text }}
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="内容边距" prop="contentItemPadding">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.contentItemPadding" />
      </el-form-item>

      <el-form-item label="每行列数" prop="columnsPerRow">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.columnsPerRow" :min="1" :max="6" />
      </el-form-item>

      <el-form-item label="项目间距" prop="itemSpacing">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.itemSpacing" :min="0" :max="50" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item label="项目内边距" prop="itemPadding">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.itemPadding" :min="0" :max="30" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item label="图片高度" prop="imageHeight">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.imageHeight" :min="50" :max="300" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <!-- 样式配置 -->
      <el-divider content-position="left">样式配置</el-divider>

      <el-form-item label="背景颜色" prop="backgroundColor">
        <el-color-picker v-model="datas.configParamJson.gridStyleJSON.backgroundColor" />
      </el-form-item>

      <el-form-item label="边框颜色" prop="borderColor">
        <el-color-picker v-model="datas.configParamJson.gridStyleJSON.borderColor" />
      </el-form-item>

      <el-form-item label="边框宽度" prop="borderWidth">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.borderWidth" :min="0" :max="10" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item label="圆角" prop="borderRadius">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.borderRadius" :min="0" :max="20" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item label="显示标题" prop="showTitle">
        <el-switch v-model="datas.configParamJson.gridStyleJSON.showTitle" />
      </el-form-item>

      <el-form-item label="标题字体大小" prop="titleFontSize" v-if="datas.configParamJson.gridStyleJSON.showTitle">
        <el-input-number v-model="datas.configParamJson.gridStyleJSON.titleFontSize" :min="10" :max="24" />
        <span style="margin-left: 10px">px</span>
      </el-form-item>

      <el-form-item label="标题颜色" prop="titleColor" v-if="datas.configParamJson.gridStyleJSON.showTitle">
        <el-color-picker v-model="datas.configParamJson.gridStyleJSON.titleColor" />
      </el-form-item>

      <el-form-item label="悬停效果" prop="hoverEffect">
        <el-switch v-model="datas.configParamJson.gridStyleJSON.hoverEffect" />
      </el-form-item>

      <!-- 图片项管理 -->
      <el-divider content-position="left">图片项管理</el-divider>

      <el-form-item>
        <el-button type="primary" @click="addGridItem">
          <el-icon>
            <Plus />
          </el-icon>
          添加图片项
        </el-button>
      </el-form-item>

      <div class="grid-items-container">
        <el-card
          v-for="(item, index) in props.datas.configParamJson[gameType].gridItems"
          :key="item.id"
          class="grid-item-card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <span>图片项 {{ index + 1 }}</span>
              <el-button
                type="danger"
                size="small"
                @click="removeGridItem(index)"
                :disabled="props.datas.configParamJson[gameType]?.gridItems?.length <= 1"
              >
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </template>
          <el-form-item label="报纸选择">
            <UniRemoteInput
              v-model.trim="item.newspaper"
              :search-obj="{ gameType: gameType }"
              valueKey="newspaperCode"
              labelKey="newspaperName"
              searchKey="newspaperCode"
              @change="(e) => onNewspaperChange(e, item, index)"
              :placeholder="placeholderText"
              :fetchOptions="getNewsPaperList"
              :formatLabel="
                (item) => (item.newspaperName ? `${item.newspaperCode} - ${item.newspaperName}` : item.newspaperCode)
              "
            />
          </el-form-item>
          <el-form-item label="图片标题">
            <el-input v-model="item.title" placeholder="请输入图片标题" />
          </el-form-item>

          <el-form-item label="报纸图片">
            <div class="image-container">
              <img
                :src="getFullUrl(item.imageUrl, PUBLIC_CDN_URL)"
                alt="图片"
                style="height: 100%; width: 100%; object-fit: cover"
              />
            </div>
          </el-form-item>
          <el-form-item label="跳转链接">
            <el-input v-model="item.link" placeholder="请输入跳转链接" />
          </el-form-item>
        </el-card>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.ImageGridListStyle {
  .preset-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .grid-items-container {
    .grid-item-card {
      margin-bottom: 16px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .el-divider {
    margin: 24px 0 16px 0;
  }
}

.image-container {
  max-height: 200px;
  aspect-ratio: 1 / 1;
}
</style>
